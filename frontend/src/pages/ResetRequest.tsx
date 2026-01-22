import { useState } from "react";
import { requestPasswordReset } from "../api/endpoints";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import Layout from "../components/layout/Layout";

export default function ResetRequest() {
  const [email, setEmail] = useState("");
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const submit = async () => {
    try {
      await requestPasswordReset(email);
      toast.success(isAr ? "تم إرسال رابط إعادة التعيين إلى بريدك." : "A reset link has been sent to your email.");
    } catch (e) {
      toast.error(isAr ? "تعذر إرسال الرابط، حاول مرة أخرى." : "Could not send the reset link. Please try again.");
    }
  };

  return (
    <Layout>
      <section className="py-14 container mx-auto px-4 max-w-lg text-secondary dark:text-neutral-100">
        <h1 className="text-2xl font-bold text-secondary dark:text-neutral-50 mb-4">
          {isAr ? "استعادة كلمة المرور" : "Reset your password"}
        </h1>
        <div className="space-y-3 bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow border border-accent/30 dark:border-neutral-800">
          <label className="block text-sm">{isAr ? "البريد الإلكتروني" : "Email"}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
          />
          <button onClick={submit} className="bg-primary text-white px-5 py-3 rounded-lg">
            {isAr ? "إرسال الرابط" : "Send reset link"}
          </button>
        </div>
      </section>
    </Layout>
  );
}
