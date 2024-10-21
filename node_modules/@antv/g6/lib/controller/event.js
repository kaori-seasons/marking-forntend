function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * @fileOverview dom event handler
 * @author wuyue.lwy <wyueliu@gmail.com>
 */
var Base = require('./base');

var Util = require('../util/');

var EVENT = {
  MOUSEMOVE: 'mousemove',
  MOUSEDOWN: 'mousedown',
  MOUSEUP: 'mouseup',
  MOUSEENTER: 'mouseenter',
  MOUSELEAVE: 'mouseleave',
  CLICK: 'click',
  DBLCLICK: 'dblclick',
  DRAGSTART: 'dragstart',
  DRAG: 'drag',
  DRAGENTER: 'dragenter',
  DRAGLEAVE: 'dragleave',
  DRAGEND: 'dragend',
  DROP: 'drop',
  CONTEXTMENU: 'contextmenu',
  WHEEL: 'wheel',
  KEYDOWN: 'keydown',
  KEYUP: 'keyup',
  KEYPRESS: 'keypress',
  MOUSEWHEEL: 'mousewheel' // Compatible with MOUSEWHEEL

};
var SHAKE_TOLERANCE = 9; // use to tolerate click shake prevent drag shake. The distance is tolerance sqrt.
// native dom events list:

var MouseEventTypes = [EVENT.DBLCLICK, EVENT.MOUSEDOWN, EVENT.MOUSEUP, EVENT.MOUSEENTER, EVENT.MOUSELEAVE, EVENT.MOUSEMOVE, EVENT.CONTEXTMENU, EVENT.WHEEL, EVENT.MOUSEWHEEL];
var KeyboardEventTypes = [EVENT.KEYDOWN, EVENT.KEYUP, EVENT.KEYPRESS];
var CANVAS = 'canvas:';

function parentNodeHasTag(n, t) {
  var p = n.parentNode;

  while (p) {
    if (p.tagName === t) {
      return true;
    }

    p = p.parentNode;
  }

  return false;
}

var Controller =
/*#__PURE__*/
function (_Base) {
  _inheritsLoose(Controller, _Base);

  function Controller(cfg) {
    var _this;

    _this = _Base.call(this, cfg) || this;
    _this._domEvents = [];

    _this._initEventStates();

    _this._registerEvents();

    return _this;
  } // init evnet states


  var _proto = Controller.prototype;

  _proto._initEventStates = function _initEventStates() {
    this._pressing = false;
    this._dragging = false;
    this._currentEventObj = {};
    this._dragEventObj = {};
  } // register all native dom events
  ;

  _proto._registerEvents = function _registerEvents() {
    this._registerMouseEvents();

    this._registerKeyboardEvents();
  };

  _proto._registerKeyboardEvents = function _registerKeyboardEvents() {
    var graph = this.graph;
    var el = graph.getKeyboardEventWrapper();
    var _events = this._domEvents;
    var keyboardEnable = graph.get('keyboardEnable');
    Util.each(KeyboardEventTypes, function (item) {
      _events.push(Util.addEventListener(el, item, function (ev) {
        var enable = true;

        if (Util.isFunction(keyboardEnable)) {
          enable = keyboardEnable();
        }

        enable && graph.emit(item, {
          domEvent: ev
        });
      }));
    });
  };

  _proto._registerMouseEvents = function _registerMouseEvents() {
    var _this2 = this;

    var graph = this.graph;
    var self = this;
    var el = graph.getMouseEventWrapper();
    var _events = this._domEvents;
    Util.each(MouseEventTypes, function (item) {
      _events.push(Util.addEventListener(el, item, function (ev) {
        // Compatible with SVG
        if (ev.type === EVENT.MOUSEENTER) {
          if (ev.fromElement) {
            if (!ev.fromElement.parentNode || parentNodeHasTag(ev.fromElement, 'foreignObject')) {
              return;
            }
          }
        }

        var oldEventObj = _this2._currentEventObj;
        _this2._oldEventObj = oldEventObj;

        _this2._processEventObj(ev);

        var currentEventObj = _this2._currentEventObj; // emit simulate events like click, dragstart, dragend, drop, dtagover,  mouseenter, mouseleave

        self._simulateEvents(ev, oldEventObj, currentEventObj); // emit normal events


        if ([EVENT.MOUSELEAVE, EVENT.MOUSEENTER].indexOf(ev.type) !== -1) {
          self._triggerEvent(CANVAS + ev.type);
        }

        self._triggerEvent(ev.type);

        if (ev.type === EVENT.MOUSELEAVE) {
          // trigger canvas dragleave when out of canvas , user can clear things that record by themselves
          if (_this2._dragging) {
            self._triggerEvent(EVENT.DRAGLEAVE, Util.mix({}, currentEventObj, {
              item: null,
              shape: null,
              currentItem: _this2._dragEventObj.item,
              currentShape: _this2._dragEventObj.shape
            }));
          }

          self._initEventStates();
        }
      }));
    });
  } // delete listeners
  ;

  _proto.destroy = function destroy() {
    var events = this._domEvents;
    Util.each(events, function (ev) {
      ev && ev.remove();
    });
    this._domEvents = null;
  }
  /**
    * trigger event
    * @param {string} type  - event type
    * @param {object} eventObj - event object
    */
  ;

  _proto._triggerEvent = function _triggerEvent(type, eventObj) {
    if (!eventObj) {
      if (type === 'mouseleave') {
        eventObj = this._oldEventObj;
      } else {
        eventObj = this._currentEventObj;
      }
    }

    if (type === 'mousedown') {
      eventObj.button = this._button;
    } // emit shape event


    eventObj._type = type;
    this.emitGraphEvent(type, eventObj);

    if ([CANVAS + EVENT.MOUSELEAVE, CANVAS + EVENT.MOUSEENTER].indexOf(type) !== -1) {
      return;
    }

    var eventPreFix = eventObj.shape && eventObj.shape.eventPreFix;

    if ([EVENT.DRAGSTART, EVENT.DRAG, EVENT.DRAGEND].indexOf(type) !== -1) {
      // get correct prefix
      eventPreFix = eventObj.currentShape && eventObj.currentShape.eventPreFix;
    }

    if (eventPreFix) {
      var _type = eventPreFix + ':' + type;

      eventObj._type = _type;

      if (Util.isBoolean(eventObj._isItemChange)) {
        if (eventObj._isItemChange) {
          this.emitGraphEvent(_type, eventObj);
        }
      } else {
        this.emitGraphEvent(_type, eventObj);
      }
    }
  }
  /**
    * emit graph event
    * @param {object} type - event type
    * @param {object} eventObj - event object
    */
  ;

  _proto.emitGraphEvent = function emitGraphEvent(type, eventObj) {
    var graph = this.graph;
    graph.emit(type, eventObj);
  };

  _proto._getDistanceToPress = function _getDistanceToPress(ev) {
    return Math.pow(ev.clientX - this._pressX, 2) + Math.pow(ev.clientY - this._pressY, 2);
  }
  /**
    * check whether or not  click  and drag
    * @param {object} ev - native dom event
    * @param {object} oldEventObj - old event object
    * @param {object} currentEventObj - current event object
    */
  ;

  _proto._simulateEvents = function _simulateEvents(ev, oldEventObj, currentEventObj) {
    if (oldEventObj === void 0) {
      oldEventObj = {};
    }

    if (currentEventObj === void 0) {
      currentEventObj = {};
    }

    var currentItem = this._dragEventObj.item;
    var currentShape = this._dragEventObj.shape;

    switch (ev.type) {
      case EVENT.MOUSEDOWN:
        this._pressing = true;
        this._button = ev.button;
        this._pressX = ev.clientX;
        this._pressY = ev.clientY;
        break;

      case EVENT.MOUSEMOVE:
        // record the element that was dragging
        if (this._dragging) {
          this._triggerEvent(EVENT.DRAG, Util.mix({}, currentEventObj, {
            button: this._button,
            currentItem: currentItem,
            currentShape: currentShape
          }));

          if (oldEventObj.shape !== currentEventObj.shape) {
            var _isItemChange = this._isItemChange(oldEventObj, currentEventObj);

            if (oldEventObj.shape) {
              this._triggerEvent(EVENT.DRAGLEAVE, Util.mix({}, currentEventObj, {
                button: this._button,
                item: oldEventObj.item,
                shape: oldEventObj.shape,
                toItem: currentEventObj.item,
                toShape: currentEventObj.shape,
                currentItem: currentItem,
                currentShape: currentShape,
                _isItemChange: _isItemChange
              }));
            }

            if (currentEventObj.shape) {
              this._triggerEvent(EVENT.DRAGENTER, Util.mix({}, currentEventObj, {
                button: this._button,
                currentItem: currentItem,
                currentShape: currentShape,
                fromItem: oldEventObj.item,
                fromShape: oldEventObj.shape,
                _isItemChange: _isItemChange
              }));
            }
          }
        } else if (this._pressing && this._getDistanceToPress(ev) > SHAKE_TOLERANCE) {
          this._dragging = true;
          this._dragEventObj = oldEventObj;
          currentItem = this._dragEventObj.item;
          currentShape = this._dragEventObj.shape;

          this._triggerEvent(EVENT.DRAGSTART, Util.mix({}, oldEventObj, {
            button: this._button,
            currentItem: currentItem,
            currentShape: currentShape
          }));
        } // normal move


        if (oldEventObj.shape !== currentEventObj.shape) {
          var _isItemChange2 = this._isItemChange(oldEventObj, currentEventObj);

          if (oldEventObj.shape) {
            // just canvas has no shape, it should not trigger leave
            this._triggerEvent(EVENT.MOUSELEAVE, Util.mix({}, currentEventObj, {
              item: oldEventObj.item,
              shape: oldEventObj.shape,
              toItem: currentEventObj.item,
              toShape: currentEventObj.shape,
              _isItemChange: _isItemChange2
            }));
          }

          if (currentEventObj.shape) {
            // canvas should not trigger enter
            this._triggerEvent(EVENT.MOUSEENTER, Util.mix({}, currentEventObj, {
              fromtItem: oldEventObj.item,
              fromShape: oldEventObj.shape,
              _isItemChange: _isItemChange2
            }));
          }
        }

        break;

      case EVENT.MOUSEUP:
        if (!this._dragging && this._pressing) {
          this._triggerEvent(EVENT.CLICK, Util.mix({}, currentEventObj, {
            button: this._button
          }));
        } else {
          this._triggerEvent(EVENT.DROP, Util.mix({}, currentEventObj, {
            button: this._button,
            currentItem: currentItem,
            currentShape: currentShape
          }));

          this._triggerEvent(EVENT.DRAGEND, Util.mix({}, currentEventObj, {
            button: this._button,
            currentItem: currentItem,
            currentShape: currentShape
          }));
        }

        this._pressing = false;
        this._dragging = false;
        this._dragEventObj = {};
        break;

      default:
        return;
    }
  }
  /**
   * checkout item is change
   * @param {object} oldEventObj - old event obj
   * @param {object} currentEventObj - current event obj
   * @return {boolean} rst
   */
  ;

  _proto._isItemChange = function _isItemChange(oldEventObj, currentEventObj) {
    var oldShape = oldEventObj.shape;
    var currentShape = currentEventObj.shape;
    var shapeIsItemChange = oldShape && currentShape && (oldShape.get('isItemChange') || currentShape.get('isItemChange'));

    if (shapeIsItemChange) {
      return shapeIsItemChange(currentShape, oldShape);
    }

    if (Util.isObject(oldEventObj.item) && Util.isObject(currentEventObj.item)) {
      return oldEventObj.item.id !== currentEventObj.item.id;
    }

    return oldEventObj.item !== currentEventObj.item;
  }
  /**
   * handle the native event by browser
   * @param {object} ev - native event by browser
   */
  ;

  _proto._processEventObj = function _processEventObj(ev) {
    var graph = this.graph;
    var canvas = graph.get('_canvas');

    var evObj = this._getEventObj(ev, canvas);

    this._currentEventObj = evObj;
  } // transform point position by pixel Ratio
  ;

  _proto._parsePoint = function _parsePoint(x, y) {
    var graph = this.graph;
    return graph.getPointByCanvas({
      x: x,
      y: y
    });
  }
  /**
    * get the source object which emitted event
    * @param {object} ev  -native event by browser
    * @param {object} canvas -the scene that event occurred
    * @return {object} - event object
    */
  ;

  _proto._getEventObj = function _getEventObj(ev, canvas) {
    var graph = this.graph;
    var clientX = ev.clientX;
    var clientY = ev.clientY;
    var canvasPoint = canvas.getPointByClient(clientX, clientY);

    var point = this._parsePoint(canvasPoint.x, canvasPoint.y);

    var shape = canvas.getShape(canvasPoint.x, canvasPoint.y, ev);
    var item = graph.getItemByShape(shape);
    var pixelRatio = canvas.get('pixelRatio');
    return {
      item: item,
      shape: shape,
      x: point.x,
      y: point.y,
      domX: canvasPoint.x / pixelRatio,
      domY: canvasPoint.y / pixelRatio,
      domEvent: ev
    };
  };

  return Controller;
}(Base);

module.exports = Controller;