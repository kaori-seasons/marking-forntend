/**
 * @fileOverview track g6
 * Experience improvement program
 */
var Global = require('./global');

var SERVER_URL = 'https://kcart.alipay.com/web/bi.do';

var version = require('./version');

var Util = require('./util/'); // 延迟发送请求


setTimeout(function () {
  var track = Global.track;

  if (Global.track) {
    var image = new Image();
    var newObj = {
      pg: document.URL,
      r: new Date().getTime(),
      g6: true,
      version: version,
      page_type: 'syslog'
    };

    if (Util.isObject(track)) {
      Util.mix(newObj, track);
    }

    var d = encodeURIComponent(JSON.stringify([newObj]));
    image.src = SERVER_URL + "?BIProfile=merge&d=" + d;
  }
}, 2000);