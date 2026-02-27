import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { MobileNav } from '../components/MobileNav';
import { formatPrice } from '../utils/currency';
import api from '../services/api';

interface FeaturedProduct {
  id: number;
  name: string;
  price: number;
  image_url: string;
}

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [1, 2, 3, 4]; // Placeholders for category loop

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <Header />
      <main style={{
        backgroundImage: "url('/assets/beemanhoney_homepage.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh'
      }}>
        {/* Hero Section */}
        <section
          className="relative h-80 md:h-96 bg-cover bg-center text-white flex items-center justify-center px-4 text-center"
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDfPWjU_Fvxzdhj-zbyha7lU-1CLD_dVEj7J5XyTtghXRXUjCNRKdWmP-jyi4FbwBVYDWISA7p-t1DuBfaXtdAqMRcoz4biouTFeJwMlAhNhldBM_UDiBM3_MKv8pXvHdyiT372YQfAgr4i9lpPz3Yfu6Azyz-6IDhIHepfAO3Ci798P5H9LRUt166iR254hCJbwmFcYSkBss6GYvfe21EhjsDHDQTaR-f6AW9uGJZ9cyu3_X723DVXhyx2ECKfmBAgnz1S_kemR3l1')" }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative z-10">
            <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4">Welcome to BeeManHoney</h1>
            <p className="text-lg md:text-xl mb-8">Pure, Natural, Straight from the Hive.</p>
            <Link to="/products" className="bg-primary hover:bg-secondary text-text font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105 inline-block">
              Shop Now
            </Link>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-12 px-4 bg-background" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/hexabump.png')" }}>
          <div className="container mx-auto">
            <h2 className="font-serif text-3xl font-bold text-center mb-8 text-text">Featured Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden text-center p-4 transform hover:scale-105 transition-transform duration-300">
                  <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-lg mx-auto" />
                  <h3 className="font-sans font-medium mt-4 text-text">{product.name}</h3>
                  <p className="text-gray-600 mt-1">{formatPrice(product.price)}</p>
                  <button className="mt-3 w-full bg-primary hover:bg-secondary text-text font-bold py-2 px-4 rounded-full transition-colors">
                    Add To Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Shop by Category */}
        <section className="py-12 px-4 bg-white">
          <div className="container mx-auto">
            <h2 className="font-serif text-3xl font-bold text-center mb-8 text-text">Shop by Category</h2>
            <div className="flex justify-center flex-wrap gap-4 sm:gap-8">
              {categories.map((_, index) => (
                <Link to="/products" key={index} className="text-center w-24 group">
                  <div className="bg-background rounded-full p-2 shadow-sm group-hover:shadow-md transition">
                    <img 
                      alt="Category" 
                      className="w-full h-auto rounded-full" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAO1w1SZUqXgbqReRC4ha-PuKkhzkTMDx5tlMHqvqf842pGal8qH0exdQN-KXV4S1r1j5CXVDoKx---WSjHGnYOxN5MocJxuj90T40zIbRSpFB5usQ_WFda_5_2ntCsTwo5rxwzn3Y3E8H8nkiSYcGTWUbv4HHhqyDfLhlPgrldLR5d6zebWbnYguMjle7uf7DDIaudSXk-xy4mHrWQ9apT7bI615Z-TxwPl_CnnRCmsM8X9seGHFZ45ecS3YehnPkBKHUoy0-Tl-7S"
                    />
                  </div>
                  <p className="mt-2 text-sm font-medium text-text">Raw Honey</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story Teaser */}
        <section className="py-12 px-4 bg-background">
          <div className="container mx-auto grid md:grid-cols-2 gap-8 items-center">
            <img 
              alt="Beekeeper with beehives" 
              className="rounded-2xl shadow-lg w-full" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGSQo9bDvJsuWL4567gr_CcEU6y7WJuBCS_U3ARGTn0fFoS1yIL_-JDvLw8fOLkIh70gE8w6fpvE77dMQWpfZ2AVfPZJfSGlhSz76S9lM0yONNuzATN9BNn2Z1bwl07TLXRrDDosIwch7e9KxSqVZtTG3G8OlZbauvca0x0hL3XSTCKOt6A7IMazBR9beiAkXeI7kD6Pt-dhIIfPTcKx9OC8vrA9UgWOflFH3xwTDYs9XWntdgeuN4zSxq980CCTfKdBNHBGFVMYVb"
            />
            <div className="text-center md:text-left">
              <h2 className="font-serif text-3xl font-bold text-text">Our Story</h2>
              <p className="mt-4 text-gray-700 leading-relaxed">
                At BeeManHoney, we're passionate about ethical beekeeping. Our honey is sustainably sourced from family-owned Indian apiaries, ensuring the highest quality and supporting bee populations across the country.
              </p>
              <Link to="/about" className="mt-4 inline-block text-secondary font-bold hover:underline">Read more &rarr;</Link>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-12 px-4 bg-yellow-50">
          <div className="container mx-auto">
            <h2 className="font-serif text-3xl font-bold text-center mb-8 text-text">Customer Testimonials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/80 p-6 rounded-2xl shadow-sm">
                <p className="text-gray-700 italic">"The best honey I've ever tasted! So rich and flavorful."</p>
                <div className="flex items-center mt-4">
                  <div className="w-10 h-10 rounded-full mr-3 bg-gray-200 flex items-center justify-center font-bold text-gray-500">S</div>
                  <span className="font-medium text-text">- Sarah J.</span>
                </div>
              </div>
              <div className="bg-white/80 p-6 rounded-2xl shadow-sm">
                <p className="text-gray-700 italic">"I love their commitment to nature. Highly recommend BeeManHoney."</p>
                <div className="flex items-center mt-4">
                  <div className="w-10 h-10 rounded-full mr-3 bg-gray-200 flex items-center justify-center font-bold text-gray-500">M</div>
                  <span className="font-medium text-text">- Mark T.</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
};

export default Home;