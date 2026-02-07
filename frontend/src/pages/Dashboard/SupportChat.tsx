import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../api/client";
import { renderRiyalText } from "../../utils/currency";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

type Conversation = {
  id: number;
  customer_name: string | null;
  customer_id: number | null;
  customer_email?: string | null;
  guest_name?: string | null;
  guest_email?: string | null;
  is_guest?: boolean;
  created_at: string;
  last_message_at: string | null;
  unread_for_support: boolean;
  is_closed?: boolean;
};

type SupportMessage = {
  id: number;
  conversation: number;
  sender_type: "customer" | "guest" | "staff" | "manager" | "bot";
  sender_name?: string;
  content: string;
  created_at: string;
};

const normalizeDisplayText = (val?: string | null) => {
  const text = (val || "").trim();
  if (!text) return null;
  if (text === "زائر" || text === "ضيف") return null;
  return text;
};

const resolveConversationName = (c: Conversation) => {
  if (c.is_guest) {
    return (
      normalizeDisplayText(c.guest_name) ||
      normalizeDisplayText(c.customer_name) ||
      normalizeDisplayText(c.guest_email) ||
      "ضيف"
    );
  }
  return (
    normalizeDisplayText(c.customer_name) ||
    normalizeDisplayText(c.customer_email) ||
    `مستخدم #${c.customer_id ?? c.id}`
  );
};

const resolveConversationEmail = (c: Conversation) => (c.is_guest ? c.guest_email : c.customer_email) || null;

const DashboardSupportChat = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const t = (ar: string, en: string) => (isAr ? ar : en);

  const accessToken = localStorage.getItem("token");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [shouldScrollToEnd, setShouldScrollToEnd] = useState(false);
  const [input, setInput] = useState("");
  const [accessDenied, setAccessDenied] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const getWsBase = () => {
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

  const fetchConversations = () => {
    setLoadingConvs(true);
    api
      .get("support/conversations/")
      .then((res) => {
        const payload = (res.data as any)?.results ?? res.data;
        setConversations(Array.isArray(payload) ? payload : []);
        setAccessDenied(false);
      })
      .catch((err) => {
        if (err?.response?.status === 403) {
          setAccessDenied(true);
        }
        console.error(err);
      })
      .finally(() => setLoadingConvs(false));
  };

  const fetchMessages = (convId: number) => {
    setLoadingMsgs(true);
    api
      .get<SupportMessage[]>(`support/conversations/${convId}/messages/`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoadingMsgs(false));
  };

  useEffect(() => {
    if (!accessToken) {
      setAccessDenied(true);
      return;
    }
    fetchConversations();
  }, [accessToken]);

  const connectWebSocket = (convId: number) => {
    if (!accessToken) return;
    const wsBase = getWsBase();
    const wsUrl = `${wsBase}/ws/support/${convId}/?token=${encodeURIComponent(accessToken)}`;
    if (wsRef.current) wsRef.current.close();
    setConnecting(true);
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;
    ws.onopen = () => setConnecting(false);
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as SupportMessage;
        setMessages((prev) => [...prev, data]);
        setShouldScrollToEnd(true);
      } catch (err) {
        console.error("WS parse error", err);
      }
    };
    ws.onclose = () => setConnecting(false);
    ws.onerror = () => setConnecting(false);
  };

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConv(conv);
    setMessages([]);
    setShouldScrollToEnd(false);
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    fetchMessages(conv.id);
    connectWebSocket(conv.id);
    api.post(`support/conversations/${conv.id}/mark-read/`).catch(() => {});
  };

  useEffect(() => {
    if (!shouldScrollToEnd) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setShouldScrollToEnd(false);
  }, [messages, shouldScrollToEnd]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !selectedConv || selectedConv.is_closed) return;

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "message", content: text }));
      setInput("");
      return;
    }

    try {
      const res = await api.post<SupportMessage>(`support/conversations/${selectedConv.id}/messages/`, { content: text });
      setMessages((prev) => [...prev, res.data]);
      setShouldScrollToEnd(true);
      setInput("");
    } catch (err) {
      console.error(err);
      alert(t("حدث خطأ أثناء الإرسال.", "Failed to send message."));
    }
  };

  if (accessDenied) {
    return (
      <DashboardLayout>
        <div className="p-6 text-secondary/70">
          {t("هذا القسم مخصص لمديري الدعم فقط.", "This area is restricted to support managers.")}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex gap-4 h-[70vh]">
        <div className="w-72 bg-white rounded-2xl shadow-sm border border-accent/30 p-3 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold">{t("محادثات الدعم", "Support chats")}</h2>
            <button onClick={fetchConversations} className="text-[11px] text-primary hover:underline">
              {t("تحديث", "Refresh")}
            </button>
          </div>
          {loadingConvs ? (
            <div className="text-xs text-secondary/60">{t("جاري التحميل...", "Loading...")}</div>
          ) : conversations.length === 0 ? (
            <div className="text-xs text-secondary/60">{t("لا توجد محادثات حالياً.", "No conversations.")}</div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-1 text-xs">
              {conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSelectConversation(c)}
                  className={`w-full text-right px-2 py-2 rounded-lg border text-xs ${
                    selectedConv?.id === c.id
                      ? "border-primary bg-primary/5"
                      : "border-accent/30 hover:bg-surface"
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-semibold">{resolveConversationName(c)}</span>
                    {c.unread_for_support && <span className="w-2 h-2 rounded-full bg-red-500" />}
                  </div>
                  {c.is_guest && resolveConversationEmail(c) && (
                    <div className="text-[10px] text-secondary/50 truncate">{resolveConversationEmail(c)}</div>
                  )}
                  <div className="text-[10px] text-secondary/50">
                    {c.last_message_at
                      ? new Date(c.last_message_at).toLocaleString()
                      : new Date(c.created_at).toLocaleString()}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-accent/30 flex flex-col">
          {!selectedConv ? (
            <div className="flex-1 flex items-center justify-center text-sm text-secondary/60">
              {t("اختر محادثة لعرض الرسائل.", "Select a conversation to view messages.")}
            </div>
          ) : (
            <>
              <div className="px-4 py-2 border-b flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold">
                    {t("المحادثة مع", "Chat with")} {resolveConversationName(selectedConv)}
                  </h3>
                  <div className="text-[11px] text-secondary/50">
                    {t("بدأ الحوار:", "Started:")} {new Date(selectedConv.created_at).toLocaleString()}
                  </div>
                  {selectedConv.is_guest && resolveConversationEmail(selectedConv) && (
                    <div className="text-[11px] text-secondary/50">
                      {t("بريد الضيف:", "Guest email:")} {resolveConversationEmail(selectedConv)}
                    </div>
                  )}
                  {selectedConv.is_closed && (
                    <div className="text-[11px] text-red-500 mt-1">{t("المحادثة مغلقة.", "Conversation is closed.")}</div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {!selectedConv.is_closed && (
                    <button
                      onClick={async () => {
                        try {
                          await api.post(`support/conversations/${selectedConv.id}/close/`);
                          setSelectedConv((prev) => (prev ? { ...prev, is_closed: true } : prev));
                          setConversations((prev) =>
                            prev.map((c) => (c.id === selectedConv.id ? { ...c, is_closed: true } : c))
                          );
                        } catch (err) {
                          console.error(err);
                          alert(t("تعذر إغلاق المحادثة.", "Unable to close conversation."));
                        }
                      }}
                      className="px-2 py-1 rounded-full border border-primary text-primary text-[11px] hover:bg-primary/5"
                    >
                      {t("إنهاء المحادثة", "Close")}
                    </button>
                  )}
                  <button
                    onClick={async () => {
                      if (!window.confirm(t("هل تريد حذف المحادثة؟", "Delete this conversation?"))) return;
                      try {
                        await api.delete(`support/conversations/${selectedConv.id}/delete/`);
                        setConversations((prev) => prev.filter((c) => c.id !== selectedConv.id));
                        setSelectedConv(null);
                        setMessages([]);
                      } catch (err) {
                        console.error(err);
                        alert(t("تعذر حذف المحادثة.", "Unable to delete conversation."));
                      }
                    }}
                    className="px-2 py-1 rounded-full border border-red-500 text-red-600 text-[11px] hover:bg-red-50"
                  >
                    {t("حذف", "Delete")}
                  </button>
                </div>
              </div>

              <div className="flex-1 px-3 py-2 overflow-y-auto space-y-2 text-xs bg-surface/60">
                {loadingMsgs ? (
                  <div className="text-center text-secondary/60 mt-3">{t("جاري تحميل الرسائل...", "Loading messages...")}</div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-secondary/60 mt-3">{t("لا توجد رسائل بعد.", "No messages yet.")}</div>
                ) : (
                  <>
                    {messages.map((m) => {
                      const isSupportSide = m.sender_type === "staff" || m.sender_type === "manager";
                      const isBot = m.sender_type === "bot";
                      return (
                        <div key={m.id} className={`flex ${isSupportSide ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[75%] px-3 py-2 rounded-2xl shadow-sm ${
                              isSupportSide
                                ? "bg-primary text-white rounded-br-none"
                                : isBot
                                  ? "bg-white border border-dashed border-accent/60 text-secondary rounded-bl-none"
                                  : "bg-white border border-accent/30 text-secondary rounded-bl-none"
                            }`}
                          >
                            <div className="text-[10px] text-secondary/70 mb-0.5">
                              {isBot ? t("مساعد لافا", "LAVA bot") : m.sender_name || t("الدعم", "Support")}
                            </div>
                            <div>{renderRiyalText(m.content)}</div>
                            <div className="text-[9px] text-secondary/50 mt-1 text-left">
                              {new Date(m.created_at).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              <div className="border-t px-3 py-2 flex items-center gap-2">
                <input
                  className="flex-1 border rounded-full px-3 py-1.5 text-xs"
                  placeholder={t("اكتب ردك على العميل...", "Type your reply...")}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  disabled={connecting || loadingMsgs || !selectedConv || selectedConv.is_closed}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || connecting || loadingMsgs || !selectedConv || selectedConv.is_closed}
                  className="px-4 py-1.5 rounded-full bg-primary text-white text-xs hover:bg-primary/90 disabled:opacity-60"
                >
                  {t("إرسال", "Send")}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardSupportChat;
