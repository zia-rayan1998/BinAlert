import React, { useState, useEffect } from 'react';
import { CheckCircle, Users, BarChart3, Leaf, Mail, Phone, MapPin, Send, RefreshCw, Calendar, FileText, Activity } from 'lucide-react';
import { User, UserRole } from '../types';

interface Stats {
  totalReports: number;
  resolvedReports: number;
  yearsExperience: number;
}

interface PageProps {
  onLoginClick: (role: UserRole) => void;
  stats?: Stats; // Optional to keep backward compatibility if needed
}

export const HomePage: React.FC<PageProps> = ({ onLoginClick, stats = { totalReports: 0, resolvedReports: 0, yearsExperience: 0 } }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [displayStats, setDisplayStats] = useState(stats);

  // Effect to handle "live" updates
  useEffect(() => {
    setDisplayStats(stats);
  }, [stats]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate network fetch
    setTimeout(() => {
      setDisplayStats(stats); // Ensure it syncs with latest props
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-slate-900 overflow-hidden">
        {/* Background Image - Increased opacity slightly for better visibility */}
        <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center"></div>
        
        {/* NEW: Live Status Bar - Fills the top gap with "Real-time" data feel */}
        <div className="relative z-20 border-b border-white/10 bg-black/20 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6 py-2 flex flex-col sm:flex-row justify-center items-center gap-3 text-xs font-medium text-emerald-300 tracking-wide">
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="uppercase font-bold">System Online</span>
                </div>
                <span className="hidden sm:inline text-white/20">|</span>
                <div className="flex items-center gap-2 text-slate-300">
                    <Activity size={12} className="text-emerald-400" />
                    <span>Monitoring <strong>12 Districts</strong></span>
                </div>
                <span className="hidden sm:inline text-white/20">|</span>
                <span className="text-slate-300">AI Optimization: <span className="text-emerald-400">Active</span></span>
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 relative z-10 text-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold text-sm mb-6 border border-emerald-500/30 backdrop-blur-md">
            Reimagining Waste Management
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
            Smarter Cities Start With <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Cleaner Streets</span>
          </h1>
          <p className="text-lg text-slate-200 mb-10 max-w-2xl mx-auto drop-shadow-md">
            Join thousands of citizens and municipalities using AI-powered detection to optimize waste collection and create sustainable environments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => onLoginClick(UserRole.CITIZEN)}
              className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 transition-transform hover:scale-105 shadow-lg shadow-emerald-900/50"
            >
              Report Waste
            </button>
            <button 
              onClick={() => onLoginClick(UserRole.EMPLOYER)}
              className="px-8 py-4 bg-white text-slate-900 rounded-xl font-bold text-lg hover:bg-slate-100 transition-transform hover:scale-105"
            >
              Municipality Login
            </button>
          </div>
        </div>
      </div>

      {/* Live Impact Statistics Section */}
      <div className="relative -mt-16 z-20 max-w-6xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-slate-800 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
               Live System Impact
             </h3>
             <button 
               onClick={handleRefresh}
               className={`text-slate-400 hover:text-emerald-600 transition-all ${isRefreshing ? 'animate-spin' : ''}`}
               title="Reload Data"
             >
               <RefreshCw size={20} />
             </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {/* Stat 1 */}
            <div className="flex items-center gap-4 py-4 md:py-0 px-4">
              <div className="bg-blue-50 text-blue-600 p-4 rounded-full">
                <FileText size={28} />
              </div>
              <div>
                <p className="text-3xl font-black text-slate-800">{displayStats.totalReports.toLocaleString()}</p>
                <p className="text-sm text-slate-500 font-medium">Total Requests Made</p>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex items-center gap-4 py-4 md:py-0 px-4">
              <div className="bg-emerald-50 text-emerald-600 p-4 rounded-full">
                <CheckCircle size={28} />
              </div>
              <div>
                <p className="text-3xl font-black text-slate-800">{displayStats.resolvedReports.toLocaleString()}</p>
                <p className="text-sm text-slate-500 font-medium">Issues Solved</p>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center gap-4 py-4 md:py-0 px-4">
              <div className="bg-purple-50 text-purple-600 p-4 rounded-full">
                <Calendar size={28} />
              </div>
              <div>
                <p className="text-3xl font-black text-slate-800">{displayStats.yearsExperience}+</p>
                <p className="text-sm text-slate-500 font-medium">Years of Experience</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400">
              * Data updates in real-time based on community submissions. Last updated: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose BinAlert?</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">We combine mobile technology, artificial intelligence, and geolocation to solve the garbage overflow crisis.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Leaf className="text-emerald-600" size={32} />, title: 'Eco-Friendly', desc: 'Reduce carbon footprint by optimizing garbage truck routes based on real-time data.' },
              { icon: <Users className="text-blue-600" size={32} />, title: 'Community Driven', desc: 'Empower citizens to take charge of their environment through gamified reporting.' },
              { icon: <BarChart3 className="text-purple-600" size={32} />, title: 'Data Insights', desc: 'Municipalities get actionable analytics to improve resource allocation and response times.' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AboutPage: React.FC = () => (
  <div className="bg-slate-50 min-h-screen">
    <div className="bg-slate-900 text-white py-20 px-6 text-center">
      <h1 className="text-4xl font-bold mb-4">About Us</h1>
      <p className="text-slate-400 max-w-2xl mx-auto">We are a team of passionate developers and environmentalists dedicated to solving urban waste challenges.</p>
    </div>
    
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 mb-12">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Our Mission</h2>
        <p className="text-slate-600 leading-relaxed mb-6">
          At BinAlert, our mission is simple: <strong>To eliminate garbage overflow in urban areas.</strong> 
          We believe that technology can bridge the gap between citizens and city administration. By leveraging 
          artificial intelligence and real-time data, we aim to create cleaner, healthier, and smarter cities 
          for everyone.
        </p>
        <p className="text-slate-600 leading-relaxed">
          Founded in 2024, BinAlert started as a small project to help a local neighborhood manage waste collection. 
          Today, it serves as a comprehensive platform connecting thousands of users with efficient waste management services.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-emerald-600 text-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
          <p className="opacity-90 leading-relaxed">
            A world where waste management is proactive, not reactive. We envision cities where sensors and community 
            reports seamlessly integrate to ensure zero overflow and maximum recycling efficiency.
          </p>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
           <h3 className="text-2xl font-bold text-slate-800 mb-4">Our Values</h3>
           <ul className="space-y-3">
             {['Sustainability First', 'Community Empowerment', 'Transparency', 'Innovation'].map((val, i) => (
               <li key={i} className="flex items-center gap-3 text-slate-600">
                 <CheckCircle size={20} className="text-emerald-500" /> {val}
               </li>
             ))}
           </ul>
        </div>
      </div>
    </div>
  </div>
);

export const ServicesPage: React.FC = () => (
  <div className="bg-slate-50 min-h-screen">
    <div className="bg-slate-900 text-white py-20 px-6 text-center">
      <h1 className="text-4xl font-bold mb-4">Our Services</h1>
      <p className="text-slate-400 max-w-2xl mx-auto">Comprehensive solutions for citizens, businesses, and municipalities.</p>
    </div>

    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            title: "Smart Waste Detection",
            desc: "Use our mobile app to detect overflowing bins instantly. Our AI analyzes waste type and severity to prioritize collection.",
            price: "Free for Citizens"
          },
          {
            title: "Route Optimization",
            desc: "For municipalities: Reduce fuel costs and time by up to 30% with AI-generated collection routes based on live traffic and bin levels.",
            price: "Custom Enterprise Plan"
          },
          {
            title: "Fleet Management",
            desc: "Track garbage trucks in real-time, assign ad-hoc tasks, and monitor driver performance through a centralized dashboard.",
            price: "Subscription Based"
          },
          {
            title: "Data Analytics",
            desc: "Gain deep insights into waste generation patterns, identify hotspots, and plan infrastructure improvements with data-backed reports.",
            price: "Included in Ent. Plan"
          },
          {
            title: "Bulk Waste Pickup",
            desc: "Schedule special pickups for large items like furniture or appliances directly through the app.",
            price: "Per Request Fee"
          },
          {
            title: "Recycling Consulting",
            desc: "Expert advice for businesses and residential complexes to improve recycling rates and reduce landfill waste.",
            price: "Consultation Fee"
          }
        ].map((service, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all group">
            <div className="h-2 bg-emerald-500 w-0 group-hover:w-full transition-all duration-500"></div>
            <div className="p-8">
              <h3 className="text-xl font-bold text-slate-800 mb-3">{service.title}</h3>
              <p className="text-slate-500 mb-6 text-sm leading-relaxed min-h-[80px]">{service.desc}</p>
              <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">{service.price}</span>
                <button className="text-emerald-600 text-sm font-bold hover:underline">Learn More</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const ContactPage: React.FC = () => (
  <div className="bg-slate-50 min-h-screen">
    <div className="bg-slate-900 text-white py-20 px-6 text-center">
      <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
      <p className="text-slate-400 max-w-2xl mx-auto">Have questions? We'd love to hear from you.</p>
    </div>

    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Get in Touch</h2>
            <p className="text-slate-500 leading-relaxed">
              Whether you are a citizen reporting a bug, or a municipality looking for a demo, our team is ready to assist you.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-emerald-100 p-3 rounded-lg text-emerald-600 mt-1">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Visit Us</h3>
                <p className="text-slate-500 text-sm">123 Green Innovation Park<br/>Eco City, CA 90210</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-emerald-100 p-3 rounded-lg text-emerald-600 mt-1">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Email Us</h3>
                <p className="text-slate-500 text-sm">General: hello@binalert.com</p>
                <p className="text-slate-500 text-sm">Support: help@binalert.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-emerald-100 p-3 rounded-lg text-emerald-600 mt-1">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Call Us</h3>
                <p className="text-slate-500 text-sm">Mon-Fri from 8am to 5pm.</p>
                <p className="text-slate-500 text-sm font-bold mt-1">+1 (555) 000-0000</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">First Name</label>
                <input type="text" className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="John" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Last Name</label>
                <input type="text" className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="Doe" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Email</label>
              <input type="email" className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="john@example.com" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Message</label>
              <textarea className="w-full border border-slate-200 rounded-lg px-4 py-3 h-32 focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none" placeholder="How can we help?"></textarea>
            </div>

            <button className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
              <Send size={18} /> Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
);