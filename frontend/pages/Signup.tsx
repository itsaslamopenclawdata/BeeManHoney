import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Eye, Mail, User } from 'lucide-react';
import { MobileNav } from '../components/MobileNav';
import { Header } from '../components/Header';
import api from '../services/api';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await api.post('/auth/register', {
        email,
        password,
        full_name: fullName
      });
      
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
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
            <h2 className="text-2xl font-bold text-[#6B4F4F] font-serif">Join the Hive</h2>
            <p className="text-sm text-[#A0522D]">Create your account today</p>
          </div>

          <div className="w-full rounded-3xl bg-white shadow-lg p-8">
            <div className="mb-5 text-center">
              <h3 className="text-xl font-bold text-[#6B4F4F]">Sign Up</h3>
              <p className="text-sm text-gray-500">Discover pure, natural sweetness.</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600" htmlFor="name">Full Name</label>
                <div className="relative mt-1">
                  <input 
                    className="block w-full rounded-lg shadow-sm border border-gray-400 p-2 pl-10 focus:border-[#B8860B] focus:ring focus:ring-[#D69E2E] focus:ring-opacity-50 outline-none" 
                    id="name" 
                    placeholder="John Doe" 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600" htmlFor="email">Email Address</label>
                <div className="relative mt-1">
                   <input 
                    className="block w-full rounded-lg shadow-sm border border-gray-400 p-2 pl-10 focus:border-[#B8860B] focus:ring focus:ring-[#D69E2E] focus:ring-opacity-50 outline-none" 
                    id="email" 
                    placeholder="your.email@example.com" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                   />
                   <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600" htmlFor="password">Password</label>
                <div className="relative mt-1">
                  <input 
                    className="block w-full rounded-lg pr-10 shadow-sm border border-gray-400 p-2 focus:border-[#B8860B] focus:ring focus:ring-[#D69E2E] focus:ring-opacity-50 outline-none" 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <div className="pt-2">
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 py-3.5 font-bold text-white shadow-md hover:opacity-90 transition disabled:opacity-50"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Already have an account? <Link to="/login" className="font-bold text-[#A0522D] hover:underline">Login</Link>
              </p>
            </div>
          </div>
        </main>
        <MobileNav />
      </div>
    </div>
  );
};

export default Signup;
