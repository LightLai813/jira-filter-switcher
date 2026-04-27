export type FilterType = 'assignee' | 'customFilter';

export interface FilterItem {
  id: string;
  name: string;
  type: FilterType;
  keyword: string;
}

export interface UrlPattern {
  id: string;
  pattern: string;
}

export interface PanelState {
  collapsed: boolean;
  position: { x: number; y: number };
}

export interface AppStorage {
  filters: FilterItem[];
  urlPatterns: UrlPattern[];
  activeFilterId: string | null;
  panelState: PanelState;
  schemaVersion: number;
}

export interface ExportBundle {
  exportedAt: string;
  schemaVersion: number;
  filters: FilterItem[];
  urlPatterns: UrlPattern[];
}

export type MessageType = 'FILTERS_UPDATED' | 'PATTERNS_UPDATED';

export interface ExtMessage {
  type: MessageType;
}
