import { UrlPatternList } from './components/UrlPatternList';
import { ImportExport } from './components/ImportExport';
import { getFilters } from '../shared/storage';

async function updateFilterCount(): Promise<void> {
  const filters = await getFilters();
  const el = document.getElementById('filter-count')!;
  el.textContent = filters.length === 0
    ? 'No filters configured'
    : `${filters.length} filter${filters.length !== 1 ? 's' : ''} configured`;
}

async function init(): Promise<void> {
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
