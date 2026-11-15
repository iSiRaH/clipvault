import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { ConfirmationDialog } from './common/ConfirmationDialog';
import { 
  Sliders, 
  Keyboard, 
  Database, 
  Shield, 
  Palette, 
  Info, 
  HardDrive, 
  FolderOpen
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, clearHistory } = useAppStore();
  const [activeSection, setActiveSection] = useState<'general' | 'shortcuts' | 'clipboard' | 'privacy' | 'storage' | 'appearance' | 'about'>('general');
  const [showPurgeConfirm, setShowPurgeConfirm] = useState(false);

  return (
    <div className="flex-1 flex overflow-hidden bg-[#111827] select-none">
      {/* Category Subnav */}
      <div className="w-56 border-r border-[#374151] p-3 space-y-1">
        <div className="text-[10px] uppercase font-semibold text-[#6B7280] px-2 py-1 tracking-wider">
          Settings
        </div>
        {[
          { id: 'general', label: 'General', icon: Sliders },
          { id: 'shortcuts', label: 'Keyboard Shortcuts', icon: Keyboard },
          { id: 'clipboard', label: 'Clipboard Engine', icon: Database },
          { id: 'privacy', label: 'Privacy & Security', icon: Shield },
          { id: 'storage', label: 'Storage & Database', icon: HardDrive },
          { id: 'appearance', label: 'Appearance', icon: Palette },
          { id: 'about', label: 'About ClipVault', icon: Info },
        ].map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id as any)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#182230] text-[#06B6D4] border border-[#374151]'
                  : 'text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#1F2937]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Settings Body */}
      <div className="flex-1 overflow-y-auto p-6 max-w-2xl space-y-6">
        {/* GENERAL SECTION */}
        {activeSection === 'general' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#F9FAFB]">General Settings</h2>
              <p className="text-xs text-[#9CA3AF]">Desktop integration, system tray, and startup preferences.</p>
            </div>

            <div className="bg-[#182230] border border-[#374151] rounded-xl p-4 divide-y divide-[#374151]">
              <div className="flex items-center justify-between pb-3">
                <div>
                  <div className="text-xs font-semibold text-[#F9FAFB]">Start on system login</div>
                  <div className="text-[11px] text-[#9CA3AF]">Automatically launch ClipVault daemon on desktop session start</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={settings.autostart} 
                  onChange={(e) => updateSettings({ autostart: e.target.checked })}
                  className="accent-[#06B6D4] w-4 h-4 rounded cursor-pointer" 
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <div className="text-xs font-semibold text-[#F9FAFB]">Minimize to System Tray</div>
                  <div className="text-[11px] text-[#9CA3AF]">Closing the main window keeps background monitoring active</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={settings.minimizeToTray} 
                  onChange={(e) => updateSettings({ minimizeToTray: e.target.checked })}
                  className="accent-[#06B6D4] w-4 h-4 rounded cursor-pointer" 
                />
              </div>

              <div className="flex items-center justify-between pt-3">
                <div>
                  <div className="text-xs font-semibold text-[#F9FAFB]">Launch Behavior</div>
                  <div className="text-[11px] text-[#9CA3AF]">Default window displayed when summoned</div>
                </div>
                <select 
                  value={settings.launchBehavior}
                  onChange={(e) => updateSettings({ launchBehavior: e.target.value as any })}
                  className="bg-[#111827] border border-[#374151] rounded-lg px-2.5 py-1 text-xs text-[#F9FAFB] focus:outline-none focus:border-[#06B6D4]"
                >
                  <option value="popup">Quick Floating Popup</option>
                  <option value="window">Full Application Window</option>
                  <option value="tray">Silent in System Tray</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* KEYBOARD SHORTCUTS */}
        {activeSection === 'shortcuts' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#F9FAFB]">Keyboard Shortcuts</h2>
              <p className="text-xs text-[#9CA3AF]">Configurable global hotkeys registered with the desktop environment.</p>
            </div>

            <div className="bg-[#182230] border border-[#374151] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-[#374151]">
                <div>
                  <div className="text-xs font-semibold text-[#F9FAFB]">Open Quick Clipboard Popup</div>
                  <div className="text-[11px] text-[#9CA3AF]">Summons the floating history search list</div>
                </div>
                <kbd className="px-2.5 py-1 rounded bg-[#111827] border border-[#06B6D4] text-[#06B6D4] font-mono text-xs shadow-sm">
                  {settings.popupShortcut}
                </kbd>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-[#374151]">
                <div>
                  <div className="text-xs font-semibold text-[#F9FAFB]">Search Clipboard History</div>
                  <div className="text-[11px] text-[#9CA3AF]">Opens quick popup directly in search mode</div>
                </div>
                <kbd className="px-2.5 py-1 rounded bg-[#111827] border border-[#374151] text-[#F9FAFB] font-mono text-xs">
                  {settings.searchShortcut}
                </kbd>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="text-xs font-semibold text-[#F9FAFB]">Clear Clipboard History</div>
                  <div className="text-[11px] text-[#9CA3AF]">Direct shortcut to trigger history purge</div>
                </div>
                <kbd className="px-2.5 py-1 rounded bg-[#111827] border border-[#374151] text-[#F9FAFB] font-mono text-xs">
                  {settings.clearShortcut}
                </kbd>
              </div>
            </div>
          </div>
        )}

        {/* CLIPBOARD ENGINE */}
        {activeSection === 'clipboard' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#F9FAFB]">Clipboard Engine & Storage</h2>
              <p className="text-xs text-[#9CA3AF]">Retention limits, deduplication policies, and automated cleanup schedules.</p>
            </div>

            <div className="bg-[#182230] border border-[#374151] rounded-xl p-4 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-[#F9FAFB]">Maximum History Size</span>
                  <span className="text-xs font-mono text-[#06B6D4]">{settings.maxHistorySize} items</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="5000"
                  step="100"
                  value={settings.maxHistorySize}
                  onChange={(e) => updateSettings({ maxHistorySize: Number(e.target.value) })}
                  className="w-full accent-[#06B6D4] cursor-pointer"
                />
                <span className="text-[10px] text-[#6B7280]">Older unpinned items are automatically recycled when limit is reached.</span>
              </div>

              <div className="pt-3 border-t border-[#374151] flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#F9FAFB]">Duplicate Item Handling</div>
                  <div className="text-[11px] text-[#9CA3AF]">Deduplication strategy for identical content hashes</div>
                </div>
                <select 
                  value={settings.duplicatePolicy} 
                  onChange={(e) => updateSettings({ duplicatePolicy: e.target.value as any })}
                  className="bg-[#111827] border border-[#374151] rounded-lg px-2.5 py-1 text-xs text-[#F9FAFB] focus:outline-none"
                >
                  <option value="bump">Update timestamp & bump to top</option>
                  <option value="ignore">Ignore duplicate copies</option>
                  <option value="allow">Store duplicate as new item</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#374151] flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#F9FAFB]">Automatic Retention Period</div>
                  <div className="text-[11px] text-[#9CA3AF]">Purge items older than configured days</div>
                </div>
                <select 
                  value={settings.retentionDays} 
                  onChange={(e) => updateSettings({ retentionDays: Number(e.target.value) })}
                  className="bg-[#111827] border border-[#374151] rounded-lg px-2.5 py-1 text-xs text-[#F9FAFB] focus:outline-none"
                >
                  <option value={7}>7 Days</option>
                  <option value={30}>30 Days (Recommended)</option>
                  <option value={90}>90 Days</option>
                  <option value={0}>Keep Indefinitely</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* PRIVACY SECTION */}
        {activeSection === 'privacy' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#F9FAFB]">Privacy & Security</h2>
              <p className="text-xs text-[#9CA3AF]">Exclude sensitive applications, password managers, and pause tracking.</p>
            </div>

            <div className="bg-[#182230] border border-[#374151] rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#374151]">
                <div>
                  <div className="text-xs font-semibold text-[#F9FAFB]">Pause Clipboard Monitoring</div>
                  <div className="text-[11px] text-[#9CA3AF]">Temporarily disable clipboard interception (incognito mode)</div>
                </div>
                <button
                  onClick={() => updateSettings({ pauseMonitoring: !settings.pauseMonitoring })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    settings.pauseMonitoring 
                      ? 'bg-[#EF4444] text-white' 
                      : 'bg-[#1F2937] border border-[#374151] text-[#9CA3AF] hover:text-[#F9FAFB]'
                  }`}
                >
                  {settings.pauseMonitoring ? 'Monitoring Paused' : 'Monitoring Active'}
                </button>
              </div>

              <div>
                <div className="text-xs font-semibold text-[#F9FAFB] mb-1">Excluded Applications</div>
                <div className="text-[11px] text-[#9CA3AF] mb-2">Clips copied in these window instances are never recorded:</div>
                <div className="flex flex-wrap gap-1.5">
                  {settings.excludedApps.map(app => (
                    <span key={app} className="px-2 py-0.5 rounded bg-[#111827] border border-[#374151] text-xs text-[#06B6D4] flex items-center gap-1">
                      {app}
                    </span>
                  ))}
                  <button className="px-2 py-0.5 rounded bg-[#1F2937] border border-[#374151] text-xs text-[#9CA3AF] hover:text-[#F9FAFB]">
                    + Add Application
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STORAGE & DATA */}
        {activeSection === 'storage' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#F9FAFB]">Storage & Database</h2>
              <p className="text-xs text-[#9CA3AF]">Inspect local SQLite cache, disk consumption, and history resets.</p>
            </div>

            <div className="bg-[#182230] border border-[#374151] rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#F9FAFB]">SQLite Database Location</div>
                  <div className="text-[11px] font-mono text-[#9CA3AF]">~/.local/share/clipvault/history.sqlite</div>
                </div>
                <button className="px-2.5 py-1 rounded bg-[#111827] border border-[#374151] text-xs text-[#9CA3AF] hover:text-[#F9FAFB] flex items-center gap-1.5">
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>Reveal in Files</span>
                </button>
              </div>

              <div className="pt-3 border-t border-[#374151] flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#EF4444]">Danger Zone: Clear All Data</div>
                  <div className="text-[11px] text-[#9CA3AF]">Irreversibly delete all recorded clipboard history and cache</div>
                </div>
                <button 
                  onClick={() => setShowPurgeConfirm(true)}
                  className="px-3 py-1.5 rounded-lg bg-[#EF4444]/15 border border-[#EF4444]/40 text-[#EF4444] text-xs font-semibold hover:bg-[#EF4444] hover:text-white transition-colors"
                >
                  Purge Vault
                </button>
              </div>
            </div>
          </div>
        )}

        {/* APPEARANCE */}
        {activeSection === 'appearance' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#F9FAFB]">Appearance & Density</h2>
              <p className="text-xs text-[#9CA3AF]">Visual themes and list display density.</p>
            </div>

            <div className="bg-[#182230] border border-[#374151] rounded-xl p-4 space-y-4">
              <div>
                <div className="text-xs font-semibold text-[#F9FAFB] mb-2">Theme Mode</div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'dark', label: 'Dark Mode (Default)' },
                    { id: 'light', label: 'Light Mode' },
                    { id: 'system', label: 'Follow System' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => updateSettings({ theme: t.id as any })}
                      className={`p-3 rounded-lg border text-xs font-medium text-left transition-all ${
                        settings.theme === t.id
                          ? 'border-[#06B6D4] bg-[#06B6D4]/10 text-[#06B6D4]'
                          : 'border-[#374151] bg-[#111827] text-[#9CA3AF] hover:text-[#F9FAFB]'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#374151] flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#F9FAFB]">Layout Density</div>
                  <div className="text-[11px] text-[#9CA3AF]">Adjust padding for clipboard list items</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateSettings({ density: 'compact' })}
                    className={`px-3 py-1 rounded text-xs font-medium border ${
                      settings.density === 'compact'
                        ? 'border-[#06B6D4] text-[#06B6D4] bg-[#06B6D4]/10'
                        : 'border-[#374151] text-[#9CA3AF]'
                    }`}
                  >
                    Compact
                  </button>
                  <button
                    onClick={() => updateSettings({ density: 'comfortable' })}
                    className={`px-3 py-1 rounded text-xs font-medium border ${
                      settings.density === 'comfortable'
                        ? 'border-[#06B6D4] text-[#06B6D4] bg-[#06B6D4]/10'
                        : 'border-[#374151] text-[#9CA3AF]'
                    }`}
                  >
                    Comfortable
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ABOUT */}
        {activeSection === 'about' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#F9FAFB]">About ClipVault</h2>
              <p className="text-xs text-[#9CA3AF]">Open-source, cross-platform clipboard manager.</p>
            </div>

            <div className="bg-[#182230] border border-[#374151] rounded-xl p-4 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#374151]">
                <span className="text-[#9CA3AF]">Application Version</span>
                <span className="font-mono text-[#F9FAFB]">0.1.0 (release)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#374151]">
                <span className="text-[#9CA3AF]">Backend Architecture</span>
                <span className="font-mono text-[#F9FAFB]">Rust 2024 + Tauri v2 (Wayland/X11)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#374151]">
                <span className="text-[#9CA3AF]">Frontend Architecture</span>
                <span className="font-mono text-[#F9FAFB]">React 19 + TypeScript + Zustand</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#9CA3AF]">License</span>
                <span className="text-[#06B6D4]">MIT License</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Purge Vault Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showPurgeConfirm}
        title="Purge Entire Vault"
        description="This will irreversibly delete all recorded clipboard history and cache from the SQLite database. Are you sure?"
        confirmLabel="Purge Everything"
        isDestructive
        onConfirm={() => {
          clearHistory();
          setShowPurgeConfirm(false);
        }}
        onCancel={() => setShowPurgeConfirm(false)}
      />
    </div>
  );
};
