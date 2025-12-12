import React from 'react';
import { User } from '../types';

interface Props {
  user: User;
}

export const GamificationBadge: React.FC<Props> = ({ user }) => {
  return (
    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-4 text-white shadow-lg flex items-center justify-between mb-6">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <img 
            src={user.avatar} 
            alt="Profile" 
            className="w-12 h-12 rounded-full border-2 border-white"
          />
          <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-yellow-900 text-xs font-bold px-1.5 py-0.5 rounded-full border border-white">
            Lvl 5
          </div>
        </div>
        <div>
          <h3 className="font-bold text-lg">{user.name}</h3>
          <p className="text-emerald-100 text-xs">Citizen Eco-Warrior</p>
        </div>
      </div>
      <div className="text-right">
        <span className="block text-2xl font-black">{user.points}</span>
        <span className="text-xs text-emerald-100 uppercase tracking-wider">Points</span>
      </div>
    </div>
  );
};