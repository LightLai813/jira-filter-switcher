import type { FilterItem } from '../../shared/types';

interface FilterStrategy {
  canApply(item: FilterItem): boolean;
  apply(item: FilterItem): Promise<void>;
}

function waitForElement(selector: string, timeout = 3000): Promise<Element> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(selector);
    if (existing) return resolve(existing);
    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) { observer.disconnect(); resolve(el); }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => { observer.disconnect(); reject(new Error(`Timeout waiting for: ${selector}`)); }, timeout);
  });
}

const ASSIGNEE_FIELDSET = 'fieldset[data-test-id="filters.ui.filters.assignee.stateless.assignee-filter"]';
const SHOW_MORE_BTN = 'button[data-testid="filters.ui.filters.assignee.stateless.show-more-button.assignee-filter-show-more"]';

class AssigneeFilterStrategy implements FilterStrategy {
  canApply(item: FilterItem) { return item.type === 'assignee'; }

  async apply(item: FilterItem): Promise<void> {
    const keyword = item.keyword.toLowerCase();

    // Step 1: wait for the assignee panel to render, then look for a visible checkbox
    let fieldset: Element | null = null;
    try {
      fieldset = await waitForElement(ASSIGNEE_FIELDSET, 2000);
    } catch {
      // panel not present — will attempt show-more fallback
    }

    if (fieldset) {
      const inputs = Array.from(fieldset.querySelectorAll<HTMLInputElement>('input[aria-label]'));
      const match = inputs.find(el => el.getAttribute('aria-label')!.toLowerCase().includes(keyword));
      if (match) {
        match.click();
        return;
      }
    }

    // Step 2: keyword not in visible list — click "show more" to expand
    const showMore = document.querySelector<HTMLButtonElement>(SHOW_MORE_BTN);
    if (!showMore) {
      console.warn('[JFS] Assignee filter fieldset and show-more button not found.');
      return;
    }
    showMore.click();

    // Step 3: wait for the expanded menu and find the item by text content
    try {
      await waitForElement('div[role="menu"]');
    } catch {
      console.warn('[JFS] Expanded assignee menu did not appear in time.');
      return;
    }

    const menu = document.querySelector('div[role="menu"]');
    if (!menu) return;

    const divs = Array.from(menu.querySelectorAll<HTMLElement>('div'));
    const target = divs.find(el =>
      el.children.length === 0 && el.textContent?.toLowerCase().includes(keyword)
    );
    if (target) {
      target.click();
    } else {
      console.warn('[JFS] No menu item matched keyword:', item.keyword);
    }
  }
}

const QUICK_FILTER_BTN = 'span[data-testid="filters.common.ui.list.快速篩選條件-filter"]';
const QUICK_FILTER_MENU = 'div[data-testid="filters.common.ui.list.menu-list-wrapper"]';

class CustomFilterStrategy implements FilterStrategy {
  canApply(item: FilterItem) { return item.type === 'customFilter'; }

  async apply(item: FilterItem): Promise<void> {
    const keyword = item.keyword.toLowerCase();

    const btn = document.querySelector<HTMLElement>(QUICK_FILTER_BTN);
    if (!btn) {
      console.warn('[JFS] Quick filter button not found.');
      return;
    }
    btn.click();

    try {
      await waitForElement(QUICK_FILTER_MENU);
    } catch {
      console.warn('[JFS] Quick filter menu did not appear in time.');
      return;
    }

    const menu = document.querySelector(QUICK_FILTER_MENU);
    if (!menu) return;

    const divs = Array.from(menu.querySelectorAll<HTMLElement>('div'));
    const target = divs.find(el =>
      el.children.length === 0 && el.textContent?.toLowerCase().includes(keyword)
    );
    if (target) {
      target.click();
    } else {
      console.warn('[JFS] No menu item matched keyword:', item.keyword);
    }
  }
}

const CLEAR_BTN = 'div[data-test-id="filters.ui.filters.clear-button.ak-button"] > button';

export class FilterApplicator {
  private strategies: FilterStrategy[] = [
    new AssigneeFilterStrategy(),
    new CustomFilterStrategy(),
  ];

  async apply(item: FilterItem): Promise<void> {
    const strategy = this.strategies.find(s => s.canApply(item));
    if (!strategy) {
      console.warn('[JFS] No strategy for filter type:', item.type);
      return;
    }

    document.querySelector<HTMLElement>(CLEAR_BTN)?.click();

    await strategy.apply(item);

    await new Promise(resolve => setTimeout(resolve, 200));
    document.body.click();
  }
}
