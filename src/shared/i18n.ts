type Messages = Record<string, string>;

const zhTW: Messages = {
  urlPatternsTitle: "啟用的 URL 規則",
  urlPatternsDesc:
    "符合以下規則的頁面會顯示面板，可用 <code>*</code> 作為萬用字元。",
  patternPlaceholder: "https://*.atlassian.net/*",
  addButton: "新增",
  exportImportTitle: "資料匯出/匯入",
  exportButton: "匯出 JSON",
  importButton: "匯入 JSON",
  noFiltersConfigured: "尚未設定篩選器",
  filtersConfigured: "已設定 $1 個篩選器",
  noPatternsMessage: "尚無規則，面板不會在任何頁面顯示。",
  removeButton: "移除",
  exportedSuccessfully: "匯出成功。",
  invalidFormat: "格式錯誤：缺少 filters 陣列。",
  importedFilters: "已匯入 $1 個篩選器。",
  importFailed: "匯入失敗：$1",
  filtersTitle: "篩選器",
  addFilter: "新增篩選器",
  shuffleFilters: "隨機排列",
  expand: "展開",
  collapse: "收合",
  noFiltersYet: "尚無篩選器，點擊 + 新增。",
  filterEditorTitle: "篩選器",
  filterNamePlaceholder: "篩選器名稱",
  assigneeType: "受託人",
  customFilterType: "快速篩選",
  keywordPlaceholder: "關鍵字 / 使用者名稱",
  cancelButton: "取消",
  saveButton: "儲存",
  editFilterTitle: "編輯篩選器",
  addFilterTitle: "新增篩選器",
  dragToReorder: "拖曳排序",
  assigneeLabel: "受託人",
  filterLabel: "快速篩選",
  editButton: "編輯",
  deleteButton: "刪除",
  activeBadge: "套用中",
  keyboardHint: "↑↓ 切換篩選 · Alt+Shift+J 關閉 Panel",
};

const en: Messages = {
  urlPatternsTitle: "Active URL Patterns",
  urlPatternsDesc:
    "Pages matching these patterns will show the panel. Use <code>*</code> as a wildcard.",
  patternPlaceholder: "https://*.atlassian.net/*",
  addButton: "Add",
  exportImportTitle: "Export / Import",
  exportButton: "Export JSON",
  importButton: "Import JSON",
  noFiltersConfigured: "No filters configured",
  filtersConfigured: "$1 filter(s) configured",
  noPatternsMessage: "No patterns. Panel will not appear anywhere.",
  removeButton: "Remove",
  exportedSuccessfully: "Exported successfully.",
  invalidFormat: "Invalid format: missing filters array.",
  importedFilters: "Imported $1 filter(s).",
  importFailed: "Import failed: $1",
  filtersTitle: "Filters",
  addFilter: "Add filter",
  shuffleFilters: "Shuffle filters",
  expand: "Expand",
  collapse: "Collapse",
  noFiltersYet: "No filters yet. Click + to add one.",
  filterEditorTitle: "Filter",
  filterNamePlaceholder: "Filter name",
  assigneeType: "Assignee",
  customFilterType: "Custom Filter",
  keywordPlaceholder: "Keyword / username",
  cancelButton: "Cancel",
  saveButton: "Save",
  editFilterTitle: "Edit Filter",
  addFilterTitle: "Add Filter",
  dragToReorder: "Drag to reorder",
  assigneeLabel: "Assignee",
  filterLabel: "Filter",
  editButton: "Edit",
  deleteButton: "Delete",
  activeBadge: "Active",
  keyboardHint: "↑↓ switch filter · Alt+Shift+J close panel",
};

const messages: Messages = chrome.i18n.getUILanguage().startsWith("zh")
  ? zhTW
  : en;

export function t(key: string, ...subs: string[]): string {
  const template = messages[key] ?? key;
  return subs.reduce((acc, val, i) => acc.replace(`$${i + 1}`, val), template);
}
