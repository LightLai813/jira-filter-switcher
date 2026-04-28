interface KeyboardNavigatorOptions {
  onActivate: (id: string) => void;
  onEscape: () => void;
}

export class KeyboardNavigator {
  private container: HTMLElement | null = null;
  private options: KeyboardNavigatorOptions | null = null;

  attach(container: HTMLElement, options: KeyboardNavigatorOptions): void {
    this.container = container;
    this.options = options;
  }

  handle(e: KeyboardEvent): void {
    if (!this.container || !this.options) return;
    const items = Array.from(
      this.container.querySelectorAll<HTMLLIElement>('[data-filter-id]')
    );
    if (!items.length) return;

    const root = this.container.getRootNode() as ShadowRoot;
    const shadowFocused = root.activeElement as HTMLLIElement | null;
    const currentIdx = shadowFocused ? items.indexOf(shadowFocused) : -1;

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        const next = currentIdx < items.length - 1 ? currentIdx + 1 : 0;
        items[next].focus();
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        const prev = currentIdx > 0 ? currentIdx - 1 : items.length - 1;
        items[prev].focus();
        break;
      }
      case 'Enter':
      case ' ': {
        e.preventDefault();
        if (shadowFocused?.dataset.filterId) this.options.onActivate(shadowFocused.dataset.filterId);
        break;
      }
      case 'Escape':
        e.preventDefault();
        this.options.onEscape();
        break;
    }
  }

  focusActive(activeId: string | null): void {
    if (!activeId || !this.container) return;
    const el = this.container.querySelector<HTMLLIElement>(`[data-filter-id="${activeId}"]`);
    el?.focus();
  }

  focusFirst(): void {
    if (!this.container) return;
    const first = this.container.querySelector<HTMLLIElement>('[data-filter-id]');
    first?.focus();
  }
}
