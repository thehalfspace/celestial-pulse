import { useState, useEffect } from 'react';
import { User, UserSummary } from '../types/user';
import { ProgressState } from '../types';
import { workoutDB } from '../utils/database';

function defaultState(): ProgressState {
  return {
    currentStepByMovement: {
      pushup: 4,
      squat: 4,
      pullup: 3,
      legraise: 2,
      bridge: 2,
      handstand: 2,
    },
    currentStepBySkill: {
      handstand_hold: 1,
      lsit: 1,
      hollow_hold: 1,
      arch_hold: 0,
      front_lever: 0,
      back_lever: 0,
      frog_stand: 0,
      ring_support: 0,
    },
    logs: [],
    xp: 0,
  };
}

export function useUserManager() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeDB();
  }, []);

  const initializeDB = async () => {
    try {
      await workoutDB.init();
      await loadUsers();
      setIsLoading(false);
    } catch (err) {
      setError('Failed to initialize database');
      setIsLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const userList = await workoutDB.getAllUsers();
      setUsers(userList);
    } catch (err) {
      setError('Failed to load users');
    }
  };

  const createUser = async (username: string): Promise<User> => {
    try {
      setError(null);
      
      if (!username.trim()) {
        throw new Error('Username cannot be empty');
      }

      if (username.trim().length < 2) {
        throw new Error('Username must be at least 2 characters');
      }

      // Check if user already exists
      const existingUser = await workoutDB.getUserByUsername(username);
      if (existingUser) {
        throw new Error('Username already exists');
      }

      const user = await workoutDB.createUser(username, defaultState());
      await loadUsers();
      return user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create user';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const loginUser = async (username: string): Promise<User> => {
    try {
      setError(null);
      
      if (!username.trim()) {
        throw new Error('Username cannot be empty');
      }

      const user = await workoutDB.getUserByUsername(username);
      if (!user) {
        throw new Error('User not found');
      }

      setCurrentUser(user);
      await loadUsers(); // Refresh the list
      return user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to login';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateUserProgress = async (progressState: ProgressState) => {
    if (!currentUser) return;

    try {
      const updatedUser = { ...currentUser, progressState };
      await workoutDB.updateUser(updatedUser);
      setCurrentUser(updatedUser);
      await loadUsers(); // Refresh the list to update XP/level
    } catch (err) {
      setError('Failed to save progress');
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setError(null);
  };

  const deleteUser = async (userId: string) => {
    try {
      await workoutDB.deleteUser(userId);
      if (currentUser?.id === userId) {
        setCurrentUser(null);
      }
      await loadUsers();
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  return {
    currentUser,
    users,
    isLoading,
    error,
    createUser,
    loginUser,
    updateUserProgress,
    logoutUser,
    deleteUser,
    clearError: () => setError(null),
  };
}