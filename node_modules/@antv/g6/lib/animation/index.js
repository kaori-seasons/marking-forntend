/**
 * @fileOverview entry file
 * the animation cfg description
 * @param {object} cfg - animate config
 * @property  {object} cfg.element - G.Element
 * @property  {object} cfg.item - G6.Item
 * @property  {object} cfg.startKeyFrame - start key frame
 * @property  {object} cfg.endKeyFrame - end key frame
 * @property  {object} cfg.startCache - start key frames cache
 * @property  {object} cfg.endCache - end key frames cache
 * @property  {function} cfg.done - should be executed when animate finished
 * @author huangtonger@aliyun.com
 */
var Global = require('../global');
/**
 * scale in animate
 * @param  {object}  item - G.Element
 * @param  {function} callback callback when animate finshed
 */


function scaleIn(item, callback) {
  var group = item.getGraphicGroup();
  var box = item.getBBox();
  var x = (box.minX + box.maxX) / 2;
  var y = (box.minY + box.maxY) / 2;
  var m = group.getMatrix();
  var s = m[0];
  group.transform([['t', -x, -y], ['s', 0.01 / s, 0.01 / s], ['t', x, y]]);
  group.animate({
    transform: [['t', -x, -y], ['s', 100 * s, 100 * s], ['t', x, y]]
  }, Global.enterDuration, Global.enterEasing, callback);
}
/**
 * scale out animate
 * @param  {object}  item - G.Element
 * @param  {function} callback callback when animate finshed
 */


function scaleOut(item, callback) {
  var group = item.getGraphicGroup();
  var box = item.getBBox();
  var x = (box.minX + box.maxX) / 2;
  var y = (box.minY + box.maxY) / 2;
  var m = group.getMatrix();
  var s = m[0];
  group.animate({
    transform: [['t', -x, -y], ['s', 0.01 / s, 0.01 / s], ['t', x, y]]
  }, Global.leaveDuration, Global.leaveEasing, callback);
}
/**
 * fade in animate
 * @param  {object}  group - G.Group item.getGraphicGroup()
 * @param  {function} callback callback when animate finshed
 */


function fadeIn(group, callback) {
  group.deepEach(function (element) {
    if (element.isShape) {
      var fillOpacity = element.attr('fillOpacity');
      var strokeOpacity = element.attr('strokeOpacity');
      element.attr({
        fillOpacity: 0,
        strokeOpacity: 0
      });
      element.animate({
        fillOpacity: fillOpacity,
        strokeOpacity: strokeOpacity
      }, Global.enterDuration, Global.enterEasing, callback);
    }
  });
}
/**
 * fade out animate
 * @param  {object}  group - G.Group item.getGraphicGroup()
 * @param  {function} callback callback when animate finshed
 */


function fadeOut(group, callback) {
  group.deepEach(function (element) {
    var fillOpacity = element.attr('fillOpacity');
    var strokeOpacity = element.attr('strokeOpacity');

    if (element.isShape) {
      element.animate({
        fillOpacity: 0,
        strokeOpacity: 0
      }, Global.leaveDuration, Global.leaveEasing, function () {
        element.attr({
          fillOpacity: fillOpacity,
          strokeOpacity: strokeOpacity
        });
        callback();
      });
    }
  });
}

module.exports = {
  enterScaleIn: function enterScaleIn(_ref) {
    var item = _ref.item,
        element = _ref.element;
    if (!element.isItemContainer || !item.getKeyShape()) return;
    scaleIn(item);
  },
  showScaleIn: function showScaleIn(_ref2) {
    var item = _ref2.item,
        element = _ref2.element;
    if (!element.isItemContainer || !item.getKeyShape()) return;
    scaleIn(item);
  },
  leaveScaleOut: function leaveScaleOut(_ref3) {
    var item = _ref3.item,
        element = _ref3.element,
        done = _ref3.done;
    if (!element.isItemContainer) return;
    scaleOut(item, function () {
      done();
    });
  },
  hideScaleOut: function hideScaleOut(_ref4) {
    var item = _ref4.item,
        element = _ref4.element,
        done = _ref4.done;
    if (!element.isItemContainer) return;
    scaleOut(item, function () {
      done();
    });
  },
  enterFadeIn: function enterFadeIn(_ref5) {
    var element = _ref5.element,
        item = _ref5.item;
    if (!element.isItemContainer || !item.getKeyShape()) return;
    fadeIn(element);
  },
  showFadeIn: function showFadeIn(_ref6) {
    var element = _ref6.element,
        item = _ref6.item;
    if (!element.isItemContainer || !item.getKeyShape()) return;
    fadeIn(element);
  },
  leaveFadeOut: function leaveFadeOut(_ref7) {
    var element = _ref7.element,
        item = _ref7.item,
        done = _ref7.done;
    if (!element.isItemContainer || !item.getKeyShape()) return;
    fadeOut(element, done);
  },
  hideFadeOut: function hideFadeOut(_ref8) {
    var element = _ref8.element,
        item = _ref8.item,
        done = _ref8.done;
    if (!element.isItemContainer || !item.getKeyShape()) return;
    fadeOut(element, done);
  }
};