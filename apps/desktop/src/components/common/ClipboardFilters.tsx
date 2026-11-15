import React from 'react';
import { FilterType } from '../../types';
import { Pin } from 'lucide-react';

interface ClipboardFiltersProps {
  activeFilter: FilterType;
  onChange: (filter: FilterType) => void;
  counts?: {
    all?: number;
    text?: number;
    image?: number;
    files?: number;
    pinned?: number;
  };
  className?: string;
}

export const ClipboardFilters: React.FC<ClipboardFiltersProps> = ({
  activeFilter,
  onChange,
  counts,
  className = ''
}) => {
  const tabs: { id: FilterType; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'text', label: 'Text' },
    { id: 'image', label: 'Images' },
    { id: 'files', label: 'Files' },
    { id: 'pinned', label: 'Pinned' },
  ];

  return (
    <div className={`flex items-center gap-1.5 overflow-x-auto text-[11px] font-medium ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeFilter === tab.id;
        const count = counts?.[tab.id];

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-2.5 py-1 rounded-md transition-all whitespace-nowrap flex items-center gap-1 ${
              isActive
                ? 'bg-[#06B6D4] text-[#111827] font-semibold shadow-sm'
                : 'bg-[#182230] text-[#9CA3AF] hover:bg-[#1F2937] hover:text-[#F9FAFB]'
            }`}
          >
            {tab.id === 'pinned' && <Pin className="w-3 h-3 fill-current" />}
            <span>{tab.label}</span>
            {count !== undefined && (
              <span className={`text-[10px] ml-0.5 opacity-80 ${isActive ? 'text-[#111827]' : 'text-[#6B7280]'}`}>
                ({count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

