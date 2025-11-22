import React from 'react';
import { Page } from '../types';
import { 
  Plus, FileText, Star, Crown, Moon, Sun, Trash2, 
  ChevronRight, ChevronLeft, LayoutDashboard, Languages, Home 
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  isPro: boolean;
  darkMode: boolean;
  language: 'ar' | 'en';
  pages: Page[];
  activePageId: string | null;
  onToggleSidebar: () => void;
  onNewPage: () => void;
  onSelectPage: (id: string) => void;
  onDeletePage: (id: string, e: React.MouseEvent) => void;
  onUpgrade: () => void;
  onToggleDarkMode: () => void;
  onToggleLanguage: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen, isPro, darkMode, language, pages, activePageId,
  onToggleSidebar, onNewPage, onSelectPage, onDeletePage, onUpgrade, onToggleDarkMode, onToggleLanguage
}) => {
  // Simple translation map for Sidebar
  const t = {
    ar: {
      title: 'Global Planner',
      premium: 'عضو مميز',
      free: 'نسخة مجانية',
      dashboard: 'الرئيسية',
      savedPages: 'صفحاتي',
      noPages: 'لا توجد صفحات محفوظة',
      untitled: 'بدون عنوان',
      upgrade: 'ترقية للعضوية المميزة',
      lightMode: 'الوضع النهاري',
      darkMode: 'الوضع الليلي',
      switchLang: 'English'
    },
    en: {
      title: 'Global Planner',
      premium: 'Premium Member',
      free: 'Free Version',
      dashboard: 'Dashboard',
      savedPages: 'My Pages',
      noPages: 'No saved pages',
      untitled: 'Untitled',
      upgrade: 'Upgrade to Premium',
      lightMode: 'Light Mode',
      darkMode: 'Dark Mode',
      switchLang: 'العربية'
    }
  }[language];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={onToggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 ${language === 'ar' ? 'right-0 border-l' : 'left-0 border-r'} h-full w-80 bg-white dark:bg-dark shadow-2xl z-40
        transform transition-transform duration-300 ease-in-out flex flex-col border-gray-100 dark:border-gray-800
        ${isOpen ? 'translate-x-0' : (language === 'ar' ? 'translate-x-full' : '-translate-x-full')}
        md:translate-x-0 md:relative md:w-72 lg:w-80
      `}>
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between transition-colors duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white shadow-lg">
              <LayoutDashboard size={20} />
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-800 dark:text-white">{t.title}</h1>
              <div className="flex items-center gap-1 text-xs font-medium">
                {isPro ? (
                  <span className="text-amber-500 flex items-center gap-1">
                    <Crown size={12} fill="currentColor" /> {t.premium}
                  </span>
                ) : (
                  <span className="text-gray-400 dark:text-gray-500">{t.free}</span>
                )}
              </div>
            </div>
          </div>
          <button onClick={onToggleSidebar} className="md:hidden text-gray-500 hover:text-primary">
            {language === 'ar' ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
          </button>
        </div>

        {/* Navigation & Pages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1 no-scrollbar">
          
          {/* Dashboard / Home Link */}
          <div 
            onClick={onNewPage}
            className={`
              group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all mb-6
              ${!activePageId 
                ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}
            `}
          >
            <Home size={20} />
            <span className="font-bold text-sm">{t.dashboard}</span>
            {!activePageId && (
               <div className={`absolute w-1 h-6 bg-white/20 rounded-full ${language === 'ar' ? 'left-2' : 'right-2'}`} />
            )}
          </div>

          {/* Pages Section Header */}
          <div className="flex items-center justify-between px-2 mb-2">
            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{t.savedPages}</h3>
            <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 py-0.5 px-2 rounded-full">
              {pages.length}
            </span>
          </div>

          {/* Pages List */}
          {pages.length === 0 ? (
            <div className="text-center py-8 text-gray-400 dark:text-gray-600 transition-colors duration-300 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl mx-2">
              <FileText size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-xs">{t.noPages}</p>
            </div>
          ) : (
            <div className="space-y-1">
              {pages.map(page => (
                <div 
                  key={page.id}
                  onClick={() => onSelectPage(page.id)}
                  className={`
                    group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors
                    ${activePageId === page.id 
                      ? 'bg-gray-100 dark:bg-gray-800 text-primary dark:text-white font-medium' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'}
                  `}
                >
                  <div className="flex items-center gap-3 truncate flex-1">
                    <FileText size={18} className={activePageId === page.id ? 'text-primary' : 'text-gray-300 dark:text-gray-600'} />
                    <span className="text-sm truncate">{page.title || t.untitled}</span>
                  </div>
                  <button 
                    onClick={(e) => onDeletePage(page.id, e)}
                    className="opacity-100 md:opacity-0 md:group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-2 bg-gray-50/50 dark:bg-dark transition-colors duration-300">
          {!isPro && (
            <button 
              onClick={onUpgrade}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm font-bold mb-3"
            >
              <Star size={16} fill="currentColor" />
              {t.upgrade}
            </button>
          )}
          
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={onToggleDarkMode}
              className="py-2.5 px-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-300"
              title={darkMode ? t.lightMode : t.darkMode}
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              <span className="hidden sm:inline">{darkMode ? t.lightMode : t.darkMode}</span>
            </button>

            <button 
              onClick={onToggleLanguage}
              className="py-2.5 px-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-300"
            >
              <Languages size={16} />
              {t.switchLang}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};