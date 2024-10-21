/**
 * @fileOverview html node shape
 * @author huangtonger@aliyun.com
 */
var Shape = require('../shape');

var Util = require('../../util/'); // html node


Shape.registerNode('html', {
  getHtml: function getHtml(item) {
    return item.getModel().html;
  },
  cssSize: true,
  draw: function draw(item) {
    var nodeContainer = Util.createDOM('<div class="g6-html-node-container"></div>');
    var group = item.getGraphicGroup();
    var graph = item.getGraph();

    if (graph.get('renderer') !== 'svg') {
      throw new Error('please use svg renderer draw html element !');
    }

    var graphContainer = graph.getGraphContainer();
    var size = this.getSize(item);
    var style = this.getStyle(item);
    var cssSize = this.cssSize;
    var html = this.getHtml(item);
    html = Util.createDOM(html);
    nodeContainer.css({
      position: 'absolute',
      padding: '0px',
      margin: '0px'
    });
    nodeContainer.appendChild(html);
    graphContainer.appendChild(nodeContainer);

    if (cssSize) {
      size[0] = nodeContainer.width();
      size[1] = nodeContainer.height();
    }

    var x = -size[0] / 2;
    var y = -size[1] / 2;
    var width = size[0];
    var height = size[1];
    var keyShape = group.addShape('rect', {
      attrs: Util.mix({}, style, {
        x: x,
        y: y,
        width: width,
        height: height
      })
    });
    group.addShape('dom', {
      attrs: Util.mix({
        x: x,
        y: y,
        width: width,
        height: height,
        html: nodeContainer
      })
    });
    return keyShape;
  }
});