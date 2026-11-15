import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  actionText,
  onAction
}) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center select-none">
      <div className="w-12 h-12 rounded-full bg-[#1F2937] border border-[#374151] flex items-center justify-center mb-3 text-[#6B7280]">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold text-[#F9FAFB]">{title}</h3>
      <p className="text-xs text-[#9CA3AF] max-w-xs mt-1 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-3 py-1.5 rounded-lg bg-[#06B6D4] text-[#111827] text-xs font-semibold hover:bg-[#0891B2] transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

