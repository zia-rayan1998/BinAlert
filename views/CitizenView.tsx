import React, { useState, useRef } from 'react';
import { Camera, MapPin, Send, Loader2, Phone, Home, Trophy, History } from 'lucide-react';
import { User, WasteReport, ReportStatus, UrgencyLevel } from '../types';
import { GamificationBadge } from '../components/GamificationBadge';
import { analyzeBinImage } from '../services/geminiService';

interface Props {
  user: User;
  onLogout: () => void;
  addReport: (report: WasteReport) => void;
}

const WASTE_TYPES = ['Paper', 'Plastic', 'Recyclable', 'Mixed', 'Organic', 'Metal'];

export const CitizenView: React.FC<Props> = ({ user, onLogout, addReport }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'leaderboard' | 'history'>('home');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [userSelectedType, setUserSelectedType] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock history data
  const history = [
    { id: '101', date: '2 days ago', points: 50, status: 'Resolved' },
    { id: '102', date: '1 week ago', points: 50, status: 'Resolved' },
    { id: '103', date: '2 weeks ago', points: 20, status: 'Resolved' }
  ];

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setPreview(base64);
        setAnalysis(null);
        setUserSelectedType(null); // Reset selection
        // Start analysis in background, but user can also select type
        await processImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (base64: string) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeBinImage(base64);
      setAnalysis(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = () => {
    if (!preview) return;

    // Use analysis if available, otherwise default
    const finalWasteTypes = userSelectedType ? [userSelectedType] : (analysis?.wasteTypes || ['Mixed']);

    const newReport: WasteReport = {
      id: Date.now().toString(),
      imageUrl: preview,
      timestamp: Date.now(),
      location: { lat: 34.0522, lng: -118.2437 }, // Mock location
      status: ReportStatus.PENDING,
      urgency: analysis?.urgency || UrgencyLevel.MEDIUM,
      wasteType: finalWasteTypes,
      overflowLevel: analysis?.overflowLevel || 50,
      aiAnalysisText: analysis?.description || `User reported: ${userSelectedType}`,
      reporterId: user.id
    };

    addReport(newReport);
    setPreview(null);
    setAnalysis(null);
    setUserSelectedType(null);
    alert(`Report Submitted! You earned 50 points.`);
  };

  const triggerEmergency = () => {
    const confirmed = window.confirm("Is this an emergency (Fire, Hazardous Chemical)? This will alert authorities immediately.");
    if (confirmed) {
      alert("Emergency Alert Sent! Authorities have been notified of your location.");
    }
  };

  const renderHome = () => (
    <div className="p-4 max-w-md mx-auto space-y-6">
      <GamificationBadge user={user} />

      {/* Action Card */}
      <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden relative">
        {!preview ? (
          <div className="p-8 text-center">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-24 bg-gradient-to-tr from-emerald-50 to-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 cursor-pointer hover:scale-105 transition-transform shadow-sm ring-4 ring-emerald-50"
            >
              <Camera size={40} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Spot Overflowing Trash?</h2>
            <p className="text-slate-500 mb-8 text-sm leading-relaxed">
              Take a photo to earn points and help keep your city clean. Help collectors by tagging the waste type!
            </p>
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold shadow-emerald-200 shadow-xl hover:bg-emerald-700 transition-all active:scale-95"
            >
              Capture Photo
            </button>
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleCapture}
            />
          </div>
        ) : (
          <div className="relative">
            <img src={preview} alt="Capture" className="w-full h-80 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            <button 
              onClick={() => setPreview(null)}
              className="absolute top-4 right-4 bg-white/20 backdrop-blur text-white p-2 rounded-full hover:bg-white/30 transition-colors z-10"
            >
              ✕
            </button>

            <div className="absolute bottom-0 left-0 right-0 p-6 rounded-t-3xl">
              
              {/* User Selection First */}
              <div className="mb-6">
                 <p className="text-white/90 text-sm font-bold mb-3 flex items-center gap-2">
                   Select Waste Type <span className="text-xs font-normal text-white/60">(Optional)</span>
                 </p>
                 <div className="flex flex-wrap gap-2">
                   {WASTE_TYPES.map(type => (
                     <button
                       key={type}
                       onClick={() => setUserSelectedType(type)}
                       className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                         userSelectedType === type 
                           ? 'bg-emerald-500 text-white shadow-lg scale-105' 
                           : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                       }`}
                     >
                       {type}
                     </button>
                   ))}
                 </div>
              </div>

              {isAnalyzing ? (
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex items-center gap-3 text-white mb-4">
                  <Loader2 className="animate-spin text-emerald-400" size={20} />
                  <span className="text-sm">AI Analyzing composition...</span>
                </div>
              ) : analysis ? (
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 mb-4 border border-white/10 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">AI Insight</span>
                    <span className="text-white font-bold text-sm">{analysis.overflowLevel}% Full</span>
                  </div>
                  <p className="text-white/80 text-xs leading-relaxed">{analysis.description}</p>
                </div>
              ) : null}

              <button 
                onClick={handleSubmit}
                disabled={isAnalyzing}
                className="w-full bg-emerald-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 shadow-lg shadow-emerald-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send size={18} /> {isAnalyzing ? 'Analyzing...' : 'Submit Report'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Emergency Help */}
      <div className="text-center pb-8">
        <button 
          onClick={triggerEmergency}
          className="inline-flex items-center justify-center gap-2 text-red-500 bg-red-50 border border-red-100 hover:bg-red-100 px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
        >
          <Phone size={16} /> Emergency Call
        </button>
      </div>
    </div>
  );

  const renderLeaderboard = () => (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Leaderboard</h2>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={`flex items-center p-4 border-b border-slate-50 ${i === 1 ? 'bg-yellow-50/50' : ''}`}>
            <span className={`w-8 h-8 flex items-center justify-center rounded-full font-bold mr-4 ${
              i === 1 ? 'bg-yellow-100 text-yellow-700' : 
              i === 2 ? 'bg-slate-200 text-slate-700' : 
              i === 3 ? 'bg-orange-100 text-orange-800' : 'text-slate-400'
            }`}>
              {i}
            </span>
            <div className="flex-1">
              <p className="font-bold text-slate-800">Citizen {100 + i}</p>
              <p className="text-xs text-slate-400">Level {10 - i}</p>
            </div>
            <span className="font-bold text-emerald-600">{1500 - (i * 100)} pts</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Your Activity</h2>
      <div className="space-y-4">
        {history.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-100 p-2.5 rounded-lg text-emerald-600">
                <Send size={20} />
              </div>
              <div>
                <p className="font-bold text-slate-800">Report #{item.id}</p>
                <p className="text-xs text-slate-400">{item.date}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="block font-bold text-emerald-600">+{item.points}</span>
              <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">{item.status}</span>
            </div>
          </div>
        ))}
        <button onClick={onLogout} className="w-full mt-8 flex items-center justify-center gap-2 text-red-500 py-4 font-medium">
          Log Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-50 h-full flex flex-col">
      <div className="flex-1 pb-24">
        {activeTab === 'home' && renderHome()}
        {activeTab === 'leaderboard' && renderLeaderboard()}
        {activeTab === 'history' && renderHistory()}
      </div>

      {/* Bottom Nav - Fixed for Citizen only */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-2 pb-6 z-50 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${activeTab === 'home' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Home size={24} />
          <span className="text-[10px] font-medium">Home</span>
        </button>
        <button 
          onClick={() => setActiveTab('leaderboard')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${activeTab === 'leaderboard' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Trophy size={24} />
          <span className="text-[10px] font-medium">Rank</span>
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${activeTab === 'history' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <History size={24} />
          <span className="text-[10px] font-medium">History</span>
        </button>
      </div>
    </div>
  );
};