// このファイルは実際は.gsファイルです。

function doGet(e) {
  const PAGE = e.parameter.page || "home";  // デフォルトはhome
  try {
    // すべてのページ一覧
    const ALL_PAGE = {
      "example": "例1",
      "example2": "例2", 
    };

    // ここは独自です。

    return returnHTML(templateObj, PAGE, ALL_PAGE[PAGE]);
  } catch (error) {
    log_record(EMAIL, PARAMS, 503);

    let templateObj = {
      status_code: 503,
      
      template_error: "サーバーにエラーが発生したため、使用できませんでした。しばらくしてからもう一度アクセスしてください。",
    };

    return returnHTML(templateObj, "error", "503 Unavailable");
  }
}

//  ページ遷移関数
function getAppUrl() {
  return ScriptApp.getService().getUrl();
}

// htmlをテンプレートとして返す関数
function returnHTML(templateObj, file, title) {
  const now = new Date();

  // メインテンプレートの設定と変数注入
  const mainTemplate = HtmlService.createTemplateFromFile(file);
  for (const key in templateObj) {
    mainTemplate[key] = templateObj[key];
  }

  // link.html もテンプレートとして展開
  const linkTemplate = HtmlService.createTemplateFromFile("link.js");
  for (const key in templateObj) {
    linkTemplate[key] = templateObj[key]; // 同じ変数を注入
  }

  // テンプレート評価（HTML文字列として取得）
  const mainHtml = mainTemplate.evaluate().getContent();
  const linkHtml = linkTemplate.evaluate().getContent();

  // 結合して出力
  const finalHtml = mainHtml + linkHtml;

  const output = HtmlService.createHtmlOutput(finalHtml)
    .setTitle(title)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setFaviconUrl(sc_props("favicon"))
    .addMetaTag("viewport", "width=device-width, initial-scale=1")
    .addMetaTag("google-site-verification", "spirix | " + now);

  return output;
}