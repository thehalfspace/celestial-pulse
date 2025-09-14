import React, { useState } from 'react';
import { User, UserSummary } from '../types/user';
import { Card, SectionTitle } from './ui';
import { Users, Plus, LogIn, Trash2, Trophy } from 'lucide-react';

interface UserSelectorProps {
  users: UserSummary[];
  isLoading: boolean;
  error: string | null;
  onCreateUser: (username: string) => Promise<User>;
  onLoginUser: (username: string) => Promise<User>;
  onDeleteUser: (userId: string) => void;
  onClearError: () => void;
}

export function UserSelector({
  users,
  isLoading,
  error,
  onCreateUser,
  onLoginUser,
  onDeleteUser,
  onClearError,
}: UserSelectorProps) {
  const [username, setUsername] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    try {
      if (isCreating) {
        await onCreateUser(username);
      } else {
        await onLoginUser(username);
      }
      setUsername('');
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleDeleteUser = (userId: string, username: string) => {
    if (confirm(`Are you sure you want to delete user "${username}"? This cannot be undone.`)) {
      onDeleteUser(userId);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-slate-300">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mb-2 flex items-center justify-center gap-3">
            🌌 Celestial Pulse
          </h1>
          <p className="text-slate-300">Select or create a user to continue</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-sm">
            {error}
            <button
              onClick={onClearError}
              className="ml-2 text-red-400 hover:text-red-300"
            >
              ✕
            </button>
          </div>
        )}

        <Card className="mb-6">
          <SectionTitle
            icon={isCreating ? <Plus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
            title={isCreating ? "Create New User" : "Login as Existing User"}
          />
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500/50"
                maxLength={20}
              />
            </div>
            
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={!username.trim()}
                className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${
                  isCreating
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-black'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isCreating ? 'Create User' : 'Login'}
              </button>
              
              <button
                type="button"
                onClick={() => setIsCreating(!isCreating)}
                className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-medium transition-colors"
              >
                {isCreating ? 'Login Instead' : 'Create New'}
              </button>
            </div>
          </form>
        </Card>

        {users.length > 0 && (
          <Card>
            <SectionTitle
              icon={<Users className="w-5 h-5" />}
              title="Existing Users"
              right={<span className="text-sm text-slate-400">{users.length} users</span>}
            />
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-medium text-slate-200">{user.username}</div>
                    <div className="text-sm text-slate-400 flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Trophy className="w-3 h-3" />
                        Level {user.level} ({user.totalXP} XP)
                      </span>
                      <span>Last active: {new Date(user.lastActiveAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => onLoginUser(user.username)}
                      className="px-3 py-1 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id, user.username)}
                      className="px-2 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-colors"
                      title="Delete user"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}