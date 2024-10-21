/**
 * @fileOverview filter graph item
 * filter will influence layout and visible
 * @author huangtonger@aliyun.com
 */
var Util = require('../util/');

var Mixin = {};
Mixin.INIT = '_initFilter';
Mixin.CFG = {
  /**
   * filter or filters
   * @type {array|function|undefined}
   */
  filters: []
};
Mixin.AUGMENT = {
  _initFilter: function _initFilter() {
    var _this = this;

    var filters = this.get('filters');

    if (Util.isFunction(filters)) {
      this.set('filters', [filters]);
    }

    this.on('afterchange', function (_ref) {
      var action = _ref.action;
      filters.length > 0 && action === 'changeData' && !_this.destroyed && _this.filter();
    });
  },

  /**
   * add an filter
   * @param {object} filter filter
   * @return {object} filter
   */
  addFilter: function addFilter(filter) {
    var filters = this.get('filters');
    filters.push(filter);
    return filter;
  },

  /**
   * remove filter
   * @param {object} filter item filter
   */
  removeFilter: function removeFilter(filter) {
    var filters = this.get('filters');
    this.set('filters', Util.filter(filters, filter));
  },

  /**
   * do filter
   */
  filter: function filter() {
    this.emit('beforefilter');
    var filters = this.get('filters');
    var items = this.getItems();

    var filteredItems = this._getFilterItems();

    filters.forEach(function (filter) {
      filteredItems = filteredItems.filter(filter);
    });
    items.forEach(function (item) {
      if (filteredItems.indexOf(item) === -1) {
        item.hide();
      } else {
        item.show();
      }
    });
    this.draw();
    this.emit('afterfilter');
  },

  /**
   * get filter items
   * @return {array} filterItems
   */
  _getFilterItems: function _getFilterItems() {
    var items = this.getItems();
    return items.filter(function (item) {
      var shapeObj = item.getShapeObj();
      return shapeObj.filter !== false;
    });
  }
};
module.exports = Mixin;