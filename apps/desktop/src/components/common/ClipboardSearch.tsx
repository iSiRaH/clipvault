import React from 'react';
import { Search, X } from 'lucide-react';

interface ClipboardSearchProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}

export const ClipboardSearch: React.FC<ClipboardSearchProps> = ({
  value,
  onChange,
  placeholder = 'Search clipboard history...',
  autoFocus = false,
  className = ''
}) => {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="w-4 h-4 absolute left-3 text-[#9CA3AF] pointer-events-none" />
      <input
        type="text"
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#1F2937] border border-[#374151] rounded-lg pl-9 pr-8 py-1.5 text-xs text-[#F9FAFB] placeholder-[#6B7280] focus:outline-none focus:border-[#06B6D4] transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2.5 p-0.5 text-[#9CA3AF] hover:text-[#F9FAFB] rounded"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

