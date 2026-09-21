import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { Mail, Lock, User, ShieldCheck } from 'lucide-react';

export function SignUp({ onNavigateToSignIn, onSignUpSuccess }) {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await signup(email, password, name);
      onSignUpSuccess(); // Routes to onboarding flow
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-600 text-white font-extrabold text-xl shadow-md shadow-emerald-600/20 mb-3">
            IW
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Create your IntelWell Account
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Step into personalized nutrition and lifestyle intelligence
          </p>
        </div>

        <Card className="p-8 space-y-5 bg-white border border-slate-200/90 shadow-lg">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              icon={User}
              placeholder="e.g. Jordan Blake"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password (min. 6 characters)"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full shadow-md"
              >
                Continue to Onboarding
              </Button>
            </div>
          </form>

          <div className="text-center pt-2 text-xs text-slate-500">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onNavigateToSignIn}
              className="text-emerald-600 font-bold hover:underline"
            >
              Sign in
            </button>
          </div>
        </Card>

        <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Non-diagnostic wellness platform with private data sandboxing</span>
        </div>
      </div>
    </div>
  );
}

export function ForgotPassword({ onNavigateToSignIn }) {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await resetPassword(email);
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-slate-900 font-display">
            Reset Your Password
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Enter your email to receive recovery instructions
          </p>
        </div>

        <Card className="p-8 space-y-5 bg-white border border-slate-200/90 shadow-lg">
          {sent ? (
            <div className="text-center space-y-3">
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl font-medium">
                If an account exists for {email}, recovery instructions have been sent.
              </div>
              <Button variant="primary" size="md" onClick={onNavigateToSignIn} className="w-full">
                Return to Sign In
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Registered Email Address"
                type="email"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />
              <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
                Send Reset Link
              </Button>
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={onNavigateToSignIn}
                  className="text-xs text-slate-500 hover:text-slate-800 underline"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
