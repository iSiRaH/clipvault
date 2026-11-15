import React, { useState } from 'react';
import { ClipboardItem } from '../../types';
import { ContentTypeIcon } from '../common/ContentTypeIcon';
import { Pin, Trash2, Check, Copy } from 'lucide-react';

interface ClipboardItemCardProps {
  item: ClipboardItem;
  isSelected?: boolean;
  onSelect: () => void;
  onCopy: (item: ClipboardItem) => void;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
  density?: 'compact' | 'comfortable';
}

export const ClipboardItemCard: React.FC<ClipboardItemCardProps> = ({
  item,
  isSelected = false,
  onSelect,
  onCopy,
  onTogglePin,
  onDelete,
  density = 'compact'
}) => {
  const [justCopied, setJustCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCopy(item);
    setJustCopied(true);
    setTimeout(() => setJustCopied(false), 1200);
  };

  return (
    <div
      onClick={onSelect}
      onDoubleClick={handleCopy}
      className={`group relative rounded-lg border transition-all cursor-pointer flex gap-3 ${
        density === 'compact' ? 'p-2.5' : 'p-3.5'
      } ${
        isSelected
          ? 'bg-[#182230] border-[#06B6D4] shadow-md shadow-[#06B6D4]/5 ring-1 ring-[#06B6D4]/30'
          : 'bg-[#182230]/70 border-[#374151]/60 hover:bg-[#182230] hover:border-[#374151]'
      }`}
    >
      {/* Icon Badge */}
      <div className="flex-shrink-0 pt-0.5">
        <div className={`w-7 h-7 rounded-md flex items-center justify-center border ${
          item.type === 'image' ? 'bg-purple-950/40 border-purple-800/50' :
          item.type === 'files' ? 'bg-emerald-950/40 border-emerald-800/50' :
          item.type === 'code' ? 'bg-cyan-950/40 border-cyan-800/50' :
          'bg-[#1F2937] border-[#374151]'
        }`}>
          <ContentTypeIcon type={item.type} size="sm" />
        </div>
      </div>

      {/* Main Content Info */}
      <div className="flex-1 min-w-0 pr-14">
        <div className="flex items-center gap-1.5 mb-0.5">
          {item.title && (
            <span className="text-xs font-semibold text-[#F9FAFB] truncate max-w-[200px]">
              {item.title}
            </span>
          )}
          <span className="text-[10px] text-[#9CA3AF] capitalize font-mono">
            {item.type}
          </span>
          <span className="text-[#6B7280] text-[10px]">•</span>
          <span className="text-[10px] text-[#9CA3AF]">
            {item.relativeTime}
          </span>
          {item.sourceApp && (
            <>
              <span className="text-[#6B7280] text-[10px]">•</span>
              <span className="text-[10px] text-[#06B6D4]/80 font-medium">
                {item.sourceApp}
              </span>
            </>
          )}
        </div>

        {/* Preview Snippet */}
        {item.type === 'image' ? (
          <div className="mt-1 flex items-center gap-2">
            <img 
              src={item.preview} 
              alt="Thumbnail" 
              className="w-16 h-10 object-cover rounded border border-[#374151]"
            />
            <div className="text-[11px] text-[#9CA3AF]">
              <div>{item.dimensions || 'Image'}</div>
              <div className="text-[10px] text-[#6B7280]">{item.size || '1.4 MB'}</div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-[#9CA3AF] font-mono leading-relaxed line-clamp-2 break-all">
            {item.preview}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="absolute right-2 top-2.5 flex items-center gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin(item.id);
          }}
          title={item.isPinned ? 'Unpin' : 'Pin'}
          className={`p-1 rounded transition-colors ${
            item.isPinned
              ? 'text-[#06B6D4] hover:bg-[#06B6D4]/10'
              : 'text-[#6B7280] hover:text-[#F9FAFB] hover:bg-[#374151]'
          }`}
        >
          <Pin className={`w-3.5 h-3.5 ${item.isPinned ? 'fill-current' : ''}`} />
        </button>

        <button
          onClick={handleCopy}
          title="Copy to clipboard"
          className="p-1 rounded text-[#6B7280] hover:text-[#06B6D4] hover:bg-[#06B6D4]/10 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item.id);
          }}
          title="Delete item"
          className="p-1 rounded text-[#6B7280] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Copy Ripple Indicator */}
      {justCopied && (
        <div className="absolute inset-0 bg-[#22C55E]/15 border border-[#22C55E] rounded-lg flex items-center justify-center gap-1.5 backdrop-blur-[1px] animate-in fade-in duration-100">
          <Check className="w-4 h-4 text-[#22C55E]" />
          <span className="text-xs font-semibold text-[#22C55E]">Copied to clipboard</span>
        </div>
      )}
    </div>
  );
};

