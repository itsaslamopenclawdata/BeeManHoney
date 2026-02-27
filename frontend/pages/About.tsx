import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Leaf, Recycle, Users } from 'lucide-react';
import { MobileNav } from '../components/MobileNav';
import { Header } from '../components/Header';

const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen font-sans text-text pb-16 md:pb-0">
      {/* Desktop Header - Visible on larger screens */}
      <div className="hidden md:block">
        <Header />
      </div>

      <div className="md:container md:mx-auto md:max-w-6xl" style={{
        backgroundImage: "url('/assets/beemanhoney_about_us_page.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh'
      }}>
        
        {/* Header (Mobile style per design) */}
        <header className="flex-shrink-0 p-4 pt-6 text-center relative md:bg-white md:rounded-b-xl md:shadow-sm md:mb-4">
          <button onClick={() => navigate(-1)} className="absolute left-4 top-1/2 -translate-y-1/2 transform p-2">
            <ChevronLeft className="h-6 w-6 text-gray-800" />
          </button>
          <div className="inline-block text-3xl font-serif italic text-primary">BeeManHoney</div>
          <h1 className="text-xl font-semibold mt-1 text-gray-800">About Us</h1>
        </header>

        <main className="flex-grow p-4">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden md:shadow-lg">
            
            {/* Story Section */}
            <section className="relative">
              <img 
                alt="Beekeeper tending to hives" 
                className="w-full h-64 object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoO328Lwl1izk1BDM2Yf2xWCme3blhJLqUzmUQAhipWafm1K5zPlGgye0_toVfHnxozExZSL8Y-5Fp8rLDLRIL-jNJrGFibfGq_1aHDXrKa_YbawWW28SvTnno2clh1MdKRgX-PIcS7DHOcw8yEDudcH7vaZ-C4vMnk2-a5japD4oz1v95g4BiNbzUg6YM3uM-hzS5Ozz6RK28lZfltvuvlf-ajwCk2FSS6AWRaTQk6nCNsWmuK_EkkqGmUWgAqNbKPTNJRn5mzEfl"
              />
              <div className="absolute bottom-0 left-0 right-0 p-5 bg-black/40 backdrop-blur-[2px]">
                <h2 className="text-white text-2xl font-semibold leading-tight font-serif">Our Story: Handcrafted with Passion & Nature.</h2>
              </div>
            </section>

            {/* Text Block */}
            <div className="bg-secondary text-white p-6">
              <h3 className="font-bold text-lg">Welcome to BeeManHoney.</h3>
              <p className="mt-2 text-sm leading-relaxed opacity-90">
                Founded in 1998 by the Miller family, our passion for bees drives everything we do. We are dedicated to bringing you the purest, all-natural honey.
              </p>
              <h4 className="text-center font-semibold text-lg mt-6 font-serif">The Heart of Our Hives</h4>
            </div>

            {/* Divider Image */}
            <section>
              <img 
                alt="Honeycomb close up" 
                className="w-full h-32 object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBllyp-rqkFEuiU74ZoB_P-6FMXjoqL5h6li2eqPrDHeRb78y3Ks-80I6ZTFmk4N9JgE5NxAvvq7v2Sl20EUGPr-KnC63POJGLEWaGlJD6jkli2vGTvI5lmU-oWWEDg7vLQXN200aWEgynZSpGOTwirdQa76oe6d_em4PCUuAOfxihSxgPCqTTJgTU7x-x3V1F-vrtVnoPQXf7BFybQGV3gXDQZDZNhxxaGDuTz3VSUokn8X7xSz4U6l_QbuzPw7_LAViQXqds18TgA"
              />
            </section>

            {/* Commitment Section */}
            <section className="p-5">
              <div className="flex flex-col md:flex-row gap-6 items-center text-center md:text-left">
                <div className="w-2/5 md:w-1/4 flex-shrink-0">
                  <img 
                    alt="Honey Jar" 
                    className="rounded-xl w-full h-auto shadow-md" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDn606GQgAc2V2MkIOkJEO0L2rZsf8jtN_unQT8QO5l80MLjw5tKsUzkVOGeAXUa5pwV5zFhlC6Ku97a1lux0qtg0osex-X0FEmFa8dWp9qvLHfPP-Wrfw7bufcqz0Vt95Y1nFN4IbdK5IENaCNYNwzmNvPmVMd-haYVfu2mXzHmMrtRXXvqJoHUMbViVRpMp_7CbpL6f7OmBeXi7hCIiQBI3US3S_3-9Qi49-DCWxf37HeosaTuviQbAzaruXgk_W0hyxus59Xty8u"
                  />
                </div>
                <div className="w-full flex-grow">
                  <h3 className="text-lg font-bold text-gray-800 font-serif">Our Commitment to Purity</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    We believe in sustainable, ethical beekeeping. No additives, just pure honey straight from our hives to your home.
                  </p>
                  
                  {/* Icons */}
                  <div className="flex mt-6 text-center justify-around">
                    <div className="flex flex-col items-center">
                      <Leaf className="h-8 w-8 text-secondary mb-1" />
                      <span className="text-xs font-semibold text-gray-600">All-Natural</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Recycle className="h-8 w-8 text-secondary mb-1" />
                      <span className="text-xs font-semibold text-gray-600">Sustainable</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Users className="h-8 w-8 text-secondary mb-1" />
                      <span className="text-xs font-semibold text-gray-600">Family-Owned</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <button className="block w-full text-center py-3 mt-6 border-2 border-primary text-primary font-bold rounded-full hover:bg-primary hover:text-white transition-colors">
            Meet the Founders
          </button>
        </main>

        <footer className="flex-shrink-0 p-4 sticky bottom-0 md:relative bg-background border-t border-gray-200 md:border-none md:bg-transparent">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <Link to="/products" className="bg-primary text-white font-semibold py-3 px-8 rounded-full shadow-md hover:bg-secondary transition-colors w-full md:w-auto text-center">
              Shop Our Honey
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/contact" className="text-sm text-gray-600 underline hover:text-primary">Contact</Link>
              <Link to="#" className="text-sm text-gray-600 underline hover:text-primary">Terms</Link>
            </div>
          </div>
        </footer>
      </div>
      <MobileNav />
    </div>
  );
};

export default About;