import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { MobileNav } from '../components/MobileNav';
import { Header } from '../components/Header';
import { formatPrice } from '../utils/currency';
import api from '../services/api';

interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  quantity: number;
}

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    const newTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(newTotal);
  }, [cartItems]);

  const loadCart = () => {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(existingCart);
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    const updatedCart = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const removeItem = (id: number) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('Please login to place an order');
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    navigate('/checkout');
  };

  const shipping = total > 500 ? 0 : 50;
  const tax = Math.round(total * 0.18 * 100) / 100;
  const finalTotal = total + shipping + tax;

  return (
    <div className="min-h-screen font-sans text-text pb-16 md:pb-0">
      <div className="hidden md:block">
        <Header />
      </div>

      <div className="w-full md:container md:mx-auto md:max-w-6xl" style={{
        backgroundImage: "url('/assets/beemanhoney_purchase_history.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh'
      }}>
        <header className="p-4 pt-6 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/20 rounded-full transition">
            <ChevronLeft className="h-6 w-6 text-text" />
          </button>
          <div className="text-center">
            <h1 className="font-bold text-lg font-serif text-text">Shopping Cart</h1>
            <p className="text-sm text-gray-600">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</p>
          </div>
          <button className="p-2">
            <ShoppingBag className="h-6 w-6 text-text" />
          </button>
        </header>

        <main className="flex-grow p-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="bg-white/90 rounded-full p-8 mb-6 shadow-lg">
                <ShoppingBag className="h-16 w-16 text-gray-300" />
              </div>
              <h2 className="text-2xl font-bold font-serif text-text mb-2">Your Cart is Empty</h2>
              <p className="text-gray-600 mb-6">Add some delicious honey products to get started!</p>
              <button
                onClick={() => navigate('/products')}
                className="bg-primary hover:bg-secondary text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all hover:scale-105"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <article key={item.id} className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-md overflow-hidden">
                    <div className="flex p-4 gap-4">
                      <div className="flex-shrink-0">
                        <img
                          src={item.image_url || '/assets/logo.png'}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-xl bg-amber-50"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-semibold text-text font-serif">{item.name}</h3>
                          <p className="text-xs text-gray-500 line-clamp-1">{item.description}</p>
                          <p className="text-lg font-bold text-primary mt-1">{formatPrice(item.price)}</p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-3 bg-amber-50 rounded-full px-3 py-1">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-gray-100 transition disabled:opacity-50"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="font-semibold text-text min-w-[20px] text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-gray-100 transition"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="bg-amber-50 px-4 py-2 border-t border-amber-100">
                      <p className="text-right text-sm font-semibold text-text">
                        Subtotal: {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </article>
                ))}
              </div>

              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
                <h3 className="text-xl font-bold font-serif text-text mb-4">Order Summary</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green-600 font-semibold' : ''}>
                      {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (18%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="border-t border-dashed border-gray-300 my-2"></div>
                  <div className="flex justify-between text-lg font-bold text-text">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-4 px-6 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? 'Processing...' : 'Proceed to Checkout'}
                  <ArrowRight className="h-5 w-5" />
                </button>

                <button
                  onClick={() => navigate('/products')}
                  className="w-full mt-3 text-text font-semibold py-2 hover:text-primary transition"
                >
                  Continue Shopping
                </button>
              </div>
            </>
          )}
        </main>
      </div>
      <MobileNav />
    </div>
  );
};

export default Cart;
