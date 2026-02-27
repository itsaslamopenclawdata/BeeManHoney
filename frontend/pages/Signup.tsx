import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Eye, Mail, User } from 'lucide-react';
import { MobileNav } from '../components/MobileNav';
import { Header } from '../components/Header';

const Signup: React.FC = () => {
  const navigate = useNavigate();

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
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNbP8lG55-vOsaZ1qCV_kPaU-WOrlDXiGX_nnyrZShcBtz0BH_kIPrxI6x_hqPgVfTkpFco5NnlbRkDdTpoRm68Dvp3k6Q44IzctRKrHiiJiA3C5XB4BJjg0EWDi-w7ymxIVRXHwN7VNVnGNG6HNnhFL8cB8E2EHZW2BkSOjUb8sPKUdjxoTyGb1nwZii1BWY3YVFestS3T_JxNK8MnhIDIBqd29b3tlvGp0_7q7USUIQkX-ZiFtil1WsRXk7H5-IxXo_6g2aT5o6l"
            />
            <h2 className="text-2xl font-bold text-[#6B4F4F] font-serif">Join the Hive</h2>
            <p className="text-sm text-[#A0522D]">Create your account today</p>
          </div>

          <div className="w-full rounded-3xl bg-white shadow-lg p-8">
            <div className="mb-5 text-center">
              <h3 className="text-xl font-bold text-[#6B4F4F]">Sign Up</h3>
              <p className="text-sm text-gray-500">Discover pure, natural sweetness.</p>
            </div>

            <div className="space-y-3">
              <button className="flex w-full items-center justify-center rounded-full border border-gray-300 bg-white py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50">
                 <img className="w-5 h-5 mr-3" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyPN49XQELg_CI7rQt-049MquLusKJdql8SKcCrsuZLB02vm1IxP3iCDjqGCzu7aPbg3GcGMMulnD0KK_e8vUsg3Hd0VeX3rgmrnWMxIf5UHVWShXpJSErMfaoHX8rDAowM-bqZ4A8xxmwzKKtKqX1aFX8fIqO8U19CCCUh6gYul0xYTxSoFU-BieeX60XGIfiwmjvIl2mvpbMpdCtGx2xBZXU9Sph8Jb1g3EEnVJBTx0bbFdSSZ8rWr9aAfZTZ2ZeMF-8SnXKjx0w" alt="Google" />
                 Sign up with Google
              </button>
              <button className="flex w-full items-center justify-center rounded-full bg-gray-800 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-700">
                <img className="w-5 h-5 mr-3" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfTStiidXg_wB9sSGkeTrN_YE1mQfyRaFDT2anfOx4KXLg5Q67uctWprl3un7MLzREEFJyP0tr_0eeuNl_EbkE2o3UVNNFt-NIDGz5qLT6YbjdhKaLL-Ds5b5_VlUeX7HptToCVE7QI9UAd6VL-cxU3KnAQziFu6DXMjSdKXBlNGFlUi4680KSW8jcdQuizXQQ5WZgY0rgNjvnpuzgzXPhcaIqhDZdDBRyCXAzMc3TbMFf0mC18inpUj-hC0SWVJ_y8XWmdx_F-uH1" alt="GitHub" />
                Sign up with GitHub
              </button>
            </div>

            <div className="my-5 flex items-center">
              <hr className="flex-grow border-t border-gray-200" />
              <span className="mx-4 text-xs text-gray-400">or register with email</span>
              <hr className="flex-grow border-t border-gray-200" />
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600" htmlFor="name">Full Name</label>
                <div className="relative mt-1">
                  <input className="block w-full rounded-lg shadow-sm border border-gray-400 p-2 pl-10 focus:border-[#B8860B] focus:ring focus:ring-[#D69E2E] focus:ring-opacity-50 outline-none" id="name" placeholder="John Doe" type="text" />
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600" htmlFor="email">Email Address</label>
                <div className="relative mt-1">
                   <input className="block w-full rounded-lg shadow-sm border border-gray-400 p-2 pl-10 focus:border-[#B8860B] focus:ring focus:ring-[#D69E2E] focus:ring-opacity-50 outline-none" id="email" placeholder="your.email@example.com" type="email" />
                   <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600" htmlFor="password">Password</label>
                <div className="relative mt-1">
                  <input className="block w-full rounded-lg pr-10 shadow-sm border border-gray-400 p-2 focus:border-[#B8860B] focus:ring focus:ring-[#D69E2E] focus:ring-opacity-50 outline-none" id="password" type="password" placeholder="••••••••" />
                  <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                    <Eye className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button className="w-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 py-3.5 font-bold text-white shadow-md hover:opacity-90 transition">
                  Create Account
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