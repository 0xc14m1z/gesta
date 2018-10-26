"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

module.exports = function () {
  // map that holds handlers for application events
  var handlers = {}; // allow the user to add handlers

  var on = function on(event, handler) {
    if (!handlers[event]) handlers[event] = [];
    handlers[event].push(handler);
  }; // enhance the socket client listening for events


  var register = function register(event) {
    return function (socket) {
      // make the actual call to an handler
      var handle = function handle(action) {
        return function (handler) {
          return handler({
            action: action,
            dispatch: dispatch,
            broadcast: broadcast
          });
        };
      }; // dispatch an action locally


      var localDispatch = function localDispatch(action) {
        var call = handle(action);
        var handlersForEvent = handlers[action.type] || [];
        handlersForEvent.forEach(call);
      }; // dispatch an action through the socket and locally


      var dispatch = function dispatch(action) {
        socket.emit(event, action);
        localDispatch(action);
      }; // broadcast an action through all connected sockets and dispatch it locally


      var broadcast = function broadcast(action) {
        socket.broadcast.emit(event, action);
        localDispatch(action);
      }; // register the listeners to the socket


      var _arr = Object.entries(handlers);

      for (var _i = 0; _i < _arr.length; _i++) {
        var _arr$_i = _slicedToArray(_arr[_i], 2),
            _event = _arr$_i[0],
            handlersForEvent = _arr$_i[1];

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          var _loop = function _loop() {
            var handler = _step.value;
            socket.on(_event, function (action) {
              return handle(action)(handler);
            });
          };

          for (var _iterator = handlersForEvent[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            _loop();
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
    };
  };

  return {
    on: on,
    register: register
  };
};