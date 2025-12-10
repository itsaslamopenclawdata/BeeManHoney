import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Sourcing from './pages/Sourcing';
import Contact from './pages/Contact';
import Products from './pages/Products';
import History from './pages/History';
import Recipes from './pages/Recipes';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';

// ScrollToTop component to reset scroll position on route change
const ScrollToTop = () => {
  return null;
}

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Defaulting to Login page as requested for preview */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sourcing" element={<Sourcing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/products" element={<Products />} />
        <Route path="/history" element={<History />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
