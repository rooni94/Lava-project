import { FormEvent, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../api/client";
import { renderRiyalText } from "../../utils/currency";

type SupportMessage = {
  id: number;
  conversation: number;
  sender_type: "customer" | "staff" | "manager" | "bot" | "guest";
  sender_name?: string;
  content: string;
  created_at: string;
};

type GuestProfile = {
  name: string;
  email: string;
  conversation_id?: number;
  guest_token?: string;
};

const GUEST_STORAGE_KEY = "lava_support_guest";

const getWsBaseUrl = () => {
  const wsOverride = import.meta.env.VITE_WS_URL;
  if (wsOverride) return wsOverride;
  const apiUrl = import.meta.env.VITE_API_URL || "/api/";
  try {
    if (typeof apiUrl === "string" && (apiUrl.startsWith("http://") || apiUrl.startsWith("https://"))) {
      const url = new URL(apiUrl);
      const wsScheme = url.protocol === "https:" ? "wss" : "ws";
      return `${wsScheme}://${url.host}`;
    }
  } catch {
    /* ignore */
  }
  const loc = window.location;
  const wsScheme = loc.protocol === "https:" ? "wss" : "ws";
  return `${wsScheme}://${loc.host}`;
};

const SupportChatWidget = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const t = (ar: string, en: string) => (isAr ? ar : en);

  const token = localStorage.getItem("token");
  const isGuest = !token;

  const [open, setOpen] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [input, setInput] = useState("");

  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestToken, setGuestToken] = useState<string | null>(null);
  const [guestStep, setGuestStep] = useState<"form" | "code" | "chat">("form");
  const [guestRequestId, setGuestRequestId] = useState<number | null>(null);
  const [guestCode, setGuestCode] = useState("");
  const [guestError, setGuestError] = useState<string | null>(null);
  const [guestSubmitting, setGuestSubmitting] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const addMessagesUnique = (incoming: SupportMessage[]) => {
    if (!incoming.length) return;
    setMessages((prev) => {
      const seen = new Set(prev.map((m) => m.id));
      const fresh = incoming.filter((m) => !seen.has(m.id));
      return fresh.length ? [...prev, ...fresh] : prev;
    });
  };

  useEffect(() => {
    if (!isGuest) return;
    try {
      const raw = localStorage.getItem(GUEST_STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as GuestProfile;
        if (data.name) setGuestName(data.name);
        if (data.email) setGuestEmail(data.email);
        if (data.conversation_id && data.guest_token) {
          setConversationId(data.conversation_id);
          setGuestToken(data.guest_token);
          setGuestStep("chat");
        }
      }
    } catch {
      /* ignore */
    }
  }, [isGuest]);

  const initForLoggedUser = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const convRes = await api.get("support/my-conversation/");
      const convId = convRes.data.conversation.id as number;
      setConversationId(convId);
      const msgRes = await api.get<SupportMessage[]>("support/my-messages/");
      addMessagesUnique(msgRes.data || []);
      setGuestStep("chat");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const initForGuestIfHasConversation = async (convId: number, tokenVal: string) => {
    setLoading(true);
    try {
      const msgRes = await api.get<SupportMessage[]>(
        `support/guest-conversations/${convId}/messages/`,
        { headers: { "X-Guest-Token": tokenVal } }
      );
      addMessagesUnique(msgRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestRequestCode = async (e: FormEvent) => {
    e.preventDefault();
    setGuestError(null);
    if (!guestName.trim() || !guestEmail.trim()) {
      setGuestError(t("يرجى إدخال الاسم والبريد الإلكتروني.", "Please enter name and email."));
      return;
    }
    setGuestSubmitting(true);
    try {
      const res = await api.post("support/guest-request-code/", {
        name: guestName.trim(),
        email: guestEmail.trim(),
      });
      setGuestRequestId(res.data.request_id);
      setGuestStep("code");
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify({ name: guestName.trim(), email: guestEmail.trim() }));
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : t("تعذر إرسال الكود. حاول لاحقاً.", "Unable to send code.");
      const msg =
        typeof err === "object" && err && "response" in err && (err as { response?: { data?: { detail?: string } } }).response?.data?.detail
          ? (err as { response?: { data?: { detail?: string } } }).response?.data?.detail
          : message;
      setGuestError(msg);
    } finally {
      setGuestSubmitting(false);
    }
  };

  const handleGuestVerifyCode = async (e: FormEvent) => {
    e.preventDefault();
    setGuestError(null);
    if (!guestRequestId) {
      setGuestError(t("انتهت صلاحية الطلب، أعد المحاولة.", "Request expired. Try again."));
      setGuestStep("form");
      return;
    }
    if (!guestCode.trim()) {
      setGuestError(t("أدخل كود التحقق.", "Enter the verification code."));
      return;
    }
    setGuestSubmitting(true);
    try {
      const res = await api.post("support/guest-verify-code/", {
        request_id: guestRequestId,
        code: guestCode.trim(),
      });
      const convId = res.data.conversation.id as number;
      const tokenVal = (res.data.guest_token as string | undefined) || null;
      if (!tokenVal) {
        setGuestError(t("لم يصل رمز الضيف، حاول مجدداً.", "Guest token missing. Try again."));
        return;
      }
      setConversationId(convId);
      setGuestToken(tokenVal);
      setGuestStep("chat");
      localStorage.setItem(
        GUEST_STORAGE_KEY,
        JSON.stringify({ name: guestName.trim(), email: guestEmail.trim(), conversation_id: convId, guest_token: tokenVal })
      );
      await initForGuestIfHasConversation(convId, tokenVal);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t("كود غير صحيح أو منتهي.", "Invalid or expired code.");
      const msg =
        typeof err === "object" && err && "response" in err && (err as { response?: { data?: { detail?: string } } }).response?.data?.detail
          ? (err as { response?: { data?: { detail?: string } } }).response?.data?.detail
          : message;
      setGuestError(msg);
    } finally {
      setGuestSubmitting(false);
    }
  };

  const connectWebSocket = (convId: number) => {
    const base = getWsBaseUrl();
    const qs = token
      ? `?token=${encodeURIComponent(token)}`
      : guestToken
        ? `?guest=1&guest_token=${encodeURIComponent(guestToken)}`
        : "?guest=1";
    const wsUrl = `${base}/ws/support/${convId}/${qs}`;
    if (wsRef.current) wsRef.current.close();
    setConnecting(true);
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;
    ws.onopen = () => setConnecting(false);
    ws.onclose = () => setConnecting(false);
    ws.onerror = () => setConnecting(false);
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as SupportMessage;
        addMessagesUnique([data]);
      } catch (err) {
        console.error("WS parse error", err);
      }
    };
  };

  const handleOpen = async () => {
    setOpen(true);
    setMessages([]);
    setConversationId(null);
    if (token) {
      setGuestStep("chat");
      await initForLoggedUser();
      return;
    }
    try {
      const raw = localStorage.getItem(GUEST_STORAGE_KEY);
      if (raw) {
        const stored = JSON.parse(raw) as GuestProfile;
        if (stored.conversation_id && stored.guest_token) {
          setConversationId(stored.conversation_id);
          setGuestToken(stored.guest_token);
          setGuestStep("chat");
          await initForGuestIfHasConversation(stored.conversation_id, stored.guest_token);
          return;
        }
      }
    } catch {
      /* ignore */
    }
    setGuestStep("form");
  };

  const handleClose = () => {
    setOpen(false);
    wsRef.current?.close();
  };

  useEffect(() => {
    if (!open || !conversationId) return;
    connectWebSocket(conversationId);
    return () => wsRef.current?.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, conversationId, token, guestToken]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendText = async () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    try {
      if (!conversationId) {
        alert(t("ابدأ المحادثة أولاً قبل الإرسال.", "Start the chat first."));
        return;
      }

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "message", content: text }));
        return;
      }

      if (token) {
        const res = await api.post("support/my-messages/", { content: text });
        addMessagesUnique([res.data.customer_message, res.data.bot_reply].filter(Boolean) as SupportMessage[]);
      } else if (isGuest && guestToken) {
        const res = await api.post(
          `support/guest-conversations/${conversationId}/messages/`,
          { content: text },
          { headers: { "X-Guest-Token": guestToken } }
        );
        addMessagesUnique([res.data.guest_message, res.data.bot_reply].filter(Boolean) as SupportMessage[]);
      }
    } catch (err) {
      console.error(err);
      alert(t("حدث خطأ أثناء الإرسال.", "Failed to send message."));
    }
  };

  const renderGuestGate = () => {
    if (!isGuest || guestStep === "chat") return null;
    return (
      <div className="absolute inset-0 bg-white/95 flex items-center justify-center px-4 z-20">
        {guestStep === "form" && (
          <form onSubmit={handleGuestRequestCode} className="w-full max-w-xs space-y-3 text-right text-sm">
            <div className="font-semibold text-gray-800">{t("تواصل معنا كضيف", "Contact us as a guest")}</div>
            <div className="text-[12px] text-gray-600">
              {t(
                "أدخل الاسم والبريد لإرسال كود التحقق.",
                "Enter your name and email to receive a verification code."
              )}
            </div>
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm"
              placeholder={t("الاسم", "Name")}
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
            />
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="example@mail.com"
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
            />
            {guestError && <div className="text-[12px] text-red-500">{guestError}</div>}
            <button
              type="submit"
              disabled={guestSubmitting}
              className="w-full py-2 rounded-full bg-primary text-white text-sm disabled:opacity-60"
            >
              {guestSubmitting ? t("يتم الإرسال...", "Sending...") : t("إرسال كود التحقق", "Send code")}
            </button>
          </form>
        )}
        {guestStep === "code" && (
          <form onSubmit={handleGuestVerifyCode} className="w-full max-w-xs space-y-3 text-right text-sm">
            <div className="font-semibold text-gray-800">{t("أدخل كود التحقق", "Enter verification code")}</div>
            <div className="text-[12px] text-gray-600">
              {t("تم إرسال كود من 6 أرقام إلى بريدك.", "We sent a 6-digit code to your email.")}
            </div>
            <input
              className="w-full border rounded-lg px-3 py-2 text-center tracking-[0.3em] text-sm"
              placeholder="123456"
              maxLength={6}
              value={guestCode}
              onChange={(e) => setGuestCode(e.target.value)}
            />
            {guestError && <div className="text-[12px] text-red-500">{guestError}</div>}
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  setGuestStep("form");
                  setGuestCode("");
                }}
                className="px-3 py-2 rounded-full border text-xs"
              >
                {t("رجوع", "Back")}
              </button>
              <button
                type="submit"
                disabled={guestSubmitting}
                className="px-4 py-2 rounded-full bg-primary text-white text-sm disabled:opacity-60"
              >
                {guestSubmitting ? t("يتم التحقق...", "Verifying...") : t("تأكيد الكود", "Verify")}
              </button>
            </div>
          </form>
        )}
      </div>
    );
  };

  const widgetWidth = "min(420px, 92vw)";
  const widgetHeight = "min(70vh, 520px)";

  return (
    <div className="fixed bottom-3 left-3 z-40" style={{ bottom: "calc(12px + env(safe-area-inset-bottom, 0px))" }}>
      {!open && (
        <button
          onClick={handleOpen}
          className="w-12 h-12 rounded-full bg-primary text-white shadow-lg flex items-center justify-center text-xl hover:bg-primary/90"
        >
          💬
        </button>
      )}

      {open && (
        <div className="bg-white rounded-2xl shadow-xl border border-accent/30 flex flex-col overflow-hidden relative" style={{ width: widgetWidth, height: widgetHeight }}>
          <div className="px-3 py-2 bg-primary text-white flex items-center justify-between sticky top-0 z-10">
            <span className="text-sm font-semibold">{t("دعم لافا", "LAVA Support")}</span>
            <div className="flex items-center gap-2">
              {(token || (isGuest && guestStep === "chat")) && (
                <button
                  onClick={() => {
                    wsRef.current?.close();
                    setConversationId(null);
                    setMessages([]);
                    setInput("");
                    if (isGuest) {
                      localStorage.removeItem(GUEST_STORAGE_KEY);
                      setGuestToken(null);
                      setGuestStep("form");
                    }
                  }}
                  className="text-[10px] border border-white/60 rounded-full px-2 py-0.5 hover:bg-white/10"
                >
                  {t("إنهاء", "End")}
                </button>
              )}
              <button onClick={handleClose} className="text-xs hover:text-red-100">✕</button>
            </div>
          </div>

          <div className="flex-1 relative bg-surface flex flex-col min-h-0">
            {(loading || connecting) && (
              <div className="text-center text-secondary/60 text-xs py-3">
                {loading ? t("جاري تحميل المحادثة...", "Loading chat...") : t("جاري الاتصال...", "Connecting...")}
              </div>
            )}

            {!loading && !connecting && messages.length === 0 && guestStep === "chat" && (
              <div className="text-center text-secondary/60 text-xs py-3">{t("اكتب رسالتك للبدء.", "Type to start.")}</div>
            )}

            <div className="flex-1 min-h-0 overflow-y-auto px-3 py-2 space-y-2 text-xs">
              {messages.map((m) => {
                const isMe = (!isGuest && m.sender_type === "customer") || (isGuest && m.sender_type === "guest");
                const isBot = m.sender_type === "bot";
                return (
                  <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[82%] px-3 py-2 rounded-2xl shadow-sm ${
                        isMe
                          ? "bg-primary text-white rounded-br-none"
                          : isBot
                            ? "bg-white border border-dashed border-accent/60 text-secondary rounded-bl-none"
                            : "bg-white border border-accent/30 text-secondary rounded-bl-none"
                      }`}
                    >
                      {!isMe && (
                        <div className="text-[10px] text-secondary/60 mb-0.5">{isBot ? t("رد تلقائي", "Auto reply") : m.sender_name || t("الدعم", "Support")}</div>
                      )}
                      <div>{renderRiyalText(m.content)}</div>
                      <div className="text-[9px] text-secondary/40 mt-1 text-left">{new Date(m.created_at).toLocaleTimeString()}</div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {renderGuestGate()}
          </div>

          <div className="border-t px-2 py-2 flex items-center gap-2 sticky bottom-0 bg-white" style={{ paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom, 0px))" }}>
            <input
              className="flex-1 border rounded-full px-3 py-1.5 text-xs"
              placeholder={t("اكتب رسالتك...", "Type your message...")}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendText();
                }
              }}
              disabled={loading || connecting || (isGuest && guestStep !== "chat")}
            />
            <button
              onClick={sendText}
              disabled={!input.trim() || loading || connecting || (isGuest && guestStep !== "chat")}
              className="px-3 py-1.5 rounded-full bg-primary text-white text-xs hover:bg-primary/90 disabled:opacity-60"
            >
              {t("إرسال", "Send")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportChatWidget;
