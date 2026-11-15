import { useEffect } from 'react';
import './App.css';
import { useAppStore } from './store/useAppStore';
import { QuickPopup } from './components/QuickPopup';
import { Sidebar } from './components/Sidebar';
import { DashboardOverview } from './components/DashboardOverview';
import { ClipboardHistory } from './components/ClipboardHistory';
import { SettingsView } from './components/SettingsView';
import { 
  Layers, 
  Monitor, 
  Check,
  Minimize2,
  Maximize2,
  X
} from 'lucide-react';

export function App() {
  const {
    windowMode,
    setWindowMode,
    activeTab,
    toastMessage,
    settings,
    initBackendListener
  } = useAppStore();

  useEffect(() => {
    initBackendListener();
  }, [initBackendListener]);

  const isLight = settings.theme === 'light';

  return (
    <div className={`w-screen h-screen flex flex-col overflow-hidden font-sans select-none transition-colors duration-150 ${
      isLight ? 'bg-gray-100 text-gray-900' : 'bg-[#111827] text-[#F9FAFB]'
    }`}>
      {/* Top Application Mode Switcher Bar */}
      <header className={`h-10 border-b px-4 flex items-center justify-between z-40 ${
        isLight ? 'bg-gray-200 border-gray-300' : 'bg-[#1F2937] border-[#374151]'
      }`}>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#06B6D4]"></div>
          <span className="text-xs font-semibold tracking-wide">ClipVault Desktop</span>
          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
            isLight ? 'bg-white border-gray-300 text-gray-600' : 'bg-[#111827] border-[#374151] text-[#9CA3AF]'
          }`}>
            Tauri v2
          </span>
        </div>

        {/* View Mode Toggle Pill (Quick Popup vs Full App Window) */}
        <div className={`flex items-center p-0.5 rounded-lg border ${
          isLight ? 'bg-gray-300 border-gray-400' : 'bg-[#111827] border-[#374151]'
        }`}>
          <button
            onClick={() => setWindowMode('popup')}
            className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${
              windowMode === 'popup'
                ? 'bg-[#06B6D4] text-[#111827] font-semibold shadow-sm'
                : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Popup (Super+V)</span>
          </button>
          <button
            onClick={() => setWindowMode('window')}
            className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${
              windowMode === 'window'
                ? 'bg-[#06B6D4] text-[#111827] font-semibold shadow-sm'
                : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Dashboard Window</span>
          </button>
        </div>

        {/* Window controls */}
        <div className="flex items-center gap-2 text-[#9CA3AF]">
          <button title="Minimize" className="hover:text-[#F9FAFB] p-1"><Minimize2 className="w-3.5 h-3.5" /></button>
          <button title="Maximize" className="hover:text-[#F9FAFB] p-1"><Maximize2 className="w-3.5 h-3.5" /></button>
          <button title="Close" className="hover:text-[#EF4444] p-1"><X className="w-3.5 h-3.5" /></button>
        </div>
      </header>

      {/* Main Container Area */}
      <main className="flex-1 overflow-hidden relative flex">
        {windowMode === 'popup' ? (
          /* FLOATING POPUP VIEW */
          <div className="flex-1 flex flex-col items-center justify-center relative p-6 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1F2937]/50 via-[#111827] to-[#0A0F1D]">
            <div className="absolute top-4 left-6 text-xs text-[#9CA3AF]">
              <span className="text-[#06B6D4] font-semibold">Simulated Desktop Environment:</span> Global trigger <kbd className="px-1.5 py-0.5 rounded bg-[#1F2937] border border-[#374151] text-[#F9FAFB] font-mono">{settings.popupShortcut}</kbd>
            </div>

            <QuickPopup />
          </div>
        ) : (
          /* FULL WINDOW APPLICATION */
          <div className="flex-1 flex overflow-hidden">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden bg-[#111827]">
              {activeTab === 'overview' && <DashboardOverview />}
              {activeTab === 'all' && <ClipboardHistory />}
              {activeTab === 'pinned' && <ClipboardHistory filterTypeOverride="pinned" />}
              {activeTab === 'text' && <ClipboardHistory filterTypeOverride="text" />}
              {activeTab === 'images' && <ClipboardHistory filterTypeOverride="image" />}
              {activeTab === 'files' && <ClipboardHistory filterTypeOverride="files" />}
              {activeTab === 'settings' && <SettingsView />}
            </div>
          </div>
        )}
      </main>

      {/* Global Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 bg-[#182230] border border-[#06B6D4] text-[#F9FAFB] px-3.5 py-2 rounded-lg text-xs flex items-center gap-2 shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-[#06B6D4]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default App;
