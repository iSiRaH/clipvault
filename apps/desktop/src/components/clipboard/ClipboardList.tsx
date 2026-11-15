import React from 'react';
import { ClipboardItem } from '../../types';
import { ClipboardItemCard } from './ClipboardItemCard';
import { EmptyState } from '../common/EmptyState';
import { Inbox } from 'lucide-react';

interface ClipboardListProps {
  items: ClipboardItem[];
  selectedItemId: string | null;
  onSelect: (id: string) => void;
  onCopy: (item: ClipboardItem) => void;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
  groupByDate?: boolean;
}

export const ClipboardList: React.FC<ClipboardListProps> = ({
  items,
  selectedItemId,
  onSelect,
  onCopy,
  onTogglePin,
  onDelete,
  groupByDate = false
}) => {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="No clipboard items"
        description="Copied text, images, and files will appear here automatically."
      />
    );
  }

  if (!groupByDate) {
    return (
      <div className="space-y-1.5 p-2 overflow-y-auto flex-1">
        {items.map((item) => (
          <ClipboardItemCard
            key={item.id}
            item={item}
            isSelected={item.id === selectedItemId}
            onSelect={() => onSelect(item.id)}
            onCopy={onCopy}
            onTogglePin={onTogglePin}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  }

  // Group items by Today, Yesterday, Earlier
  const groups: { [key: string]: ClipboardItem[] } = {
    Today: items.filter(i => i.dateGroup === 'Today'),
    Yesterday: items.filter(i => i.dateGroup === 'Yesterday'),
    Earlier: items.filter(i => i.dateGroup === 'Earlier'),
  };

  return (
    <div className="space-y-3 p-2 overflow-y-auto flex-1">
      {(['Today', 'Yesterday', 'Earlier'] as const).map((groupName) => {
        const groupItems = groups[groupName];
        if (!groupItems || groupItems.length === 0) return null;

        return (
          <div key={groupName} className="space-y-1.5">
            <div className="text-[10px] uppercase font-semibold text-[#6B7280] tracking-wider px-2 pt-1">
              {groupName} ({groupItems.length})
            </div>
            {groupItems.map((item) => (
              <ClipboardItemCard
                key={item.id}
                item={item}
                isSelected={item.id === selectedItemId}
                onSelect={() => onSelect(item.id)}
                onCopy={onCopy}
                onTogglePin={onTogglePin}
                onDelete={onDelete}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
};

