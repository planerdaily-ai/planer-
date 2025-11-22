import React, { useState } from 'react';
import { Page } from '../types';
import { generatePlanContent } from '../services/geminiService';
import { 
  ArrowRight, Save, Wand2, Loader2, Calendar, 
  AlignLeft, Type, Download, CheckCircle2, ArrowLeft
} from 'lucide-react';

interface EditorProps {
  page: Page | null;
  isNew: boolean;
  language: 'ar' | 'en';
  onSave: (title: string, content: string) => void;
  onBack: () => void;
  showToast: (msg: string, type: any) => void;
}

export const Editor: React.FC<EditorProps> = ({ page, isNew, language, onSave, onBack, showToast }) => {
  const [title, setTitle] = useState(page?.title || '');
  const [content, setContent] = useState(page?.content || '');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const t = {
    ar: {
      editor: 'المحرر',
      new: 'إنشاء جديد',
      edit: 'تعديل',
      save: 'حفظ التغييرات',
      titlePlaceholder: 'عنوان الصفحة...',
      contentPlaceholder: 'اكتب خطتك هنا أو استخدم الذكاء الاصطناعي...',
      aiTitle: 'مساعد الذكاء الاصطناعي',
      aiDesc: 'اطلب من Gemini إنشاء خطة لرحلة، جدول مذاكرة، أو قائمة مهام. سيقوم بكتابة الهيكل الكامل لك.',
      whatToPlan: 'ماذا تريد أن تخطط؟',
      promptPlaceholder: 'مثال: خطة لتعلم البرمجة في 3 أشهر...',
      generating: 'جاري التفكير...',
      generate: 'إنشاء بالذكاء الاصطناعي',
      poweredBy: 'مدعوم بواسطة',
      toastEmpty: 'الرجاء كتابة وصف لما تريد التخطيط له',
      toastSuccess: 'تم إنشاء الخطة بنجاح بواسطة الذكاء الاصطناعي',
      toastError: 'حدث خطأ أثناء الاتصال بالذكاء الاصطناعي',
      autoTitle: 'خطة: '
    },
    en: {
      editor: 'Editor',
      new: 'Create New',
      edit: 'Edit',
      save: 'Save Changes',
      titlePlaceholder: 'Page Title...',
      contentPlaceholder: 'Write your plan here or use AI...',
      aiTitle: 'AI Assistant',
      aiDesc: 'Ask Gemini to create a travel plan, study schedule, or to-do list. It will write the full structure for you.',
      whatToPlan: 'What do you want to plan?',
      promptPlaceholder: 'Example: 3-month coding study plan...',
      generating: 'Thinking...',
      generate: 'Generate with AI',
      poweredBy: 'Powered by',
      toastEmpty: 'Please describe what you want to plan',
      toastSuccess: 'Plan generated successfully by AI',
      toastError: 'Error connecting to AI',
      autoTitle: 'Plan: '
    }
  }[language];

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) {
      showToast(t.toastEmpty, 'warning');
      return;
    }

    setIsGenerating(true);
    try {
      const generatedContent = await generatePlanContent(aiPrompt, page?.category || 'General');
      
      // Use functional update to append if desired, or replace. Here we append with a separator.
      const newContent = content 
        ? content + '\n\n---\n\n' + generatedContent 
        : generatedContent;
        
      setContent(newContent);
      
      if (!title) {
        setTitle(`${t.autoTitle}${aiPrompt}`);
      }
      
      showToast(t.toastSuccess, 'success');
    } catch (err) {
      showToast(t.toastError, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-bg dark:bg-dark overflow-hidden animate-slide-up">
      {/* Editor Toolbar */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between shadow-sm z-20 transition-colors duration-300">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500 transition-colors"
          >
            {language === 'ar' ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
          </button>
          <div className="h-6 w-[1px] bg-gray-200 dark:bg-gray-700 mx-2 hidden md:block" />
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">{t.editor}</span>
            <span className="text-xs text-primary font-bold">{isNew ? t.new : t.edit}</span>
          </div>
        </div>

        <button 
          onClick={() => onSave(title, content)}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all font-bold active:scale-95"
        >
          <Save size={18} />
          <span>{t.save}</span>
        </button>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
        
        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative transition-colors duration-300">
          <div className="flex-1 overflow-y-auto p-6 md:p-10 max-w-4xl mx-auto w-full">
            
            {/* Title Input */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.titlePlaceholder}
              className="w-full text-3xl md:text-4xl font-bold bg-transparent border-none focus:ring-0 placeholder-gray-300 dark:placeholder-gray-700 text-gray-800 dark:text-gray-100 mb-6 px-0 transition-colors duration-300"
            />

            {/* Editor Textarea */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t.contentPlaceholder}
              className="w-full h-[calc(100%-100px)] resize-none bg-transparent border-none focus:ring-0 text-lg leading-relaxed text-gray-700 dark:text-gray-300 placeholder-gray-300 dark:placeholder-gray-700 font-light p-0 transition-colors duration-300"
            />
          </div>
        </div>

        {/* AI Sidebar / Drawer */}
        <div className="w-full md:w-80 bg-white dark:bg-gray-900 border-t md:border-t-0 md:border-r md:border-l border-gray-200 dark:border-gray-800 p-6 flex flex-col shadow-xl z-10 transition-colors duration-300">
          <div className="flex items-center gap-2 mb-6 text-primary">
            <Wand2 size={20} />
            <h3 className="font-bold">{t.aiTitle}</h3>
          </div>

          <div className="space-y-4 mb-6">
             <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 transition-colors duration-300">
               <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                 {t.aiDesc}
               </p>
             </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold text-gray-500 uppercase">{t.whatToPlan}</label>
            <textarea 
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="w-full h-32 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none text-sm"
              placeholder={t.promptPlaceholder}
            />
            <button 
              onClick={handleAiGenerate}
              disabled={isGenerating}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-secondary to-purple-600 text-white font-bold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {t.generating}
                </>
              ) : (
                <>
                  <Wand2 size={18} />
                  {t.generate}
                </>
              )}
            </button>
          </div>

          <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between text-xs text-gray-400">
               <span>{t.poweredBy}</span>
               <span className="font-bold text-gray-500">Gemini 2.5 Flash</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};