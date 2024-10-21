/**
 * @fileOverview mapping mixin
 * @author huangtonger@aliyun.com
 */
var Mapper = require('../controller/mapper');

var Mixin = {};
Mixin.INIT = '_initMapper';
Mixin.AUGMENT = {
  _initMapper: function _initMapper() {
    var controllers = this.get('_controllers');
    controllers.nodeMapper = new Mapper({
      graph: this
    });
    controllers.edgeMapper = new Mapper({
      graph: this
    });
    controllers.groupMapper = new Mapper({
      graph: this
    });
    controllers.guideMapper = new Mapper({
      graph: this
    });
  },

  /**
   * node mapping
   * @param  {array} channels mapping channel
   * @return {object} nodeMapper
   */
  node: function node(channels) {
    var nodeMapper = this._getController('nodeMapper');

    channels && nodeMapper.addChannels(channels);
    return nodeMapper;
  },

  /**
   * edge mapping
   * @param  {array} channels mapping channel
   * @return {object} edgeMapper
   */
  edge: function edge(channels) {
    var edgeMapper = this._getController('edgeMapper');

    channels && edgeMapper.addChannels(channels);
    return edgeMapper;
  },

  /**
   * group mapping
   * @param  {array} channels mapping channel
   * @return {object} groupMapper
   */
  group: function group(channels) {
    var groupMapper = this._getController('groupMapper');

    channels && groupMapper.addChannels(channels);
    return this._getController('groupMapper');
  },

  /**
   * guide mapping
   * @param  {array} channels mapping channel
   * @return {object} guideMapper
   */
  guide: function guide(channels) {
    var guideMapper = this._getController('guideMapper');

    channels && guideMapper.addChannels(channels);
    return this._getController('guideMapper');
  }
};
module.exports = Mixin;