import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { MobileNav } from '../components/MobileNav';
import { formatPrice } from '../utils/currency';
import api from '../services/api';

interface User {
  id: number;
  email: string;
  full_name: string;
  is_admin: boolean;
}

interface Address {
  id?: number;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
}

interface Order {
  id: number;
  created_at: string;
  total_amount: number;
  order_status: string;
  items: { name: string; quantity: number; price: number }[];
}

interface WishlistItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
    image_url: string;
  };
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'orders' | 'wishlist'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ full_name: '', email: '' });
  const [addressForm, setAddressForm] = useState<Address>({
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: '',
    is_default: false
  });
  const [showAddressForm, setShowAddressForm] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchOrders();
    fetchWishlist();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const { data } = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(data);
      setEditForm({ full_name: data.full_name || '', email: data.email });
      
      // Fetch addresses
      const addrRes = await api.get('/addresses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAddresses(addrRes.data);
    } catch (error) {
      console.error('Failed to fetch profile', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await api.get('/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    }
  };

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await api.get('/wishlist', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWishlist(data);
    } catch (error) {
      console.error('Failed to fetch wishlist', error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await api.put('/auth/profile', editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser({ ...user!, ...editForm });
      setIsEditing(false);
      alert('Profile updated!');
    } catch (error) {
      alert('Failed to update profile');
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await api.post('/addresses', addressForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProfile();
      setShowAddressForm(false);
      setAddressForm({
        full_name: '',
        phone: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        pincode: '',
        is_default: false
      });
      alert('Address added!');
    } catch (error) {
      alert('Failed to add address');
    }
  };

  const handleDeleteAddress = async (id: number) => {
    if (!confirm('Delete this address?')) return;
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/addresses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProfile();
    } catch (error) {
      alert('Failed to delete address');
    }
  };

  const handleRemoveFromWishlist = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/wishlist/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchWishlist();
    } catch (error) {
      alert('Failed to remove from wishlist');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('cart');
    window.location.href = '/';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Account</h1>

        {/* Tabs */}
        <div className="flex border-b mb-6 overflow-x-auto">
          {(['profile', 'addresses', 'orders', 'wishlist'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium capitalize whitespace-nowrap ${
                activeTab === tab
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && user && (
          <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Full Name</label>
                  <input
                    type="text"
                    value={editForm.full_name}
                    onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                    className="mt-1 block w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    disabled
                    className="mt-1 block w-full border rounded px-3 py-2 bg-gray-100"
                  />
                </div>
                <div className="space-x-2">
                  <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Save</button>
                  <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                </div>
              </form>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-lg font-medium">{user.full_name}</p>
                    <p className="text-gray-500">{user.email}</p>
                  </div>
                  <button onClick={() => setIsEditing(true)} className="text-primary hover:underline">Edit</button>
                </div>
                <button onClick={handleLogout} className="text-red-600 hover:underline">Logout</button>
              </div>
            )}
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === 'addresses' && (
          <div className="space-y-4">
            <button
              onClick={() => setShowAddressForm(!showAddressForm)}
              className="bg-primary text-white px-4 py-2 rounded"
            >
              {showAddressForm ? 'Cancel' : 'Add New Address'}
            </button>

            {showAddressForm && (
              <form onSubmit={handleAddAddress} className="bg-white p-6 rounded-lg shadow space-y-4 max-w-2xl">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium">Full Name</label>
                    <input type="text" required value={addressForm.full_name} onChange={(e) => setAddressForm({...addressForm, full_name: e.target.value})} className="mt-1 block w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Phone</label>
                    <input type="tel" required value={addressForm.phone} onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})} className="mt-1 block w-full border rounded px-3 py-2" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium">Address Line 1</label>
                  <input type="text" required value={addressForm.address_line1} onChange={(e) => setAddressForm({...addressForm, address_line1: e.target.value})} className="mt-1 block w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Address Line 2</label>
                  <input type="text" value={addressForm.address_line2} onChange={(e) => setAddressForm({...addressForm, address_line2: e.target.value})} className="mt-1 block w-full border rounded px-3 py-2" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium">City</label>
                    <input type="text" required value={addressForm.city} onChange={(e) => setAddressForm({...addressForm, city: e.target.value})} className="mt-1 block w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">State</label>
                    <input type="text" required value={addressForm.state} onChange={(e) => setAddressForm({...addressForm, state: e.target.value})} className="mt-1 block w-full border rounded px-3 py-2" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium">Pincode</label>
                    <input type="text" required value={addressForm.pincode} onChange={(e) => setAddressForm({...addressForm, pincode: e.target.value})} className="mt-1 block w-full border rounded px-3 py-2" />
                  </div>
                  <div className="flex items-center mt-6">
                    <input type="checkbox" checked={addressForm.is_default} onChange={(e) => setAddressForm({...addressForm, is_default: e.target.checked})} className="mr-2" />
                    <label>Set as default</label>
                  </div>
                </div>
                <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Save Address</button>
              </form>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div key={addr.id} className="bg-white p-4 rounded-lg shadow relative">
                  <p className="font-medium">{addr.full_name}</p>
                  <p className="text-gray-600 text-sm">{addr.address_line1}</p>
                  <p className="text-gray-600 text-sm">{addr.address_line2}</p>
                  <p className="text-gray-600 text-sm">{addr.city}, {addr.state} - {addr.pincode}</p>
                  <p className="text-gray-500 text-sm">Phone: {addr.phone}</p>
                  {addr.is_default && <span className="bg-primary text-white text-xs px-2 py-1 rounded absolute top-2 right-2">Default</span>}
                  <button onClick={() => handleDeleteAddress(addr.id!)} className="text-red-600 text-sm mt-2 hover:underline">Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <p className="text-gray-500">No orders yet.</p>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">Order #{order.id}</p>
                      <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.order_status)}`}>
                      {order.order_status}
                    </span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{item.name} x {item.quantity}</span>
                        <span>{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                    <span>Total</span>
                    <span>{formatPrice(order.total_amount)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Wishlist Tab */}
        {activeTab === 'wishlist' && (
          <div className="space-y-4">
            {wishlist.length === 0 ? (
              <p className="text-gray-500">Your wishlist is empty.</p>
            ) : (
              <div className="grid md:grid-cols-3 gap-4">
                {wishlist.map((item) => (
                  <div key={item.id} className="bg-white p-4 rounded-lg shadow">
                    <img src={item.product.image_url} alt={item.product.name} className="w-full h-40 object-cover rounded mb-2" />
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-primary font-bold">{formatPrice(item.product.price)}</p>
                    <div className="flex gap-2 mt-2">
                      <Link to={`/products/${item.product.id}`} className="text-sm text-primary hover:underline">View</Link>
                      <button onClick={() => handleRemoveFromWishlist(item.id)} className="text-sm text-red-600 hover:underline">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
};

export default Profile;
