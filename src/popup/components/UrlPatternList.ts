import type { UrlPattern } from '../../shared/types';
import { getUrlPatterns, saveUrlPatterns } from '../../shared/storage';
import { t } from '../../shared/i18n';

async function reloadCurrentTab(): Promise<void> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.location.reload(),
    });
  }
}

export class UrlPatternList {
  private patterns: UrlPattern[] = [];

  constructor(
    private container: HTMLElement,
    private input: HTMLInputElement,
    addBtn: HTMLButtonElement,
  ) {
    addBtn.addEventListener('click', () => this.addPattern());
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') this.addPattern(); });
  }

  async load(): Promise<void> {
    this.patterns = await getUrlPatterns();
    this.render();
  }

  private render(): void {
    this.container.innerHTML = '';
    if (!this.patterns.length) {
      const empty = document.createElement('div');
      empty.style.cssText = 'font-size:12px;color:#97a0af;font-style:italic;padding:4px 0';
      empty.textContent = t('noPatternsMessage');
      this.container.appendChild(empty);
      return;
    }

    const list = document.createElement('div');
    list.className = 'pattern-list';
    this.patterns.forEach((p) => {
      const isEnabled = p.enabled ?? true;

      const row = document.createElement('div');
      row.className = 'pattern-item' + (isEnabled ? '' : ' disabled');

      const toggle = document.createElement('label');
      toggle.className = 'pattern-toggle';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = isEnabled;
      checkbox.addEventListener('change', () => this.togglePattern(p.id));

      const track = document.createElement('span');
      track.className = 'pattern-toggle-track';

      toggle.appendChild(checkbox);
      toggle.appendChild(track);

      const text = document.createElement('span');
      text.className = 'pattern-text';
      text.textContent = p.pattern;

      const del = document.createElement('button');
      del.className = 'pattern-del';
      del.title = t('removeButton');
      del.textContent = '×';
      del.addEventListener('click', () => this.removePattern(p.id));

      row.appendChild(toggle);
      row.appendChild(text);
      row.appendChild(del);
      list.appendChild(row);
    });
    this.container.appendChild(list);
  }

  private async addPattern(): Promise<void> {
    const value = this.input.value.trim();
    if (!value) return;
    const pattern: UrlPattern = { id: crypto.randomUUID(), pattern: value, enabled: true };
    this.patterns.push(pattern);
    await saveUrlPatterns(this.patterns);
    this.input.value = '';
    this.render();
    await reloadCurrentTab();
  }

  private async togglePattern(id: string): Promise<void> {
    const p = this.patterns.find(item => item.id === id);
    if (!p) return;
    p.enabled = !(p.enabled ?? true);
    await saveUrlPatterns(this.patterns);
    this.render();
    await reloadCurrentTab();
  }

  private async removePattern(id: string): Promise<void> {
    this.patterns = this.patterns.filter(p => p.id !== id);
    await saveUrlPatterns(this.patterns);
    this.render();
    await reloadCurrentTab();
  }
}
