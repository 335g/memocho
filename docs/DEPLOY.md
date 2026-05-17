# Cloudflare Pages デプロイ手順

## 1. 前提条件

- GitHub リポジトリにコードがプッシュ済みであること
- Cloudflare アカウントがあること

## 2. Cloudflare Pages プロジェクト作成

### Workers & Pages ダッシュボード

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Pages** タブ
2. **Create a project** → **Connect to Git**
3. GitHub アカウントを連携し、リポジトリを選択
4. **Begin setup**

### ビルド設定

| 項目 | 値 |
|------|-----|
| **Production branch** | `main` |
| **Framework preset** | Astro |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Node.js version** | `22` (`.nvmrc` から自動検出) |

> **Note**: `.nvmrc` に `22` を指定しているため、Node.js バージョンは自動検出される。

### 環境変数

静的サイトのため、**環境変数の追加は不要**。

| 変数 | 値 | 備考 |
|------|-----|------|
| (なし) | | `postbuild` で Pagefind のインデックスを生成 |

### ビルドプロセス

```
npm install
  ↓
npm run build
  ├── astro build       # HTML / CSS / JS / OGP 画像生成
  └── npx pagefind ...   # 全文検索インデックス生成 (postbuild)
  ↓
dist/ を CDN へデプロイ
```

## 3. カスタムドメイン（任意）

1. Cloudflare Pages プロジェクト → **Custom domains**
2. ドメインを追加（例: `memocho.pages.dev` はデフォルトで利用可能）
3. 外部ドメインの場合は DNS 設定

## 4. 確認項目

`npm run build` 後に `dist/` に以下が含まれていること：

- [ ] HTML ページ（`index.html`, `posts/*/index.html`, `tags/*/index.html`）
- [ ] 静的アセット（`_astro/*.css`, `_astro/*.js`）
- [ ] OGP 画像（`og/*.png`）
- [ ] Pagefind インデックス（`pagefind/*`）
- [ ] Sitemap（`sitemap-0.xml`, `sitemap-index.xml`）
- [ ] `_headers`（セキュリティヘッダー）

## 5. トラブルシューティング

### `@resvg/resvg-js` のネイティブバインドエラー

`@resvg/resvg-js` はプラットフォーム固有のバイナリを含む。Cloudflare Pages のビルド環境（Linux x64）では正常に動作する。エラーが出る場合は以下を確認：

```bash
npm rebuild @resvg/resvg-js
```

### Pagefind インデックスが空

`pagefind` コマンドが `dist/` の HTML を正しく検索できているか確認：

```bash
ls dist/pagefind/
```

`pagefind.js`, `pagefind-entry.json` が生成されていれば正常。

### 検索が本番で動かない

`dist/pagefind/pagefind.js` が CDN にデプロイされていることを確認。`/pagefind/pagefind.js` にアクセスできるか確認。

### デプロイ後のキャッシュ

`public/_headers` でキャッシュ設定をしているが、デプロイ直後は Cloudflare CDN が古いキャッシュを返すことがある。必要に応じて Cloudflare ダッシュボードから **Cache → Purge Everything** を実行。
