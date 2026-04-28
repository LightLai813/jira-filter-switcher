interface ToolbarOptions {
  onAdd: () => void;
  onCollapse: () => void;
  onDragStart: (e: MouseEvent) => void;
}

export class Toolbar {
  readonly el: HTMLDivElement;
  private collapseBtn: HTMLButtonElement;

  constructor(container: HTMLElement, options: ToolbarOptions) {
    this.el = document.createElement('div');
    this.el.className = 'jfs-toolbar';

    const title = document.createElement('span');
    title.className = 'jfs-toolbar-title';
    title.innerHTML = `<svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" style="vertical-align:-2px;margin-right:5px"><path d="M1.5 2.75A.75.75 0 0 1 2.25 2h11.5a.75.75 0 0 1 .56 1.248L9.5 9.12V13.25a.75.75 0 0 1-1.105.66l-2.5-1.5A.75.75 0 0 1 5.5 11.75V9.12L1.69 3.248A.75.75 0 0 1 1.5 2.75z"/></svg>Filters`;
    title.addEventListener('mousedown', (e) => options.onDragStart(e));

    const actionsEl = document.createElement('div');
    actionsEl.className = 'jfs-toolbar-actions';

    const addBtn = document.createElement('button');
    addBtn.className = 'jfs-btn';
    addBtn.title = 'Add filter';
    addBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path d="M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2z"/>
    </svg>`;
    addBtn.addEventListener('click', options.onAdd);

    this.collapseBtn = document.createElement('button');
    this.collapseBtn.className = 'jfs-btn';
    this.collapseBtn.addEventListener('click', options.onCollapse);

    actionsEl.appendChild(addBtn);
    actionsEl.appendChild(this.collapseBtn);

    this.el.appendChild(title);
    this.el.appendChild(actionsEl);
    container.appendChild(this.el);
  }

  setCollapsed(collapsed: boolean): void {
    this.collapseBtn.title = collapsed ? 'Expand' : 'Collapse';
    this.collapseBtn.innerHTML = collapsed
      ? `<svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M6 2l6 6-6 6V2z"/></svg>`
      : `<svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M14 6l-6 6-6-6h12z"/></svg>`;
  }
}
