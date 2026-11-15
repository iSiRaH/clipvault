import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { ClipboardItem } from '../types';
import { ClipboardSearch } from './common/ClipboardSearch';
import { ClipboardFilters } from './common/ClipboardFilters';
import { ContentTypeIcon } from './common/ContentTypeIcon';
import { ConfirmationDialog } from './common/ConfirmationDialog';
import { 
  Sparkles, 
  Settings, 
  MoreVertical, 
  Trash2, 
  ExternalLink, 
  Pin, 
  Check 
} from 'lucide-react';

export const QuickPopup: React.FC = () => {
  const {
    items,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    copyItem,
    togglePin,
    deleteItem,
    clearHistory,
    setWindowMode,
    setActiveTab
  } = useAppStore();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Filter items
  const filteredItems = items.filter(item => {
    if (activeFilter === 'pinned' && !item.isPinned) return false;
    if (activeFilter === 'text' && item.type !== 'text' && item.type !== 'code' && item.type !== 'link') return false;
    if (activeFilter === 'image' && item.type !== 'image') return false;
    if (activeFilter === 'files' && item.type !== 'files') return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.preview.toLowerCase().includes(q) ||
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.sourceApp && item.sourceApp.toLowerCase().includes(q))
    );
  });

  // Keyboard navigation: Arrow keys, Enter to copy, Escape to dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, Math.max(0, filteredItems.length - 1)));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && filteredItems[selectedIndex]) {
        e.preventDefault();
        handleItemClick(filteredItems[selectedIndex]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredItems, selectedIndex]);

  const handleItemClick = (item: ClipboardItem) => {
    setCopiedId(item.id);
    copyItem(item);
    setTimeout(() => {
      setCopiedId(null);
    }, 1200);
  };

  const counts = {
    all: items.length,
    text: items.filter(i => i.type === 'text' || i.type === 'code' || i.type === 'link').length,
    image: items.filter(i => i.type === 'image').length,
    files: items.filter(i => i.type === 'files').length,
    pinned: items.filter(i => i.isPinned).length,
  };

  // Group items by Today, Yesterday, Earlier
  const groups = [
    { title: 'Today', list: filteredItems.filter(i => i.dateGroup === 'Today') },
    { title: 'Yesterday', list: filteredItems.filter(i => i.dateGroup === 'Yesterday') },
    { title: 'Earlier', list: filteredItems.filter(i => i.dateGroup === 'Earlier') },
  ].filter(g => g.list.length > 0);

  return (
    <div className="w-[480px] h-[580px] bg-[#111827] text-[#F9FAFB] flex flex-col rounded-xl border border-[#374151] shadow-2xl overflow-hidden select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#1F2937]/90 border-b border-[#374151]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#06B6D4]/15 border border-[#06B6D4]/40 flex items-center justify-center text-[#06B6D4]">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-sm tracking-wide">ClipVault</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#111827] border border-[#374151] text-[#9CA3AF]">
            Super + V
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => {
              setWindowMode('window');
              setActiveTab('settings');
            }}
            title="Settings"
            className="p-1.5 rounded-md hover:bg-[#374151] text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button 
            title="Options"
            className="p-1.5 rounded-md hover:bg-[#374151] text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Input Bar & Tabs */}
      <div className="p-3 bg-[#111827] space-y-2.5">
        <ClipboardSearch
          value={searchQuery}
          onChange={(q) => {
            setSearchQuery(q);
            setSelectedIndex(0);
          }}
          autoFocus
        />

        <ClipboardFilters
          activeFilter={activeFilter}
          onChange={(f) => {
            setActiveFilter(f);
            setSelectedIndex(0);
          }}
          counts={counts}
        />
      </div>

      {/* Scrollable Grouped Clipboard History */}
      <div className="flex-1 overflow-y-auto px-3 py-1 space-y-3">
        {groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-16 text-[#9CA3AF]">
            <div className="w-10 h-10 rounded-full bg-[#1F2937] flex items-center justify-center mb-2 text-[#6B7280]">
              <Sparkles className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-[#F9FAFB]">No clipboard items found</p>
            <p className="text-[11px] text-[#6B7280] mt-0.5">Try a different search query or filter</p>
          </div>
        ) : (
          groups.map(({ title, list }) => (
            <div key={title} className="space-y-1.5">
              <div className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider px-1">
                {title}
              </div>
              {list.map((item) => {
                const globalIndex = filteredItems.findIndex(i => i.id === item.id);
                const isSelected = globalIndex === selectedIndex;
                const isCopied = copiedId === item.id;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    onMouseEnter={() => setSelectedIndex(globalIndex)}
                    className={`group relative p-2.5 rounded-lg border transition-all cursor-pointer flex gap-3 ${
                      isSelected
                        ? 'bg-[#182230] border-[#06B6D4] shadow-md shadow-[#06B6D4]/5 ring-1 ring-[#06B6D4]/30'
                        : 'bg-[#182230]/70 border-[#374151]/60 hover:bg-[#182230] hover:border-[#374151]'
                    }`}
                  >
                    {/* Content-type icon */}
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

                    {/* Metadata & Preview */}
                    <div className="flex-1 min-w-0 pr-12">
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

                      {item.type === 'image' ? (
                        <div className="mt-1 flex items-center gap-2">
                          <img
                            src={item.preview}
                            alt="Preview"
                            className="w-14 h-9 object-cover rounded border border-[#374151]"
                          />
                          <div className="text-[11px] text-[#9CA3AF]">
                            <div>{item.dimensions || '1920 × 1080'}</div>
                            <div className="text-[10px] text-[#6B7280]">{item.size || '1.4 MB'}</div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-[#9CA3AF] font-mono leading-relaxed line-clamp-2 break-all">
                          {item.preview}
                        </p>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="absolute right-2 top-2.5 flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePin(item.id);
                        }}
                        title={item.isPinned ? "Unpin" : "Pin"}
                        className={`p-1 rounded transition-colors ${
                          item.isPinned
                            ? 'text-[#06B6D4] hover:bg-[#06B6D4]/10'
                            : 'text-[#6B7280] hover:text-[#F9FAFB] hover:bg-[#374151]'
                        }`}
                      >
                        <Pin className={`w-3.5 h-3.5 ${item.isPinned ? 'fill-current' : ''}`} />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteItem(item.id);
                        }}
                        title="Delete"
                        className="p-1 rounded text-[#6B7280] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Feedback copy toast */}
                    {isCopied && (
                      <div className="absolute inset-0 bg-[#22C55E]/15 border border-[#22C55E] rounded-lg flex items-center justify-center gap-1.5 backdrop-blur-[1px] animate-in fade-in duration-100">
                        <Check className="w-4 h-4 text-[#22C55E]" />
                        <span className="text-xs font-semibold text-[#22C55E]">Copied to clipboard</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-3.5 py-2.5 bg-[#1F2937]/90 border-t border-[#374151] flex items-center justify-between text-[11px]">
        <button
          onClick={() => setShowClearConfirm(true)}
          className="flex items-center gap-1 text-[#9CA3AF] hover:text-[#EF4444] transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear History</span>
        </button>

        <div className="flex items-center gap-2 text-[#6B7280]">
          <span className="flex items-center gap-0.5">
            <kbd className="px-1 py-0.5 bg-[#111827] border border-[#374151] rounded text-[9px] font-mono">↑↓</kbd> Navigate
          </span>
          <span className="flex items-center gap-0.5">
            <kbd className="px-1 py-0.5 bg-[#111827] border border-[#374151] rounded text-[9px] font-mono">⏎</kbd> Copy
          </span>
        </div>

        <button
          onClick={() => {
            setWindowMode('window');
            setActiveTab('overview');
          }}
          className="flex items-center gap-1 text-[#06B6D4] hover:underline font-medium"
        >
          <span>Open ClipVault</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* Clear History Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showClearConfirm}
        title="Clear Clipboard History"
        description="Are you sure you want to clear your entire clipboard history? Pinned items will be cleared as well."
        confirmLabel="Clear All"
        isDestructive
        onConfirm={() => {
          clearHistory();
          setShowClearConfirm(false);
        }}
        onCancel={() => setShowClearConfirm(false)}
      />
    </div>
  );
};
