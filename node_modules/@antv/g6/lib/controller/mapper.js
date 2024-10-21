function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * @fileOverview mapper controller
 * @author huangtonger@aliyun.com
 */
var Base = require('./base');

var Util = require('../util/');

var CHANNEL_NAMES = ['color', 'shape', 'size', 'label', 'style'];

var Controller =
/*#__PURE__*/
function (_Base) {
  _inheritsLoose(Controller, _Base);

  function Controller() {
    return _Base.apply(this, arguments) || this;
  }

  var _proto = Controller.prototype;

  _proto._init = function _init() {
    var _this = this;

    var channels = {};
    Util.each(CHANNEL_NAMES, function (channel) {
      channels[channel] = {};

      _this[channel] = function (input) {
        channels[channel].input = input;
        return _this;
      };
    });
    this.channels = channels;
  };

  _proto.addChannels = function addChannels(inputChannels) {
    var channels = this.channels;
    Util.each(inputChannels, function (channel, name) {
      channels[name] = {
        input: channel
      };
    });
  }
  /**
   * @param  {object} model origin model
   */
  ;

  _proto.mapping = function mapping(model) {
    var channels = this.channels;
    Util.each(channels, function (channel, name) {
      if (Util.isFunction(channel.input)) {
        model[name] = channel.input(model);
      } else if (channel.input) {
        model[name] = channel.input;
      }
    });
  };

  return Controller;
}(Base);

module.exports = Controller;