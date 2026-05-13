import type { FilterItem, FilterType } from '../../shared/types';
import { t } from '../../shared/i18n';

interface FilterEditorOptions {
  onSave: (item: FilterItem) => void;
  onCancel: () => void;
}

export class FilterEditor {
  private el: HTMLDivElement;
  private titleEl!: HTMLDivElement;
  private nameInput!: HTMLInputElement;
  private typeSelect!: HTMLSelectElement;
  private keywordInput!: HTMLInputElement;
  private editingId: string | null = null;

  constructor(container: HTMLElement, private options: FilterEditorOptions) {
    this.el = document.createElement('div');
    this.el.className = 'jfs-editor jfs-hidden';
    this.build();
    container.appendChild(this.el);
  }

  private build(): void {
    this.titleEl = document.createElement('div');
    this.titleEl.className = 'jfs-editor-title';

    this.nameInput = document.createElement('input');
    this.nameInput.type = 'text';
    this.nameInput.className = 'jfs-input';
    this.nameInput.placeholder = t('filterNamePlaceholder');

    this.typeSelect = document.createElement('select');
    this.typeSelect.className = 'jfs-select';
    const types: Array<{ value: FilterType; labelKey: string }> = [
      { value: 'assignee', labelKey: 'assigneeType' },
      { value: 'customFilter', labelKey: 'customFilterType' },
    ];
    types.forEach(({ value, labelKey }) => {
      const opt = document.createElement('option');
      opt.value = value;
      opt.textContent = t(labelKey);
      this.typeSelect.appendChild(opt);
    });

    this.keywordInput = document.createElement('input');
    this.keywordInput.type = 'text';
    this.keywordInput.className = 'jfs-input';
    this.keywordInput.placeholder = t('keywordPlaceholder');

    const actions = document.createElement('div');
    actions.className = 'jfs-editor-actions';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'jfs-btn-secondary';
    cancelBtn.textContent = t('cancelButton');
    cancelBtn.type = 'button';
    cancelBtn.addEventListener('click', () => this.options.onCancel());

    const saveBtn = document.createElement('button');
    saveBtn.className = 'jfs-btn-primary';
    saveBtn.textContent = t('saveButton');
    saveBtn.type = 'button';
    saveBtn.addEventListener('click', () => this.submit());

    this.nameInput.addEventListener('keydown', (e) => {
      e.stopPropagation();
      if (e.key === 'Escape') this.options.onCancel();
    });
    this.keywordInput.addEventListener('keydown', (e) => {
      e.stopPropagation();
      if (e.key === 'Escape') this.options.onCancel();
    });
    this.typeSelect.addEventListener('keydown', (e) => e.stopPropagation());

    actions.appendChild(cancelBtn);
    actions.appendChild(saveBtn);

    this.el.appendChild(this.titleEl);
    this.el.appendChild(this.nameInput);
    this.el.appendChild(this.typeSelect);
    this.el.appendChild(this.keywordInput);
    this.el.appendChild(actions);
  }

  private submit(): void {
    const name = this.nameInput.value.trim();
    if (!name) { this.nameInput.focus(); return; }
    const keyword = this.keywordInput.value.trim();
    const item: FilterItem = {
      id: this.editingId ?? crypto.randomUUID(),
      name,
      type: this.typeSelect.value as FilterType,
      keyword,
    };
    this.options.onSave(item);
  }

  show(existing?: FilterItem): void {
    this.editingId = existing?.id ?? null;
    this.nameInput.value = existing?.name ?? '';
    this.typeSelect.value = existing?.type ?? 'assignee';
    this.keywordInput.value = existing?.keyword ?? '';
    this.el.classList.remove('jfs-hidden');
    this.titleEl.textContent = existing ? t('editFilterTitle') : t('addFilterTitle');
    requestAnimationFrame(() => this.nameInput.focus());
  }

  hide(): void {
    this.el.classList.add('jfs-hidden');
    this.editingId = null;
  }

  isVisible(): boolean {
    return !this.el.classList.contains('jfs-hidden');
  }
}
