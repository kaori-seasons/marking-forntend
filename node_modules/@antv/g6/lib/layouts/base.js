/**
 * @fileOverview layout base class
 * @author huangtonger@aliyun.com
 */
var Base =
/*#__PURE__*/
function () {
  function Base() {}

  var _proto = Base.prototype;

  _proto.execute = function execute() {
    throw new Error('please override this method');
  };

  return Base;
}();

module.exports = Base;