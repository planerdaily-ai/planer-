import React from 'react';
import { ToastMessage } from '../types';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';

interface ToastContainerProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-3 w-full max-w-md px-4 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-lg text-white
            transform transition-all duration-300 ease-in-out animate-fade-in
            ${toast.type === 'success' ? 'bg-emerald-500' : ''}
            ${toast.type === 'error' ? 'bg-rose-500' : ''}
            ${toast.type === 'warning' ? 'bg-amber-500' : ''}
            ${toast.type === 'info' ? 'bg-blue-500' : ''}
          `}
        >
          <div className="flex items-center gap-3">
            {toast.type === 'success' && <CheckCircle size={20} />}
            {toast.type === 'error' && <AlertCircle size={20} />}
            {toast.type === 'warning' && <AlertTriangle size={20} />}
            {toast.type === 'info' && <Info size={20} />}
            <p className="font-semibold text-sm">{toast.message}</p>
          </div>
          <button 
            onClick={() => removeToast(toast.id)} 
            className="hover:bg-white/20 p-1 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  );
};