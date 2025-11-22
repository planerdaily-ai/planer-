import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { AppState, Page, Template, ToastMessage } from './types';
import { ALL_TEMPLATES, STORAGE_KEYS, CATEGORIES } from './constants';
import { Sidebar } from './components/Sidebar';
import { CategoryNav } from './components/CategoryNav';
import { Editor } from './components/Editor';
import { ToastContainer } from './components/ToastContainer';
import { 
  Search, Menu, Crown, Star, Download, Languages, Info 
} from 'lucide-react';

// Helper to generate ID
const generateId = () => Math.random().toString(36).substr(2, 9);

const App = () => {
  // --- State ---
  // Initialize state lazily to avoid overwriting localStorage with defaults on first render
  const [state, setState] = useState<AppState>(() => {
    const defaultState: AppState = {
      currentView: 'templates',
      selectedCategory: 'all',
      searchQuery: '',
      pages: [],
      activePageId: null,
      isPro: false,
      darkMode: false,
      language: 'ar',
      isSidebarOpen: typeof window !== 'undefined' ? window.innerWidth > 1024 : true,
      isLoading: false,
      aiPrompt: '',
      aiResponse: null,
    };

    try {
      // Load saved pages
      const savedPages = localStorage.getItem(STORAGE_KEYS.PAGES);
      if (savedPages) {
        defaultState.pages = JSON.parse(savedPages);
      }

      // Load saved settings
      const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (savedSettings) {
        const { isPro, darkMode, language } = JSON.parse(savedSettings);
        defaultState.isPro = isPro;
        defaultState.darkMode = darkMode;
        defaultState.language = language || 'ar';
      } else {
        // Fallback to system preference if no settings found
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          defaultState.darkMode = true;
        }
      }
    } catch (error) {
      console.error('Failed to load state from localStorage', error);
    }

    return defaultState;
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showLanguageConfirm, setShowLanguageConfirm] = useState(false);

  // --- Persistence & Effects ---

  // Save Pages changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify(state.pages));
  }, [state.pages]);

  // Save Settings & Apply Theme/Language changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({
      isPro: state.isPro,
      darkMode: state.darkMode,
      language: state.language
    }));
    
    // Handle Dark Mode
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Handle Language Direction
    document.documentElement.dir = state.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = state.language;
  }, [state.isPro, state.darkMode, state.language]);

  // --- Handlers ---

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    const id = generateId();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleSelectTemplate = (template: Template) => {
    if (template.isPremium && !state.isPro) {
      showToast(
        state.language === 'ar' 
          ? '⭐ هذا القالب حصري للأعضاء المميزين! قم بالترقية الآن.' 
          : '⭐ This template is for Premium members only! Upgrade now.', 
        'warning'
      );
      setShowUpgradeModal(true);
      return;
    }

    const isAr = state.language === 'ar';
    const newPage: Page = {
      id: generateId(),
      title: isAr ? template.name : template.nameEn,
      content: isAr ? template.initialContent : (template.initialContentEn || template.initialContent),
      category: template.category,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      templateId: template.id
    };

    setState(prev => ({
      ...prev,
      pages: [newPage, ...prev.pages],
      activePageId: newPage.id,
      currentView: 'editor'
    }));
  };

  const handleSavePage = (title: string, content: string) => {
    if (!state.activePageId) return;

    setState(prev => ({
      ...prev,
      pages: prev.pages.map(p => 
        p.id === prev.activePageId 
          ? { ...p, title, content, updatedAt: Date.now() } 
          : p
      )
    }));
    showToast(
      state.language === 'ar' ? 'تم حفظ التغييرات بنجاح' : 'Changes saved successfully', 
      'success'
    );
  };

  const handleDeletePage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmMsg = state.language === 'ar' 
      ? 'هل أنت متأكد من حذف هذه الصفحة؟ لا يمكن التراجع عن هذا الإجراء.'
      : 'Are you sure you want to delete this page? This action cannot be undone.';
      
    if (confirm(confirmMsg)) {
      setState(prev => {
        const newPages = prev.pages.filter(p => p.id !== id);
        return {
          ...prev,
          pages: newPages,
          activePageId: prev.activePageId === id ? null : prev.activePageId,
          currentView: prev.activePageId === id ? 'templates' : prev.currentView
        };
      });
      showToast(
        state.language === 'ar' ? 'تم حذف الصفحة' : 'Page deleted', 
        'info'
      );
    }
  };

  const handleUpgrade = () => {
    setState(prev => ({ ...prev, isPro: true }));
    setShowUpgradeModal(false);
    showToast(
      state.language === 'ar' ? '🎉 مبروك! تم تفعيل العضوية المميزة بنجاح.' : '🎉 Congratulations! Premium activated.', 
      'success'
    );
  };

  const handleToggleLanguage = () => {
    setShowLanguageConfirm(true);
  };

  const confirmLanguageToggle = () => {
    setState(prev => ({ ...prev, language: prev.language === 'ar' ? 'en' : 'ar' }));
    setShowLanguageConfirm(false);
  };

  const handleToggleDarkMode = () => {
    setState(prev => {
      const newMode = !prev.darkMode;
      showToast(
        prev.language === 'ar' 
          ? (newMode ? 'تم تفعيل الوضع الليلي 🌙' : 'تم تفعيل الوضع النهاري ☀️') 
          : (newMode ? 'Dark mode activated 🌙' : 'Light mode activated ☀️'),
        'info'
      );
      return { ...prev, darkMode: newMode };
    });
  };

  // --- Filtered Templates ---
  const filteredTemplates = ALL_TEMPLATES.filter(t => {
    const matchesCategory = state.selectedCategory === 'all' || t.category === state.selectedCategory;
    // Search in both languages
    const matchesSearch = 
      t.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      t.nameEn.toLowerCase().includes(state.searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const t = {
    ar: {
      searchPlaceholder: "بحث في القوالب...",
      chooseTemplate: 'اختر نموذجاً للبدء',
      chooseDesc: `أكثر من ${ALL_TEMPLATES.length} قالب جاهز لمساعدتك في التخطيط لحياتك`,
      noTemplates: 'لا توجد قوالب مطابقة لبحثك',
      viewAll: 'عرض الكل',
      premium: 'PREMIUM'
    },
    en: {
      searchPlaceholder: "Search templates...",
      chooseTemplate: 'Choose a template to start',
      chooseDesc: `Over ${ALL_TEMPLATES.length} ready-made templates to help you plan your life`,
      noTemplates: 'No templates match your search',
      viewAll: 'View All',
      premium: 'PREMIUM'
    }
  }[state.language];

  return (
    <div className="flex h-screen bg-bg dark:bg-dark text-slate-800 dark:text-gray-100 overflow-hidden transition-colors duration-300">
      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl max-w-md w-full text-center border border-gray-100 dark:border-gray-700 transform scale-100 transition-transform">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-300 to-orange-500 rounded-full mx-auto flex items-center justify-center mb-6 shadow-lg shadow-orange-500/30">
              <Crown size={40} className="text-white" fill="currentColor" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
              {state.language === 'ar' ? 'ترقية للعضوية المميزة' : 'Upgrade to Premium'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
              {state.language === 'ar' 
                ? 'احصل على وصول غير محدود لجميع القوالب الاحترافية، أدوات الذكاء الاصطناعي المتقدمة، وأولوية الدعم الفني.'
                : 'Get unlimited access to all professional templates, advanced AI tools, and priority support.'}
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-600 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:text-gray-300"
              >
                {state.language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button 
                onClick={handleUpgrade}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-600 text-white font-bold shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all transform hover:-translate-y-1"
              >
                {state.language === 'ar' ? 'ترقية الآن مجاناً' : 'Upgrade Free'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Language Confirmation Modal */}
      {showLanguageConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center border border-gray-100 dark:border-gray-700 transform scale-100 transition-transform">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mx-auto flex items-center justify-center mb-4 text-primary">
              <Languages size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
              {state.language === 'ar' ? 'تغيير اللغة' : 'Change Language'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {state.language === 'ar' 
                ? 'هل أنت متأكد؟ سيتم تغيير اتجاه الواجهة.'
                : 'Are you sure? The interface layout will be flipped.'}
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowLanguageConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:text-gray-300"
              >
                {state.language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button 
                onClick={confirmLanguageToggle}
                className="flex-1 py-2.5 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all"
              >
                {state.language === 'ar' ? 'تأكيد' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <Sidebar 
        isOpen={state.isSidebarOpen}
        isPro={state.isPro}
        darkMode={state.darkMode}
        language={state.language}
        pages={state.pages}
        activePageId={state.activePageId}
        onToggleSidebar={() => setState(prev => ({ ...prev, isSidebarOpen: !prev.isSidebarOpen }))}
        onNewPage={() => setState(prev => ({ ...prev, currentView: 'templates', activePageId: null }))}
        onSelectPage={(id) => setState(prev => ({ ...prev, currentView: 'editor', activePageId: id }))}
        onDeletePage={handleDeletePage}
        onUpgrade={() => setShowUpgradeModal(true)}
        onToggleDarkMode={handleToggleDarkMode}
        onToggleLanguage={handleToggleLanguage}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative w-full transition-all duration-300">
        {/* Top Bar */}
        <header className="h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-4 z-20 shrink-0 transition-colors duration-300">
          <div className="flex items-center gap-3 md:hidden">
            <button 
              onClick={() => setState(prev => ({ ...prev, isSidebarOpen: !prev.isSidebarOpen }))}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg dark:text-gray-300"
            >
              <Menu size={24} />
            </button>
          </div>

          {state.currentView === 'templates' && (
            <div className="flex-1 max-w-xl mx-auto relative px-4">
              <Search className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${state.language === 'ar' ? 'right-7' : 'left-7'}`} size={18} />
              <input 
                type="text"
                value={state.searchQuery}
                onChange={(e) => setState(prev => ({ ...prev, searchQuery: e.target.value }))}
                placeholder={t.searchPlaceholder}
                className={`w-full py-2.5 bg-gray-100 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary/50 text-sm transition-shadow dark:text-white ${state.language === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
              />
            </div>
          )}
        </header>

        {state.currentView === 'editor' ? (
          <Editor 
            page={state.pages.find(p => p.id === state.activePageId) || null}
            isNew={!state.pages.find(p => p.id === state.activePageId)}
            language={state.language}
            onSave={handleSavePage}
            onBack={() => setState(prev => ({ ...prev, currentView: 'templates', activePageId: null }))}
            showToast={showToast}
          />
        ) : (
          <div className="flex-1 overflow-y-auto overflow-x-hidden bg-bg dark:bg-dark transition-colors duration-300">
            <div className="sticky top-0 z-10 bg-bg dark:bg-dark pt-4 pb-2 transition-colors duration-300">
              <CategoryNav 
                selectedCategory={state.selectedCategory} 
                language={state.language}
                onSelectCategory={(id) => setState(prev => ({ ...prev, selectedCategory: id }))}
              />
            </div>

            <div className="p-4 md:p-8">
              <div className="mb-8 animate-fade-in">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
                  {t.chooseTemplate}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  {t.chooseDesc}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                {filteredTemplates.map((template) => {
                  const category = CATEGORIES.find(c => c.id === template.category);
                  const categoryName = state.language === 'ar' ? category?.name : category?.nameEn;
                  const description = state.language === 'ar' ? template.description : template.descriptionEn;

                  return (
                  <div 
                    key={template.id}
                    onClick={() => handleSelectTemplate(template)}
                    className={`
                      group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 cursor-pointer
                      hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-300
                      ${template.isPremium && !state.isPro ? 'opacity-90' : ''}
                    `}
                  >
                    {template.isPremium && (
                      <div className={`absolute top-4 bg-gradient-to-r from-amber-300 to-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md z-10 ${state.language === 'ar' ? 'left-4' : 'right-4'}`}>
                        <Star size={10} fill="currentColor" />
                        {t.premium}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300 shrink-0">
                           {category?.icon}
                        </div>
                        <div className="flex flex-col items-start">
                           <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
                             {categoryName}
                           </span>
                           
                           {/* Info Button with Tooltip */}
                           <div className="relative group/info z-20">
                              <button 
                                type="button"
                                onClick={(e) => { e.stopPropagation(); }}
                                className="flex items-center gap-1 text-xs text-primary hover:underline bg-primary/5 hover:bg-primary/10 px-2 py-0.5 rounded-full transition-colors"
                              >
                                <Info size={10} />
                                <span>{state.language === 'ar' ? 'تفاصيل' : 'More Info'}</span>
                              </button>
                              
                              {/* Tooltip */}
                              <div className={`
                                absolute bottom-full mb-2 w-52 bg-gray-900/95 backdrop-blur-sm text-white text-xs p-3 rounded-xl shadow-xl
                                opacity-0 group-hover/info:opacity-100 pointer-events-none group-hover/info:pointer-events-auto transition-all duration-200
                                ${state.language === 'ar' ? '-right-2' : '-left-2'} transform translate-y-2 group-hover/info:translate-y-0
                                z-30
                              `}>
                                <p className="leading-relaxed">{description}</p>
                                <div className={`absolute top-full ${state.language === 'ar' ? 'right-4' : 'left-4'} -mt-0.5 border-4 border-transparent border-t-gray-900/95`} />
                              </div>
                           </div>
                        </div>
                      </div>
                    </div>

                    <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-2 line-clamp-1">
                      {state.language === 'ar' ? template.name : template.nameEn}
                    </h3>
                    
                    <p className="text-sm text-gray-400 dark:text-gray-500 line-clamp-1 mb-4 h-6 opacity-60">
                      {description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-4 transition-colors duration-300">
                      <div className="flex items-center gap-1">
                        <Star size={12} className="text-amber-400" fill="currentColor" />
                        <span>{template.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download size={12} />
                        <span>{template.downloads}</span>
                      </div>
                    </div>
                  </div>
                );})}
              </div>

              {filteredTemplates.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-xl text-gray-400">
                    {t.noTemplates}
                  </p>
                  <button 
                    onClick={() => setState(prev => ({ ...prev, searchQuery: '', selectedCategory: 'all' }))}
                    className="mt-4 text-primary font-bold hover:underline"
                  >
                    {t.viewAll}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;

// Mount
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}