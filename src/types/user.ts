import { ProgressState } from './index';

export interface User {
  id: string;
  username: string;
  createdAt: string;
  lastActiveAt: string;
  progressState: ProgressState;
}

export interface UserSummary {
  id: string;
  username: string;
  lastActiveAt: string;
  totalXP: number;
  level: number;
}