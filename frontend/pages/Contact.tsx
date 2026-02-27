import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Phone, Mail, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import { MobileNav } from '../components/MobileNav';
import { Header } from '../components/Header';

const Contact: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      {/* Desktop Header - Visible on larger screens */}
      <div className="hidden md:block">
        <Header />
      </div>

      <div className="md:container md:mx-auto md:max-w-6xl" style={{
        backgroundImage: "url('/assets/beemanhoney_contact_us_page.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh'
      }}>
        
        {/* Logo Header */}
        <header className="py-4 px-4 flex items-center justify-center h-16">
          <div className="flex items-center space-x-2">
            <img 
              alt="Bee icon" 
              className="h-10" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_7OsEuhc6g3UXgLFIo_XZNkExrMUv0ydtAA4wmQScwZUPMSmHNlWEXWHLh7EYFjrcZ17Aw8l9dQ6nKsiglir2gSFKorD1LnMkD9YvGlLbkKGXhmZy-xXua8r9m3-lG_jfVlk13a-p2YjrfX8q0GNSyiYHVV3-DK_4DlpOcAiWzP4jX8sxy6kTOwMCFYYbIgvel-pzeTJThIU7RX2wF9NjSICCqEvztSQbVQJK5iMmd1-HmqR8I5Ip95QHnB_oyRAnEFZapo84LSYZ"
            />
            <span className="text-2xl font-bold text-text font-serif">BeeManHoney</span>
          </div>
        </header>

        <main className="bg-[#fefaf0] rounded-t-3xl overflow-hidden shadow-lg min-h-[calc(100vh-64px)]">
          <header className="relative flex items-center justify-center py-4 h-16">
            <button onClick={() => navigate(-1)} aria-label="Go back" className="absolute left-4">
              <ChevronLeft className="w-6 h-6 text-primary" strokeWidth={2.5} />
            </button>
            <h1 className="text-xl font-bold text-primary">Contact Us</h1>
          </header>

          <div className="p-6 pt-0">
            {/* Banner */}
            <section className="relative -mx-6 mb-6">
              <img 
                alt="Honeycomb and honey jar" 
                className="w-full h-36 object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWeOKDeNVpJntkIBY0JUxhHHCZGvT4gAvfK0DfXpkC0VTIpROo9iJjfYjdDLFVDYTPHVtkM1MN7g3lFbo4nCxC1QQUUM5wFAuEKNyvwMQckUuBwjm1yGjQmNbOv3eTb-yu2zusb17Yb6l5sntTAOHtPzTE4Sd3gLhG9msFogICsPRabqYsMRISIGPCXTm782UOua7n97PZMHL_SPqvNf-zWj_Y8nwucDW6Kr25ZiAHVUrcNgv6YTggtzyw67WkC9Qv7KQYyh46Yh0X"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                <h2 className="text-2xl font-bold text-white text-center font-serif">Get in Touch with<br/>BeeManHoney</h2>
              </div>
            </section>

            {/* Form */}
            <section className="mb-8">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-1" htmlFor="name">Name</label>
                    <input className="w-full px-3 py-2 text-sm border bg-white border-gray-300 rounded-lg focus:ring-primary focus:border-primary outline-none" id="name" placeholder="Name" type="text" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1" htmlFor="email">Email Address</label>
                    <input className="w-full px-3 py-2 text-sm border bg-white border-gray-300 rounded-lg focus:ring-primary focus:border-primary outline-none" id="email" placeholder="Email Address" type="email" />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-text mb-1" htmlFor="message">Message</label>
                  <textarea className="w-full px-3 py-2 text-sm border bg-white border-gray-300 rounded-lg focus:ring-primary focus:border-primary outline-none" id="message" placeholder="How can we help?" rows={4}></textarea>
                </div>
                <button className="w-full bg-primary text-white font-bold py-3 px-4 rounded-full hover:bg-opacity-90 transition-colors shadow-md">
                  Send Message
                </button>
              </form>
            </section>

            {/* Contact Info */}
            <section className="mb-8">
              <h3 className="text-lg font-bold text-text mb-4 font-serif">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-6 h-6 mr-3 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <a className="text-text hover:text-primary" href="tel:5551234567">+91-98765-43210</a>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 mr-3 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <a className="text-text hover:text-primary" href="mailto:hello@beemanhoney.com">hello@beemanhoney.com</a>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 mr-3 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-text">123 Apiary Lane, Coorg, KA 571201</p>
                </div>
              </div>
            </section>

            {/* Map Placeholder */}
            <section className="mb-8 rounded-lg overflow-hidden border border-gray-200">
               <img 
                alt="Map showing BeeManHoney HQ" 
                className="w-full h-auto" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCPicPyN5A7bTmr2Zf5RRKKO4_W6W0Ok1JQrvVsqQ4z-AvhjwQczGMIxpjm86f90xtZte-OzSI-ewAe0liIc1G0n1tXr8hQS7N5GgoAmqCLqnzlBrigRfWVPTpDvwkpP7YtcBed_9ptR_R2Xd2tebOu5O_fidFVmpYhSYaT1jz-8V9TSvQ6AXOIK8_j0PxIp47KvVe8MTOJzwrAgpW14vE36DtC2rSPbBBO1xRmHq9KuRefmnye6XfAT3pNSGXv6cXKVHI702gi05G"
              />
              <div className="text-center py-2 bg-white">
                <p className="font-semibold text-sm text-text">BeeManHoney HQ</p>
              </div>
            </section>

            {/* Socials */}
            <section className="text-center pb-8">
              <h3 className="text-lg font-bold text-text mb-4 font-serif">Follow Us</h3>
              <div className="flex justify-center space-x-4">
                <a href="#" className="bg-primary p-3 rounded-full text-white hover:bg-secondary transition-colors"><Instagram className="h-5 w-5" /></a>
                <a href="#" className="bg-primary p-3 rounded-full text-white hover:bg-secondary transition-colors"><Facebook className="h-5 w-5" /></a>
                <a href="#" className="bg-primary p-3 rounded-full text-white hover:bg-secondary transition-colors"><Twitter className="h-5 w-5" /></a>
              </div>
            </section>
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
};

export default Contact;