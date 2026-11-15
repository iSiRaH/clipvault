import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { FilterType, SortOrder } from '../types';
import { ClipboardSearch } from './common/ClipboardSearch';
import { ClipboardFilters } from './common/ClipboardFilters';
import { ClipboardList } from './clipboard/ClipboardList';
import { ClipboardPreview } from './clipboard/ClipboardPreview';

interface ClipboardHistoryProps {
  filterTypeOverride?: FilterType;
}

export const ClipboardHistory: React.FC<ClipboardHistoryProps> = ({
  filterTypeOverride
}) => {
  const {
    items,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    sortOrder,
    setSortOrder,
    selectedItemId,
    setSelectedItemId,
    copyItem,
    togglePin,
    deleteItem,
  } = useAppStore();

  const currentFilter = filterTypeOverride || activeFilter;

  // Filter items
  const filtered = items.filter(item => {
    if (currentFilter === 'pinned' && !item.isPinned) return false;
    if (currentFilter !== 'all' && currentFilter !== 'pinned') {
      if (currentFilter === 'text' && item.type !== 'text' && item.type !== 'code' && item.type !== 'link') return false;
      if (currentFilter === 'image' && item.type !== 'image') return false;
      if (currentFilter === 'files' && item.type !== 'files') return false;
    }

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.preview.toLowerCase().includes(q) ||
      (item.title && item.title.toLowerCase().includes(q)) ||
      item.fullContent.toLowerCase().includes(q)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
  });

  const selectedItem = items.find(i => i.id === selectedItemId) || sorted[0] || null;

  const counts = {
    all: items.length,
    text: items.filter(i => i.type === 'text' || i.type === 'code' || i.type === 'link').length,
    image: items.filter(i => i.type === 'image').length,
    files: items.filter(i => i.type === 'files').length,
    pinned: items.filter(i => i.isPinned).length,
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Center 2nd Pane: History List */}
      <div className="w-[420px] border-r border-[#374151] flex flex-col bg-[#111827]">
        {/* Search & Sort Controls */}
        <div className="p-3 border-b border-[#374151] space-y-2.5">
          <ClipboardSearch
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search clipboard history..."
          />

          {!filterTypeOverride && (
            <ClipboardFilters
              activeFilter={activeFilter}
              onChange={setActiveFilter}
              counts={counts}
            />
          )}

          <div className="flex items-center justify-between text-xs text-[#9CA3AF] pt-0.5">
            <span>{sorted.length} {sorted.length === 1 ? 'item' : 'items'} found</span>
            <div className="flex items-center gap-1.5">
              <span>Sort:</span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                className="bg-[#1F2937] border border-[#374151] rounded px-2 py-0.5 text-xs text-[#F9FAFB] focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </div>
          </div>
        </div>

        {/* Scrollable list */}
        <ClipboardList
          items={sorted}
          selectedItemId={selectedItem?.id || null}
          onSelect={setSelectedItemId}
          onCopy={copyItem}
          onTogglePin={togglePin}
          onDelete={deleteItem}
        />
      </div>

      {/* Right 3rd Pane: Inspector Preview */}
      <ClipboardPreview
        item={selectedItem}
        onCopy={copyItem}
        onTogglePin={togglePin}
        onDelete={deleteItem}
      />
    </div>
  );
};
