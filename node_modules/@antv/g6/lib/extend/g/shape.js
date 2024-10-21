/**
 * @fileOverview extend G.Shape
 * @author huangtonger@aliyun.com
 * @ignore
 */
var Util = require('../../util/');

var G = require('@antv/g/lib');

var Mixin = function Mixin() {};

Util.augment(Mixin, {
  /**
   * Check contains the specified class
   * @param   {string}      className class name
   * @return  {Boolean}     boolean
   */
  hasClass: function hasClass(className) {
    var clasees = this.get('class');

    if (clasees && clasees.indexOf(className) !== -1) {
      return true;
    }

    return false;
  }
});
Util.mixin(G.Shape, [Mixin]);
module.exports = Mixin;