export type ContentType = 'text' | 'image' | 'files' | 'code' | 'link';

export type DateGroup = 'Today' | 'Yesterday' | 'Earlier';

export interface ClipboardItem {
  id: string;
  type: ContentType;
  title?: string;
  preview: string;
  fullContent: string;
  contentHash: string;
  timestamp: string;
  relativeTime: string;
  isPinned: boolean;
  sourceApp?: string;
  size?: string;
  dimensions?: string; // e.g. "1920 × 1080" for images
  fileCount?: number;   // for file lists
  charCount?: number;
  tags?: string[];
  dateGroup: DateGroup;
}

export type FilterType = 'all' | 'text' | 'image' | 'files' | 'pinned';

export type SortOrder = 'newest' | 'oldest';

export type ThemeMode = 'dark' | 'light' | 'system';

export type WindowMode = 'popup' | 'window';

export type NavTab = 'overview' | 'all' | 'pinned' | 'text' | 'images' | 'files' | 'settings';

export interface SettingsState {
  autostart: boolean;
  minimizeToTray: boolean;
  launchBehavior: 'popup' | 'window' | 'tray';
  popupShortcut: string;
  searchShortcut: string;
  clearShortcut: string;
  maxHistorySize: number;
  duplicatePolicy: 'bump' | 'ignore' | 'allow';
  retentionDays: number;
  pauseMonitoring: boolean;
  sensitiveFilter: boolean;
  excludedApps: string[];
  theme: ThemeMode;
  density: 'compact' | 'comfortable';
}
