// カテゴリを1次元に展開（個別カテゴリページの自動生成に使用）
const categories = require("./categories.json");
module.exports = categories.flatMap((g) =>
  g.items.map((c) => ({ ...c, group: g.name, groupSlug: g.slug }))
);
