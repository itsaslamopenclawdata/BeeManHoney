import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Share2, MapPin } from 'lucide-react';
import { MobileNav } from '../components/MobileNav';
import { Header } from '../components/Header';

const Sourcing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen font-sans text-text pb-16 md:pb-0">
      {/* Desktop Header - Visible on larger screens */}
      <div className="hidden md:block">
        <Header />
      </div>

      <div className="md:container md:mx-auto md:max-w-6xl" style={{
        backgroundImage: "url('/assets/beemanhoney_apiaries_page.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh'
      }}>
        <div className="max-w-2xl mx-auto bg-white min-h-screen shadow-lg">
        {/* Header */}
        <header className="bg-primary p-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
          <button onClick={() => navigate(-1)} aria-label="Go back">
            <ChevronLeft className="h-6 w-6 text-black" />
          </button>
          <h1 className="text-xl font-bold text-black font-serif">Our Apiaries & Sourcing</h1>
          <button aria-label="Share page">
            <Share2 className="h-6 w-6 text-black" />
          </button>
        </header>

        <main>
          {/* Hero */}
          <section 
            className="relative h-64 bg-cover bg-center text-white" 
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBOWLtEXCvyoMEETbfmrj_b1omDClzMRjIMBhIE8KLrXBCHpKKJYt1E3TElMLNVHLrh_49skxp-agWLLAi9oPouc4QYLTUFesQ9tf7K8eKXzUQ5vxX9cQSYCG_DVaJ1la1Wk_TzDK_cialILS8G7vcID1FCnwaWjXmknuR4Ey3uQR62FP-uh_OAF6elkMAQdFWPxFB_m4EF19YGSsP3O58b1-o54-HetzninU0t_gndkb_LTgbZ9fXHfVtkrOuUbeRCr0oOvcpTD_tN')" }}
          >
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="relative z-10 flex h-full items-center justify-center p-6">
              <h2 className="text-3xl font-bold text-center font-serif drop-shadow-md">
                BeeManHoney Apiaries: Rooted in Nature, Committed to Transparency.
              </h2>
            </div>
          </section>

          {/* Info Section */}
          <section className="bg-background p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="md:w-3/5">
                <h3 className="text-2xl font-bold mb-2 font-serif">Sustainable Beekeeping & Bee Health</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Our practices prioritize the well-being of our bees above all. We use organic methods, avoid harmful chemicals, and ensure our hives are placed in rich, biodiverse environments to promote colony health and natural pollination.
                </p>
              </div>
              <div className="md:w-2/5 w-full">
                <img 
                  alt="Beekeeper inspecting frame" 
                  className="rounded-lg shadow-md w-full" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYrvUN22wGJXYOyYNOpmtBQXT83i77n8JjnOkDZ3yS3DV_Yh5HhKKjHfOreRfRIky5G6PScuuBETptW9jI7Ne03Zgkt4APh7-Xo0lwQY8Gt-yDe-9m1Q5UVCSe6w2ladbkXl-VJMrAUcuaCI4E9ciqS7GysAXMvYwEdsgKE-ZAyBsPR_XLvmNj4ckD6P7WeIWWyL1F3t0A7e2CkxrfbkaxRIS1dsGzWzKnbwa2NQAmuhuDd2C7-C5lC_zTQO2-2Njzw4t6WBXynQCg"
                />
              </div>
            </div>
          </section>

          {/* Locations Map Mockup */}
          <section className="bg-background pt-8 pb-6 px-4">
            <h3 className="text-2xl font-bold text-center mb-6 font-serif">Ethical Sourcing & Our Locations</h3>
            <div 
              className="relative p-4 rounded-lg bg-cover bg-center h-80 shadow-inner border border-yellow-200"
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD6J04UpCjL12dqSdrZIaOjDObnG8cHu2n7Gz8DPj03WqKD8HVEMH3laopgcNZfqwbAls-euf_M0PS4rMBZazOSMxKHATiezK6EaERqUx2BHAHkzbuVpVjiqKYNrNx4G2W_gsWe-UsiEL97F_WgjngSsi-ayAABanvPIxCJkHivOI-fUktloXDWaoH1Idv3qSmUpmlbv81H03r4VS1gBat3Qk_AyrsEhY3qAs5pz_110CCU9llj-2qqrB7aRpuyNRlPjur0Gjn-BhoM')" }}
            >
              {/* Pin 1 */}
              <div className="absolute top-1/3 left-[20%] group">
                <MapPin className="w-8 h-8 text-secondary -mb-1 fill-current" />
                <div className="absolute bottom-full left-0 w-48 bg-white p-3 rounded-lg shadow-xl mb-2 hidden group-hover:block z-10 text-xs">
                  <div className="flex gap-2">
                     <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7rYCuHNf-4NQkPySOdadkm176zhk1wSZ7-sxTgOcXUeSDUxrmMf_1vfVQLcagtpu70Z5dh9Qty0d84jm7R1tDdBP3d6gxMnbNX6nFtGhVrJfBV-qWRdEwG2kylikDpRsWrwxaW1xJfii3ezSZPG_ecIV82SSeQnZ_2H-8Y0Lo2efiM2rtlxcAhgS8T--3RvMzZr4Wckj79BZXGIQbaedcthCdUbqO2OGllSX2L-qSoYIdkXFqryQTCD5AeozkszFwOgFvUuG53zLR" className="w-10 h-10 rounded object-cover" />
                     <div>
                        <h4 className="font-bold">Sunny Hills, Himachal</h4>
                        <p className="text-[10px] text-gray-500">Pristine apiary supporting local flora.</p>
                     </div>
                  </div>
                </div>
              </div>

               {/* Pin 2 */}
              <div className="absolute top-1/4 right-[25%] group">
                <MapPin className="w-8 h-8 text-secondary -mb-1 fill-current" />
                <div className="absolute bottom-full right-0 w-48 bg-white p-3 rounded-lg shadow-xl mb-2 hidden group-hover:block z-10 text-xs">
                  <div className="flex gap-2">
                     <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuMbvQMx8P84H2HE1y2VUUPCC-vC1cuqWV9VmPQuL6vkbYb40XHkLyTENnKMh-7FYP3XKH1pT3r_ZsEAG8uScPyZDEMh0mm5qmPKBnYO7qMIAnDcrAA8_kzAxRxzxwAgAE2Px1BO5PBik0UGjczoMwV9jB6zE7rRWQorsKCz01lw9Fn24oqSPmB7xKVIOgfQQEUlFW3uevXyhKyLSz2jtUMcPf8u-eRQCVYjCbI1SyFP3XlQ6ljVUXnZRNBkPPpejpcb6gVyTRqh6R" className="w-10 h-10 rounded object-cover" />
                     <div>
                        <h4 className="font-bold">River Valley, Kerala</h4>
                        <p className="text-[10px] text-gray-500">Rich in biodiversity and spices.</p>
                     </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center mt-6 text-gray-600 italic text-sm">From Hive to Jar, With Integrity</p>
          </section>

          {/* Promises */}
          <section className="bg-background p-6 pb-12">
            <h3 className="text-2xl font-bold text-center mb-8 font-serif">Our Promise</h3>
            <div className="flex justify-around items-start text-center">
              <div className="flex flex-col items-center w-1/3 px-1">
                <img className="w-12 h-12 mb-2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEr-ZYhStbrm6Mjs5Tav_Toqf8h6WycN4eBuImMb684wWnBhv8yicIK83uMqHP7P2gyWh-QxQpxWniu-6s5FkvrT3D2l-E6HoDcKry3bA2rRQzBHOKtjYVjEtLdIqSlF8Lq-Vxtk1amAsqfso77o2CbBwsZQ17MF9QSLBOBUAU4zvh8mUKfAPIbZgekDu47QyA_GL-SkV1zXQTUw3Htu2t_SVcnMPAzWXtAK3KSEW9tB02LsZXOjtqMnbQCv4adHeOKJdo7Ku4mT3g" alt="Traceable" />
                <span className="font-semibold text-xs md:text-sm">Traceable Honey</span>
              </div>
              <div className="flex flex-col items-center w-1/3 px-1">
                 <img className="w-12 h-12 mb-2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMLsHpuuBdmE_82vNIg4TNZ1eplSn28iqViJxyGKFBMqxnw-zP8PHks2oJCChhtBAcACZwMGVEzY_nGJLLvIpBsbXu8QI8Womv9HjzmxIeJ_GH3iMymayZxdfcR8fRWy9MaHvKZLzeo-8GGzhDhRzWCfXpkvDSgiGEIcylsZe3R1_yjBOPWtig7Y_9V-tB6P1s1wmGkSqzYfE_euP5cd5lCqChJHxj-VNXdWAlcoe0Ft1RWMhIY-grHi0rQnJKA201nlm78lr_0Ob_" alt="Environmental" />
                <span className="font-semibold text-xs md:text-sm">Environmental Stewardship</span>
              </div>
              <div className="flex flex-col items-center w-1/3 px-1">
                <img className="w-12 h-12 mb-2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAde-JCni5D09RusdTTBrsGN5hy8P6e8SlYeL3nk4VpBkLyW6fF3Qs-inkLGiN1oTO4VP0c_0Bhv38usRngPzgckDvLwAP-vxLGyFJPco7OQTkmJjZXNOrNSxFlYs7SrVhs-587cLQ-5FmsoH3DJWz-oekWVqBwl5E6cpBK0y-D_J41TPKF6UqdGwVXtMLyol9i9LKju9V5KIjGWD3TxfFlYCU0EAgVN7P8FBK4pKycpnWn0XBe4d6_ifksIasME_ksasgsFYczImpp" alt="Fair" />
                <span className="font-semibold text-xs md:text-sm">Fair Partnerships</span>
              </div>
            </div>
          </section>

          <footer className="bg-background p-6">
            <button className="w-full bg-secondary text-white font-bold py-4 px-6 rounded-full text-lg shadow-lg hover:bg-opacity-90 transition-colors">
              Learn More About Our Mission
            </button>
          </footer>
        </main>
        </div>
      </div>
      <MobileNav />
    </div>
  );
};

export default Sourcing;