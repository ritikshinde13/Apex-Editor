import React, { useState } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { Play, Eye, EyeOff, Loader2, ArrowLeft, ArrowRight, CheckCircle2, HelpCircle, Shield, FileText, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { setCurrentPage, setCurrentUser, showToast } = useUIStore();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [demoNotice, setDemoNotice] = useState<string | null>(null);
  const [activeInfoModal, setActiveInfoModal] = useState<'terms' | 'privacy' | 'help' | null>(null);

  const isFormValid = identifier.trim().length > 0 && password.trim().length > 0;

  const handleEnterEditor = (userName?: string, userEmail?: string) => {
    const finalName = userName || identifier.split('@')[0] || 'Apex Creator';
    const finalEmail = userEmail || identifier || 'creator@apexeditor.local';
    setCurrentUser({
      name: finalName,
      email: finalEmail,
      isLoggedIn: true,
    });
    window.location.hash = '#editor';
    setCurrentPage('editor');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isLoading) return;

    setIsLoading(true);
    setDemoNotice(null);

    setTimeout(() => {
      setIsLoading(false);
      const name = identifier.split('@')[0];
      setDemoNotice(
        mode === 'login'
          ? `Welcome back, ${name}! Launching Apex Studio...`
          : `Account created for ${name}! Launching Apex Studio...`
      );

      showToast({
        type: 'success',
        title: mode === 'login' ? 'Signed In' : 'Account Created',
        message: `Welcome to Apex Editor, ${name}!`,
      });

      setTimeout(() => {
        handleEnterEditor(name, identifier.trim());
      }, 700);
    }, 900);
  };

  const handleGoogleAuth = () => {
    setIsLoading(true);
    setDemoNotice(null);

    setTimeout(() => {
      setIsLoading(false);
      setDemoNotice('Google Account connected! Launching Apex Studio...');
      showToast({
        type: 'success',
        title: 'Google Sign-In',
        message: 'Authenticated with Google. Entering video studio...',
      });
      setTimeout(() => {
        handleEnterEditor('Google Creator', 'creator@gmail.com');
      }, 700);
    }, 800);
  };

  const handleGuestAccess = () => {
    showToast({
      type: 'info',
      title: 'Guest Mode Activated',
      message: 'Entering Apex Editor directly without credentials.',
    });
    handleEnterEditor('Guest Creator', 'guest@apexeditor.local');
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    showToast({
      type: 'info',
      title: 'Reset Password',
      message: 'Demo only: Password reset link simulated for your account.',
    });
  };

  return (
    <div className="min-h-screen w-full bg-[#0d0d0f] text-[#f3f4f6] font-sans flex flex-col justify-between items-center px-4 py-8 relative overflow-hidden select-none">
      {/* Restrained Ambient Gradient Glow behind the card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[540px] pointer-events-none rounded-full blur-[110px] opacity-25 bg-[radial-gradient(circle_at_center,#6C5CE7_0%,#00D2FF_50%,transparent_75%)] animate-pulse duration-1000" />
      <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

      {/* Top Bar: Return to Editor & Direct Guest Entry */}
      <header className="w-full max-w-md flex items-center justify-between z-10">
        <button
          onClick={handleGuestAccess}
          className="inline-flex items-center gap-1.5 text-xs text-editor-dim hover:text-white transition-colors py-1 px-2.5 rounded-md hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D2FF] cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Enter Video Editor</span>
        </button>

        <button
          onClick={handleGuestAccess}
          className="inline-flex items-center gap-1.5 text-xs text-[#00D2FF] hover:text-cyan-300 transition-colors py-1 px-2.5 rounded-md bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] cursor-pointer"
        >
          <Sparkles className="w-3 h-3 text-[#00D2FF]" />
          <span>Continue as Guest</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-[400px] flex flex-col items-center gap-4 z-10 my-auto">
        {/* Main Login Card */}
        <div className="w-full bg-[#161618] border border-white/[0.08] rounded-[10px] p-7 shadow-2xl shadow-black/80 relative backdrop-blur-sm">
          {/* Logo & Brand Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#00D2FF] to-[#6C5CE7] p-[1px] shadow-lg shadow-[#00D2FF]/20 mb-3 flex items-center justify-center">
              <div className="w-full h-full bg-[#111113] rounded-[11px] flex items-center justify-center">
                <Play className="w-5 h-5 text-[#00D2FF] fill-current ml-0.5" />
              </div>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
              Apex <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D2FF] to-[#6C5CE7]">Editor</span>
            </h1>
            <p className="text-xs text-[#9ca3af] mt-1">
              {mode === 'login'
                ? 'Sign in to access your video projects'
                : 'Create your account to start editing'}
            </p>
          </div>

          {/* Demo Mode Notice Banner */}
          {demoNotice && (
            <div className="mb-4 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-emerald-300 leading-tight">{demoNotice}</p>
            </div>
          )}

          {/* Login / Sign-up Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Identifier Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="identifier"
                className="block text-xs font-medium text-[#d1d5db]"
              >
                Email or username
              </label>
              <input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="name@example.com"
                disabled={isLoading}
                autoComplete="username"
                className="w-full h-10 px-3.5 bg-[#111113] border border-white/[0.1] rounded-[8px] text-xs text-white placeholder-editor-dim transition-all focus:outline-none focus:border-[#00D2FF] focus:ring-2 focus:ring-[#00D2FF]/20 disabled:opacity-50"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-[#d1d5db]"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  disabled={isLoading}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  className="w-full h-10 pl-3.5 pr-10 bg-[#111113] border border-white/[0.1] rounded-[8px] text-xs text-white placeholder-editor-dim transition-all focus:outline-none focus:border-[#00D2FF] focus:ring-2 focus:ring-[#00D2FF]/20 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-editor-dim hover:text-white p-1 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00D2FF] rounded"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className={`w-full h-10 rounded-[8px] font-semibold text-xs transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D2FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#161618] ${
                isFormValid && !isLoading
                  ? 'bg-gradient-to-r from-[#00D2FF] to-[#6C5CE7] hover:brightness-110 active:scale-[0.99] text-black font-bold shadow-lg shadow-[#00D2FF]/20 cursor-pointer'
                  : 'bg-white/10 text-white/40 cursor-not-allowed border border-white/[0.04]'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>{mode === 'login' ? 'Log in' : 'Create account'}</span>
              )}
            </button>

            {/* Forgot Password Link */}
            {mode === 'login' && (
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs text-[#9ca3af] hover:text-white transition-colors focus-visible:outline-none focus-visible:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}
          </form>

          {/* Horizontal Divider */}
          <div className="relative my-5 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.08]" />
            </div>
            <span className="relative px-3 bg-[#161618] text-[10px] font-medium uppercase tracking-wider text-editor-dim">
              OR
            </span>
          </div>

          {/* Secondary Button: Continue with Google */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full h-10 rounded-[8px] bg-white/[0.04] hover:bg-white/[0.08] active:bg-white/[0.1] border border-white/[0.09] text-xs font-medium text-white transition-all flex items-center justify-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D2FF] disabled:opacity-50 cursor-pointer"
          >
            {/* Google Brand Multi-Color SVG Icon */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Secondary Card below main card: Toggle Mode */}
        <div className="w-full bg-[#161618] border border-white/[0.08] rounded-[10px] p-3.5 text-center text-xs text-[#9ca3af] shadow-lg shadow-black/40 flex flex-col gap-2">
          {mode === 'login' ? (
            <span>
              New to Apex Editor?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setDemoNotice(null);
                }}
                className="text-[#00D2FF] font-semibold hover:underline focus-visible:outline-none focus-visible:underline cursor-pointer"
              >
                Create account
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setDemoNotice(null);
                }}
                className="text-[#00D2FF] font-semibold hover:underline focus-visible:outline-none focus-visible:underline cursor-pointer"
              >
                Log in
              </button>
            </span>
          )}

          <div className="border-t border-white/[0.06] pt-2 flex items-center justify-center gap-1.5 text-[11px] text-editor-dim">
            <span>Want to edit immediately?</span>
            <button
              type="button"
              onClick={handleGuestAccess}
              className="text-white hover:text-[#00D2FF] font-medium underline underline-offset-2 cursor-pointer"
            >
              Enter as Guest →
            </button>
          </div>
        </div>
      </main>

      {/* Footer Links */}
      <footer className="w-full max-w-md flex flex-col items-center gap-2 z-10 mt-auto pt-4">
        <div className="flex items-center gap-3 text-xs text-editor-dim">
          <button
            onClick={() => setActiveInfoModal('terms')}
            className="hover:text-[#9ca3af] transition-colors focus-visible:outline-none focus-visible:underline"
          >
            Terms
          </button>
          <span>·</span>
          <button
            onClick={() => setActiveInfoModal('privacy')}
            className="hover:text-[#9ca3af] transition-colors focus-visible:outline-none focus-visible:underline"
          >
            Privacy
          </button>
          <span>·</span>
          <button
            onClick={() => setActiveInfoModal('help')}
            className="hover:text-[#9ca3af] transition-colors focus-visible:outline-none focus-visible:underline"
          >
            Help
          </button>
        </div>
        <p className="text-[10px] text-editor-dim/60">
          © {new Date().getFullYear()} Apex Editor. Professional In-Browser Video Studio.
        </p>
      </footer>

      {/* Info / Terms / Help Modal */}
      {activeInfoModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#161618] border border-white/[0.1] rounded-xl p-5 max-w-sm w-full shadow-2xl relative">
            <div className="flex items-center gap-2 mb-3">
              {activeInfoModal === 'terms' && <FileText className="w-4 h-4 text-[#00D2FF]" />}
              {activeInfoModal === 'privacy' && <Shield className="w-4 h-4 text-[#6C5CE7]" />}
              {activeInfoModal === 'help' && <HelpCircle className="w-4 h-4 text-emerald-400]" />}
              <h3 className="text-sm font-semibold text-white capitalize">
                Apex Editor {activeInfoModal}
              </h3>
            </div>
            <p className="text-xs text-[#9ca3af] leading-relaxed mb-4">
              {activeInfoModal === 'terms' &&
                'By using Apex Editor, your video data and edits stay private on your local device. Projects are rendered client-side using WebAssembly and Web Audio API.'}
              {activeInfoModal === 'privacy' &&
                'Apex Editor prioritizes your privacy: no media files are uploaded to external servers without explicit user export actions. Everything runs client-side in your browser.'}
              {activeInfoModal === 'help' &&
                'Need assistance? Use the ✨ AI Co-Pilot inside the editor (Ctrl+J) to execute trimming, split, audio mixing, and color grading using natural language.'}
            </p>
            <button
              onClick={() => setActiveInfoModal(null)}
              className="w-full py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.12] text-xs font-semibold text-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
