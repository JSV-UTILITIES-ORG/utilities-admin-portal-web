import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { Sparkles, ArrowRight, ShieldCheck, Check } from "lucide-react";
import type { AdminRole } from "../../types/admin";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("super@demo.com");
  const [password, setPassword] = useState("demo123");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login, switchRole } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please provide valid admin credentials");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const quickRoles: { role: AdminRole; label: string; email: string }[] = [
    {
      role: "SUPER_ADMIN",
      label: "SUPER ADMIN",
      email: "super@demo.com",
    },
    {
      role: "OPERATIONS_ADMIN",
      label: "OPERATIONS ADMIN",
      email: "ops@demo.com",
    },
    {
      role: "FINANCE_ADMIN",
      label: "FINANCE ADMIN",
      email: "finance@demo.com",
    },
    {
      role: "SUPPORT_ADMIN",
      label: "SUPPORT ADMIN",
      email: "support@demo.com",
    },
  ];

  const handleQuickRole = (r: AdminRole, roleEmail: string) => {
    setEmail(roleEmail);
    setPassword("demo123");
    switchRole(r);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans antialiased overflow-x-hidden">
      {/* LEFT FORM COLUMN */}
      <div className="w-full lg:w-[48%] min-h-screen overflow-y-auto flex flex-col justify-between p-6 sm:p-10 lg:p-12 bg-white shrink-0">
        <div>
          {/* Brand Header */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-lg bg-[#0f172a] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">
              PaniMitra
            </span>
          </div>

          <div className="max-w-md mx-auto lg:mx-0">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 block mb-2">
              ADMIN PORTAL
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-heading mb-2">
              Sign in to operate the marketplace.
            </h1>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Access is restricted to authorized administrators. All actions are
              audited.
            </p>

            {error && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-red-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email or mobile
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="super@demo.com"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-slate-900 transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => e.preventDefault()}
                    className="text-[11px] font-medium text-slate-400 hover:text-slate-600"
                  >
                    Forgot password?
                  </a>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-slate-900 transition-all"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900 border-slate-300 cursor-pointer"
                />
                <label
                  htmlFor="remember"
                  className="text-xs text-slate-600 font-medium cursor-pointer"
                >
                  Remember this device
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-[#0f172a] hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign in</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* DEMO ACCOUNTS GRID */}
            <div className="mt-8 pt-5 border-t border-slate-100">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-2.5">
                DEMO ACCOUNTS
              </span>

              <div className="grid grid-cols-2 gap-2.5">
                {quickRoles.map((qr) => (
                  <button
                    key={qr.role}
                    type="button"
                    onClick={() => handleQuickRole(qr.role, qr.email)}
                    className="p-2.5 border border-slate-200/90 rounded-xl bg-white hover:border-slate-400 hover:bg-slate-50/80 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider group-hover:text-blue-600 transition-colors">
                        {qr.label}
                      </span>
                      {email === qr.email && (
                        <Check className="w-3.5 h-3.5 text-blue-600" />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {qr.email}
                    </p>
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 font-mono mt-2.5">
                Password for all demo accounts:{" "}
                <span className="font-bold text-slate-600">demo123</span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-[11px] text-slate-400 font-mono mt-6">
          © PaniMitra · Marketplace Operations
        </div>
      </div>

      {/* RIGHT HERO SKYLINE COLUMN */}
      <div className="hidden lg:flex flex-1 relative bg-slate-900 overflow-hidden flex-col justify-between p-12 lg:p-16 text-white min-h-screen">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80"
            alt="City Skyline"
            className="w-full h-full object-cover opacity-35 mix-blend-luminosity scale-105 filter contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/60" />
        </div>

        {/* Top Header Badge */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-bold uppercase tracking-widest text-slate-200 shadow-md">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping inline-block"></span>
            OPERATIONS CONTROL CENTER
          </div>
        </div>

        {/* Bottom Hero Text & KPIs */}
        <div className="relative z-10 space-y-8 max-w-xl">
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white font-heading leading-tight">
              Run every corner of your city services marketplace.
            </h2>
            <p className="text-sm text-slate-300 font-normal leading-relaxed">
              Assignments, partner verification, disputes, refunds and SLA — one
              operational surface.
            </p>
          </div>

          {/* KPI Stat Row */}
          <div className="pt-6 border-t border-white/15 grid grid-cols-3 gap-6">
            <div>
              <span className="text-2xl lg:text-3xl font-extrabold text-white font-mono block">
                48min
              </span>
              <span className="text-[10px] lg:text-[11px] font-bold tracking-wider text-slate-400 uppercase mt-1 block">
                AVG. SLA
              </span>
            </div>
            <div>
              <span className="text-2xl lg:text-3xl font-extrabold text-white font-mono block">
                96.4%
              </span>
              <span className="text-[10px] lg:text-[11px] font-bold tracking-wider text-slate-400 uppercase mt-1 block">
                COMPLETION
              </span>
            </div>
            <div>
              <span className="text-2xl lg:text-3xl font-extrabold text-white font-mono block">
                32
              </span>
              <span className="text-[10px] lg:text-[11px] font-bold tracking-wider text-slate-400 uppercase mt-1 block">
                ACTIVE PARTNERS
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
