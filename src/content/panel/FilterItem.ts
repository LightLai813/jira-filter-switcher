import type { FilterItem as FilterItemData } from '../../shared/types';

interface FilterItemOptions {
  onActivate: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const TYPE_LABELS: Record<string, string> = { assignee: 'Assignee', customFilter: 'Filter' };

export function createFilterItemEl(item: FilterItemData, active: boolean, options: FilterItemOptions): HTMLLIElement {
  const li = document.createElement('li');
  li.className = 'jfs-filter-item' + (active ? ' jfs-active' : '');
  li.dataset.filterId = item.id;
  li.tabIndex = 0;
  li.draggable = true;

  const handle = document.createElement('span');
  handle.className = 'jfs-drag-handle';
  handle.title = 'Drag to reorder';
  handle.innerHTML = `<svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor">
    <circle cx="4" cy="4" r="1.5"/><circle cx="8" cy="4" r="1.5"/>
    <circle cx="4" cy="8" r="1.5"/><circle cx="8" cy="8" r="1.5"/>
    <circle cx="4" cy="12" r="1.5"/><circle cx="8" cy="12" r="1.5"/>
  </svg>`;

  const name = document.createElement('span');
  name.className = 'jfs-item-name';
  name.textContent = item.name;
  name.title = item.name;

  const badge = document.createElement('span');
  badge.className = 'jfs-item-type';
  badge.textContent = TYPE_LABELS[item.type] ?? item.type;

  const actions = document.createElement('div');
  actions.className = 'jfs-item-actions';

  const editBtn = document.createElement('button');
  editBtn.className = 'jfs-item-btn';
  editBtn.title = 'Edit';
  editBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
    <path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61z"/>
  </svg>`;
  editBtn.addEventListener('click', (e) => { e.stopPropagation(); options.onEdit(item.id); });

  const delBtn = document.createElement('button');
  delBtn.className = 'jfs-item-btn jfs-delete-btn';
  delBtn.title = 'Delete';
  delBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
    <path d="M11 1.75V3h2.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75zM6.5 1.75V3h3V1.75a.25.25 0 0 0-.25-.25h-2.5a.25.25 0 0 0-.25.25zM4.997 6.5a.75.75 0 0 0-1.498.064l.5 7.5a.75.75 0 0 0 1.498-.064l-.5-7.5zm6.504.063a.75.75 0 1 0-1.498-.063l-.5 7.5a.75.75 0 0 0 1.498.063l.5-7.5z"/>
  </svg>`;
  delBtn.addEventListener('click', (e) => { e.stopPropagation(); options.onDelete(item.id); });

  actions.appendChild(editBtn);
  actions.appendChild(delBtn);

  li.appendChild(handle);
  li.appendChild(name);
  if (active) {
    const activeTag = document.createElement('span');
    activeTag.className = 'jfs-item-active-tag';
    activeTag.textContent = 'Active';
    li.appendChild(activeTag);
  }
  li.appendChild(badge);
  li.appendChild(actions);

  li.addEventListener('click', () => options.onActivate(item.id));
  li.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); options.onActivate(item.id); }
  });

  return li;
}
