import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Eye, QrCode, X, ShieldCheck } from 'lucide-react';
import { MobileNav } from '../components/MobileNav';
import { Header } from '../components/Header';
import api from '../services/api';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isScanMode, setIsScanMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('username', email); // FastAPI OAuth2PasswordRequestForm expects 'username'
      formData.append('password', password);

      const { data } = await api.post('/auth/token', formData, {
        headers: { 'Content-Type': 'multipart/form-data' } // Override for OAuth2
      });

      localStorage.setItem('token', data.access_token);
      navigate('/products');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans antialiased text-[#6B4F4F]">
      {/* Desktop Header - Visible on larger screens */}
      <div className="hidden md:block">
        <Header />
      </div>

      <div
        className="relative mx-auto md:container md:mx-auto md:max-w-6xl flex min-h-screen max-w-md flex-col overflow-hidden bg-cover bg-center pb-24"
        style={{ backgroundImage: "url('/assets/beemanhoney_user_login.png')", backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh' }}
      >
        <header className="absolute top-0 left-0 right-0 z-10 flex h-24 items-center justify-between px-4 pt-10 text-[#6B4F4F]">
          <button onClick={() => navigate(-1)} className="p-2">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold font-serif">BeeManHoney</h1>
          <div className="w-8"></div>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center p-4 pt-24 pb-4">
          <div className="flex flex-col items-center text-center mb-8">
            <img
              alt="BeeManHoney Logo"
              className="h-20 w-20 mb-2"
              src="/assets/logo.png"
            />
            <h2 className="text-2xl font-bold text-[#6B4F4F] font-serif">BeeManHoney</h2>
            <p className="text-sm text-[#A0522D]">Pure & Natural and Trustworthy</p>
          </div>

          <div className="w-full rounded-3xl bg-white shadow-lg p-8 transition-all duration-300">
            {isScanMode ? (
              /* Scan Mode UI */
              <div className="flex flex-col items-center animate-fadeIn">
                <div className="w-full flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-[#6B4F4F]">Scan QR Code</h3>
                  <button onClick={() => setIsScanMode(false)} className="p-1 hover:bg-gray-100 rounded-full">
                    <X className="h-6 w-6 text-gray-500" />
                  </button>
                </div>
                <div className="relative w-64 h-64 bg-gray-900 rounded-2xl overflow-hidden mb-6 flex items-center justify-center shadow-inner">
                  <div className="absolute inset-0 border-2 border-primary/50 m-8 rounded-lg animate-pulse"></div>
                  <p className="text-white/70 text-xs text-center px-4">Align the BeeManHoney QR code within the frame to log in.</p>
                  {/* Mock Camera Feed */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent pointer-events-none"></div>
                </div>
                <p className="text-sm text-gray-500 mb-6 text-center">
                  Use your device camera to scan the login code provided on your desktop or membership card.
                </p>
                <button
                  onClick={() => setIsScanMode(false)}
                  className="w-full rounded-full border border-gray-300 bg-white py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  Cancel Scan
                </button>
              </div>
            ) : (
              /* Standard Login UI */
              <>
                <div className="mb-5 text-center">
                  <h3 className="text-xl font-bold text-[#6B4F4F]">Welcome Back!</h3>
                  <p className="text-sm text-gray-500">Please log in to continue.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600" htmlFor="email">Email Address</label>
                    <input
                      className="mt-1 block w-full rounded-lg shadow-sm border border-gray-400 p-2 focus:border-[#B8860B] focus:ring focus:ring-[#D69E2E] focus:ring-opacity-50 outline-none"
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="relative">
                    <label className="text-xs font-semibold text-gray-600" htmlFor="password">Password</label>
                    <input
                      className="mt-1 block w-full rounded-lg pr-10 shadow-sm border border-gray-400 p-2 focus:border-[#B8860B] focus:ring focus:ring-[#D69E2E] focus:ring-opacity-50 outline-none"
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 top-6 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                  </div>

                  {error && <p className="text-red-500 text-xs text-center">{error}</p>}

                  <div className="text-right">
                    <a className="text-sm font-semibold text-[#A0522D] hover:underline" href="#">Forgot Password?</a>
                  </div>

                  <div className="space-y-3 pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 py-3.5 font-bold text-white shadow-md hover:opacity-90 transition disabled:opacity-50"
                    >
                      {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsScanMode(true)}
                      className="flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#D4AC6E] to-[#B98E54] py-3.5 font-bold text-white shadow-md hover:opacity-90 transition"
                    >
                      <QrCode className="h-5 w-5 mr-2" />
                      Login with Scan Code
                    </button>
                  </div>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500">
                    Don't have an account? <Link to="/signup" className="font-bold text-[#A0522D] hover:underline">Sign Up</Link>
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-100 flex justify-center">
                  <Link to="/admin-login" className="flex items-center text-xs text-gray-400 hover:text-primary transition-colors">
                    <ShieldCheck className="w-3 h-3 mr-1" />
                    Admin Access
                  </Link>
                </div>

              </>
            )}
          </div>
        </main>
        <MobileNav />
      </div>
    </div>
  );
};

export default Login;
