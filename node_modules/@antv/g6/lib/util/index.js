/**
 * @fileOverview util
 * @author huangtonger@aliyun.com
 */
var Util = {};

var MathUtil = require('./math');

var PathUtil = require('./path');

var BaseUtil = require('./base');

var DomUtil = require('./dom');

var GraphUtil = require('./graph');

var GraphicUtil = require('./graphic');

BaseUtil.mix(Util, BaseUtil, GraphUtil, GraphicUtil, DomUtil, PathUtil, MathUtil);
module.exports = Util;