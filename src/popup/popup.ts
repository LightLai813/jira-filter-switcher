import { UrlPatternList } from './components/UrlPatternList';
import { ImportExport } from './components/ImportExport';
import { getFilters } from '../shared/storage';
import { t } from '../shared/i18n';

function applyI18n(): void {
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n!);
  });
  document.querySelectorAll<HTMLElement>('[data-i18n-html]').forEach(el => {
    el.innerHTML = t(el.dataset.i18nHtml!);
  });
  document.querySelectorAll<HTMLInputElement>('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder!);
  });
}

async function updateFilterCount(): Promise<void> {
  const filters = await getFilters();
  const el = document.getElementById('filter-count')!;
  el.textContent = filters.length === 0
    ? t('noFiltersConfigured')
    : t('filtersConfigured', String(filters.length));
}

async function init(): Promise<void> {
  applyI18n();

  const urlList = new UrlPatternList(
    document.getElementById('url-patterns-container')!,
    document.getElementById('new-pattern-input') as HTMLInputElement,
    document.getElementById('add-pattern-btn') as HTMLButtonElement,
  );
  await urlList.load();

  new ImportExport(
    document.getElementById('export-btn') as HTMLButtonElement,
    document.getElementById('import-input') as HTMLInputElement,
    document.getElementById('import-status')!,
    async () => {
      await urlList.load();
      await updateFilterCount();
    },
  );

  await updateFilterCount();
}

document.addEventListener('DOMContentLoaded', init);
