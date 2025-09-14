import React from 'react';
import { Save, Upload, RefreshCw, LogOut, User } from 'lucide-react';

interface HeaderProps {
  currentUser?: { username: string; } | null;
  onExport: () => void;
  onImport: () => void;
  onReset: () => void;
  onLogout?: () => void;
}

export function Header({ currentUser, onExport, onImport, onReset, onLogout }: HeaderProps) {
  return (
    <header className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          🌌 Celestial Pulse: Workout Log
        </h1>
        {currentUser && (
          <div className="flex items-center gap-2 mt-1 text-sm text-slate-300">
            <User className="w-4 h-4" />
            <span>Welcome back, {currentUser.username}!</span>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <button
          className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10"
          onClick={onExport}
          title="Export JSON"
        >
          <Save className="w-4 h-4" />
        </button>
        <button
          className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10"
          onClick={onImport}
          title="Import JSON"
        >
          <Upload className="w-4 h-4" />
        </button>
        <button
          className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10"
          onClick={onReset}
          title="Reset"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
        {onLogout && (
          <button
            className="px-3 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/20 text-red-300"
            onClick={onLogout}
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
}