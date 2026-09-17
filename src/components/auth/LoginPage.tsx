import React, { useState } from 'react';
import { useUIStore } from '@/store/useUIStore';
import {
  Play,
  Eye,
  EyeOff,
  Loader2,
  LogIn,
  LogOut,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Shield,
  FileText,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { setCurrentPage, currentUser, setCurrentUser, showToast } = useUIStore();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [demoNotice, setDemoNotice] = useState<string | null>(null);
  const [activeInfoModal, setActiveInfoModal] = useState<'terms' | 'privacy' | 'help' | null>(null);

  const isFormValid = identifier.trim().length > 0 && password.trim().length > 0;

  // Handle Logout: Reverts badge to "Logged out" and resets form to empty state
  const handleLogout = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentUser(null);
    setIdentifier('');
    setPassword('');
    setDemoNotice(null);
    if (window.location.hash !== '#login') {
      window.location.hash = '#login';
    }
    showToast({
      type: 'info',
      title: 'Logged Out',
      message: 'You have been logged out. Status reverted to Not logged in.',
    });
  };

  // Launch the Video Editor studio once authenticated
  const handleEnterStudio = () => {
    if (!currentUser || !currentUser.isLoggedIn) return;
    window.location.hash = '#editor';
    setCurrentPage('editor');
  };

  // Handle Login / Sign Up Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isLoading) return;

    setIsLoading(true);
    setDemoNotice(null);

    // Simulate brief authentication process
    setTimeout(() => {
      setIsLoading(false);
      const parsedName = identifier.split('@')[0].trim() || 'Apex Creator';
      const userEmail = identifier.includes('@') ? identifier.trim() : `${identifier.trim()}@apexeditor.local`;

      // Update in-memory session: swaps status badge to "Logged in"
      setCurrentUser({
        name: parsedName,
        email: userEmail,
        isLoggedIn: true,
      });

      setDemoNotice(
        mode === 'login'
          ? `Welcome back, ${parsedName}! Session authenticated.`
          : `Account created for ${parsedName}! Session authenticated.`
      );

      showToast({
        type: 'success',
        title: mode === 'login' ? 'Logged In Successfully' : 'Account Created',
        message: `Welcome, ${parsedName}! You can now enter Apex Studio.`,
      });

      // Auto launch video studio after brief feedback
      setTimeout(() => {
        window.location.hash = '#editor';
        setCurrentPage('editor');
      }, 1000);
    }, 900);
  };

  // Handle Google Authentication
  const handleGoogleAuth = () => {
    if (isLoading) return;
    setIsLoading(true);
    setDemoNotice(null);

    setTimeout(() => {
      setIsLoading(false);
      setCurrentUser({
        name: 'Google Creator',
        email: 'creator@gmail.com',
        isLoggedIn: true,
      });

      setDemoNotice('Google account authenticated! Session active.');
      showToast({
        type: 'success',
        title: 'Google Sign-In Verified',
        message: 'Welcome! Session created with Google.',
      });

      setTimeout(() => {
        window.location.hash = '#editor';
        setCurrentPage('editor');
      }, 1000);
    }, 850);
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    showToast({
      type: 'info',
      title: 'Password Reset (Demo)',
      message: `Simulated password reset instructions sent to ${identifier.trim() || 'your account'}.`,
    });
  };

  return (
    <div className="min-h-screen w-full bg-[#0d0d0f] text-[#f3f4f6] font-sans flex flex-col justify-between items-center px-4 py-8 relative overflow-hidden select-none">
      {/* Restrained Ambient Gradient Glow behind the card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[540px] pointer-events-none rounded-full blur-[115px] opacity-25 bg-[radial-gradient(circle_at_center,#6C5CE7_0%,#00D2FF_50%,transparent_75%)] animate-pulse duration-1000" />
      <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

      {/* Page Header with Brand Tag & Status Indicator Pill */}
      <header className="w-full max-w-[420px] flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-editor-dim bg-[#161618] border border-white/[0.06] px-2.5 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF] shadow-[0_0_6px_#00D2FF]" />
            <span>Apex Editor Pro</span>
          </span>
        </div>

        {/* Global Auth Status Pill: Logged out (gray dot + Not logged in + login arrow) vs Logged in (green dot + username + logout button) */}
        {currentUser?.isLoggedIn ? (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-medium animate-in fade-in duration-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
            <span className="max-w-[120px] truncate">{currentUser.name}</span>
            <button
              onClick={handleLogout}
              title="Log out"
              className="ml-0.5 p-1 rounded hover:bg-rose-500/20 hover:text-rose-300 text-emerald-400 transition-colors flex items-center cursor-pointer"
              aria-label="Log out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#161618] border border-white/[0.08] text-xs text-zinc-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-zinc-500" />
            <span>Not logged in</span>
            <LogIn className="w-3.5 h-3.5 text-zinc-400 ml-0.5" />
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-[420px] flex flex-col items-center gap-4 z-10 my-auto">
        {/* Main Login Card */}
        <div className="w-full bg-[#161618] border border-white/[0.08] rounded-[10px] p-7 shadow-2xl shadow-black/80 relative backdrop-blur-sm">
          {/* Card Top Row: Brand Monogram & Card Status Badge */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#00D2FF] to-[#6C5CE7] p-[1px] flex items-center justify-center">
                <div className="w-full h-full bg-[#111113] rounded-[5px] flex items-center justify-center">
                  <Play className="w-3 h-3 text-[#00D2FF] fill-current ml-0.5" />
                </div>
              </div>
              <span className="text-xs font-semibold tracking-tight text-white">
                Apex <span className="text-[#00D2FF]">Editor</span>
              </span>
            </div>

            {/* Status indicator badge inside card top corner */}
            {currentUser?.isLoggedIn ? (
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="font-medium max-w-[100px] truncate">{currentUser.name}</span>
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Log out"
                  className="p-0.5 hover:text-rose-400 rounded transition-colors cursor-pointer"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#111113] border border-white/[0.08] text-[11px] text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                <span>Not logged in</span>
                <LogIn className="w-3 h-3 text-zinc-400 ml-0.5" />
              </div>
            )}
          </div>

          {/* Logo Area */}
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
              {currentUser?.isLoggedIn
                ? 'Session verified. Account is ready to edit video.'
                : mode === 'login'
                ? 'Sign in to access your video editing workspace'
                : 'Create an account to start editing video'}
            </p>
          </div>

          {/* Active Session Card View (if already logged in) */}
          {currentUser?.isLoggedIn ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#111113] border border-emerald-500/20 flex flex-col items-center text-center gap-2 animate-in fade-in duration-200">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#00D2FF] to-[#6C5CE7] flex items-center justify-center text-black font-bold text-lg shadow-lg shadow-[#00D2FF]/20">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center justify-center gap-1.5">
                    <span>{currentUser.name}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </h3>
                  <p className="text-xs text-editor-dim font-mono mt-0.5">{currentUser.email}</p>
                </div>
                <div className="inline-flex items-center gap-1.5 text-[11px] text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded-full mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Authenticated Pro Member</span>
                </div>
              </div>

              {/* Primary Launch Studio Button */}
              <button
                type="button"
                onClick={handleEnterStudio}
                className="w-full h-10 rounded-[8px] bg-gradient-to-r from-[#00D2FF] to-[#6C5CE7] hover:brightness-110 active:scale-[0.99] text-black font-bold text-xs shadow-lg shadow-[#00D2FF]/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>Enter Video Studio</span>
                <ArrowRight className="w-4 h-4 text-black stroke-[2.5]" />
              </button>

              {/* Log out action button that reverts to Logged out */}
              <button
                type="button"
                onClick={handleLogout}
                className="w-full h-9 rounded-[8px] bg-white/[0.04] hover:bg-rose-500/10 hover:text-rose-400 border border-white/[0.08] hover:border-rose-500/30 text-xs font-medium text-zinc-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log out (revert to empty state)</span>
              </button>
            </div>
          ) : (
            /* Login / Signup Form when Logged Out */
            <>
              {/* Feedback Banner */}
              {demoNotice && (
                <div className="mb-4 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2 animate-in fade-in duration-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-emerald-300 leading-tight">{demoNotice}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Input field: Email or username */}
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

                {/* Input field: Password */}
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

                {/* Primary Button: "Log in" with login/arrow icon inside it */}
                <button
                  type="submit"
                  disabled={!isFormValid || isLoading}
                  className={`w-full h-10 rounded-[8px] font-bold text-xs transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D2FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#161618] ${
                    isFormValid && !isLoading
                      ? 'bg-gradient-to-r from-[#00D2FF] to-[#6C5CE7] hover:brightness-110 active:scale-[0.99] text-black shadow-lg shadow-[#00D2FF]/20 cursor-pointer'
                      : 'bg-white/10 text-white/40 cursor-not-allowed border border-white/[0.04]'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>{mode === 'login' ? 'Log in' : 'Create account'}</span>
                    </>
                  )}
                </button>

                {/* Link: "Forgot password?" */}
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

              {/* Divider: horizontal lines with "OR" centered */}
              <div className="relative my-5 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/[0.08]" />
                </div>
                <span className="relative px-3 bg-[#161618] text-[10px] font-medium uppercase tracking-wider text-editor-dim">
                  OR
                </span>
              </div>

              {/* Secondary Button: "Continue with Google" */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full h-10 rounded-[8px] bg-white/[0.04] hover:bg-white/[0.08] active:bg-white/[0.1] border border-white/[0.09] text-xs font-medium text-white transition-all flex items-center justify-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D2FF] disabled:opacity-50 cursor-pointer"
              >
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
            </>
          )}
        </div>

        {/* Secondary Card below main card: Toggle Mode (only when logged out) */}
        {!currentUser?.isLoggedIn && (
          <div className="w-full bg-[#161618] border border-white/[0.08] rounded-[10px] p-3.5 text-center text-xs text-[#9ca3af] shadow-lg shadow-black/40">
            {mode === 'login' ? (
              <span>
                New to Apex Editor?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setDemoNotice(null);
                  }}
                  className="text-[#00D2FF] font-semibold hover:underline focus-visible:outline-none focus-visible:underline cursor-pointer ml-1"
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
                  className="text-[#00D2FF] font-semibold hover:underline focus-visible:outline-none focus-visible:underline cursor-pointer ml-1"
                >
                  Log in
                </button>
              </span>
            )}
          </div>
        )}
      </main>

      {/* Footer: Terms · Privacy · Help */}
      <footer className="w-full max-w-md flex flex-col items-center gap-2 z-10 mt-auto pt-4">
        <div className="flex items-center gap-3 text-xs text-editor-dim">
          <button
            onClick={() => setActiveInfoModal('terms')}
            className="hover:text-[#9ca3af] transition-colors focus-visible:outline-none focus-visible:underline cursor-pointer"
          >
            Terms
          </button>
          <span>·</span>
          <button
            onClick={() => setActiveInfoModal('privacy')}
            className="hover:text-[#9ca3af] transition-colors focus-visible:outline-none focus-visible:underline cursor-pointer"
          >
            Privacy
          </button>
          <span>·</span>
          <button
            onClick={() => setActiveInfoModal('help')}
            className="hover:text-[#9ca3af] transition-colors focus-visible:outline-none focus-visible:underline cursor-pointer"
          >
            Help
          </button>
        </div>
        <p className="text-[10px] text-editor-dim/60">
          © {new Date().getFullYear()} Apex Editor. Professional In-Browser Video Studio.
        </p>
      </footer>

      {/* Info Modal for Terms / Privacy / Help */}
      {activeInfoModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#161618] border border-white/[0.1] rounded-xl p-5 max-w-sm w-full shadow-2xl relative">
            <div className="flex items-center gap-2 mb-3">
              {activeInfoModal === 'terms' && <FileText className="w-4 h-4 text-[#00D2FF]" />}
              {activeInfoModal === 'privacy' && <Shield className="w-4 h-4 text-[#6C5CE7]" />}
              {activeInfoModal === 'help' && <HelpCircle className="w-4 h-4 text-emerald-400" />}
              <h3 className="text-sm font-semibold text-white capitalize">
                Apex Editor {activeInfoModal}
              </h3>
            </div>
            <p className="text-xs text-[#9ca3af] leading-relaxed mb-4">
              {activeInfoModal === 'terms' &&
                'An account is required to edit videos. By using Apex Editor, your video data and edits stay private on your local device. Projects are rendered client-side using WebAssembly and Web Audio API.'}
              {activeInfoModal === 'privacy' &&
                'Apex Editor prioritizes your privacy: no media files are uploaded to external servers without explicit user export actions. Everything runs client-side in your browser.'}
              {activeInfoModal === 'help' &&
                'Need assistance? Once logged in, use the ✨ AI Co-Pilot inside the editor (Ctrl+J) to execute trimming, split, audio mixing, and color grading using natural language.'}
            </p>
            <button
              onClick={() => setActiveInfoModal(null)}
              className="w-full py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.12] text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
