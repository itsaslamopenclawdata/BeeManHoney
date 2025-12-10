import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Eye, QrCode, X, ShieldCheck } from 'lucide-react';
import { MobileNav } from '../components/MobileNav';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isScanMode, setIsScanMode] = useState(false);

  return (
    <div className="bg-amber-50 font-sans antialiased text-[#6B4F4F]">
      <div 
        className="relative mx-auto flex min-h-screen max-w-md flex-col overflow-hidden bg-cover bg-center pb-24" 
        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDZGu3mYYHovNiJadpd54pAIj35NT3rVbBizKAtSg9iSmecHnUqCBY5QpzUJGVwgyBsPfF3FEsJzzFcnv9fxG8jEqArLBvaK2a65j2zMdu53cCjVYDa1hBxI6EKoSS2nLcTEm2Exzyjbul0JnagxxP47YglAhu8kSySV1-1iD36KXY1Xw_eEg7BmWNY0jnPhBLMNjUeIwK0WhRzZvCw_yBZpDQI4unu3RorJ-GV1HTeaut_HOAfEc2FKoZwzHMhwYLwFuylRR1J0l2P')" }}
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

                <div className="space-y-3">
                  <button className="flex w-full items-center justify-center rounded-full border border-gray-300 bg-white py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50">
                     <img className="w-5 h-5 mr-3" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyPN49XQELg_CI7rQt-049MquLusKJdql8SKcCrsuZLB02vm1IxP3iCDjqGCzu7aPbg3GcGMMulnD0KK_e8vUsg3Hd0VeX3rgmrnWMxIf5UHVWShXpJSErMfaoHX8rDAowM-bqZ4A8xxmwzKKtKqX1aFX8fIqO8U19CCCUh6gYul0xYTxSoFU-BieeX60XGIfiwmjvIl2mvpbMpdCtGx2xBZXU9Sph8Jb1g3EEnVJBTx0bbFdSSZ8rWr9aAfZTZ2ZeMF-8SnXKjx0w" alt="Google" />
                     Login with Google
                  </button>
                  <button className="flex w-full items-center justify-center rounded-full bg-gray-800 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-700">
                    <img className="w-5 h-5 mr-3" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfTStiidXg_wB9sSGkeTrN_YE1mQfyRaFDT2anfOx4KXLg5Q67uctWprl3un7MLzREEFJyP0tr_0eeuNl_EbkE2o3UVNNFt-NIDGz5qLT6YbjdhKaLL-Ds5b5_VlUeX7HptToCVE7QI9UAd6VL-cxU3KnAQziFu6DXMjSdKXBlNGFlUi4680KSW8jcdQuizXQQ5WZgY0rgNjvnpuzgzXPhcaIqhDZdDBRyCXAzMc3TbMFf0mC18inpUj-hC0SWVJ_y8XWmdx_F-uH1" alt="GitHub" />
                    Login with GitHub
                  </button>
                </div>

                <div className="my-5 flex items-center">
                  <hr className="flex-grow border-t border-gray-200" />
                  <span className="mx-4 text-xs text-gray-400">or continue with email</span>
                  <hr className="flex-grow border-t border-gray-200" />
                </div>

                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600" htmlFor="email">Email Address</label>
                    <input className="mt-1 block w-full rounded-lg shadow-sm border border-gray-400 p-2 focus:border-[#B8860B] focus:ring focus:ring-[#D69E2E] focus:ring-opacity-50 outline-none" id="email" placeholder="your.email@example.com" type="email" />
                  </div>
                  <div className="relative">
                    <label className="text-xs font-semibold text-gray-600" htmlFor="password">Password</label>
                    <input className="mt-1 block w-full rounded-lg pr-10 shadow-sm border border-gray-400 p-2 focus:border-[#B8860B] focus:ring focus:ring-[#D69E2E] focus:ring-opacity-50 outline-none" id="password" type="password" defaultValue="••••••••" />
                    <button type="button" className="absolute inset-y-0 right-0 top-6 flex items-center pr-3 text-gray-400">
                      <Eye className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="text-right">
                    <a className="text-sm font-semibold text-[#A0522D] hover:underline" href="#">Forgot Password?</a>
                  </div>
                  <div className="space-y-3 pt-2">
                    <button className="w-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 py-3.5 font-bold text-white shadow-md hover:opacity-90 transition">
                      Login
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
                
                {/* Admin Link added here */}
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
