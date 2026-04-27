import { STORAGE_KEY, SCHEMA_VERSION } from '../shared/constants';

chrome.runtime.onInstalled.addListener(async () => {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  const data = result[STORAGE_KEY];
  if (!data || data.schemaVersion === SCHEMA_VERSION) return;
  await chrome.storage.local.set({
    [STORAGE_KEY]: { ...data, schemaVersion: SCHEMA_VERSION },
  });
});
