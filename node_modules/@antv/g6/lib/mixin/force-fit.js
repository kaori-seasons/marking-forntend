/**
 * @fileOverview force fit mixin
 * @author huangtonger@aliyun.com
 */
var Util = require('../util/');

var Mixin = {};
Mixin.INIT = '_initForceFit';
Mixin.AUGMENT = {
  _initForceFit: function _initForceFit() {
    var width = this.get('width');
    var height = this.get('height');

    if (!width && !height) {
      this.forceFit();

      this._bindForceEvent();

      return;
    }

    if (!width) {
      this.forceFit('width');

      this._bindForceEvent('width');

      return;
    }

    if (!height) {
      this.forceFit('height');

      this._bindForceEvent('height');

      return;
    }
  },
  _bindForceEvent: function _bindForceEvent(type) {
    var _this = this;

    var forceFitTimer = this._getTimer('forceFit');

    var windowForceResizeEvent = function windowForceResizeEvent() {
      var timer = setTimeout(function () {
        _this.forceFit(type);
      }, 200);
      forceFitTimer && clearTimeout(forceFitTimer);

      _this._setTimer('forceFit', timer);
    };

    window.addEventListener('resize', windowForceResizeEvent);
    this.set('_windowForceResizeEvent', windowForceResizeEvent);
  },

  /**
   * force fit canvas size to container
   * @param  {string|undefined} type string could be 'width', 'height'
   * @return {Graph} this
   */
  forceFit: function forceFit(type) {
    var container = this.get('_containerDOM');
    var width = this.get('width');
    var height = this.get('height');
    var containerHeight = Util.getHeight(container);
    var containerWidth = Util.getWidth(container);

    if (type === 'width') {
      this.changeSize(containerWidth, height);
      return this;
    }

    if (type === 'height') {
      this.changeSize(width, containerHeight);
      return this;
    }

    this.changeSize(containerWidth, containerHeight);
    return this;
  }
};
module.exports = Mixin;