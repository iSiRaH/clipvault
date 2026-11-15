import { create } from 'zustand';
import { 
  ClipboardItem, 
  FilterType, 
  SortOrder, 
  SettingsState, 
  NavTab, 
  WindowMode 
} from '../types';
import { listen } from '@tauri-apps/api/event';

// Initial realistic clipboard items
const INITIAL_ITEMS: ClipboardItem[] = [
  {
    id: 'clip-1',
    type: 'code',
    title: 'PostgreSQL Production Connection String',
    preview: 'postgresql://postgres:p4ssw0rd@db.internal.aws.compute:5432/clipvault_prod?sslmode=require',
    fullContent: 'postgresql://postgres:p4ssw0rd@db.internal.aws.compute:5432/clipvault_prod?sslmode=require',
    contentHash: 'a89c7d1e9f023812738912',
    timestamp: '2026-11-15T18:42:10Z',
    relativeTime: '3m ago',
    isPinned: true,
    sourceApp: 'DBeaver',
    charCount: 88,
    dateGroup: 'Today'
  },
  {
    id: 'clip-2',
    type: 'text',
    title: 'Standup update summary',
    preview: 'Completed Wayland selection protocol integration in platform-linux crate. Tested with wl-clipboard and mutter.',
    fullContent: 'Completed Wayland selection protocol integration in platform-linux crate. Tested with wl-clipboard and mutter.\nNext up: implementing SQLite vacuuming & LRU retention policy in clipboard-storage.',
    contentHash: '3948b8ca71e09dfa981273',
    timestamp: '2026-11-15T18:15:30Z',
    relativeTime: '30m ago',
    isPinned: false,
    sourceApp: 'Slack',
    charCount: 201,
    dateGroup: 'Today'
  },
  {
    id: 'clip-3',
    type: 'image',
    title: 'architecture-diagram-v2.png',
    preview: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
    fullContent: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    contentHash: 'f419d8329bc018237198a',
    timestamp: '2026-11-15T17:20:00Z',
    relativeTime: '1h ago',
    isPinned: true,
    sourceApp: 'Figma',
    size: '1.4 MB',
    dimensions: '1920 × 1080',
    dateGroup: 'Today'
  },
  {
    id: 'clip-4',
    type: 'code',
    title: 'tokio::spawn async clipboard monitor',
    preview: 'tokio::spawn(async move { while let Ok(item) = rx.recv().await { store.insert(item).await; } });',
    fullContent: `tokio::spawn(async move {
    let mut interval = tokio::time::interval(Duration::from_millis(400));
    loop {
        interval.tick().await;
        if let Some(event) = monitor.poll_change().await {
            let hash = event.content_hash();
            if !cache.contains(&hash) {
                storage.save(event).await?;
            }
        }
    }
});`,
    contentHash: 'e7192301982bca891723',
    timestamp: '2026-11-15T16:05:00Z',
    relativeTime: '2h ago',
    isPinned: false,
    sourceApp: 'VS Code',
    charCount: 312,
    dateGroup: 'Today'
  },
  {
    id: 'clip-5',
    type: 'files',
    title: '3 Workspace Crates Manifests',
    preview: 'Cargo.toml, Cargo.lock, tauri.conf.json',
    fullContent: '/home/isirahansaja/Desktop/clipvault/Cargo.toml\n/home/isirahansaja/Desktop/clipvault/Cargo.lock\n/home/isirahansaja/Desktop/clipvault/apps/desktop/src-tauri/tauri.conf.json',
    contentHash: 'c90123891723bba712391',
    timestamp: '2026-11-15T14:10:00Z',
    relativeTime: '4h ago',
    isPinned: false,
    sourceApp: 'Nautilus',
    fileCount: 3,
    size: '142 KB',
    dateGroup: 'Today'
  },
  {
    id: 'clip-6',
    type: 'link',
    title: 'Tauri v2 Global Shortcut Documentation',
    preview: 'https://v2.tauri.app/develop/plugins/global-shortcut/',
    fullContent: 'https://v2.tauri.app/develop/plugins/global-shortcut/',
    contentHash: 'd781290381273912a7812',
    timestamp: '2026-11-14T20:30:00Z',
    relativeTime: 'Yesterday',
    isPinned: true,
    sourceApp: 'Brave Browser',
    charCount: 52,
    dateGroup: 'Yesterday'
  },
  {
    id: 'clip-7',
    type: 'text',
    title: 'SSH Ed25519 Public Key (Workstation)',
    preview: 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIGVpP6L1820... isirahansaja@fedora-workstation',
    fullContent: 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIGVpP6L1820Qz93XNm48A291m81Zal90321Kz0912 isirahansaja@fedora-workstation',
    contentHash: 'b12987391823719283719',
    timestamp: '2026-11-14T11:00:00Z',
    relativeTime: 'Yesterday',
    isPinned: true,
    sourceApp: 'Terminal',
    charCount: 110,
    dateGroup: 'Yesterday'
  },
  {
    id: 'clip-8',
    type: 'text',
    title: 'Release checklist template',
    preview: '1. [ ] Run cargo test workspace\n2. [ ] Bump versions\n3. [ ] Verify Wayland capture\n4. [ ] Build deb/AppImage',
    fullContent: 'Release Checklist:\n1. [ ] Run cargo audit & test workspace\n2. [ ] Bump version in Cargo.toml & package.json\n3. [ ] Verify Wayland & X11 clipboard capture\n4. [ ] Build deb, AppImage, and flatpak\n5. [ ] Publish release notes on GitHub',
    contentHash: 'f09123891823719238912',
    timestamp: '2026-11-12T09:15:00Z',
    relativeTime: '3 days ago',
    isPinned: false,
    sourceApp: 'Obsidian',
    charCount: 245,
    dateGroup: 'Earlier'
  }
];

const INITIAL_SETTINGS: SettingsState = {
  autostart: true,
  minimizeToTray: true,
  launchBehavior: 'popup',
  popupShortcut: 'Super + V',
  searchShortcut: 'Super + Shift + V',
  clearShortcut: 'Super + Alt + X',
  maxHistorySize: 1000,
  duplicatePolicy: 'bump',
  retentionDays: 30,
  pauseMonitoring: false,
  sensitiveFilter: true,
  excludedApps: ['1Password', 'Bitwarden', 'KeePassXC', 'GnuPG Pinentry'],
  theme: 'dark',
  density: 'compact'
};

interface AppStore {
  // Navigation & UI State
  windowMode: WindowMode;
  setWindowMode: (mode: WindowMode) => void;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  toastMessage: string | null;
  setToastMessage: (msg: string | null) => void;
  showToast: (msg: string) => void;

  // Search & Filtering
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: FilterType;
  setActiveFilter: (filter: FilterType) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;

  // Clipboard Items
  items: ClipboardItem[];
  selectedItemId: string | null;
  setSelectedItemId: (id: string | null) => void;
  copyItem: (item: ClipboardItem) => void;
  togglePin: (id: string) => void;
  deleteItem: (id: string) => void;
  clearHistory: () => void;
  addItem: (item: ClipboardItem) => void;

  // Settings State
  settings: SettingsState;
  updateSettings: (updates: Partial<SettingsState>) => void;

  // Backend sync status
  isBackendConnected: boolean;
  initBackendListener: () => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  windowMode: 'popup',
  setWindowMode: (mode) => set({ windowMode: mode }),
  activeTab: 'overview',
  setActiveTab: (tab) => set({ activeTab: tab }),
  toastMessage: null,
  setToastMessage: (msg) => set({ toastMessage: msg }),
  showToast: (msg) => {
    set({ toastMessage: msg });
    setTimeout(() => {
      if (get().toastMessage === msg) {
        set({ toastMessage: null });
      }
    }, 1500);
  },

  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  activeFilter: 'all',
  setActiveFilter: (filter) => set({ activeFilter: filter }),
  sortOrder: 'newest',
  setSortOrder: (order) => set({ sortOrder: order }),

  items: INITIAL_ITEMS,
  selectedItemId: INITIAL_ITEMS[0]?.id || null,
  setSelectedItemId: (id) => set({ selectedItemId: id }),

  copyItem: (item) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(item.fullContent);
    }
    get().showToast(`Copied to clipboard: ${item.title || item.preview.slice(0, 24)}...`);
  },

  togglePin: (id) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, isPinned: !item.isPinned } : item
      )
    }));
  },

  deleteItem: (id) => {
    set((state) => {
      const remaining = state.items.filter((item) => item.id !== id);
      const newSelected = state.selectedItemId === id ? remaining[0]?.id || null : state.selectedItemId;
      return {
        items: remaining,
        selectedItemId: newSelected
      };
    });
    get().showToast('Item removed from history');
  },

  clearHistory: () => {
    set({ items: [], selectedItemId: null });
    get().showToast('Clipboard history cleared');
  },

  addItem: (item) => {
    set((state) => {
      // Check for duplicate hash
      const existsIndex = state.items.findIndex(i => i.contentHash === item.contentHash);
      if (existsIndex !== -1) {
        if (state.settings.duplicatePolicy === 'bump') {
          const updated = [...state.items];
          const existing = updated.splice(existsIndex, 1)[0];
          return {
            items: [{ ...existing, timestamp: new Date().toISOString(), relativeTime: 'Just now' }, ...updated]
          };
        } else if (state.settings.duplicatePolicy === 'ignore') {
          return state;
        }
      }
      return {
        items: [item, ...state.items]
      };
    });
  },

  settings: INITIAL_SETTINGS,
  updateSettings: (updates) => {
    set((state) => ({
      settings: { ...state.settings, ...updates }
    }));
    get().showToast('Settings saved');
  },

  isBackendConnected: false,
  initBackendListener: () => {
    try {
      listen<any>('clipboard://item', (event) => {
        set({ isBackendConnected: true });
        const raw = event.payload;
        if (!raw) return;

        let contentStr = '';
        let contentType: any = 'text';

        if (raw.content) {
          if (raw.content.Text) {
            contentStr = raw.content.Text;
            contentType = contentStr.includes('http') ? 'link' : (contentStr.includes('{') || contentStr.includes('fn ')) ? 'code' : 'text';
          } else if (raw.content.Files) {
            contentStr = raw.content.Files.join('\n');
            contentType = 'files';
          }
        }

        const newItem: ClipboardItem = {
          id: raw.id || String(Date.now()),
          type: contentType,
          preview: contentStr.slice(0, 160),
          fullContent: contentStr,
          contentHash: raw.content_hash || String(Date.now()),
          timestamp: raw.created_at || new Date().toISOString(),
          relativeTime: 'Just now',
          isPinned: raw.is_pinned || false,
          sourceApp: raw.source_app || undefined,
          charCount: contentStr.length,
          dateGroup: 'Today'
        };

        get().addItem(newItem);
      }).catch(() => {
        // Fallback in web/preview mode
      });
    } catch {
      // Safe fallback outside Tauri runtime
    }
  }
}));

