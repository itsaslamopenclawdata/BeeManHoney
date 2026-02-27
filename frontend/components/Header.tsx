import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Search, ShoppingCart, X, User } from 'lucide-react';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    // Load cart count on mount and update when localStorage changes
    const updateCartCount = () => {
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const totalCount = existingCart.reduce((sum: number, item: any) =>
        sum + (item.quantity || 1), 0);
      setCartCount(totalCount);
    };

    updateCartCount();

    // Listen for storage events (when cart is updated in other tabs)
    const handleStorageChange = () => {
      updateCartCount();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cart-updated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cart-updated', handleStorageChange);
    };
  }, []);

  const navLinks = [
    { name: 'Home', path: '/home' },
    { name: 'Products', path: '/products' },
    { name: 'About Us', path: '/about' },
    { name: 'Sourcing', path: '/sourcing' },
    { name: 'Recipes', path: '/recipes' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm font-sans">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/home" className="flex items-center gap-2 group">
           <img 
            alt="BeeManHoney Logo" 
            className="h-10 group-hover:scale-105 transition-transform" 
            src="/assets/logo.png"
          />
          <span className="font-serif font-bold text-xl text-text hidden sm:block">BeeManHoney</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-semibold hover:text-primary transition-colors ${
                location.pathname === link.path ? 'text-primary' : 'text-text'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Icons */}
        <div className="flex items-center space-x-4">
          <button aria-label="Search" className="text-text hover:text-primary transition-colors">
            <Search className="h-6 w-6" />
          </button>
          <Link to="/login" className="text-text hover:text-primary transition-colors hidden md:flex items-center gap-1 font-semibold text-sm">
            <User className="h-5 w-5" />
            <span>Login</span>
          </Link>
          <Link to="/history" aria-label="Shopping Cart" className="text-text hover:text-primary transition-colors relative">
            <ShoppingCart className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
           <button 
            className="md:hidden text-text"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg py-4 px-4 flex flex-col space-y-4">
           {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              className={`text-sm font-semibold hover:text-primary transition-colors ${
                location.pathname === link.path ? 'text-primary' : 'text-text'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-sm font-semibold text-text hover:text-primary">Login</Link>
        </div>
      )}
    </header>
  );
};