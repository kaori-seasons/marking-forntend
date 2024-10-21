/**
 * @fileOverview draw
 * @author huangtonger@aliyun.com
 */
var Mixin = {};
Mixin.INIT = '_initDraw';
Mixin.AUGMENT = {
  _initDraw: function _initDraw() {
    var _this = this;

    var controllers = this.get('_controllers');
    var animateController = controllers.animate;
    var eventNames = ['clear', 'show', 'hide', 'change', 'updatenodeposition'];
    eventNames.forEach(function (eventName) {
      if (animateController) {
        _this.on('before' + eventName, function (ev) {
          var forcePreventAnimate = _this.get('_forcePreventAnimate');

          var affectedItemIds = ev ? ev.affectedItemIds : undefined;

          if (forcePreventAnimate !== true && animateController) {
            animateController.cacheGraph('startCache', affectedItemIds);
          }
        });
      }

      _this.on('after' + eventName, function (ev) {
        var affectedItemIds = ev ? ev.affectedItemIds : undefined;

        var forcePreventAnimate = _this.get('_forcePreventAnimate');

        if (ev && ev.action === 'changeData') {
          var fitView = _this.get('fitView');

          fitView && _this.setFitView(fitView);
        }

        if (forcePreventAnimate !== true && animateController) {
          animateController.cacheGraph('endCache', affectedItemIds);
          animateController.run();
        } else {
          _this.draw();
        }
      });
    });
  },
  draw: function draw() {
    var canvas = this.get('_canvas');
    canvas.draw();
  },
  animateDraw: function animateDraw() {
    var controllers = this.get('_controllers');
    var animateController = controllers.animate;
    animateController.run();
  }
};
module.exports = Mixin;