import React, { useState } from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import { User, UserRole } from '../types';

interface Props {
  user: User | null;
  onLogout: () => void;
  onNavigate: (page: string) => void;
  onLoginClick: () => void;
}

export const Navbar: React.FC<Props> = ({ user, onLogout, onNavigate, onLoginClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNav = (page: string) => {
    onNavigate(page);
    setIsOpen(false);
  };

  return (
    <nav className="bg-white border-b border-slate-200 fixed top-0 left-0 right-0 z-[2000] h-16 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-full flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNav('home')}>
           <span className="text-2xl">♻️</span>
           <span className="font-bold text-xl text-slate-800">BinAlert</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => handleNav('home')} className="text-slate-600 hover:text-emerald-600 font-medium text-sm">Home</button>
          <button onClick={() => handleNav('about')} className="text-slate-600 hover:text-emerald-600 font-medium text-sm">About Us</button>
          <button onClick={() => handleNav('services')} className="text-slate-600 hover:text-emerald-600 font-medium text-sm">Services</button>
          <button onClick={() => handleNav('contact')} className="text-slate-600 hover:text-emerald-600 font-medium text-sm">Contact</button>
          
          {user ? (
            <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
              <div className="flex items-center gap-2">
                 <img src={user.avatar} className="w-8 h-8 rounded-full border border-slate-200" alt="Avatar"/>
                 <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-700 leading-none">{user.name}</span>
                    <span className="text-[10px] text-slate-400 uppercase">{user.role}</span>
                 </div>
              </div>
              <button 
                onClick={onLogout}
                className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 pl-4">
               <button onClick={onLoginClick} className="text-slate-600 font-bold hover:text-emerald-600">Login</button>
               <button onClick={onLoginClick} className="bg-emerald-600 text-white px-5 py-2 rounded-full font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100">
                 Sign Up
               </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-slate-600 p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-xl absolute top-16 left-0 right-0 p-4 flex flex-col gap-4 z-[2000]">
          <button onClick={() => handleNav('home')} className="text-slate-600 font-medium p-2 text-left">Home</button>
          <button onClick={() => handleNav('about')} className="text-slate-600 font-medium p-2 text-left">About Us</button>
          <button onClick={() => handleNav('services')} className="text-slate-600 font-medium p-2 text-left">Services</button>
          <button onClick={() => handleNav('contact')} className="text-slate-600 font-medium p-2 text-left">Contact</button>
          <hr className="border-slate-100"/>
           {user ? (
            <>
              <div className="flex items-center gap-3 p-2">
                 <img src={user.avatar} className="w-10 h-10 rounded-full" />
                 <div>
                    <p className="font-bold text-slate-700">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.role}</p>
                 </div>
              </div>
              <button 
                onClick={() => { onLogout(); setIsOpen(false); }}
                className="text-red-500 font-medium p-2 flex items-center gap-2 bg-red-50 rounded-lg justify-center"
              >
                <LogOut size={18} /> Sign Out
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <button onClick={() => { onLoginClick(); setIsOpen(false); }} className="w-full py-3 font-bold text-slate-600 bg-slate-50 rounded-xl">Login</button>
              <button onClick={() => { onLoginClick(); setIsOpen(false); }} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold">Sign Up</button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};