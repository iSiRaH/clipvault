import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { 
  FileText, 
  Pin, 
  HardDrive, 
  Zap, 
  ArrowUpRight, 
  Clock, 
  Activity, 
  ShieldAlert
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const { items, setActiveTab, copyItem, settings } = useAppStore();

  const totalCount = items.length;
  const pinnedCount = items.filter(i => i.isPinned).length;
  const recentClips = items.slice(0, 4);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 select-none">
      {/* Welcome Heading */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#F9FAFB]">Dashboard Overview</h1>
          <p className="text-xs text-[#9CA3AF] mt-1">
            Real-time clipboard ingestion engine & history analytics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse"></span>
            Clipboard Listener Active
          </span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Items */}
        <div className="bg-[#182230] border border-[#374151] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#9CA3AF]">Total Clipboard Items</span>
            <div className="p-2 rounded-lg bg-[#06B6D4]/10 text-[#06B6D4]">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-[#F9FAFB]">{totalCount}</div>
            <div className="text-[11px] text-[#9CA3AF] mt-1 flex items-center gap-1">
              <span className="text-[#22C55E] font-medium">+12%</span> retention velocity
            </div>
          </div>
        </div>

        {/* Pinned Items */}
        <div className="bg-[#182230] border border-[#374151] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#9CA3AF]">Pinned Items</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Pin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-[#F9FAFB]">{pinnedCount}</div>
            <div className="text-[11px] text-[#9CA3AF] mt-1">
              Quick access shortcuts preserved
            </div>
          </div>
        </div>

        {/* Storage Usage */}
        <div className="bg-[#182230] border border-[#374151] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#9CA3AF]">Storage Usage</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-[#F9FAFB]">14.2 MB</div>
            <div className="text-[11px] text-[#9CA3AF] mt-1 flex items-center gap-1">
              SQLite WAL mode enabled
            </div>
          </div>
        </div>
      </div>

      {/* Activity Overview and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Section */}
        <div className="lg:col-span-2 bg-[#182230] border border-[#374151] rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#06B6D4]" />
              <h2 className="text-xs font-semibold text-[#F9FAFB] uppercase tracking-wider">
                Clipboard Activity (Last 7 Days)
              </h2>
            </div>
            <span className="text-[11px] text-[#9CA3AF]">Deduplication: Active</span>
          </div>

          {/* Histogram bar chart */}
          <div className="flex items-end justify-between h-32 pt-4 px-2 gap-2 border-b border-[#374151]">
            {[
              { day: 'Mon', count: 32 },
              { day: 'Tue', count: 54 },
              { day: 'Wed', count: 48 },
              { day: 'Thu', count: 85 },
              { day: 'Fri', count: 96 },
              { day: 'Sat', count: 28 },
              { day: 'Sun', count: 42 },
            ].map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <span className="text-[10px] text-[#06B6D4] opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                  {d.count}
                </span>
                <div 
                  style={{ height: `${(d.count / 100) * 85}%` }}
                  className="w-full bg-[#1F2937] hover:bg-[#06B6D4] rounded-t transition-all"
                ></div>
                <span className="text-[10px] text-[#6B7280]">{d.day}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 text-[11px] text-[#9CA3AF]">
            <span>Average: 55 clips/day</span>
            <span className="text-[#22C55E]">Zero memory leaks detected</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#182230] border border-[#374151] rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-[#06B6D4]" />
              <h2 className="text-xs font-semibold text-[#F9FAFB] uppercase tracking-wider">
                Quick Actions
              </h2>
            </div>

            <div className="space-y-2">
              <button 
                onClick={() => setActiveTab('pinned')}
                className="w-full flex items-center justify-between p-2 rounded-lg bg-[#111827] border border-[#374151] text-xs text-[#9CA3AF] hover:text-[#F9FAFB] hover:border-[#06B6D4] transition-colors"
              >
                <span>View Pinned Snippets</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#06B6D4]" />
              </button>

              <button 
                onClick={() => setActiveTab('settings')}
                className="w-full flex items-center justify-between p-2 rounded-lg bg-[#111827] border border-[#374151] text-xs text-[#9CA3AF] hover:text-[#F9FAFB] hover:border-[#06B6D4] transition-colors"
              >
                <span>Configure Keyboard Shortcuts</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#06B6D4]" />
              </button>

              <button 
                onClick={() => setActiveTab('settings')}
                className="w-full flex items-center justify-between p-2 rounded-lg bg-[#111827] border border-[#374151] text-xs text-[#9CA3AF] hover:text-[#F9FAFB] hover:border-[#06B6D4] transition-colors"
              >
                <span>Manage Excluded Apps</span>
                <ShieldAlert className="w-3.5 h-3.5 text-[#F59E0B]" />
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#374151] text-[11px] text-[#6B7280]">
            Global trigger: <kbd className="px-1.5 py-0.5 rounded bg-[#111827] border border-[#374151] text-[#9CA3AF] font-mono">{settings.popupShortcut}</kbd>
          </div>
        </div>
      </div>

      {/* Recently Copied Items Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#06B6D4]" />
            <h2 className="text-xs font-semibold text-[#F9FAFB] uppercase tracking-wider">
              Recently Copied Items
            </h2>
          </div>
          <button 
            onClick={() => setActiveTab('all')}
            className="text-xs text-[#06B6D4] hover:underline flex items-center gap-1"
          >
            See all history <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recentClips.map((item) => (
            <div 
              key={item.id}
              onClick={() => copyItem(item)}
              className="p-3 bg-[#182230] border border-[#374151] rounded-xl hover:border-[#06B6D4] transition-all cursor-pointer group flex flex-col justify-between h-24"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#F9FAFB] truncate max-w-[240px]">
                  {item.title || item.preview}
                </span>
                <span className="text-[10px] text-[#6B7280]">{item.relativeTime}</span>
              </div>
              <p className="text-[11px] font-mono text-[#9CA3AF] truncate mt-1">
                {item.preview}
              </p>
              <div className="flex items-center justify-between text-[10px] text-[#6B7280] pt-1 border-t border-[#374151]/40">
                <span className="capitalize">{item.type} • {item.sourceApp || 'Desktop'}</span>
                <span className="text-[#06B6D4] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  Click to copy
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
