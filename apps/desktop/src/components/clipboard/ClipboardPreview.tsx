import React, { useState } from 'react';
import { ClipboardItem } from '../../types';
import { ContentTypeIcon } from '../common/ContentTypeIcon';
import { 
  Pin, 
  Trash2, 
  Copy, 
  Check, 
  FolderArchive, 
  Info, 
  ExternalLink 
} from 'lucide-react';

interface ClipboardPreviewProps {
  item: ClipboardItem | null;
  onCopy: (item: ClipboardItem) => void;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ClipboardPreview: React.FC<ClipboardPreviewProps> = ({
  item,
  onCopy,
  onTogglePin,
  onDelete,
}) => {
  const [copied, setCopied] = useState(false);

  if (!item) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-[#9CA3AF] p-8 select-none">
        <Info className="w-8 h-8 mb-2 text-[#6B7280]" />
        <p className="text-xs">Select a clipboard entry to preview its content</p>
      </div>
    );
  }

  const handleCopy = () => {
    onCopy(item);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="flex-1 bg-[#182230] flex flex-col justify-between overflow-hidden">
      {/* Inspector Header */}
      <div className="p-4 border-b border-[#374151] flex items-center justify-between bg-[#1F2937]/50 select-none">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#06B6D4]/10 border border-[#06B6D4]/30 flex items-center justify-center text-[#06B6D4] flex-shrink-0">
            <ContentTypeIcon type={item.type} size="md" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-[#F9FAFB] truncate">
              {item.title || (item.type === 'image' ? 'Image Capture' : 'Clipboard Entry')}
            </h3>
            <div className="text-[11px] text-[#9CA3AF] flex items-center gap-2 mt-0.5">
              <span className="capitalize font-mono">{item.type}</span>
              <span>•</span>
              <span>Source: {item.sourceApp || 'System'}</span>
              <span>•</span>
              <span>{item.relativeTime}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => onTogglePin(item.id)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              item.isPinned
                ? 'bg-[#06B6D4]/10 border-[#06B6D4] text-[#06B6D4]'
                : 'bg-[#111827] border-[#374151] text-[#9CA3AF] hover:text-[#F9FAFB]'
            }`}
          >
            <Pin className={`w-3.5 h-3.5 ${item.isPinned ? 'fill-current' : ''}`} />
            <span>{item.isPinned ? 'Pinned' : 'Pin'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-[#06B6D4] text-[#111827] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#0891B2] transition-colors shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={() => onDelete(item.id)}
            className="p-1.5 rounded-lg bg-[#111827] border border-[#374151] text-[#9CA3AF] hover:text-[#EF4444] hover:border-[#EF4444]/40 transition-colors"
            title="Delete entry"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Inspector Body Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {item.type === 'image' ? (
          <div className="flex flex-col items-center justify-center p-6 bg-[#111827] border border-[#374151] rounded-xl">
            <img
              src={item.fullContent}
              alt="Clipboard full content"
              className="max-h-[380px] max-w-full rounded-lg shadow-lg object-contain"
            />
            <div className="mt-4 flex items-center gap-4 text-xs text-[#9CA3AF]">
              <span>Dimensions: {item.dimensions || '1920 × 1080'}</span>
              <span>•</span>
              <span>Size: {item.size || '1.4 MB'}</span>
              <span>•</span>
              <span>Format: PNG / WebP</span>
            </div>
          </div>
        ) : item.type === 'files' ? (
          <div className="bg-[#111827] border border-[#374151] rounded-xl p-4">
            <div className="flex items-center justify-between text-xs font-semibold text-[#9CA3AF] uppercase mb-3">
              <span>Files Collection ({item.fileCount || 3} items)</span>
              <span className="text-[10px] text-[#6B7280]">Total Size: {item.size || '142 KB'}</span>
            </div>
            <div className="space-y-1.5 font-mono text-xs text-[#F9FAFB]">
              {item.fullContent.split('\n').map((path, idx) => (
                <div key={idx} className="p-2 rounded bg-[#182230] border border-[#374151]/60 flex items-center gap-2 group">
                  <FolderArchive className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span className="truncate flex-1">{path}</span>
                  <ExternalLink className="w-3 h-3 text-[#6B7280] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-[#111827] border border-[#374151] rounded-xl p-4">
            <div className="flex items-center justify-between text-xs text-[#9CA3AF] mb-3 pb-2 border-b border-[#374151]">
              <span>Characters: {item.charCount || item.fullContent.length}</span>
              <span className="font-mono text-[10px]">{item.type === 'code' ? 'Code Snippet' : 'Plain Text'}</span>
            </div>
            <pre className="text-xs font-mono text-[#F9FAFB] whitespace-pre-wrap break-all leading-relaxed select-text font-normal">
              {item.fullContent}
            </pre>
          </div>
        )}
      </div>

      {/* Inspector Footer Meta */}
      <div className="p-3 border-t border-[#374151] bg-[#111827]/70 flex items-center justify-between text-[11px] text-[#6B7280] select-none">
        <span className="font-mono">Hash: sha256:{item.contentHash.slice(0, 16)}...</span>
        <span>Stored in local SQLite cache</span>
      </div>
    </div>
  );
};

