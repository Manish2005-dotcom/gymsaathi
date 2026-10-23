import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Database,
  Dumbbell,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'signin' | 'signup' | 'forgot';
  onOpenSetupGuide?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'signin',
  onOpenSetupGuide,
}) => {
  const { signIn, signUp, resetPassword, isConfigured, setGuestMode } = useAuth();

  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'forgot'>(initialTab);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validation
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (activeTab === 'forgot') {
      setLoading(true);
      const res = await resetPassword(email);
      setLoading(false);
      if (res.success) {
        setSuccessMessage('Password reset link has been dispatched to your email address.');
      } else {
        setErrorMessage(res.error || 'Failed to send reset link.');
      }
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('Password must contain at least 6 characters.');
      return;
    }

    if (activeTab === 'signup') {
      if (!fullName.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }

      setLoading(true);
      const res = await signUp(email, password, fullName);
      setLoading(false);

      if (res.success) {
        setSuccessMessage('Account created successfully! Proceeding to fitness assessment...');
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setErrorMessage(res.error || 'Signup failed. Please try again.');
      }
      return;
    }

    if (activeTab === 'signin') {
      setLoading(true);
      const res = await signIn(email, password);
      setLoading(false);

      if (res.success) {
        setSuccessMessage('Signed in successfully! Welcome back.');
        setTimeout(() => {
          onClose();
        }, 800);
      } else {
        setErrorMessage(res.error || 'Invalid credentials or login failed.');
      }
    }
  };

  const handleGuestPreview = () => {
    setGuestMode(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="bg-[#101412] border border-zinc-800 rounded-2xl w-full max-w-md my-8 overflow-hidden shadow-2xl relative">
        {/* Top Accent bar */}
        <div className="h-1 bg-gradient-to-r from-lime-500 via-emerald-400 to-lime-600" />

        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Banner */}
        <div className="px-6 pt-6 pb-4 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-lime-500/10 border border-lime-500/20 text-lime-400 mb-3 shadow-inner">
            <Dumbbell className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">GymSaathi</h2>
          <p className="text-xs text-zinc-400 mt-1">
            {activeTab === 'signin' && 'Sign in to sync your custom workouts and diet plans'}
            {activeTab === 'signup' && 'Create your account to unlock personalized fitness tracking'}
            {activeTab === 'forgot' && 'Reset your password via verified email'}
          </p>

          {!isConfigured && (
            <div className="mt-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-left text-[11px]">
                <Database className="w-3.5 h-3.5 flex-shrink-0" />
                Supabase credentials not yet detected in env.
              </span>
              {onOpenSetupGuide && (
                <button
                  type="button"
                  onClick={onOpenSetupGuide}
                  className="text-[11px] underline font-bold hover:text-amber-200 ml-2"
                >
                  Setup
                </button>
              )}
            </div>
          )}
        </div>

        {/* Tabs for Sign In vs Sign Up */}
        {activeTab !== 'forgot' && (
          <div className="flex border-b border-zinc-800 px-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab('signin');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-all ${
                activeTab === 'signin'
                  ? 'border-lime-400 text-lime-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('signup');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-all ${
                activeTab === 'signup'
                  ? 'border-lime-400 text-lime-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Full Name field for sign up */}
          {activeTab === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Aman Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-lime-500 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Email field */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-lime-500 transition-colors"
              />
            </div>
          </div>

          {/* Password field */}
          {activeTab !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-zinc-300">Password</label>
                {activeTab === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('forgot');
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="text-[11px] text-lime-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-lime-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Confirm Password field for sign up */}
          {activeTab === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-lime-500 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-lime-400 hover:bg-lime-300 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-lime-500/10 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              <>
                <span>
                  {activeTab === 'signin' && 'Sign In to GymSaathi'}
                  {activeTab === 'signup' && 'Create Account & Start Onboarding'}
                  {activeTab === 'forgot' && 'Send Password Reset Email'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Back to sign in from forgot password */}
          {activeTab === 'forgot' && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('signin');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className="text-xs text-zinc-400 hover:text-white"
              >
                ← Back to Sign In
              </button>
            </div>
          )}

          {/* Offline / Guest Mode Fallback */}
          <div className="pt-3 border-t border-zinc-800/80 text-center space-y-2">
            <button
              type="button"
              onClick={handleGuestPreview}
              className="text-xs text-zinc-400 hover:text-lime-400 flex items-center justify-center gap-1.5 mx-auto font-medium"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore as Guest (Offline Local Mode)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
