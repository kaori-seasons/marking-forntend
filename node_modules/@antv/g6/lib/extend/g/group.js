/**
 * @fileOverview extend G.Group
 * @author huangtonger@aliyun.com
 * @ignore
 */
var G = require('@antv/g/lib');

var Util = require('../../util/');

var Mixin = function Mixin() {};

Util.augment(Mixin, {
  /**
   * find element by className
   * @param   {string}      className class name
   * @return  {Array}       rst
   */
  findByClass: function findByClass(className) {
    var rst = [];
    this.deepEach(function (child) {
      if (child.hasClass(className)) {
        rst.push(child);
      }
    });
    return rst;
  },

  /**
   * Check contains the specified class
   * @param   {string}      className class name
   * @return  {Boolean}     boolean
   */
  hasClass: function hasClass(className) {
    var clasees = this.get('class');

    if (clasees && clasees.indexOf(className) !== -1) {
      return true;
    }

    return false;
  },

  /**
   * traverse child node
   * @param  {function} callback callback
   * @param  {boolean} runSelf excute self or not
   */
  deepEach: function deepEach(callback, runSelf) {
    Util.traverseTree(this, callback, function (parent) {
      return parent.get('children');
    }, runSelf);
  },

  /**
   * radix sort (a stable sort)
   */
  sort: function sort() {
    var children = this.get('children');
    this.set('children', Util.radixSort(children, function (child) {
      return child.get('zIndex');
    }));
  },

  /**
   * sort by callback
   * @param  {function} callback callback
   */
  sortBy: function sortBy(callback) {
    var children = this.get('children');
    this.set('children', Util.radixSort(children, callback));
  },

  /**
   * clear inner elements
   * @param  {boolean} bool if destroy child
   * @return {object}  this
   */
  clear: function clear(bool) {
    var children = this._cfg.children;

    for (var i = children.length - 1; i >= 0; i--) {
      children[i].remove(bool);
    }

    this._cfg.children = [];
    return this;
  }
});
Util.mixin(G.Group, [Mixin]);
module.exports = Mixin;