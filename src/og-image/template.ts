/**
 * OGP 画像テンプレート — Satori VDOM を生成する
 *
 * Satori は React ではなく独自の VDOM を扱うため、
 * { type, props: { style, children } } のプレーンなオブジェクトで記述する。
 */

interface OgpTemplateProps {
  title: string;
  date: string;
  siteName: string;
  /** タグ（最大3つまで表示） */
  tags?: string[];
}

/** 1200×630 OGP 画像の Satori VDOM 要素ツリー */
export function ogpElement({
  title,
  date,
  siteName,
  tags = [],
}: OgpTemplateProps) {
  const tagLabels = tags.slice(0, 3).map((t) => `#${t}`).join("  ");

  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: 1200,
        height: 630,
        backgroundColor: "#0f172a",
        fontFamily: '"Noto Sans JP"',
        padding: 80,
        boxSizing: "border-box",
      },
      children: [
        // ── 上段：サイト名 ──
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
              gap: 12,
            },
            children: [
              // ロゴ風アイコン（"M" の文字）
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    backgroundColor: "#3b82f6",
                    fontSize: 24,
                    fontWeight: 700,
                    color: "#ffffff",
                  },
                  children: "M",
                },
              },
              {
                type: "span",
                props: {
                  style: {
                    fontSize: 36,
                    fontWeight: 700,
                    color: "#f8fafc",
                    letterSpacing: "-0.02em",
                  },
                  children: siteName,
                },
              },
            ],
          },
        },

        // ── 中段：記事タイトル ──
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              gap: 8,
              flex: 1,
              justifyContent: "center",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 64,
                    fontWeight: 700,
                    color: "#f8fafc",
                    lineHeight: 1.3,
                    letterSpacing: "-0.01em",
                    maxHeight: 260,
                    overflow: "hidden",
                    display: "-webkit-box",
                    // biome-ignore lint/style/useNamingConvention: Satori のプロパティ
                    WebkitLineClamp: 3,
                  } as Record<string, unknown>,
                  children: title,
                },
              },
            ],
          },
        },

        // ── 下段：日付とタグ ──
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            },
            children: [
              {
                type: "span",
                props: {
                  style: {
                    fontSize: 28,
                    color: "#94a3b8",
                  },
                  children: date,
                },
              },
              tagLabels
                ? {
                    type: "span",
                    props: {
                      style: {
                        fontSize: 24,
                        color: "#3b82f6",
                        fontWeight: 600,
                      },
                      children: tagLabels,
                    },
                  }
                : null,
            ].filter(Boolean),
          },
        },
      ],
    },
  };
}
