import { create } from 'zustand';
import {
  EditStage,
  ReviewVersion,
  ReviewComment,
  RenderTask,
  DeliveryChecklistItem,
  BackupLocation,
  StorageQuota,
  Revision,
} from '@/types';

interface PostProductionState {
  editStages: Record<string, EditStage[]>;
  reviewVersions: Record<string, ReviewVersion[]>;
  renderTasks: Record<string, RenderTask[]>;
  checklistItems: Record<string, DeliveryChecklistItem[]>;
  backupLocations: Record<string, BackupLocation[]>;
  storageQuotas: Record<string, StorageQuota | null>;
  revisions: Record<string, Revision[]>;
  isLoading: boolean;

  setEditStages: (projectId: string, stages: EditStage[]) => void;
  updateEditStage: (projectId: string, stageId: string, updates: Partial<EditStage>) => void;

  setReviewVersions: (projectId: string, versions: ReviewVersion[]) => void;
  addReviewVersion: (projectId: string, version: ReviewVersion) => void;
  updateReviewVersion: (projectId: string, versionId: string, updates: Partial<ReviewVersion>) => void;

  setRenderTasks: (projectId: string, tasks: RenderTask[]) => void;
  addRenderTask: (projectId: string, task: RenderTask) => void;
  updateRenderTask: (projectId: string, taskId: string, updates: Partial<RenderTask>) => void;
  deleteRenderTask: (projectId: string, taskId: string) => void;

  setChecklistItems: (projectId: string, items: DeliveryChecklistItem[]) => void;
  toggleChecklistItem: (projectId: string, itemId: string) => void;
  addChecklistItem: (projectId: string, item: DeliveryChecklistItem) => void;

  setBackupLocations: (projectId: string, locations: BackupLocation[]) => void;
  updateBackupLocation: (projectId: string, locationId: string, updates: Partial<BackupLocation>) => void;

  setStorageQuota: (projectId: string, quota: StorageQuota) => void;

  setRevisions: (projectId: string, revisions: Revision[]) => void;

  getOverallProgress: (projectId: string) => number;
  setLoading: (loading: boolean) => void;
}

export const usePostProductionStore = create<PostProductionState>((set, get) => ({
  editStages: {},
  reviewVersions: {},
  renderTasks: {},
  checklistItems: {},
  backupLocations: {},
  storageQuotas: {},
  revisions: {},
  isLoading: false,

  setEditStages: (projectId, stages) =>
    set((state) => ({
      editStages: { ...state.editStages, [projectId]: stages },
    })),

  updateEditStage: (projectId, stageId, updates) =>
    set((state) => {
      const stages = state.editStages[projectId] || [];
      return {
        editStages: {
          ...state.editStages,
          [projectId]: stages.map((stage) =>
            stage.id === stageId ? { ...stage, ...updates, updatedAt: new Date() } : stage
          ),
        },
      };
    }),

  setReviewVersions: (projectId, versions) =>
    set((state) => ({
      reviewVersions: { ...state.reviewVersions, [projectId]: versions },
    })),

  addReviewVersion: (projectId, version) =>
    set((state) => {
      const versions = state.reviewVersions[projectId] || [];
      return {
        reviewVersions: {
          ...state.reviewVersions,
          [projectId]: [...versions, version],
        },
      };
    }),

  updateReviewVersion: (projectId, versionId, updates) =>
    set((state) => {
      const versions = state.reviewVersions[projectId] || [];
      return {
        reviewVersions: {
          ...state.reviewVersions,
          [projectId]: versions.map((version) =>
            version.id === versionId ? { ...version, ...updates, updatedAt: new Date() } : version
          ),
        },
      };
    }),

  setRenderTasks: (projectId, tasks) =>
    set((state) => ({
      renderTasks: { ...state.renderTasks, [projectId]: tasks },
    })),

  addRenderTask: (projectId, task) =>
    set((state) => {
      const tasks = state.renderTasks[projectId] || [];
      return {
        renderTasks: {
          ...state.renderTasks,
          [projectId]: [...tasks, task],
        },
      };
    }),

  updateRenderTask: (projectId, taskId, updates) =>
    set((state) => {
      const tasks = state.renderTasks[projectId] || [];
      return {
        renderTasks: {
          ...state.renderTasks,
          [projectId]: tasks.map((task) =>
            task.id === taskId ? { ...task, ...updates, updatedAt: new Date() } : task
          ),
        },
      };
    }),

  deleteRenderTask: (projectId, taskId) =>
    set((state) => {
      const tasks = state.renderTasks[projectId] || [];
      return {
        renderTasks: {
          ...state.renderTasks,
          [projectId]: tasks.filter((task) => task.id !== taskId),
        },
      };
    }),

  setChecklistItems: (projectId, items) =>
    set((state) => ({
      checklistItems: { ...state.checklistItems, [projectId]: items },
    })),

  toggleChecklistItem: (projectId, itemId) =>
    set((state) => {
      const items = state.checklistItems[projectId] || [];
      return {
        checklistItems: {
          ...state.checklistItems,
          [projectId]: items.map((item) =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
          ),
        },
      };
    }),

  addChecklistItem: (projectId, item) =>
    set((state) => {
      const items = state.checklistItems[projectId] || [];
      return {
        checklistItems: {
          ...state.checklistItems,
          [projectId]: [...items, item],
        },
      };
    }),

  setBackupLocations: (projectId, locations) =>
    set((state) => ({
      backupLocations: { ...state.backupLocations, [projectId]: locations },
    })),

  updateBackupLocation: (projectId, locationId, updates) =>
    set((state) => {
      const locations = state.backupLocations[projectId] || [];
      return {
        backupLocations: {
          ...state.backupLocations,
          [projectId]: locations.map((location) =>
            location.id === locationId ? { ...location, ...updates, updatedAt: new Date() } : location
          ),
        },
      };
    }),

  setStorageQuota: (projectId, quota) =>
    set((state) => ({
      storageQuotas: { ...state.storageQuotas, [projectId]: quota },
    })),

  setRevisions: (projectId, revisions) =>
    set((state) => ({
      revisions: { ...state.revisions, [projectId]: revisions },
    })),

  getOverallProgress: (projectId) => {
    const state = get();
    const stages = state.editStages[projectId] || [];
    if (stages.length === 0) return 0;

    const completedStages = stages.filter((stage) => stage.status === 'complete').length;
    return Math.round((completedStages / stages.length) * 100);
  },

  setLoading: (loading) => set({ isLoading: loading }),
}));
