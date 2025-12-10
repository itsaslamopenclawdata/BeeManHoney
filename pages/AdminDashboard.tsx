import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Users, Package, DollarSign, Activity, LogOut } from 'lucide-react';
import { formatPrice } from '../utils/currency';

// Mock Data simulating Backend Responses
const KP_DATA = {
  totalSales: 1245000,
  pendingDeliveries: 42,
  monthlySignups: [
    { month: 'Jan', count: 45 },
    { month: 'Feb', count: 52 },
    { month: 'Mar', count: 38 },
    { month: 'Apr', count: 65 },
    { month: 'May', count: 89 },
    { month: 'Jun', count: 120 },
  ],
  monthlyLogins: [
    { month: 'Jan', count: 120 },
    { month: 'Feb', count: 150 },
    { month: 'Mar', count: 180 },
    { month: 'Apr', count: 250 },
    { month: 'May', count: 310 },
    { month: 'Jun', count: 450 },
  ]
};

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Security Check
  useEffect(() => {
    const isAdmin = localStorage.getItem('adminSession');
    if (isAdmin !== 'true') {
      navigate('/admin-login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    navigate('/admin-login');
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans text-text">
      {/* Admin Sidebar / Layout */}
      <div className="flex flex-col md:flex-row min-h-screen">
        
        {/* Sidebar */}
        <aside className="bg-text text-white w-full md:w-64 flex-shrink-0 p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-10">
            <Activity className="text-primary h-8 w-8" />
            <div>
              <h1 className="font-serif font-bold text-xl">BeeManAdmin</h1>
              <p className="text-xs text-gray-400">Analytics Console</p>
            </div>
          </div>
          
          <nav className="flex-grow space-y-4">
            <button className="flex items-center gap-3 w-full bg-white/10 p-3 rounded-lg text-primary font-semibold">
              <TrendingUp className="h-5 w-5" /> Dashboard
            </button>
            <button className="flex items-center gap-3 w-full hover:bg-white/5 p-3 rounded-lg transition text-gray-300">
              <Users className="h-5 w-5" /> Users
            </button>
            <button className="flex items-center gap-3 w-full hover:bg-white/5 p-3 rounded-lg transition text-gray-300">
              <Package className="h-5 w-5" /> Orders
            </button>
          </nav>

          <button 
            onClick={handleLogout} 
            className="mt-auto flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-grow p-6 md:p-10 overflow-y-auto">
          <header className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold font-serif text-gray-800">Performance Overview</h2>
            <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm">
              Last Updated: {new Date().toLocaleDateString()}
            </div>
          </header>

          {/* KPI Cards Row */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-primary">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Aggregate Sales</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatPrice(KP_DATA.totalSales)}</h3>
                </div>
                <div className="bg-primary/10 p-2 rounded-lg">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
              </div>
              <p className="text-xs text-green-600 mt-2 font-medium">↑ 12% from last month</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Pending Deliveries</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">{KP_DATA.pendingDeliveries}</h3>
                </div>
                <div className="bg-red-50 p-2 rounded-lg">
                  <Package className="h-6 w-6 text-red-500" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Orders in Processing/Shipped</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total Signups (Jun)</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">120</h3>
                </div>
                <div className="bg-blue-50 p-2 rounded-lg">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
              </div>
               <p className="text-xs text-green-600 mt-2 font-medium">↑ 35 New users</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Active Logins (Jun)</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">450</h3>
                </div>
                <div className="bg-purple-50 p-2 rounded-lg">
                  <Activity className="h-6 w-6 text-purple-500" />
                </div>
              </div>
               <p className="text-xs text-green-600 mt-2 font-medium">High Engagement</p>
            </div>
          </section>

          {/* Charts Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Monthly Signups - Simple Bar Chart using Flexbox */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-bold text-lg mb-6 text-gray-800">Monthly Signups</h3>
              <div className="h-64 flex items-end justify-between space-x-2">
                {KP_DATA.monthlySignups.map((item, index) => (
                  <div key={index} className="flex flex-col items-center flex-1 group">
                    <div className="relative w-full flex justify-center items-end h-full">
                       {/* Tooltip */}
                       <div className="opacity-0 group-hover:opacity-100 absolute -top-10 bg-gray-800 text-white text-xs rounded py-1 px-2 transition-opacity">
                         {item.count} Users
                       </div>
                       {/* Bar */}
                       <div 
                        className="w-full max-w-[40px] bg-secondary rounded-t-md transition-all duration-500 hover:bg-primary"
                        style={{ height: `${(item.count / 150) * 100}%` }}
                       ></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-2 font-medium">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Logins - Simple Line Chart using SVG */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-bold text-lg mb-6 text-gray-800">Login Activity Trend</h3>
              <div className="h-64 w-full relative">
                 <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                    {/* Grid Lines */}
                    <line x1="0" y1="50" x2="600" y2="50" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4" />
                    <line x1="0" y1="100" x2="600" y2="100" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4" />
                    <line x1="0" y1="150" x2="600" y2="150" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4" />
                    
                    {/* The Line - Coordinates mapped crudely to the mock data */}
                    <polyline
                       fill="none"
                       stroke="#FFA726"
                       strokeWidth="4"
                       points="
                         50,160 
                         150,150 
                         250,140 
                         350,110 
                         450,90 
                         550,40
                       "
                       className="drop-shadow-lg"
                    />
                    
                    {/* Data Points */}
                    <circle cx="50" cy="160" r="4" fill="#D46F00" />
                    <circle cx="150" cy="150" r="4" fill="#D46F00" />
                    <circle cx="250" cy="140" r="4" fill="#D46F00" />
                    <circle cx="350" cy="110" r="4" fill="#D46F00" />
                    <circle cx="450" cy="90" r="4" fill="#D46F00" />
                    <circle cx="550" cy="40" r="4" fill="#D46F00" />
                 </svg>
                 
                 {/* X-Axis Labels */}
                 <div className="flex justify-between px-8 text-xs text-gray-500 mt-2">
                    {KP_DATA.monthlyLogins.map(m => <span key={m.month}>{m.month}</span>)}
                 </div>
              </div>
            </div>

          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
