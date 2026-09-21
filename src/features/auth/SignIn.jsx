import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { Mail, Lock, ShieldCheck } from 'lucide-react';

export function SignIn({ onNavigateToSignUp, onNavigateToForgot, onLoginSuccess }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      await login(email, password);
      onLoginSuccess();
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-600 text-white font-extrabold text-xl shadow-md shadow-emerald-600/20 mb-3">
            IW
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Welcome to IntelWell
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Sign in to access your personalized wellness intelligence
          </p>
        </div>

        {/* Form Card */}
        <Card className="p-8 space-y-5 bg-white border border-slate-200/90 shadow-lg">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="space-y-1">
              <Input
                label="Password"
                type="password"
                icon={Lock}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={onNavigateToForgot}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-medium cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full shadow-md"
            >
              Sign In
            </Button>
          </form>

          <div className="text-center pt-2 text-xs text-slate-500">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onNavigateToSignUp}
              className="text-emerald-600 font-bold hover:underline cursor-pointer"
            >
              Create an account
            </button>
          </div>
        </Card>

        <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Secure data isolation with end-to-end privacy controls</span>
        </div>
      </div>
    </div>
  );
}
