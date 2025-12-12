import React, { useState } from 'react';
import { WasteReport, UrgencyLevel, User } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertTriangle, CheckCircle, Clock, Map as MapIcon, MapPin, Truck, LayoutDashboard } from 'lucide-react';
import { MapComponent } from '../components/MapComponent';

interface Props {
  user: User;
  reports: WasteReport[];
  onLogout: () => void;
}

export const MunicipalityView: React.FC<Props> = ({ user, reports, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'map' | 'fleet'>('dashboard');

  // Stats
  const criticalCount = reports.filter(r => r.urgency === UrgencyLevel.CRITICAL || r.urgency === UrgencyLevel.HIGH).length;
  const pendingCount = reports.filter(r => r.status === 'PENDING').length;
  
  // Mock Data for chart
  const data = [
    { name: 'Mon', reports: 12 },
    { name: 'Tue', reports: 19 },
    { name: 'Wed', reports: 15 },
    { name: 'Thu', reports: 22 },
    { name: 'Fri', reports: 28 },
    { name: 'Sat', reports: 35 },
    { name: 'Sun', reports: 20 },
  ];

  const renderContent = () => {
    if (activeTab === 'map') {
      return (
        <div className="h-[calc(100vh-10rem)] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative z-0">
          <MapComponent reports={reports} />
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-3 rounded-lg shadow-lg z-[400] max-w-xs pointer-events-none">
            <h3 className="font-bold text-slate-800">Live Heatmap</h3>
            <p className="text-xs text-slate-500 mb-2">Real-time overflow tracking</p>
            <div className="flex gap-2 text-xs">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Critical</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span> High</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Normal</span>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'fleet') {
        return (
            <div className="h-[calc(100vh-10rem)] flex items-center justify-center bg-white rounded-xl border border-slate-200 text-slate-400">
                <div className="text-center">
                    <Truck size={48} className="mx-auto mb-4 opacity-50"/>
                    <h3 className="text-lg font-bold text-slate-600">Fleet Management Module</h3>
                    <p>Live tracking of garbage trucks would appear here.</p>
                </div>
            </div>
        )
    }

    // DASHBOARD VIEW
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Overview & Map Preview */}
        <div className="lg:col-span-2 space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-500 text-sm font-medium">Critical Issues</p>
                  <h3 className="text-3xl font-bold text-slate-800 mt-1">{criticalCount}</h3>
                </div>
                <div className="bg-red-100 p-2 rounded-lg text-red-600">
                  <AlertTriangle size={20} />
                </div>
              </div>
              <p className="text-xs text-red-500 mt-2 font-medium">Requires immediate action</p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-500 text-sm font-medium">Active Fleet</p>
                  <h3 className="text-3xl font-bold text-slate-800 mt-1">8</h3>
                </div>
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                  <Truck size={20} />
                </div>
              </div>
              <p className="text-xs text-emerald-500 mt-2 font-medium">Route Optimization Active</p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-500 text-sm font-medium">Pending Reports</p>
                  <h3 className="text-3xl font-bold text-slate-800 mt-1">{pendingCount}</h3>
                </div>
                <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                  <Clock size={20} />
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-2">Avg resolution: 4.2 hrs</p>
            </div>
          </div>

          {/* Map Area */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-80 relative group z-0">
            <MapComponent reports={reports} interactive={false} zoom={11} />
            <div className="absolute bottom-4 right-4 z-[400]">
              <button 
                onClick={() => setActiveTab('map')}
                className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg hover:bg-slate-800 transition-colors"
              >
                View Full Map
              </button>
            </div>
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-md shadow-sm text-xs font-bold text-slate-700 z-[400]">
              City Overview
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4">Report Volume (7 Days)</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{fill: '#f1f5f9'}}
                  />
                  <Bar dataKey="reports" radius={[4, 4, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 5 ? '#10b981' : '#cbd5e1'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Col: Feed */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full max-h-[calc(100vh-10rem)] sticky top-6">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-bold text-slate-800">Incoming Reports</h2>
            <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full">{reports.length} New</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="flex gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer">
                <div className="relative flex-shrink-0">
                  <img src={report.imageUrl} alt="Bin" className="w-16 h-16 rounded-lg object-cover bg-slate-200" />
                  <div className={`absolute -top-2 -right-2 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white font-bold ${
                    report.overflowLevel > 80 ? 'bg-red-500' : 'bg-emerald-500'
                  }`}>
                    {report.overflowLevel}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                       report.urgency === UrgencyLevel.CRITICAL ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {report.urgency}
                    </span>
                    <span className="text-xs text-slate-400">2m ago</span>
                  </div>
                  <p className="text-sm font-medium text-slate-800 truncate">{report.aiAnalysisText}</p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin size={12} /> {report.location.lat.toFixed(4)}, {report.location.lng.toFixed(4)}
                  </p>
                </div>
              </div>
            ))}
            {reports.length === 0 && (
              <div className="text-center py-10 text-slate-400">
                <CheckCircle className="mx-auto mb-2 opacity-50" size={32} />
                <p>All clean! No reports pending.</p>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-xl">
             <button className="w-full bg-slate-900 text-white py-2 rounded-lg font-medium text-sm hover:bg-slate-800 transition-colors">
               Optimize & Dispatch Routes
             </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Horizontal Nav for Admin Tabs */}
      <div className="bg-white border-b border-slate-200 px-6 py-0 flex items-center sticky top-[64px] z-10 shadow-sm overflow-x-auto">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'dashboard' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutDashboard size={18} /> Dashboard
        </button>
        <button 
          onClick={() => setActiveTab('map')}
          className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'map' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MapIcon size={18} /> Live Map
        </button>
        <button 
          onClick={() => setActiveTab('fleet')}
          className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'fleet' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Truck size={18} /> Fleet
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
           {renderContent()}
        </div>
      </main>
    </div>
  );
};