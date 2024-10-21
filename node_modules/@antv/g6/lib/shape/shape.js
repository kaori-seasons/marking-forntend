/**
 * @fileOverview shape base class
 * @author huangtonger@aliyun.com
 */
var Util = require('../util/');

var Shape = {};
var ShapeBase = {
  draw: function draw() {}
};
var ShapeManagerBase = {
  defaultShapeType: null,
  getShape: function getShape(type, inputDefaultShape) {
    var shape = this[type] || this[inputDefaultShape] || this[this.defaultShapeType] || ShapeBase;
    return shape;
  },
  getExtendShape: function getExtendShape(extendShapeName, defaultShapeType) {
    var _this = this;

    if (Util.isArray(extendShapeName)) {
      var rst = {};
      extendShapeName.forEach(function (subExtendShapeName) {
        if (_this[subExtendShapeName]) {
          rst = Util.mix({}, rst, _this.getShape(subExtendShapeName, defaultShapeType));
        }
      });
      return rst;
    }

    return this.getShape(extendShapeName, defaultShapeType);
  }
};

Shape.registerShapeManager = function (type, cfg) {
  var shapeManager = Util.mix({}, ShapeManagerBase, cfg);
  var Type = Util.upperFirst(type);
  Shape[Type] = shapeManager;

  Shape['register' + Type] = function (shapeType, cfg, extendShapeName, defaultShapeType) {
    // if (shapeManager[shapeType]) {
    //   throw new Error(shapeType + ' was already exist, please choose another name.');
    // }
    if (Util.isNil(extendShapeName) && Util.isNil(defaultShapeType)) {
      extendShapeName = shapeType;
    }

    var extendShape = shapeManager.getExtendShape(extendShapeName, defaultShapeType);
    var shapeObj = Util.mix(true, {}, extendShape, cfg);
    shapeObj.type = shapeType;
    shapeManager[shapeType] = shapeObj;
    return shapeObj;
  };

  return shapeManager;
};

module.exports = Shape;