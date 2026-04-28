import panelCss from '../content.css?inline';
import type { FilterItem } from '../../shared/types';
import * as storage from '../../shared/storage';
import { Toolbar } from './Toolbar';
import { FilterList } from './FilterList';
import { FilterEditor } from './FilterEditor';
import { FilterApplicator } from '../filter/FilterApplicator';
import { KeyboardNavigator } from '../keyboard/KeyboardNavigator';
import { PANEL_HOST_ID } from '../../shared/constants';

export class Panel {
  private host: HTMLDivElement;
  private shadow: ShadowRoot;
  private panelEl!: HTMLDivElement;
  private bodyEl!: HTMLDivElement;

  private toolbar!: Toolbar;
  private filterList!: FilterList;
  private filterEditor!: FilterEditor;
  private applicator = new FilterApplicator();
  private keyboard = new KeyboardNavigator();

  private filters: FilterItem[] = [];
  private activeFilterId: string | null = null;
  private collapsed = false;
  private position = { x: -1, y: 80 };
  private isDragging = false;
  private dragOffset = { x: 0, y: 0 };

  constructor() {
    this.host = document.createElement('div');
    this.host.id = PANEL_HOST_ID;
    this.host.style.cssText = 'position:fixed;z-index:2147483647;';
    this.shadow = this.host.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = panelCss;
    this.shadow.appendChild(style);

    this.buildDOM();
  }

  private buildDOM(): void {
    this.panelEl = document.createElement('div');
    this.panelEl.className = 'jfs-panel';
    this.shadow.appendChild(this.panelEl);

    this.toolbar = new Toolbar(this.panelEl, {
      onAdd: () => this.openEditor(),
      onCollapse: () => this.toggleCollapse(),
      onDragStart: (e) => this.startPanelDrag(e),
    });

    this.bodyEl = document.createElement('div');
    this.bodyEl.className = 'jfs-panel-body';
    this.panelEl.appendChild(this.bodyEl);

    const hint = document.createElement('div');
    hint.className = 'jfs-hint';
    hint.textContent = '↑↓ navigate · Enter activate · Alt+Shift+J toggle';
    this.panelEl.appendChild(hint);

    this.filterList = new FilterList(this.bodyEl, {
      onActivate: (id) => this.activateFilter(id),
      onEdit: (id) => this.openEditor(id),
      onDelete: (id) => this.deleteFilter(id),
      onReorder: (ids) => this.reorderFilters(ids),
    });

    this.filterEditor = new FilterEditor(this.panelEl, {
      onSave: (item) => this.saveFilter(item),
      onCancel: () => this.filterEditor.hide(),
    });

    this.keyboard.attach(this.bodyEl, {
      onActivate: (id) => this.activateFilter(id),
      onEscape: () => {
        if (this.filterEditor.isVisible()) this.filterEditor.hide();
        else this.toggleCollapse();
      },
    });

  }

  async mount(container: HTMLElement): Promise<void> {
    await this.loadData();
    this.applyPosition();
    container.appendChild(this.host);
    this.render();

    document.addEventListener('keydown', (e) => {
      if (e.altKey && e.shiftKey && e.code === 'KeyJ') {
        e.preventDefault();
        this.toggleCollapse();
        return;
      }
      if (this.collapsed) return;
      const tag = (document.activeElement?.tagName ?? '').toLowerCase();
      if (['input', 'textarea', 'select'].includes(tag) ||
          !!(document.activeElement as HTMLElement)?.isContentEditable) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); this.navigateFilter(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); this.navigateFilter(-1); }
    }, true);
  }

  private async loadData(): Promise<void> {
    this.filters = await storage.getFilters();
    this.activeFilterId = await storage.getActiveFilterId();
    const state = await storage.getPanelState();
    this.collapsed = state.collapsed;
    this.position = state.position;
  }

  private applyPosition(): void {
    if (this.position.x < 0) {
      // Default: top-right corner
      this.host.style.top = `${this.position.y}px`;
      this.host.style.right = '16px';
      this.host.style.left = '';
    } else {
      this.host.style.top = `${this.position.y}px`;
      this.host.style.left = `${this.position.x}px`;
      this.host.style.right = '';
    }
  }

  private render(): void {
    this.toolbar.setCollapsed(this.collapsed);
    this.bodyEl.style.display = this.collapsed ? 'none' : '';
    const hint = this.panelEl.querySelector('.jfs-hint') as HTMLElement | null;
    if (hint) hint.style.display = this.collapsed ? 'none' : '';
    this.filterList.render(this.filters, this.activeFilterId);
  }

  private navigateFilter(direction: 1 | -1): void {
    if (!this.filters.length) return;
    const currentIdx = this.filters.findIndex(f => f.id === this.activeFilterId);
    const nextIdx = currentIdx === -1
      ? 0
      : (currentIdx + direction + this.filters.length) % this.filters.length;
    this.activateFilter(this.filters[nextIdx].id);
  }

  private async activateFilter(id: string): Promise<void> {
    const filter = this.filters.find(f => f.id === id);
    if (!filter) return;
    this.activeFilterId = id;
    await storage.saveActiveFilterId(id);
    this.filterList.render(this.filters, this.activeFilterId);
    this.keyboard.focusActive(this.activeFilterId);
    await this.applicator.apply(filter);
  }

  private openEditor(id?: string): void {
    const existing = id ? this.filters.find(f => f.id === id) : undefined;
    this.filterEditor.show(existing);
  }

  private async saveFilter(item: FilterItem): Promise<void> {
    const idx = this.filters.findIndex(f => f.id === item.id);
    if (idx >= 0) this.filters[idx] = item;
    else this.filters.push(item);
    await storage.saveFilters(this.filters);
    this.filterEditor.hide();
    this.filterList.render(this.filters, this.activeFilterId);
  }

  private async deleteFilter(id: string): Promise<void> {
    this.filters = this.filters.filter(f => f.id !== id);
    if (this.activeFilterId === id) {
      this.activeFilterId = null;
      await storage.saveActiveFilterId(null);
    }
    await storage.saveFilters(this.filters);
    this.filterList.render(this.filters, this.activeFilterId);
  }

  private async reorderFilters(ids: string[]): Promise<void> {
    this.filters = ids
      .map(id => this.filters.find(f => f.id === id))
      .filter((f): f is FilterItem => f !== undefined);
    await storage.saveFilters(this.filters);
    this.filterList.render(this.filters, this.activeFilterId);
  }

  private async toggleCollapse(): Promise<void> {
    this.collapsed = !this.collapsed;
    const state = await storage.getPanelState();
    await storage.savePanelState({ ...state, collapsed: this.collapsed });
    this.render();
    if (!this.collapsed) {
      if (this.activeFilterId) this.keyboard.focusActive(this.activeFilterId);
      else this.keyboard.focusFirst();
    }
  }

  private startPanelDrag(e: MouseEvent): void {
    if ((e.target as HTMLElement).tagName === 'BUTTON') return;
    e.preventDefault();
    this.isDragging = true;
    const rect = this.host.getBoundingClientRect();
    this.dragOffset.x = e.clientX - rect.left;
    this.dragOffset.y = e.clientY - rect.top;

    const onMove = (ev: MouseEvent): void => {
      if (!this.isDragging) return;
      const newX = ev.clientX - this.dragOffset.x;
      const newY = ev.clientY - this.dragOffset.y;
      this.position = { x: Math.max(0, newX), y: Math.max(0, newY) };
      this.host.style.left = `${this.position.x}px`;
      this.host.style.top = `${this.position.y}px`;
      this.host.style.right = '';
    };

    const onUp = async (): Promise<void> => {
      this.isDragging = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      const state = await storage.getPanelState();
      await storage.savePanelState({ ...state, position: this.position });
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  async refresh(): Promise<void> {
    await this.loadData();
    this.render();
  }
}
