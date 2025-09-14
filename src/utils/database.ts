import { User, UserSummary } from '../types/user';
import { ProgressState } from '../types';

const DB_NAME = 'CelestialPulseDB';
const DB_VERSION = 1;
const USERS_STORE = 'users';

class WorkoutDatabase {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(USERS_STORE)) {
          const userStore = db.createObjectStore(USERS_STORE, { keyPath: 'id' });
          userStore.createIndex('username', 'username', { unique: true });
        }
      };
    });
  }

  async createUser(username: string, initialState: ProgressState): Promise<User> {
    if (!this.db) throw new Error('Database not initialized');

    const user: User = {
      id: crypto.randomUUID(),
      username: username.trim(),
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      progressState: initialState,
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([USERS_STORE], 'readwrite');
      const store = transaction.objectStore(USERS_STORE);
      const request = store.add(user);

      request.onsuccess = () => resolve(user);
      request.onerror = () => reject(request.error);
    });
  }

  async getUserByUsername(username: string): Promise<User | null> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([USERS_STORE], 'readonly');
      const store = transaction.objectStore(USERS_STORE);
      const index = store.index('username');
      const request = index.get(username.trim());

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async updateUser(user: User): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    user.lastActiveAt = new Date().toISOString();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([USERS_STORE], 'readwrite');
      const store = transaction.objectStore(USERS_STORE);
      const request = store.put(user);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAllUsers(): Promise<UserSummary[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([USERS_STORE], 'readonly');
      const store = transaction.objectStore(USERS_STORE);
      const request = store.getAll();

      request.onsuccess = () => {
        const users: UserSummary[] = request.result.map((user: User) => ({
          id: user.id,
          username: user.username,
          lastActiveAt: user.lastActiveAt,
          totalXP: user.progressState.xp,
          level: Math.floor(user.progressState.xp / 100) + 1,
        }));
        resolve(users.sort((a, b) => new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime()));
      };
      request.onerror = () => reject(request.error);
    });
  }

  async deleteUser(userId: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([USERS_STORE], 'readwrite');
      const store = transaction.objectStore(USERS_STORE);
      const request = store.delete(userId);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const workoutDB = new WorkoutDatabase();