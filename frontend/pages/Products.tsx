import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart } from 'lucide-react';
import { MobileNav } from '../components/MobileNav';
import { Header } from '../components/Header';
import { formatPrice } from '../utils/currency';
import { Link } from 'react-router-dom';
import api from '../services/api';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
}

const Products: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');

    // Check if product already exists in cart
    const existingItem = existingCart.find((item: Product) => item.id === product.id);

    if (existingItem) {
      // Update quantity if exists
      existingCart.forEach((item: Product & { quantity?: number }) => {
        if (item.id === product.id) {
          item.quantity = (item.quantity || 1) + 1;
        }
      });
    } else {
      // Add new item with quantity 1
      existingCart.push({ ...product, quantity: 1 });
    }

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart));

    // Dispatch custom event to notify other components (Header, MobileNav)
    window.dispatchEvent(new Event('cart-updated'));

    // Update cart count
    const totalCount = existingCart.reduce((sum: number, item: Product & { quantity?: number }) =>
      sum + (item.quantity || 1), 0);
    setCartCount(totalCount);

    // Show notification
    setNotification(`${product.name} added to cart!`);
    setTimeout(() => setNotification(''), 2000);
  };

  useEffect(() => {
    // Load cart count on mount
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalCount = existingCart.reduce((sum: number, item: Product & { quantity?: number }) =>
      sum + (item.quantity || 1), 0);
    setCartCount(totalCount);
  }, []);

  const categories = ['All', 'Premium', 'Standard', 'Dark', 'Infused'];

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen font-sans text-text pb-20">
      {/* Desktop Header - Visible on larger screens */}
      <div className="hidden md:block">
        <Header />
      </div>

      <div className="md:container md:mx-auto md:max-w-6xl" style={{
        backgroundImage: "url('/assets/beemanhoney_products_page.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh'
      }}>
      {/* Custom Header for Products Page */}
      <header className="bg-[#f3dcb3] sticky top-0 z-20 shadow-sm">
        <div className="w-full px-4 py-3 flex justify-between items-center md:container md:mx-auto">
          <button aria-label="Search" className="p-2">
            <Search className="h-6 w-6 text-text" />
          </button>
          <h1 className="text-xl font-semibold text-text font-serif">BeeManHoney</h1>
          <Link to="/history" aria-label="Shopping Cart" className="p-2 relative">
            <ShoppingCart className="h-6 w-6 text-text" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* Notification */}
      {notification && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
          {notification}
        </div>
      )}

      <main className="w-full px-4 py-4 md:container md:mx-auto md:max-w-7xl">
        {/* Filters */}
        <section className="mb-4">
          <div className="flex items-center overflow-x-auto pb-2 space-x-2 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`py-2 text-sm font-medium rounded-full shadow-sm whitespace-nowrap px-4 transition-colors ${activeCategory === cat
                    ? 'text-white bg-primary'
                    : 'text-text bg-white border border-gray-300'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Product Grid */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading ? (
            <div className="col-span-full text-center py-10">Loading fresh honey...</div>
          ) : filteredProducts.map(product => (
            <article key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full">
              <div className="p-4 bg-[#f9e9cc] flex-grow flex items-center justify-center h-40">
                <img src={product.image_url || '/assets/logo.png'} alt={product.name} className="h-32 object-contain" />
              </div>
              <div className="p-4 text-left flex flex-col flex-grow">
                <h3 className="text-base font-semibold text-text">{product.name}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                <p className="text-lg font-bold text-text mt-2">{formatPrice(product.price)}</p>
                <button
                  onClick={() => addToCart(product)}
                  className="mt-4 w-full py-2 text-sm font-medium text-text bg-white border border-[#c8a66b] rounded-lg shadow-sm hover:bg-gray-50 transition-colors active:scale-95"
                >
                  Add to Cart
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>
      </div>
      <MobileNav />
    </div>
  );
};

export default Products;