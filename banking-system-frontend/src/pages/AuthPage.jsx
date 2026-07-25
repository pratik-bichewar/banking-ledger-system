import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import logoMark from '../assets/logo-mark.svg';
import heroIllustration from '../assets/hero-bank-illustration.svg';
import Button from '../components/ui/Button';

function InputField({ label, type = 'text', icon: Icon, placeholder, value, onChange, extra }) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">{label}</label>
      <div className="relative">
        {Icon && (
          <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" strokeWidth={1.75} />
        )}
        <input
          type={isPassword && show ? 'text' : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full pl-10 pr-10 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 text-gray-800 placeholder:text-gray-400 transition-all"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-gray-600"
          >
            {show ? <EyeOff size={16} strokeWidth={1.75} /> : <Eye size={16} strokeWidth={1.75} />}
          </button>
        )}
      </div>
      {extra}
    </div>
  );
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, register, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => { if (user) navigate('/'); }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (!name) { setError('Please enter your full name.'); setLoading(false); return; }
        await register(name, email, password);
      }
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-dark-sidebar p-12 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-primary opacity-10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-secondary opacity-10 blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <img src={logoMark} alt="Credo" className="w-10 h-10" />
          <div>
            <span className="text-white font-bold text-xl tracking-widest block">CREDO</span>
            <span className="text-slate-400 text-xs tracking-widest">BANK</span>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10">
          <div className="flex justify-center mb-8">
            <img src={heroIllustration} alt="Banking" className="w-64 opacity-90" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            {isLogin
              ? 'Login to access your account and manage your finances.'
              : 'Join Credo Bank and experience modern banking.'}
          </p>
        </div>

        <p className="text-slate-600 text-xs relative z-10">© 2025 Credo Bank. All rights reserved.</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <img src={logoMark} alt="Credo" className="w-9 h-9" />
            <span className="font-bold text-xl tracking-widest text-gray-800">CREDO</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            {isLogin ? 'Sign In' : 'Create Account'}
          </h2>
          <p className="text-text-muted text-sm mb-7">
            {isLogin ? 'Enter your credentials to continue.' : 'Fill in your details to get started.'}
          </p>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <InputField
                label="Full Name"
                icon={User}
                placeholder="Enter your full name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            )}
            <InputField
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <InputField
              label="Password"
              type="password"
              icon={Lock}
              placeholder="Enter a strong password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              extra={isLogin && (
                <div className="flex justify-between mt-1">
                  <label className="flex items-center gap-1.5 text-xs text-text-muted cursor-pointer">
                    <input type="checkbox" className="rounded border-slate-300" />
                    Remember me
                  </label>
                  <button type="button" className="text-xs text-primary font-semibold hover:underline">
                    Forgot Password?
                  </button>
                </div>
              )}
            />

            {!isLogin && (
              <p className="text-xs text-text-muted mb-5">
                I agree to the{' '}
                <span className="text-primary font-semibold cursor-pointer hover:underline">Terms & Conditions</span>
                {' '}and{' '}
                <span className="text-primary font-semibold cursor-pointer hover:underline">Privacy Policy</span>.
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full justify-center py-3 text-sm mt-2"
              disabled={loading}
              iconRight={ArrowRight}
            >
              {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
            </Button>
          </form>

          <p className="text-center text-sm text-text-muted mt-6">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setIsLogin(l => !l); setError(''); }}
              className="text-primary font-semibold hover:underline"
            >
              {isLogin ? 'Register now' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
