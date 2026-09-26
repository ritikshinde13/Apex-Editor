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
  ArrowLeft,
} from 'lucide-react';
import { AnimatedButton } from '@/components/ui/animated-button';

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

  const handleBackToLanding = () => {
    window.location.hash = '#landing';
    setCurrentPage('landing');
  };

  return (
    <div className="min-h-screen w-full bg-[#06070a] text-[#f3f4f6] font-sans flex flex-col justify-between items-center px-4 py-8 relative overflow-hidden select-none">
      {/* Dynamic Ambient Background Mesh Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full bg-accent-cyan/20 blur-[130px] animate-orb-1" />
        <div className="absolute -bottom-36 -right-32 w-[600px] h-[600px] rounded-full bg-accent-purple/20 blur-[140px] animate-orb-2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full bg-blue-600/15 blur-[120px] animate-orb-3" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(6,7,10,0.7)_100%)]" />
      </div>

      {/* Page Header with Brand Tag & Status Indicator Pill */}
      <header className="w-full max-w-[430px] flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleBackToLanding}
            className="text-[11px] font-medium text-editor-subtext hover:text-white glass-pill px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/10 shadow-glass-sm transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
          <span className="text-[11px] font-mono text-editor-subtext glass-pill px-3 py-1 rounded-full flex items-center gap-2 border border-white/10 shadow-glass-sm hidden sm:flex">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan shadow-[0_0_8px_#00e5ff] animate-pulse" />
            <span className="font-semibold text-white">Apex Editor Pro</span>
          </span>
        </div>

        {/* Global Auth Status Pill */}
        {currentUser?.isLoggedIn ? (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-medium backdrop-blur-xl shadow-glass-sm animate-in fade-in duration-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
            <span className="max-w-[120px] truncate font-semibold">{currentUser.name}</span>
            <button
              onClick={handleLogout}
              title="Log out"
              className="ml-0.5 p-1 rounded-full hover:bg-rose-500/20 hover:text-rose-300 text-emerald-400 transition-colors flex items-center cursor-pointer"
              aria-label="Log out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full glass-pill text-xs text-editor-dim font-medium border border-white/10 shadow-glass-sm">
            <span className="w-2 h-2 rounded-full bg-zinc-500" />
            <span>Not logged in</span>
            <LogIn className="w-3.5 h-3.5 text-zinc-400 ml-0.5" />
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-[430px] flex flex-col items-center gap-4 z-10 my-auto">
        {/* Main Frosted Glass Login Card */}
        <div className="w-full glass-panel rounded-3xl p-8 shadow-glass-lg backdrop-blur-3xl bg-slate-950/70 border border-white/15 relative overflow-hidden specular-border">
          {/* Top Subtle Specular Light Gradient */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-accent-cyan/50 to-transparent pointer-events-none" />

          {/* Card Top Row: Brand Monogram & Card Status Badge */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-accent-cyan via-blue-500 to-accent-purple p-[1px] shadow-glow-cyan flex items-center justify-center">
                <div className="w-full h-full bg-[#0a0d14] rounded-[11px] flex items-center justify-center">
                  <Play className="w-3 h-3 text-accent-cyan fill-current ml-0.5" />
                </div>
              </div>
              <span className="text-xs font-bold tracking-tight text-white">
                Apex <span className="text-accent-cyan drop-shadow-[0_0_6px_rgba(0,229,255,0.4)]">Editor</span>
              </span>
            </div>

            {/* Status indicator badge inside card top corner */}
            {currentUser?.isLoggedIn ? (
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[11px] text-emerald-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                <span className="max-w-[100px] truncate">{currentUser.name}</span>
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
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full glass-pill text-[11px] text-zinc-400 border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                <span>Not logged in</span>
                <LogIn className="w-3 h-3 text-zinc-400 ml-0.5" />
              </div>
            )}
          </div>

          {/* Logo Area */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-accent-cyan via-blue-500 to-accent-purple p-[1.5px] shadow-glow-cyan/50 mb-3 flex items-center justify-center">
              <div className="w-full h-full bg-[#080b12] rounded-[14px] flex items-center justify-center">
                <Play className="w-6 h-6 text-accent-cyan fill-current ml-0.5 filter drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]" />
              </div>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-1">
              Apex <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan via-blue-400 to-accent-purple drop-shadow-[0_0_12px_rgba(0,229,255,0.3)]">Studio</span>
            </h1>
            <p className="text-xs text-editor-subtext mt-1.5 font-medium">
              {currentUser?.isLoggedIn
                ? 'Session verified. Account is ready to edit video.'
                : mode === 'login'
                ? 'Sign in to access your frosted video workspace'
                : 'Create an account to start editing video'}
            </p>
          </div>

          {/* Active Session Card View (if already logged in) */}
          {currentUser?.isLoggedIn ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl glass-card border border-emerald-500/30 flex flex-col items-center text-center gap-2 animate-in fade-in duration-200">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-accent-cyan to-accent-purple flex items-center justify-center text-black font-extrabold text-lg shadow-glow-cyan/40">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center justify-center gap-1.5">
                    <span>{currentUser.name}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </h3>
                  <p className="text-xs text-editor-dim font-mono mt-0.5">{currentUser.email}</p>
                </div>
                <div className="inline-flex items-center gap-1.5 text-[11px] text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-3 py-0.5 rounded-full mt-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Authenticated Pro Member</span>
                </div>
              </div>

              {/* Primary Launch Studio Button with Animated Border Beam & Shimmer */}
              <AnimatedButton
                type="button"
                variant="cyan"
                onClick={handleEnterStudio}
                className="w-full h-11 rounded-2xl text-xs font-bold shadow-glow-cyan gap-2 cursor-pointer"
              >
                <span>Enter Video Studio</span>
                <ArrowRight className="w-4 h-4 text-black stroke-[2.5]" />
              </AnimatedButton>

              {/* Log out action button that reverts to Logged out */}
              <button
                type="button"
                onClick={handleLogout}
                className="w-full h-10 rounded-2xl glass-pill hover:bg-rose-500/10 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 text-xs font-medium text-zinc-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
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
                <div className="mb-4 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-start gap-2.5 animate-in fade-in duration-200 backdrop-blur-md">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-emerald-300 font-medium leading-tight">{demoNotice}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Input field: Email or username */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="identifier"
                    className="block text-xs font-semibold text-editor-subtext"
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
                    className="w-full h-11 px-4 glass-pill rounded-2xl text-xs text-white placeholder-editor-dim transition-all focus:outline-none focus:border-accent-cyan/70 focus:shadow-glow-cyan/20 disabled:opacity-50"
                  />
                </div>

                {/* Input field: Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-xs font-semibold text-editor-subtext"
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
                      className="w-full h-11 pl-4 pr-11 glass-pill rounded-2xl text-xs text-white placeholder-editor-dim transition-all focus:outline-none focus:border-accent-cyan/70 focus:shadow-glow-cyan/20 disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-editor-dim hover:text-white p-1 transition-colors cursor-pointer"
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

                {/* Primary Button: "Log in" with animated border beam & text shimmer */}
                <AnimatedButton
                  type="submit"
                  disabled={!isFormValid || isLoading}
                  variant={isFormValid && !isLoading ? 'cyan' : 'default'}
                  className={`w-full h-11 rounded-2xl text-xs font-bold gap-2 shadow-glow-cyan/40 cursor-pointer ${
                    !isFormValid || isLoading ? 'opacity-50 cursor-not-allowed' : ''
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
                </AnimatedButton>

                {/* Link: "Forgot password?" */}
                {mode === 'login' && (
                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-xs text-editor-subtext hover:text-accent-cyan transition-colors cursor-pointer"
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
                <span className="relative px-3 glass-pill text-[10px] font-bold uppercase tracking-wider text-editor-dim rounded-full">
                  OR
                </span>
              </div>

              {/* Secondary Button: "Continue with Google" */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full h-11 rounded-2xl glass-pill hover:border-white/20 active:bg-white/[0.08] text-xs font-semibold text-white transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer shadow-glass-sm"
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
          <div className="w-full glass-pill rounded-2xl p-3.5 text-center text-xs text-editor-subtext shadow-glass-sm border border-white/10">
            {mode === 'login' ? (
              <span>
                New to Apex Editor?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setDemoNotice(null);
                  }}
                  className="text-accent-cyan font-bold hover:underline cursor-pointer ml-1 drop-shadow-[0_0_6px_rgba(0,229,255,0.4)]"
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
                  className="text-accent-cyan font-bold hover:underline cursor-pointer ml-1 drop-shadow-[0_0_6px_rgba(0,229,255,0.4)]"
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
            className="hover:text-white transition-colors cursor-pointer"
          >
            Terms
          </button>
          <span>·</span>
          <button
            onClick={() => setActiveInfoModal('privacy')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Privacy
          </button>
          <span>·</span>
          <button
            onClick={() => setActiveInfoModal('help')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Help
          </button>
        </div>
        <p className="text-[10px] text-editor-dim/60 font-mono">
          © {new Date().getFullYear()} Apex Studio. Frosted Glass Next-Gen Video Editor.
        </p>
      </footer>

      {/* Info Modal for Terms / Privacy / Help */}
      {activeInfoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="glass-panel rounded-3xl p-6 max-w-sm w-full shadow-glass-lg border border-white/15 relative">
            <div className="flex items-center gap-2 mb-3">
              {activeInfoModal === 'terms' && <FileText className="w-4 h-4 text-accent-cyan" />}
              {activeInfoModal === 'privacy' && <Shield className="w-4 h-4 text-accent-purple" />}
              {activeInfoModal === 'help' && <HelpCircle className="w-4 h-4 text-emerald-400" />}
              <h3 className="text-sm font-bold text-white capitalize">
                Apex Editor {activeInfoModal}
              </h3>
            </div>
            <p className="text-xs text-editor-subtext leading-relaxed mb-4">
              {activeInfoModal === 'terms' &&
                'An account is required to edit videos. By using Apex Editor, your video data and edits stay private on your local device. Projects are rendered client-side using WebAssembly and Web Audio API.'}
              {activeInfoModal === 'privacy' &&
                'Apex Editor prioritizes your privacy: no media files are uploaded to external servers without explicit user export actions. Everything runs client-side in your browser.'}
              {activeInfoModal === 'help' &&
                'Need assistance? Once logged in, use the ✨ AI Co-Pilot inside the editor (Ctrl+J) to execute trimming, split, audio mixing, and color grading using natural language.'}
            </p>
            <button
              onClick={() => setActiveInfoModal(null)}
              className="w-full py-2 rounded-xl glass-pill hover:bg-white/[0.1] text-xs font-bold text-white transition-colors cursor-pointer border border-white/10"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
