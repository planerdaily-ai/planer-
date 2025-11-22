export interface Template {
  id: string;
  name: string;
  nameEn: string;
  category: string;
  icon: string; // Lucide icon name
  description: string;
  descriptionEn: string;
  isPremium: boolean;
  rating: string;
  downloads: string;
  initialContent: string;
  initialContentEn: string;
}

export interface Page {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: number;
  updatedAt: number;
  templateId: string;
}

export interface AppState {
  currentView: 'templates' | 'editor';
  selectedCategory: string;
  searchQuery: string;
  pages: Page[];
  activePageId: string | null;
  isPro: boolean;
  darkMode: boolean;
  language: 'ar' | 'en';
  isSidebarOpen: boolean;
  isLoading: boolean;
  aiPrompt: string;
  aiResponse: string | null;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export type ToastContextType = {
  showToast: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
};

export enum CategoryId {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  GOALS = 'goals',
  TODO = 'todo',
  HEALTH = 'health',
  FINANCE = 'finance',
  CREATIVE = 'creative',
  STUDENT = 'student',
  TRIPS = 'trips',
  NOTES = 'notes',
}