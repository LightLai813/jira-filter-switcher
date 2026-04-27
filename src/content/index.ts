import { Panel } from './panel/Panel';
import { getUrlPatterns } from '../shared/storage';
import { INJECTED_FLAG } from '../shared/constants';

declare global {
  interface Window {
    [key: string]: unknown;
  }
}

function urlMatchesPattern(url: string, pattern: string): boolean {
  const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
  try {
    return new RegExp(`^${escaped}$`).test(url);
  } catch {
    return false;
  }
}

async function init(): Promise<void> {
  if (window[INJECTED_FLAG]) return;

  const patterns = await getUrlPatterns();
  if (!patterns.length) return;

  const matches = patterns.some(p => urlMatchesPattern(window.location.href, p.pattern));
  if (!matches) return;

  window[INJECTED_FLAG] = true;
  const panel = new Panel();
  await panel.mount(document.body);
}

init();
