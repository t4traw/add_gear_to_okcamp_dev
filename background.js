chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.tabs.sendMessage(tab.id, "Action");
});

var params = {};
var categories = {};
var makers = {};

// まずaccess_tokenがactiveなのかどうかを検証する

// access_tokenが無効だった場合はログインをさせる

// TODO 将来的にはcategoriesとmakersはlocalStorageにキャッシュデータを保存しておいて高速化

// 実際のpopup.htmlに値を渡す
var category_json = new XMLHttpRequest();
category_json.open("get", "./categories.json", true);
category_json.onload = function(){
  // console.log(this.responseText);
  var json = JSON.parse(this.responseText);
  for (var i=0; i<json.length; i++){
    categories[json[i]['id']] = json[i]['name_ja']
  }
}
category_json.send(null);

var maker_json = new XMLHttpRequest();
maker_json.open("get", "./makers.json", true);
maker_json.onload = function(){
  // console.log(this.responseText);
  var json = JSON.parse(this.responseText);
  for (var i=0; i<json.length; i++){
    makers[json[i]['id']] = json[i]['name_ja']
  }
}
maker_json.send(null);

// ここでメーカーとカテゴリーを正確じゃないにしても把握できるのか？

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse){
    name_arr = [request.title, request.current_color, request.current_style]
    mixed_title = name_arr.filter(function(e){return e}).join(' ')
    params['asin'] = request.asin;
    params['title'] = mixed_title;
    params['weight'] = request.weight;
    params['description'] = request.description;
    chrome.tabs.create({"url": "popup.html" });
  }
);
