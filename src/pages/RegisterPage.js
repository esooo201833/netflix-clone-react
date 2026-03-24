import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const { lang } = useLanguage();
  const nav = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPass) {
      setError(lang === 'ar' ? 'كلمات المرور مش متطابقة' : 'Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError(lang === 'ar' ? 'الرقم السري لازم يكون 6 أحرف على الأقل' : 'Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    const result = register(name, email, password);
    
    if (result.success) {
      nav('/');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md bg-gray-900 rounded-lg p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          {lang === 'ar' ? 'إنشاء حساب' : 'Sign Up'}
        </h1>
        <p className="text-gray-400 text-center mb-8">
          {lang === 'ar' ? 'انضم لينا دلوقتي!' : 'Join us today!'}
        </p>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              {lang === 'ar' ? 'الاسم' : 'Name'}
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500"
                placeholder={lang === 'ar' ? 'اسمك' : 'Your name'}
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">
              {lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500"
                placeholder="example@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">
              {lang === 'ar' ? 'كلمة المرور' : 'Password'}
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-12 text-white focus:outline-none focus:border-blue-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">
              {lang === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type={showPass ? 'text' : 'password'}
                value={confirmPass}
                onChange={e => setConfirmPass(e.target.value)}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {lang === 'ar' ? 'جاري التسجيل...' : 'Signing up...'}
              </span>
            ) : (
              lang === 'ar' ? 'سجل' : 'Sign Up'
            )}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          {lang === 'ar' ? 'عندك حساب؟' : 'Already have an account?'}{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300">
            {lang === 'ar' ? 'سجل دخول' : 'Sign In'}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;