import type { ExportBundle } from '../../shared/types';
import { loadAll, saveAll } from '../../shared/storage';
import { SCHEMA_VERSION } from '../../shared/constants';

export class ImportExport {
  constructor(
    exportBtn: HTMLButtonElement,
    private importInput: HTMLInputElement,
    private statusEl: HTMLElement,
    private onImported: () => void,
  ) {
    exportBtn.addEventListener('click', () => this.exportJson());
    importInput.addEventListener('change', () => this.importJson());
  }

  private async exportJson(): Promise<void> {
    const data = await loadAll();
    const bundle: ExportBundle = {
      exportedAt: new Date().toISOString(),
      schemaVersion: SCHEMA_VERSION,
      filters: data.filters,
      urlPatterns: data.urlPatterns,
    };
    const json = JSON.stringify(bundle, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jira-filter-switcher-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.setStatus('Exported successfully.', 'success');
  }

  private importJson(): void {
    const file = this.importInput.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const json = e.target?.result as string;
        const bundle = JSON.parse(json) as Partial<ExportBundle>;
        if (!bundle.filters || !Array.isArray(bundle.filters)) {
          throw new Error('Invalid format: missing filters array.');
        }
        const current = await loadAll();
        await saveAll({
          ...current,
          filters: bundle.filters,
          urlPatterns: bundle.urlPatterns ?? current.urlPatterns,
        });
        this.setStatus(`Imported ${bundle.filters.length} filter(s).`, 'success');
        this.onImported();
      } catch (err) {
        this.setStatus(`Import failed: ${(err as Error).message}`, 'error');
      }
      this.importInput.value = '';
    };
    reader.readAsText(file);
  }

  private setStatus(msg: string, type: 'success' | 'error'): void {
    this.statusEl.textContent = msg;
    this.statusEl.className = `status-msg ${type}`;
    setTimeout(() => { this.statusEl.textContent = ''; this.statusEl.className = 'status-msg'; }, 3000);
  }
}
