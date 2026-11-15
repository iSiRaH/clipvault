import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { NavTab } from '../types';
import { 
  LayoutDashboard, 
  History, 
  Pin, 
  FileText, 
  Image as ImageIcon, 
  FolderArchive, 
  Settings, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { items, activeTab, setActiveTab, isBackendConnected } = useAppStore();

  const counts = {
    all: items.length,
    pinned: items.filter(i => i.isPinned).length,
    text: items.filter(i => i.type === 'text' || i.type === 'code' || i.type === 'link').length,
    images: items.filter(i => i.type === 'image').length,
    files: items.filter(i => i.type === 'files').length,
  };

  const navItems = [
    { id: 'overview' as NavTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'all' as NavTab, label: 'All Items', icon: History, count: counts.all },
    { id: 'pinned' as NavTab, label: 'Pinned', icon: Pin, count: counts.pinned },
    { id: 'text' as NavTab, label: 'Text & Code', icon: FileText, count: counts.text },
    { id: 'images' as NavTab, label: 'Images', icon: ImageIcon, count: counts.images },
    { id: 'files' as NavTab, label: 'Files', icon: FolderArchive, count: counts.files },
  ];

  return (
    <aside className="w-60 bg-[#1F2937] border-r border-[#374151] flex flex-col justify-between select-none">
      <div>
        {/* Brand Header */}
        <div className="h-14 flex items-center px-4 gap-2.5 border-b border-[#374151]">
          <div className="w-7 h-7 rounded-lg bg-[#06B6D4]/15 border border-[#06B6D4]/40 flex items-center justify-center text-[#06B6D4]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-sm tracking-wide text-[#F9FAFB] leading-none">ClipVault</div>
            <div className="text-[10px] text-[#9CA3AF] mt-1 flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isBackendConnected ? 'bg-[#22C55E]' : 'bg-[#06B6D4]'}`}></span>
              <span>{isBackendConnected ? 'Listener Live' : 'Daemon Standby'}</span>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <div className="p-3 space-y-1">
          <div className="text-[10px] uppercase font-semibold text-[#6B7280] px-2 py-1 tracking-wider">
            Library
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#111827] text-[#06B6D4] border border-[#374151]'
                    : 'text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#182230]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#06B6D4]' : 'text-[#9CA3AF]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                    isActive ? 'bg-[#06B6D4]/15 text-[#06B6D4]' : 'bg-[#111827] text-[#6B7280]'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Settings & System status */}
      <div className="p-3 border-t border-[#374151] space-y-2">
        <button
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'settings'
              ? 'bg-[#111827] text-[#06B6D4] border border-[#374151]'
              : 'text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#182230]'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>

        <div className="flex items-center justify-between px-2 pt-1 text-[10px] text-[#6B7280]">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" /> SQLite DB
          </span>
          <span className="font-mono">v0.1.0</span>
        </div>
      </div>
    </aside>
  );
};
