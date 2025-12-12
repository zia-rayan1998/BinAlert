import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<Props> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div>
          <div 
            className="flex items-center gap-2 mb-4 cursor-pointer hover:opacity-80 transition-opacity" 
            onClick={() => onNavigate('home')}
          >
             <span className="text-2xl">♻️</span>
             <span className="font-bold text-xl text-white">BinAlert</span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Empowering communities to maintain cleaner cities through smart, AI-driven waste management solutions.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><button onClick={() => onNavigate('home')} className="hover:text-emerald-400 transition-colors text-left">Home</button></li>
            <li><button onClick={() => onNavigate('about')} className="hover:text-emerald-400 transition-colors text-left">About Us</button></li>
            <li><button onClick={() => onNavigate('services')} className="hover:text-emerald-400 transition-colors text-left">Services</button></li>
            <li><button onClick={() => onNavigate('contact')} className="hover:text-emerald-400 transition-colors text-left">Contact</button></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-white font-bold mb-4">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <MapPin size={16} className="text-emerald-500" />
              <span>123 Green Street, Eco City, 10012</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={16} className="text-emerald-500" />
              <span>+1 (555) 123-4567</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={16} className="text-emerald-500" />
              <span>support@binalert.com</span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-white font-bold mb-4">Newsletter</h3>
          <p className="text-xs text-slate-400 mb-3">Subscribe for updates on waste management initiatives.</p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Your email" 
              className="bg-slate-800 border-none rounded-lg px-3 py-2 text-sm w-full focus:ring-1 focus:ring-emerald-500 text-white"
            />
            <button className="bg-emerald-600 text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700">
              Go
            </button>
          </div>
          <div className="flex gap-4 mt-6">
            <a href="#" className="text-slate-400 hover:text-white"><Facebook size={20} /></a>
            <a href="#" className="text-slate-400 hover:text-white"><Twitter size={20} /></a>
            <a href="#" className="text-slate-400 hover:text-white"><Instagram size={20} /></a>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} BinAlert Systems. All rights reserved.
      </div>
    </footer>
  );
};