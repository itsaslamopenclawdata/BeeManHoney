import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Search, ShoppingCart, X, User, LogOut, Package } from 'lucide-react';
import api from '../services/api';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const updateCartCount = () => {
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const totalCount = existingCart.reduce((sum: number, item: any) =>
        sum + (item.quantity || 1), 0);
      setCartCount(totalCount);
    };

    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const adminToken = localStorage.getItem('admin_token');
      setIsLoggedIn(!!token || !!adminToken);
      setIsAdmin(!!adminToken);
    };

    updateCartCount();
    checkAuth();

    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cart-updated', updateCartCount);
    window.addEventListener('auth-change', checkAuth);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cart-updated', updateCartCount);
      window.removeEventListener('auth-change', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin_token');
    localStorage.removeItem('cart');
    setIsLoggedIn(false);
    setIsAdmin(false);
    window.dispatchEvent(new Event('auth-change'));
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/home' },
    { name: 'Products', path: '/products' },
    { name: 'About Us', path: '/about' },
    { name: 'Sourcing', path: '/sourcing' },
    { name: 'Recipes', path: '/recipes' },
    { name: 'FAQ', path: '/faq' },
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
          
          {isLoggedIn ? (
            <>
              <Link to="/history" className="text-text hover:text-primary transition-colors" title="My Orders">
                <Package className="h-6 w-6" />
              </Link>
              <Link to="/profile" className="text-text hover:text-primary transition-colors hidden md:flex items-center gap-1 font-semibold text-sm">
                <User className="h-5 w-5" />
              </Link>
              <button 
                onClick={handleLogout}
                className="text-text hover:text-red-600 transition-colors hidden md:flex items-center gap-1 font-semibold text-sm"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
              {isAdmin && (
                <Link to="/admin" className="text-sm font-semibold text-primary hover:underline">
                  Admin
                </Link>
              )}
            </>
          ) : (
            <Link to="/login" className="text-text hover:text-primary transition-colors hidden md:flex items-center gap-1 font-semibold text-sm">
              <User className="h-5 w-5" />
              <span>Login</span>
            </Link>
          )}
          
          <Link to="/cart" aria-label="Shopping Cart" className="text-text hover:text-primary transition-colors relative">
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
          {isLoggedIn ? (
            <>
              <Link to="/history" onClick={() => setIsMenuOpen(false)} className="text-sm font-semibold text-text hover:text-primary">My Orders</Link>
              <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="text-sm font-semibold text-text hover:text-primary">Profile</Link>
              <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="text-sm font-semibold text-red-600 text-left">Logout</button>
              {isAdmin && <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="text-sm font-semibold text-primary">Admin Dashboard</Link>}
            </>
          ) : (
            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-sm font-semibold text-text hover:text-primary">Login</Link>
          )}
        </div>
      )}
    </header>
  );
};
