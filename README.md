# GAS ページ遷移フレームワーク

**Google Apps Script**(以下GAS) でウェブアプリケーションを開発する際に、HTMLベースのシンプルなページ遷移を実現する軽量フレームワークです。

本フレームワークを導入することで、以下のような書き方が可能になります：

```html
<a href="?page=about">About</a>
<a href="#section1">Section 1</a>
<a href="?page=docs#install">Install</a>
```

GAS本来の構造制約を超えて、HTML標準に近い記述と直感的なページ遷移が実現できます。

## 特徴

- GAS上で疑似的なルーティングが可能(`?page=xxx`)
- `<a>`タグの利用による自然なページ遷移
- ハッシュ遷移(`#section1`)との併用に対応
- 外部リンクも通常通り動作
- クライアント側での補助スクリプトにより滑らかな遷移を実現
- 導入が非常に軽量で、既存GASアプリにも組み込みやすい

## 背景

GAS のウェブアプリでは `doGet(e)` によるパラメータ分岐しかできず、URLパスやアンカーによる本格的なページ遷移が困難です。多くの場合、JavaScriptによるクリックイベントに頼らざるを得ず、HTML本来の構造的な書き方が制限されていました。

このフレームワークは、そうした GAS の制約を緩やかに解消し、以下の課題を解決します：

- `<a href="?page=xxx">` が使えない(`onclick` に頼らざるを得ない)
- クエリとハッシュの併用が難しい
- URLによる画面状態の再現性が低い(リロードや共有が困難)
- SPA的構成が実質不可能

## ファイル構成

このフレームワークは以下の2ファイルのみで構成されます。

| ファイル名 | 内容 |
|:--|:--|
| `code.gs` | メインのGASコード(`doGet()`処理) |
| `link.html` | 共通レイアウトおよびルーティング処理を含むHTMLテンプレート |

## インストール方法

1. Google Apps Script プロジェクトを作成

2. 以下の2ファイルを追加

   - `code.gs`(提供されたコードをそのまま貼り付けてください)
   - `link.html`(ページテンプレートファイル)

3. `link.html` 内に `<a href="?page=about">About</a>` のようにリンクを定義

4. ウェブアプリとしてデプロイし、「アクセスできるユーザー」を「全員」に設定

## 基本的な使い方

### 内部ページ遷移(クエリパラメータ)

```html
<a href="?page=home">ホーム</a>
<a href="?page=contact">お問い合わせ</a>
```

`code.gs` 側で `?page=xxx` を読み取り、該当するHTMLを返します。

### アンカー(スクロール)

```html
<a href="#section1">セクション1へ</a>
```

同一ページ内の任意の要素へスクロールします。`id="section1"` のように記述してください。

### 複合(ページ遷移＋スクロール)

```html
<a href="?page=docs#install">インストール手順</a>
```

ページ遷移後、指定アンカーへスクロールします。

### 外部リンク

```html
<a href="https://example.com" target="_blank">外部サイトへ</a>
```

通常の外部リンクとして動作します(JavaScriptによる干渉はありません)。

## 動作仕様まとめ

| 機能 | `<a href>`の記述形式 | 備考 |
|:--|:--|:--|
| ページ切り替え | `?page=example1` | 例: `/?page=about` |
| ハッシュスクロール | `#example2` | id属性へのスクロール |
| ページ切り替え＋スクロール | `?page=example1#example2` | 両方同時に処理されます |
| 外部リンク遷移 | `https://example.com` | 通常通り外部サイトへ |

## code.gs の構成例

```javascript
function doGet(e) {
  const page = e.parameter.page || 'home';
  const template = HtmlService.createTemplateFromFile('link');
  template.page = page;
  return template.evaluate().setTitle('My GAS App');
}
```

`e.parameter.page` に応じて、表示内容を切り替えるロジックを組み込むことが可能です。

## カスタマイズのヒント

- 共通ヘッダー/フッターを `include()` 関数で分割管理可能
- ページごとの JavaScript 読み込みにも対応
- `<script>` タグの defer 属性を使用することで描画の最適化が可能
- `e.parameter.lang` 等による言語切替や条件分岐も可能

## ライセンス

MIT License

## 問い合わせ・フィードバック

このフレームワークに関する質問・バグ報告・提案などは、GitHubのIssuesからお願いします。

## 今後の予定

- `pushState` による履歴管理対応
- 動的ページ読み込み(Ajax)への拡張
- 自動スクロール調整(ヘッダー固定時のオフセット考慮)
- フォーム送信後のページ維持