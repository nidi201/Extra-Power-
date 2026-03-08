import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@cleaning.com");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await login(email);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Top accent */}
      <div className="fixed top-0 left-0 w-full h-1 bg-blue-600 z-50" />
      {/* Blobs */}
      <div className="fixed -bottom-24 -left-24 w-64 h-64 bg-blue-100 rounded-full blur-3xl -z-10" />
      <div className="fixed -top-24 -right-24 w-96 h-96 bg-blue-50 rounded-full blur-3xl -z-10" />

      {/* Logo */}
      <div className="flex flex-col items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg shadow-blue-600/25">🧹</div>
        <div className="text-center">
          <h2 className="text-slate-900 text-lg font-black tracking-tight">CleanPro Platform</h2>
          <p className="text-slate-400 text-sm mt-0.5">Enterprise Management Suite</p>
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin Portal</h1>
            <p className="text-slate-400 text-sm mt-1.5">Enter your admin email to sign in</p>
          </div>

          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Email Address</label>
              <input
                className="w-full h-11 rounded-xl border border-slate-200 px-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                placeholder="admin@cleaning.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <p className="text-xs text-slate-400">Use any <span className="font-semibold">@cleanpro.com</span> or <span className="font-semibold">admin@cleaning.com</span></p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-2.5 font-medium">
                {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-600/20"
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </div>
        </div>
        <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 text-center">
          <p className="text-slate-400 text-xs">
            Protected by enterprise-grade encryption.{" "}
            <Link to="/" className="text-blue-600 hover:underline font-semibold">Back to Store</Link>
          </p>
        </div>
      </div>

      <div className="mt-10 flex items-center gap-6 text-slate-400 text-xs uppercase tracking-widest font-bold">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
          System Operational
        </div>
        <div className="flex items-center gap-1.5">🌐 Global Node 04</div>
      </div>
    </div>
  );
}
