"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var omitBoolean = function omitBoolean(obj) {
  if (obj && obj !== true) {
    return obj;
  }

  return undefined;
};

var _default = omitBoolean;
exports.default = _default;