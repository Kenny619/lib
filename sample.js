// XMLHttpRequestオブジェクトの作成
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var request = new XMLHttpRequest();


//parameters
var affiliate_id = '4urpleasures-990';
var api_id = 'B5pKGfh2z1kpC1LLsXxD';
var URL = 'https://api.dmm.com/affiliate/v3/ItemList?api_id=' + api_id + '&affiliate_id=' + affiliate_id + '&site=FANZA&service=digital&floor=videoa&hits=10&sort=match&output=json';
var keyword = 'YMDD-061';

//edit URL
URL = URL + '&' + keyword;

// URLを開く
request.open('GET', URL, true);

// レスポンスが返ってきた時の処理を記述
request.onload = function () {
  // レスポンスが返ってきた時の処理
  var data = this.response;
     console.log(data);
}

// リクエストをURLに送信
request.send();
document.write(data);
