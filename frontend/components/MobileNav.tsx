import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, BookOpen, User, ShoppingCart } from 'lucide-react';

export const MobileNav: React.FC = () => {
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

  const navItems = [
    { name: 'Home', icon: Home, path: '/home' },
    { name: 'Shop', icon: ShoppingBag, path: '/products' },
    { name: 'Recipes', icon: BookOpen, path: '/recipes' },
    { name: 'Cart', icon: ShoppingCart, path: '/history' }, // Linking cart to history as per design flow roughly
    { name: 'Profile', icon: User, path: '/login' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40">
      <div className="flex h-16 items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center w-1/5 ${
                isActive ? 'text-primary' : 'text-gray-400 hover:text-primary'
              }`}
            >
              <div className="relative">
                 {isActive && (
                  <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 h-0.5 w-6 rounded-full bg-primary"></span>
                 )}
                 <item.icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
                 {/* Show cart badge on Cart icon */}
                 {item.name === 'Cart' && cartCount > 0 && (
                   <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
                     {cartCount}
                   </span>
                 )}
              </div>
              <span className={`text-[10px] mt-1 ${isActive ? 'font-bold' : ''}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};