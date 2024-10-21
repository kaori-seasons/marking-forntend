/**
 * @fileOverview entry file
 * @author huangtonger@aliyun.com
 */
var Shape = require('./shape/');

var Handler = require('./handler');

var Global = require('./global');

var version = require('./version');

var G = require('@antv/g/lib');

var G6 = {
  Graph: require('./graph'),
  Tree: require('./tree'),
  Util: require('./util/'),
  Layouts: require('./layouts/'),
  G: G,
  Plugins: {},
  Components: {},
  Global: Global,
  Shape: Shape,
  registerNode: Shape.registerNode,
  registerEdge: Shape.registerEdge,
  registerGroup: Shape.registerGroup,
  registerGuide: Shape.registerGuide,
  registerBehaviour: Handler.registerBehaviour,
  version: version,
  track: function track(_track) {
    Global.track = _track;
  }
};

require('./track');

module.exports = G6;