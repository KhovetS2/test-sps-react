import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  // If already authenticated, redirect
  if (isAuthenticated) {
    navigate(from, { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message || "Erro ao fazer login. Tente novamente.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sps-950 via-sps-900 to-sps-800 px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-sps-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-sps-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sps-400 to-sps-600 rounded-2xl shadow-lg shadow-sps-500/25 mb-4">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <h1 className="text-2xl font-bold text-white">SPS System</h1>
          <p className="text-sps-300 mt-1">Faça login para continuar</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Alert */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-sps-200 mb-1.5">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg
                         text-white placeholder-sps-400
                         focus:outline-none focus:ring-2 focus:ring-sps-400 focus:border-transparent
                         transition-all duration-200"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-sps-200 mb-1.5">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg
                         text-white placeholder-sps-400
                         focus:outline-none focus:ring-2 focus:ring-sps-400 focus:border-transparent
                         transition-all duration-200"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-sps-500 to-sps-600 text-white rounded-lg
                       font-semibold shadow-lg shadow-sps-500/25
                       hover:from-sps-400 hover:to-sps-500
                       focus:outline-none focus:ring-2 focus:ring-sps-400 focus:ring-offset-2 focus:ring-offset-sps-900
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200
                       flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sps-400 text-xs mt-6">
          © 2026 SPS Group. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}

export default SignIn;
