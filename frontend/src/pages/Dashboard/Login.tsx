import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { login } from "../../api/endpoints";

export default function DashboardLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const handleLogin = async () => {
    try {
      await login(username, password);
      navigate("/dashboard");
    } catch (e) {
      console.error(e);
      setError(isAr ? "تعذر تسجيل الدخول، تأكد من البيانات." : "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-surface dark:bg-neutral-950 text-secondary dark:text-neutral-100">
      <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow border border-accent/40 dark:border-neutral-800 w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-secondary dark:text-neutral-50 text-center">
          {isAr ? "تسجيل دخول لوحة التحكم" : "Dashboard login"}
        </h1>
        <input
          className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
          placeholder={isAr ? "اسم المستخدم" : "Username"}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
          type="password"
          placeholder={isAr ? "كلمة المرور" : "Password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin} className="w-full bg-primary text-white py-3 rounded-lg">
          {isAr ? "دخول" : "Sign in"}
        </button>
        {error && <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>}
      </div>
    </div>
  );
}
