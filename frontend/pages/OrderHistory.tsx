import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Package, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import { MobileNav } from '../components/MobileNav';
import { Header } from '../components/Header';
import { formatPrice } from '../utils/currency';
import api from '../services/api';

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image_url?: string;
}

interface Order {
  id: number;
  created_at: string;
  total_amount: number;
  status: string;
  shipping_address: any;
  items: OrderItem[];
}

const OrderHistory: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to view your orders');
        setLoading(false);
        return;
      }

      const { data } = await api.get('/orders/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(data);
    } catch (err: any) {
      console.error('Failed to fetch orders', err);
      setError(err.response?.data?.detail || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'processing':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
      case 'returned':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
      case 'returned':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen font-sans pb-16 md:pb-0">
        <div className="hidden md:block">
          <Header />
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
        <MobileNav />
      </div>
    );
  }

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
          <h1 className="font-bold text-lg font-serif text-text">My Orders</h1>
          <div className="w-10"></div>
        </header>

        <main className="flex-grow p-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-600 text-center">{error}</p>
              {!localStorage.getItem('token') && (
                <div className="text-center mt-2">
                  <Link to="/login" className="text-primary font-semibold hover:underline">Login to view orders</Link>
                </div>
              )}
            </div>
          )}

          {!error && orders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="bg-white/90 rounded-full p-8 mb-6 shadow-lg">
                <Package className="h-16 w-16 text-gray-300" />
              </div>
              <h2 className="text-2xl font-bold font-serif text-text mb-2">No Orders Yet</h2>
              <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
              <button
                onClick={() => navigate('/products')}
                className="bg-primary hover:bg-secondary text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all hover:scale-105"
              >
                Start Shopping
              </button>
            </div>
          )}

          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-md overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-text">Order #{order.id}</p>
                      <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="w-10 h-10 object-cover rounded" />
                        ) : (
                          <Package className="h-6 w-6 text-amber-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                      </div>
                      <p className="font-semibold text-sm">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-amber-50 px-4 py-3 border-t border-amber-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total</span>
                    <span className="text-lg font-bold text-primary">{formatPrice(order.total_amount)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
};

export default OrderHistory;
