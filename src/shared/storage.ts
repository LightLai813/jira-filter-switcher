import type { AppStorage, FilterItem, PanelState, UrlPattern } from './types';
import { STORAGE_KEY, SCHEMA_VERSION } from './constants';

const DEFAULT: AppStorage = {
  filters: [],
  urlPatterns: [],
  activeFilterId: null,
  panelState: { collapsed: false, position: { x: -1, y: 80 } },
  schemaVersion: SCHEMA_VERSION,
};

async function load(): Promise<AppStorage> {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  const stored = result[STORAGE_KEY] as Partial<AppStorage> | undefined;
  return { ...DEFAULT, ...stored, panelState: { ...DEFAULT.panelState, ...stored?.panelState } };
}

async function patch(data: Partial<AppStorage>): Promise<void> {
  const current = await load();
  await chrome.storage.local.set({ [STORAGE_KEY]: { ...current, ...data } });
}

export async function getFilters(): Promise<FilterItem[]> {
  return (await load()).filters;
}

export async function saveFilters(filters: FilterItem[]): Promise<void> {
  await patch({ filters });
}

export async function getActiveFilterId(): Promise<string | null> {
  return (await load()).activeFilterId;
}

export async function saveActiveFilterId(id: string | null): Promise<void> {
  await patch({ activeFilterId: id });
}

export async function getUrlPatterns(): Promise<UrlPattern[]> {
  return (await load()).urlPatterns;
}

export async function saveUrlPatterns(patterns: UrlPattern[]): Promise<void> {
  await patch({ urlPatterns: patterns });
}

export async function getPanelState(): Promise<PanelState> {
  return (await load()).panelState;
}

export async function savePanelState(state: PanelState): Promise<void> {
  await patch({ panelState: state });
}

export async function loadAll(): Promise<AppStorage> {
  return load();
}

export async function saveAll(data: AppStorage): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEY]: data });
}
