/**
 * @fileOverview extend G.Shape
 * @author huangtonger@aliyun.com
 * @ignore
 */
var Util = require('../../util/');

var G = require('@antv/g/lib');

var Mixin = function Mixin() {};

Util.augment(Mixin, {
  // draw dom when canvas renderer
  drawInner: function drawInner(context) {
    var tm = Util.clone(this.getTotalMatrix());
    var _this$_attrs = this._attrs,
        x = _this$_attrs.x,
        y = _this$_attrs.y,
        width = _this$_attrs.width,
        height = _this$_attrs.height;
    context.setTransform(tm[0], tm[1], tm[3], tm[4], tm[6], tm[7]);
    context.drawImage(this.domImage, x, y, width, height);
  }
});
Util.mixin(G.Dom, [Mixin]);
module.exports = Mixin;