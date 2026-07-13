const { HtmlBasePlugin } = require("@11ty/eleventy");

module.exports = function (eleventyConfig) {
  // GitHub Pagesのサブパス（https://ユーザー名.github.io/リポジトリ名/）対応。
  // リポジトリ名を変える場合はここと src/_data/site.json のurlを変更。
  // 独自ドメインにする場合は "/" にする。
  eleventyConfig.addPlugin(HtmlBasePlugin);

  // 静的アセットをそのままコピー
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  // ---- コレクション ----------------------------------------------------

  // 全記事（新しい順）
  eleventyConfig.addCollection("articles", (api) =>
    api.getFilteredByGlob("src/articles/**/*.md").sort((a, b) => b.date - a.date)
  );

  // タグ一覧（記事の tags を集計。件数付き）
  eleventyConfig.addCollection("tagList", (api) => {
    const counts = new Map();
    api.getFilteredByGlob("src/articles/**/*.md").forEach((item) => {
      (item.data.tags || []).forEach((t) => counts.set(t, (counts.get(t) || 0) + 1));
    });
    return [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  });

  // ---- フィルタ ----------------------------------------------------------

  // 日本語タグ対応のslug（英数字は小文字化、日本語はそのまま保持）
  eleventyConfig.addFilter("tagSlug", (str) =>
    String(str)
      .trim()
      .toLowerCase()
      .replace(/[\s\/\\?#%&=+]+/g, "-")
      .replace(/[・、。「」（）()]/g, "")
  );

  // 日付表示: 2026年7月12日
  eleventyConfig.addFilter("dateJP", (d) => {
    const dt = new Date(d);
    return `${dt.getFullYear()}年${dt.getMonth() + 1}月${dt.getDate()}日`;
  });

  // ISO 8601（構造化データ・sitemap用）
  eleventyConfig.addFilter("dateISO", (d) => new Date(d).toISOString());

  // カテゴリ slug → カテゴリ情報
  eleventyConfig.addFilter("categoryInfo", (slug, categories) => {
    for (const group of categories) {
      const found = group.items.find((c) => c.slug === slug);
      if (found) return { ...found, group: group.name, groupSlug: group.slug };
    }
    return { slug, name: slug, group: "" };
  });

  // カテゴリ slug で記事を絞り込み
  eleventyConfig.addFilter("byCategory", (articles, slug) =>
    articles.filter((a) => a.data.category === slug)
  );

  // タグ名で記事を絞り込み
  eleventyConfig.addFilter("byTag", (articles, tag) =>
    articles.filter((a) => (a.data.tags || []).includes(tag))
  );

  // 関連記事: 同カテゴリ +2点、共有タグ1つにつき +1点 → 上位4件
  eleventyConfig.addFilter("related", (articles, current, limit = 4) => {
    const curTags = new Set(current.data.tags || []);
    return articles
      .filter((a) => a.url !== current.url)
      .map((a) => {
        let score = 0;
        if (a.data.category && a.data.category === current.data.category) score += 2;
        (a.data.tags || []).forEach((t) => { if (curTags.has(t)) score += 1; });
        return { item: a, score };
      })
      .filter((x) => x.score > 0)
      .sort((x, y) => y.score - x.score || y.item.date - x.item.date)
      .slice(0, limit)
      .map((x) => x.item);
  });

  // 先頭 n 件
  eleventyConfig.addFilter("limit", (arr, n) => arr.slice(0, n));

  // 記事本文から説明文を自動生成（description未指定時の保険）
  eleventyConfig.addFilter("excerpt", (content, len = 110) => {
    if (!content) return "";
    const text = content.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    return text.length > len ? text.slice(0, len) + "…" : text;
  });

  return {
    pathPrefix: "/space/",
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
