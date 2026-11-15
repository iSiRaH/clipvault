import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-sm bg-[#1F2937] border border-[#374151] rounded-xl shadow-2xl p-5 select-none animate-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
              isDestructive ? 'bg-[#EF4444]/15 text-[#EF4444]' : 'bg-[#06B6D4]/15 text-[#06B6D4]'
            }`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#F9FAFB]">{title}</h3>
            </div>
          </div>
          <button 
            onClick={onCancel}
            className="p-1 text-[#9CA3AF] hover:text-[#F9FAFB] rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#9CA3AF] mt-3 leading-relaxed">
          {description}
        </p>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 rounded-lg border border-[#374151] bg-[#111827] text-xs font-medium text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors ${
              isDestructive 
                ? 'bg-[#EF4444] hover:bg-[#DC2626]' 
                : 'bg-[#06B6D4] text-[#111827] hover:bg-[#0891B2]'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

