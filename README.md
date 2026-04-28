# Jira Filter Switcher

在 Scrum 站立會議時，快速切換 Jira Board 的篩選條件，輕鬆聚焦在當前報告人的相關票券。

---

## 功能介紹

- **浮動面板**：自動在指定頁面顯示，可拖曳至任意位置
- **快速切換篩選**：點擊項目或用鍵盤 ↑↓ 直接切換
- **新增 / 編輯篩選項目**：支援 Assignee（受託人）和 Custom Filter（快速篩選條件）兩種類型
- **拖曳排序**：拖曳 ⠿ 手把調整項目順序
- **隨機排序**：點擊工具列的隨機排序按鈕，一鍵打亂所有篩選項目的順序
- **資料備份**：匯出 / 匯入 `.json` 設定檔
- **快捷鍵**：`Alt + Shift + J` 快速顯示 / 隱藏面板

---

## 開發說明

### 環境需求

- Node.js 18+
- npm 9+

### 安裝依賴

```bash
npm install
```

### 開發模式（自動重新建置）

```bash
npm run dev
```

每次儲存檔案後會自動重新建置到 `dist/`。在 Chrome 套件管理頁面按下重新整理即可套用變更。

### 一次性建置

```bash
npm run build
```

建置結果輸出至 `dist/` 資料夾。

### 專案結構

```
src/
├── manifest.json                  # Chrome 套件設定
├── shared/
│   ├── types.ts                   # 型別定義
│   ├── storage.ts                 # chrome.storage.local 存取封裝
│   └── constants.ts               # 共用常數
├── background/
│   └── service-worker.ts          # MV3 Service Worker（資料遷移）
├── content/
│   ├── index.ts                   # Content Script 進入點
│   ├── content.css                # 面板樣式（注入 Shadow DOM）
│   ├── panel/                     # 浮動面板 UI 元件
│   │   ├── Panel.ts
│   │   ├── Toolbar.ts
│   │   ├── FilterList.ts
│   │   ├── FilterItem.ts
│   │   └── FilterEditor.ts
│   ├── drag/
│   │   └── DragManager.ts         # HTML5 拖曳排序
│   ├── keyboard/
│   │   └── KeyboardNavigator.ts   # 鍵盤導航
│   └── filter/
│       └── FilterApplicator.ts    # 點擊 Jira DOM 套用篩選的邏輯
└── popup/
    ├── popup.html / popup.ts      # 套件彈出視窗
    ├── popup.css
    └── components/
        ├── UrlPatternList.ts      # URL 規則管理
        └── ImportExport.ts        # 匯入 / 匯出
```

---

## 安裝到 Chrome

### 步驟一：建置

```bash
npm run build
```

### 步驟二：開啟 Chrome 套件管理頁面

在網址列輸入：

```
chrome://extensions
```

### 步驟三：開啟開發者模式

點擊右上角的「**開發人員模式**」切換開關。

![開發人員模式](https://developer.chrome.com/static/docs/extensions/get-started/tutorial/hello-world/image/extensions-page-e0d64d89a6acf.png)

### 步驟四：載入套件

點擊「**載入未封裝項目**」，選擇專案的 `dist/` 資料夾。

套件安裝完成後，瀏覽器工具列會出現以下圖示：

![工具列圖示](public/icons/icon128.png)

### 步驟五：設定 URL 規則

點擊工具列圖示開啟設定視窗，在「**啟用的 URL 規則**」新增要顯示面板的網址規則，例如：

```
https://your-company.atlassian.net/*
```

支援 `*` 萬用字元。

### 步驟六：前往 Jira，開始使用！

前往符合規則的 Jira 頁面，浮動面板會自動出現在右上角。

---

## 使用方式

### 新增篩選項目

1. 點擊面板右上角的 **＋** 按鈕
2. 填入：
   - **Filter name**：顯示名稱（自由命名）
   - **Type**：選擇 `Assignee`（受託人）或 `Custom Filter`（快速篩選條件）
   - **Keyword**：篩選關鍵字（受託人的顯示名稱，或快速篩選條件的文字）
3. 點擊 **Save**

### 套用篩選

- 直接**點擊**面板中的項目
- 或用 **↑↓ 方向鍵** 直接切換篩選

### 鍵盤快捷鍵

| 快捷鍵 | 功能 |
|---|---|
| `↑` / `↓` | 直接切換並套用篩選 |
| `Alt + Shift + J` | 顯示 / 隱藏面板 |

### 拖曳排序

抓住項目左側的 **⠿** 手把，拖曳至目標位置放開。

### 隨機排序

點擊工具列的 **隨機排序** 按鈕（shuffle icon），所有篩選項目的順序會立即隨機打亂並儲存。

### 匯出 / 匯入設定

點擊瀏覽器工具列的套件圖示 → **資料匯出/匯入** 區塊：

- **匯出 JSON**：將目前的篩選項目和 URL 規則匯出為 `.json` 檔案
- **匯入 JSON**：從 `.json` 檔案還原設定

---

## 開發注意事項

- 修改 `src/content/filter/FilterApplicator.ts` 中的 `AssigneeFilterStrategy` 和 `CustomFilterStrategy` 以對應 Jira DOM 結構的異動
- 樣式修改請編輯 `src/content/content.css`（面板）或 `src/popup/popup.css`（彈出視窗）
- 資料儲存在 `chrome.storage.local`，重新安裝套件後資料會保留；若需清除，可在 `chrome://extensions` → 套件詳細資訊 → 清除資料
