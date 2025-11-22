import { CategoryId, Template } from './types';
import { 
  Calendar, CheckSquare, Target, Activity, DollarSign, 
  Palette, BookOpen, Plane, FileText, Clock, Layout 
} from 'lucide-react';

export const CATEGORIES = [
  { id: CategoryId.DAILY, name: 'يومي', nameEn: 'Daily', icon: <Clock size={20} /> },
  { id: CategoryId.WEEKLY, name: 'أسبوعي', nameEn: 'Weekly', icon: <Calendar size={20} /> },
  { id: CategoryId.MONTHLY, name: 'شهري', nameEn: 'Monthly', icon: <Layout size={20} /> },
  { id: CategoryId.GOALS, name: 'أهداف', nameEn: 'Goals', icon: <Target size={20} /> },
  { id: CategoryId.TODO, name: 'قوائم', nameEn: 'To-Do', icon: <CheckSquare size={20} /> },
  { id: CategoryId.HEALTH, name: 'صحة', nameEn: 'Health', icon: <Activity size={20} /> },
  { id: CategoryId.FINANCE, name: 'مالية', nameEn: 'Finance', icon: <DollarSign size={20} /> },
  { id: CategoryId.CREATIVE, name: 'إبداع', nameEn: 'Creative', icon: <Palette size={20} /> },
  { id: CategoryId.STUDENT, name: 'دراسة', nameEn: 'Student', icon: <BookOpen size={20} /> },
  { id: CategoryId.TRIPS, name: 'سفر', nameEn: 'Travel', icon: <Plane size={20} /> },
  { id: CategoryId.NOTES, name: 'ملاحظات', nameEn: 'Notes', icon: <FileText size={20} /> },
];

// Helper to generate dummy templates
const generateTemplates = (): Template[] => {
  const templates: Template[] = [];
  
  CATEGORIES.forEach((cat) => {
    // 5 Free Templates
    for (let i = 1; i <= 5; i++) {
      templates.push({
        id: `${cat.id}-free-${i}`,
        category: cat.id,
        name: `${cat.name} - نموذج أساسي ${i}`,
        nameEn: `${cat.nameEn} - Basic Template ${i}`,
        description: `قالب مجاني لتنظيم الـ ${cat.name} بشكل بسيط وفعال.`,
        descriptionEn: `Free template to organize your ${cat.nameEn} simply and effectively.`,
        isPremium: false,
        rating: '4.5',
        downloads: `${Math.floor(Math.random() * 50)}K`,
        icon: 'FileText',
        initialContent: `# ${cat.name} - نموذج ${i}\n\n- [ ] مهمة 1\n- [ ] مهمة 2\n\nملاحظات:\n`,
        initialContentEn: `# ${cat.nameEn} - Template ${i}\n\n- [ ] Task 1\n- [ ] Task 2\n\nNotes:\n`,
      });
    }
    // 7 Premium Templates
    for (let i = 1; i <= 7; i++) {
      templates.push({
        id: `${cat.id}-pro-${i}`,
        category: cat.id,
        name: `${cat.name} - نموذج احترافي ${i}`,
        nameEn: `${cat.nameEn} - Pro Template ${i}`,
        description: `قالب متقدم للأعضاء المميزين مع تحليل ومتابعة دقيقة.`,
        descriptionEn: `Advanced template for premium members with detailed tracking.`,
        isPremium: true,
        rating: '5.0',
        downloads: `${Math.floor(Math.random() * 10)}K`,
        icon: 'Star',
        initialContent: `# 💎 ${cat.name} احترافي\n\n## الأهداف الرئيسية\n1. \n2. \n\n## الجدول الزمني\n| الوقت | النشاط |\n|-------|--------|\n| 09:00 | |\n\n## التقييم\n`,
        initialContentEn: `# 💎 ${cat.nameEn} Professional\n\n## Main Goals\n1. \n2. \n\n## Schedule\n| Time | Activity |\n|-------|--------|\n| 09:00 | |\n\n## Evaluation\n`,
      });
    }
  });
  
  return templates;
};

export const ALL_TEMPLATES = generateTemplates();

export const STORAGE_KEYS = {
  SETTINGS: 'global_planner_settings',
  PAGES: 'global_planner_pages',
};