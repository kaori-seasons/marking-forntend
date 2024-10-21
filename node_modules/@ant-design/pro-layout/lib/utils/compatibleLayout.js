"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var compatibleLayout = function compatibleLayout(layout) {
  var layoutEnum = ['sidemenu', 'topmenu'];

  if (layoutEnum.includes(layout)) {
    return layout === null || layout === void 0 ? void 0 : layout.replace('menu', '');
  }

  return layout;
};

var _default = compatibleLayout;
exports.default = _default;