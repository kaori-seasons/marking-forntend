/**
 * @fileOverview dom event handler
 * @author wuyue.lwy <wyueliu@gmail.com>
 */
var Mixin = {};

var Controller = require('../controller/event');

Mixin.INIT = '_initEvents';
Mixin.CFG = {
  /**
   * keyboard Enable
   * @type {boolean|function}
   */
  keyboardEnable: true
};
Mixin.AUGMENT = {
  _initEvents: function _initEvents() {
    var controllers = this.get('_controllers');
    controllers.events = new Controller({
      graph: this
    });
  }
};
module.exports = Mixin;