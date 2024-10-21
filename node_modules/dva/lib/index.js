"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _react = _interopRequireDefault(require("react"));

var _invariant = _interopRequireDefault(require("invariant"));

var _createHashHistory = _interopRequireDefault(require("history/createHashHistory"));

var _reactRouterRedux = require("react-router-redux");

var _document = _interopRequireDefault(require("global/document"));

var _reactRedux = require("react-redux");

var core = _interopRequireWildcard(require("dva-core"));

var _utils = require("dva-core/lib/utils");

function _default() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var history = opts.history || (0, _createHashHistory.default)();
  var createOpts = {
    initialReducer: {
      routing: _reactRouterRedux.routerReducer
    },
    setupMiddlewares: function setupMiddlewares(middlewares) {
      return [(0, _reactRouterRedux.routerMiddleware)(history)].concat((0, _toConsumableArray2.default)(middlewares));
    },
    setupApp: function setupApp(app) {
      app._history = patchHistory(history);
    }
  };
  var app = core.create(opts, createOpts);
  var oldAppStart = app.start;
  app.router = router;
  app.start = start;
  return app;

  function router(router) {
    (0, _invariant.default)((0, _utils.isFunction)(router), "[app.router] router should be function, but got ".concat((0, _typeof2.default)(router)));
    app._router = router;
  }

  function start(container) {
    // 允许 container 是字符串，然后用 querySelector 找元素
    if (isString(container)) {
      container = _document.default.querySelector(container);
      (0, _invariant.default)(container, "[app.start] container ".concat(container, " not found"));
    } // 并且是 HTMLElement


    (0, _invariant.default)(!container || isHTMLElement(container), "[app.start] container should be HTMLElement"); // 路由必须提前注册

    (0, _invariant.default)(app._router, "[app.start] router must be registered before app.start()");

    if (!app._store) {
      oldAppStart.call(app);
    }

    var store = app._store; // export _getProvider for HMR
    // ref: https://github.com/dvajs/dva/issues/469

    app._getProvider = getProvider.bind(null, store, app); // If has container, render; else, return react component

    if (container) {
      render(container, store, app, app._router);

      app._plugin.apply('onHmr')(render.bind(null, container, store, app));
    } else {
      return getProvider(store, this, this._router);
    }
  }
}

function isHTMLElement(node) {
  return (0, _typeof2.default)(node) === 'object' && node !== null && node.nodeType && node.nodeName;
}

function isString(str) {
  return typeof str === 'string';
}

function getProvider(store, app, router) {
  var DvaRoot = function DvaRoot(extraProps) {
    return _react.default.createElement(_reactRedux.Provider, {
      store: store
    }, router((0, _objectSpread2.default)({
      app: app,
      history: app._history
    }, extraProps)));
  };

  return DvaRoot;
}

function render(container, store, app, router) {
  var ReactDOM = require('react-dom'); // eslint-disable-line


  ReactDOM.render(_react.default.createElement(getProvider(store, app, router)), container);
}

function patchHistory(history) {
  var oldListen = history.listen;

  history.listen = function (callback) {
    callback(history.location);
    return oldListen.call(history, callback);
  };

  return history;
}