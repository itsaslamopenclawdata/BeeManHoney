import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-text text-white pt-10 pb-6 px-4">
      <div className="container mx-auto text-center">
        {/* Footer Navigation */}
        <nav className="flex justify-center flex-wrap gap-x-6 gap-y-2 text-sm mb-6">
          <Link to="/about" className="hover:text-primary transition-colors">About Us</Link>
          <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
          <Link to="#" className="hover:text-primary transition-colors">Shipping & Returns</Link>
          <Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
        </nav>

        {/* Contact Information */}
        <div className="text-sm mb-6 text-gray-300">
          <p className="mb-1">Email: <a href="mailto:hello@beemanhoney.com" className="hover:text-primary text-white">hello@beemanhoney.com</a></p>
          <p>Phone: <a href="tel:+918002334483" className="hover:text-primary text-white">+91-800-BEE-HIVE</a></p>
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center space-x-6 mb-8">
          <a aria-label="Instagram" href="#" className="hover:text-primary transition-colors">
            <Instagram className="w-6 h-6" />
          </a>
          <a aria-label="Facebook" href="#" className="hover:text-primary transition-colors">
            <Facebook className="w-6 h-6" />
          </a>
          <a aria-label="Twitter" href="#" className="hover:text-primary transition-colors">
            <Twitter className="w-6 h-6" />
          </a>
        </div>

        {/* Copyright Notice */}
        <div className="border-t border-gray-700 pt-6 text-xs text-gray-400">
          <p>© 2024 BeeManHoney. All rights reserved.</p>
          <p className="mt-1">Proudly made in India.</p>
        </div>
      </div>
    </footer>
  );
};