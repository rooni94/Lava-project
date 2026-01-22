import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { confirmPasswordReset } from "../api/endpoints";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import Layout from "../components/layout/Layout";

export default function ResetConfirm() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const uid = params.get("uid") || "";
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const submit = async () => {
    try {
      await confirmPasswordReset({ uid, token, new_password: password });
      toast.success(isAr ? "تم تحديث كلمة المرور." : "Password updated.");
      navigate("/dashboard/login");
    } catch (e) {
      toast.error(isAr ? "رابط غير صالح أو منتهي." : "Invalid or expired link.");
    }
  };

  return (
    <Layout>
      <section className="py-14 container mx-auto px-4 max-w-lg text-secondary dark:text-neutral-100">
        <h1 className="text-2xl font-bold text-secondary dark:text-neutral-50 mb-4">
          {isAr ? "تعيين كلمة مرور جديدة" : "Set a new password"}
        </h1>
        <div className="space-y-3 bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow border border-accent/30 dark:border-neutral-800">
          <label className="block text-sm">{isAr ? "كلمة المرور الجديدة" : "New password"}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
          />
          <button onClick={submit} className="bg-primary text-white px-5 py-3 rounded-lg">
            {isAr ? "تحديث" : "Update password"}
          </button>
        </div>
      </section>
    </Layout>
  );
}
