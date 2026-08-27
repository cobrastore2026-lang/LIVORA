"use client";

import React, { useState, useEffect } from "react";
import { Save, Loader2, RefreshCw, Check, Sparkles, Phone, Instagram, KeyRound, Lock, Mail, ShieldCheck } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({
    store_name: "LIVORA | ليفورا",
    whatsapp_number: "967737462144",
    whatsapp_message_prefix: "السلام عليكم، أرغب في طلب:",
    instagram_url: "https://instagram.com/livora_ye",
    tiktok_url: "https://tiktok.com/@livora.ye",
    currency_symbol: "ر.ي",
    store_description: "الوجهة الأولى للمرأة الأنيقة في اليمن - إكسسوارات، مكياج، ومنتجات عناية وجمال فاخرة ومختارة بعناية فائقة.",
    about_title: "قصة ليفورا | فخامة تليق بكِ",
    about_text: "انطلقت LIVORA لتكون المعيار الحقيقي للأناقة والجمال العصري في اليمن. نختار كل قطعة بعناية استثنائية لتلهم كل امرأة ثقة مطلقة وإشراقة ساحرة.",
    about_image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Admin Credentials State
  const [currentAdminEmail, setCurrentAdminEmail] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingCredentials, setIsUpdatingCredentials] = useState(false);
  const [credSuccess, setCredSuccess] = useState("");
  const [credError, setCredError] = useState("");

  const fetchSettingsAndAdmin = async () => {
    setIsLoading(true);
    try {
      const [settingsRes, adminRes] = await Promise.all([
        fetch("/api/settings"),
        fetch("/api/auth/me"),
      ]);

      const settingsData = await settingsRes.json();
      if (settingsData.settings) {
        setSettings((prev) => ({ ...prev, ...settingsData.settings }));
      }

      const adminData = await adminRes.json();
      if (adminData.authenticated && adminData.admin) {
        setCurrentAdminEmail(adminData.admin.email);
        setNewAdminEmail(adminData.admin.email);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettingsAndAdmin();
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMessage("تم حفظ كافة إعدادات المتجر بنجاح!");
        setTimeout(() => setSuccessMessage(""), 4000);
      } else {
        setErrorMessage(data.error || "فشل حفظ الإعدادات");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("حدث خطأ في الاتصال بالخادم");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setCredError("");
    setCredSuccess("");

    if (!currentPassword) {
      setCredError("يرجى إدخال كلمة المرور الحالية لتأكيد التحديث");
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setCredError("كلمة المرور الجديدة وتأكيدها غير متطابقين");
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setCredError("يجب أن تكون كلمة المرور الجديدة 6 أحرف على الأقل");
      return;
    }

    setIsUpdatingCredentials(true);

    try {
      const res = await fetch("/api/admin/change-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newEmail: newAdminEmail.trim(),
          newPassword: newPassword || undefined,
          confirmPassword: confirmPassword || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setCredSuccess(data.message || "تم تحديث بيانات حساب المسؤول بنجاح!");
        setCurrentAdminEmail(data.email || newAdminEmail);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setCredSuccess(""), 5000);
      } else {
        setCredError(data.error || "فشل تحديث بيانات الحساب");
      }
    } catch (err) {
      console.error(err);
      setCredError("تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً");
    } finally {
      setIsUpdatingCredentials(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#C8A96B]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E8DFD3] shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-[#171717]">
            إعدادات المتجر والحساب
          </h1>
          <p className="text-xs text-gray-500 mt-1 font-light">
            إدارة بيانات التواصل، قصة ليفورا، وأمان حساب دخول الإدارة
          </p>
        </div>
      </div>

      {/* Admin Account & Security Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DFD3] shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD3]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#171717] text-[#C8A96B] flex items-center justify-center shadow-sm">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#171717]">أمان وبيانات حساب المسؤول (Admin Account)</h3>
              <p className="text-xs text-gray-400">تغيير البريد الإلكتروني وكلمة المرور الخاصة بدخول لوحة التحكم</p>
            </div>
          </div>
          {currentAdminEmail && (
            <span className="hidden sm:inline-block px-3 py-1 bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl text-xs font-mono text-[#171717]">
              {currentAdminEmail}
            </span>
          )}
        </div>

        {credSuccess && (
          <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl text-xs font-bold border border-emerald-200 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{credSuccess}</span>
          </div>
        )}

        {credError && (
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-200">
            {credError}
          </div>
        )}

        <form onSubmit={handleUpdateCredentials} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1.5">
                البريد الإلكتروني للوحة الإدارة:
              </label>
              <div className="relative">
                <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="admin@livora.ye"
                  className="w-full bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl pr-10 pl-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#C8A96B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1.5">
                كلمة المرور الحالية (مطلوبة لتأكيد التغيير):
              </label>
              <div className="relative">
                <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="كلمة المرور الحالية"
                  className="w-full bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl pr-10 pl-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#C8A96B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1.5">
                كلمة المرور الجديدة (اتركيها فارغة إذا لا ترغبين بتغييرها):
              </label>
              <div className="relative">
                <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl pr-10 pl-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#C8A96B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1.5">
                تأكيد كلمة المرور الجديدة:
              </label>
              <div className="relative">
                <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl pr-10 pl-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#C8A96B]"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isUpdatingCredentials}
              className="inline-flex items-center gap-2 bg-[#171717] hover:bg-[#C8A96B] text-[#C8A96B] hover:text-black font-bold text-xs py-3 px-6 rounded-xl transition-all border border-[#C8A96B]/40 shadow-sm disabled:opacity-50"
            >
              {isUpdatingCredentials ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>تحديث وحفظ بيانات الدخول</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Store Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Alerts */}
        {successMessage && (
          <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl text-xs font-bold border border-emerald-200 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-200">
            {errorMessage}
          </div>
        )}

        {/* General Store Info */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DFD3] shadow-sm space-y-4">
          <h3 className="font-bold text-base text-[#171717] pb-3 border-b border-[#E8DFD3]">
            معلومات المتجر العامة
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1.5">
                اسم المتجر
              </label>
              <input
                type="text"
                value={settings.store_name || ""}
                onChange={(e) => handleChange("store_name", e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#C8A96B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1.5">
                رمز العملة
              </label>
              <input
                type="text"
                value={settings.currency_symbol || ""}
                onChange={(e) => handleChange("currency_symbol", e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#C8A96B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#171717] mb-1.5">
              الوصف المختصر للمتجر
            </label>
            <textarea
              rows={2}
              value={settings.store_description || ""}
              onChange={(e) => handleChange("store_description", e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl p-3 text-xs text-[#171717] focus:outline-none focus:border-[#C8A96B]"
            />
          </div>
        </div>

        {/* WhatsApp & Social Contacts */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DFD3] shadow-sm space-y-4">
          <h3 className="font-bold text-base text-[#171717] pb-3 border-b border-[#E8DFD3] flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#C8A96B]" />
            <span>رقم واتساب الطلبات والشبكات الاجتماعية</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#171717] mb-1.5">
                رقم WhatsApp المعتمد لاستقبال طلبات الزبائن
              </label>
              <input
                type="text"
                value={settings.whatsapp_number || ""}
                onChange={(e) => handleChange("whatsapp_number", e.target.value)}
                placeholder="967737462144"
                className="w-full bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl px-3.5 py-2.5 text-xs text-[#171717] font-mono focus:outline-none focus:border-[#C8A96B]"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">
                الصيغة الدولية بدون (+) أو مسافات: 967737462144
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1.5">
                رابط حساب انستغرام
              </label>
              <input
                type="url"
                value={settings.instagram_url || ""}
                onChange={(e) => handleChange("instagram_url", e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#C8A96B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1.5">
                رابط حساب تيك توك
              </label>
              <input
                type="url"
                value={settings.tiktok_url || ""}
                onChange={(e) => handleChange("tiktok_url", e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#C8A96B]"
              />
            </div>
          </div>
        </div>

        {/* About Section Story */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DFD3] shadow-sm space-y-4">
          <h3 className="font-bold text-base text-[#171717] pb-3 border-b border-[#E8DFD3]">
            محتوى قسم &quot;من نحن - قصة ليفورا&quot;
          </h3>

          <div>
            <label className="block text-xs font-bold text-[#171717] mb-1.5">
              عنوان القسم
            </label>
            <input
              type="text"
              value={settings.about_title || ""}
              onChange={(e) => handleChange("about_title", e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#C8A96B]"
            />
          </div>

          <ImageUploader
            value={settings.about_image || ""}
            onChange={(val) => handleChange("about_image", val)}
            label="الصورة التعبيرية لقسم قصة ليفورا"
            aspectRatio="square"
          />

          <div>
            <label className="block text-xs font-bold text-[#171717] mb-1.5">
              النص السردي للقصة
            </label>
            <textarea
              rows={4}
              value={settings.about_text || ""}
              onChange={(e) => handleChange("about_text", e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl p-3 text-xs text-[#171717] focus:outline-none focus:border-[#C8A96B]"
            />
          </div>
        </div>

        {/* Save Button */}
        <div>
          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-[#171717] hover:bg-[#C8A96B] text-[#C8A96B] hover:text-black font-bold text-sm py-4 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 border border-[#C8A96B]/50 shadow-gold-glow disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>حفظ وتحديث إعدادات المتجر</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
