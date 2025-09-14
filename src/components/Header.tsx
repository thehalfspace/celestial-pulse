import React from 'react';
import { Save, Upload, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onExport: () => void;
  onImport: () => void;
  onReset: () => void;
}

export function Header({ onExport, onImport, onReset }: HeaderProps) {
  return (
    <header className="mb-6 flex items-center justify-between">
      <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
        🌌 Celestial Pulse: Workout Log
      </h1>
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
      </div>
    </header>
  );
}