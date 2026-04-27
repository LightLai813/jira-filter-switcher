interface KeyboardNavigatorOptions {
  onActivate: (id: string) => void;
  onEscape: () => void;
}

export class KeyboardNavigator {
  attach(container: HTMLElement, options: KeyboardNavigatorOptions): void {
    container.addEventListener('keydown', (e: KeyboardEvent) => {
      const items = Array.from(
        container.querySelectorAll<HTMLLIElement>('[data-filter-id]')
      );
      if (!items.length) return;

      const focused = container.querySelector<HTMLLIElement>('[data-filter-id]:focus');
      const currentIdx = focused ? items.indexOf(focused) : -1;

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
          if (focused?.dataset.filterId) options.onActivate(focused.dataset.filterId);
          break;
        }
        case 'Escape':
          e.preventDefault();
          options.onEscape();
          break;
      }
    });
  }

  focusActive(container: HTMLElement, activeId: string | null): void {
    if (!activeId) return;
    const el = container.querySelector<HTMLLIElement>(`[data-filter-id="${activeId}"]`);
    el?.focus();
  }
}
