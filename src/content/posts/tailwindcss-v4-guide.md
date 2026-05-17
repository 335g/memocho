---
title: "Tailwind CSS v4 入門"
description: "Tailwind CSS v4の新機能とAstroでの設定方法を解説します。"
pubDate: 2026-05-14
updatedDate: 2026-05-16
tags: ["css", "tailwindcss", "design"]
---

## Tailwind CSS v4 の変更点

Tailwind CSS v4では、設定方法が大きく変わりました。

### Viteプラグインとしての導入

```js
// astro.config.mjs
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
});
```

### CSSベースの設定

`tailwind.config.js` の代わりに、CSSファイル内で `@theme` ディレクティブを使って設定します。
