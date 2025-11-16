import { create } from 'zustand';
import { DashboardStats, Activity } from '@/types';
import { mockStats, mockActivities } from '@/lib/utils/mock-data';

interface DashboardState {
  stats: DashboardStats;
  activities: Activity[];
  isLoading: boolean;
  setStats: (stats: DashboardStats) => void;
  addActivity: (activity: Activity) => void;
  setLoading: (loading: boolean) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  stats: mockStats,
  activities: mockActivities,
  isLoading: false,
  setStats: (stats) => set({ stats }),
  addActivity: (activity) => set((state) => ({
    activities: [activity, ...state.activities].slice(0, 10)
  })),
  setLoading: (loading) => set({ isLoading: loading })
}));
