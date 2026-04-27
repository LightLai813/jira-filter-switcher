interface DragManagerOptions {
  onReorder: (ids: string[]) => void;
}

export class DragManager {
  private dragSrcId: string | null = null;
  private listEl: HTMLUListElement | null = null;

  attach(listEl: HTMLUListElement, options: DragManagerOptions): void {
    this.listEl = listEl;
    listEl.addEventListener('dragstart', (e) => this.onDragStart(e));
    listEl.addEventListener('dragover', (e) => this.onDragOver(e));
    listEl.addEventListener('drop', (e) => this.onDrop(e, options));
    listEl.addEventListener('dragend', () => this.onDragEnd());
    listEl.addEventListener('dragleave', (e) => this.onDragLeave(e));
  }

  private getItem(e: DragEvent): HTMLLIElement | null {
    return (e.target as HTMLElement).closest<HTMLLIElement>('[data-filter-id]');
  }

  private onDragStart(e: DragEvent): void {
    const handle = (e.target as HTMLElement).closest('.jfs-drag-handle');
    if (!handle) { e.preventDefault(); return; }
    const li = handle.closest<HTMLLIElement>('[data-filter-id]');
    if (!li) return;
    this.dragSrcId = li.dataset.filterId!;
    e.dataTransfer!.effectAllowed = 'move';
    e.dataTransfer!.setData('text/plain', this.dragSrcId);
    requestAnimationFrame(() => li.classList.add('jfs-dragging'));
  }

  private onDragOver(e: DragEvent): void {
    e.preventDefault();
    e.dataTransfer!.dropEffect = 'move';
    const li = this.getItem(e);
    if (!li || li.dataset.filterId === this.dragSrcId) return;
    this.clearIndicators();
    const rect = li.getBoundingClientRect();
    li.classList.add(e.clientY < rect.top + rect.height / 2 ? 'jfs-insert-before' : 'jfs-insert-after');
  }

  private onDragLeave(e: DragEvent): void {
    const related = e.relatedTarget as HTMLElement | null;
    if (!this.listEl?.contains(related)) this.clearIndicators();
  }

  private onDrop(e: DragEvent, options: DragManagerOptions): void {
    e.preventDefault();
    const li = this.getItem(e);
    if (!li || !this.dragSrcId || li.dataset.filterId === this.dragSrcId) return;

    const insertBefore = li.classList.contains('jfs-insert-before');
    this.clearIndicators();

    const items = Array.from(this.listEl!.querySelectorAll<HTMLLIElement>('[data-filter-id]'));
    const srcIdx = items.findIndex(el => el.dataset.filterId === this.dragSrcId);
    const destIdx = items.findIndex(el => el === li);
    if (srcIdx === -1 || destIdx === -1) return;

    const ids = items.map(el => el.dataset.filterId!);
    const [removed] = ids.splice(srcIdx, 1);
    const insertAt = insertBefore ? destIdx : destIdx + 1;
    const adjustedIdx = srcIdx < destIdx && !insertBefore ? insertAt - 1 : insertAt;
    ids.splice(adjustedIdx < 0 ? 0 : adjustedIdx, 0, removed);

    options.onReorder(ids);
  }

  private onDragEnd(): void {
    if (this.dragSrcId && this.listEl) {
      const src = this.listEl.querySelector<HTMLLIElement>(`[data-filter-id="${this.dragSrcId}"]`);
      src?.classList.remove('jfs-dragging');
    }
    this.clearIndicators();
    this.dragSrcId = null;
  }

  private clearIndicators(): void {
    this.listEl?.querySelectorAll('.jfs-insert-before, .jfs-insert-after').forEach(el => {
      el.classList.remove('jfs-insert-before', 'jfs-insert-after');
    });
  }
}
