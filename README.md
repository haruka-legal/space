# 宇宙海事レビュー — サイト運用ガイド

宇宙・海事分野の専門メディアサイト。Eleventy（静的サイトジェネレーター）+ GitHub Pages 構成。
記事はMarkdownで書くだけで、カテゴリページ・タグページ・関連記事・サイトマップ・RSS・llms.txt・構造化データがすべて自動生成されます。

## 公開前に必ずやること

1. **`src/_data/site.json` の `url` を本番URLに変更**（例: `https://example.github.io/repo名` または独自ドメイン）。sitemap・OGP・構造化データすべてに反映されます。
2. `src/_data/site.json` の `author` を確認（名前・肩書き・紹介文）。**行政書士登録が完了してから公開すること。**
3. `src/contact.md` の連絡窓口（TODO箇所）を設定。
4. サンプル記事3本の内容をファクトチェック（法令名・条文・所管はAIが書いた下書きなので、必ず一次資料で確認してから公開）。
5. サイト名は仮に「宇宙海事レビュー」としています。変更する場合は `site.json` の1箇所を直すだけです。

## 記事の書き方

1. `article-template.md` をコピーして `src/articles/` に置く（ファイル名は英語スラッグ、URLになります。例: `space-port-hokkaido.md`）
2. front matter（冒頭の `---` 部分）を記入
   - `category`: `src/_data/categories.json` にあるslugを1つ
   - `tags`: 自由に複数（日本語OK。タグページが自動生成されます）
   - `faq`: 書くとFAQPage構造化データが自動で付きます
   - `updated`: 更新時に追加すると更新日が表示・sitemapに反映
3. 本文は共通テンプレート（概要→制度の背景→現状→行政書士の視点→企業が注意すべき点→今後の展望→参考資料）で執筆
4. `main` ブランチにpushすると自動でビルド・公開されます（GitHub Actions）

## カテゴリの追加・変更

`src/_data/categories.json` に1行追加するだけです。カテゴリページ・トップページ・ナビへの反映は自動です。
海事代理士登録後に「海事代理士業務」等のカテゴリを追加する場合もここに足すだけ。

## ローカルでの確認

```
npm install        # 初回のみ
npm run serve      # http://localhost:8080 でプレビュー（検索以外）
npm run preview    # 検索込みの完全プレビュー
```


## GitHubへのアップ手順（初回）

1. GitHubで新しいリポジトリを作成（例: `haruka-legal/space`・Public）
2. このフォルダの中身を**全部**リポジトリ直下にアップする
   - **`.github` フォルダ（自動デプロイ設定）と `.eleventy.js`・`.gitignore` を忘れずに。** 隠しファイルなのでWeb画面のドラッグ&ドロップだと漏れやすい。GitHub Desktopを使うか、Web画面なら「Add file → Upload files」にフォルダごとドラッグする
   - `node_modules` と `_site` はアップ不要（`.gitignore`済み）
3. リポジトリの Settings → Pages → Source を「**GitHub Actions**」に設定
4. 1〜2分でビルドが走り、https://haruka-legal.github.io/space/ で公開される

以後は `src/articles/` にMarkdownを追加してpushするだけ。**リポジトリに置くのは記事のMarkdownと設定だけなので、記事が千本になってもリポジトリは軽いまま**（ビルド成果物はGitHub側で毎回生成され、コミットされない）。

リポジトリ名を `space` 以外にする場合は2箇所変更:
- `.eleventy.js` の `pathPrefix: "/space/"`
- `src/_data/site.json` の `url`

独自ドメインを使う場合は `pathPrefix` を `"/"` に、`url` をそのドメインに。

### 画像を使うときの軽量化ルール

- 画像は `src/assets/images/` に置き、**幅1200px以下・WebP形式・1枚200KB以下**を目安に
- base64埋め込みは禁止（過去のサイトで83%削減した教訓のとおり）
- 記事は原則テキスト中心でOK。図が必要なときだけ入れる

## 自動生成されるもの

- `/sitemap.xml` — 全ページのサイトマップ
- `/feed.xml` — RSS（新着20件）
- `/llms.txt` — AI検索エンジン向けのサイト説明（新着記事リスト付き）
- `/robots.txt`
- 各記事: Article / BreadcrumbList / FAQPage（faq記入時）のJSON-LD
- カテゴリページ: CollectionPage のJSON-LD
- サイト内検索の索引（Pagefind。ビルド時に生成、記事1000本でも軽量）

## 設計方針（依頼書との対応）

- Webフォント不使用・JSは検索ページのみ → Core Web Vitals最優先
- 記事本文は白背景・明朝見出し（シンクタンク調）、ヘッダー/ヒーローは宇宙紺→海青のグラデーション
- シグネチャ: ヘッダー下・フッター上の「水平線」グラデーションライン（宇宙と海の境界のモチーフ)
- 記事が増えても構造は変わらない（一覧は20件ごとに自動ページ分割）
