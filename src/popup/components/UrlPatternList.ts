import type { UrlPattern } from '../../shared/types';
import { getUrlPatterns, saveUrlPatterns } from '../../shared/storage';

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
      empty.textContent = 'No patterns. Panel will not appear anywhere.';
      this.container.appendChild(empty);
      return;
    }

    const list = document.createElement('div');
    list.className = 'pattern-list';
    this.patterns.forEach((p) => {
      const row = document.createElement('div');
      row.className = 'pattern-item';

      const text = document.createElement('span');
      text.className = 'pattern-text';
      text.textContent = p.pattern;

      const del = document.createElement('button');
      del.className = 'pattern-del';
      del.title = 'Remove';
      del.textContent = '×';
      del.addEventListener('click', () => this.removePattern(p.id));

      row.appendChild(text);
      row.appendChild(del);
      list.appendChild(row);
    });
    this.container.appendChild(list);
  }

  private async addPattern(): Promise<void> {
    const value = this.input.value.trim();
    if (!value) return;
    const pattern: UrlPattern = { id: crypto.randomUUID(), pattern: value };
    this.patterns.push(pattern);
    await saveUrlPatterns(this.patterns);
    this.input.value = '';
    this.render();
  }

  private async removePattern(id: string): Promise<void> {
    this.patterns = this.patterns.filter(p => p.id !== id);
    await saveUrlPatterns(this.patterns);
    this.render();
  }
}
