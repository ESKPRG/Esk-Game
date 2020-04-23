(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var objectCreate = Object.create || objectCreatePolyfill
var objectKeys = Object.keys || objectKeysPolyfill
var bind = Function.prototype.bind || functionBindPolyfill

function EventEmitter() {
  if (!this._events || !Object.prototype.hasOwnProperty.call(this, '_events')) {
    this._events = objectCreate(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

var hasDefineProperty;
try {
  var o = {};
  if (Object.defineProperty) Object.defineProperty(o, 'x', { value: 0 });
  hasDefineProperty = o.x === 0;
} catch (err) { hasDefineProperty = false }
if (hasDefineProperty) {
  Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
    enumerable: true,
    get: function() {
      return defaultMaxListeners;
    },
    set: function(arg) {
      // check whether the input is a positive number (whose value is zero or
      // greater and not a NaN).
      if (typeof arg !== 'number' || arg < 0 || arg !== arg)
        throw new TypeError('"defaultMaxListeners" must be a positive number');
      defaultMaxListeners = arg;
    }
  });
} else {
  EventEmitter.defaultMaxListeners = defaultMaxListeners;
}

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || isNaN(n))
    throw new TypeError('"n" argument must be a positive number');
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

// These standalone emit* functions are used to optimize calling of event
// handlers for fast cases because emit() itself often has a variable number of
// arguments and can be deoptimized because of that. These functions always have
// the same number of arguments and thus do not get deoptimized, so the code
// inside them can execute faster.
function emitNone(handler, isFn, self) {
  if (isFn)
    handler.call(self);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self);
  }
}
function emitOne(handler, isFn, self, arg1) {
  if (isFn)
    handler.call(self, arg1);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1);
  }
}
function emitTwo(handler, isFn, self, arg1, arg2) {
  if (isFn)
    handler.call(self, arg1, arg2);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2);
  }
}
function emitThree(handler, isFn, self, arg1, arg2, arg3) {
  if (isFn)
    handler.call(self, arg1, arg2, arg3);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2, arg3);
  }
}

function emitMany(handler, isFn, self, args) {
  if (isFn)
    handler.apply(self, args);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].apply(self, args);
  }
}

EventEmitter.prototype.emit = function emit(type) {
  var er, handler, len, args, i, events;
  var doError = (type === 'error');

  events = this._events;
  if (events)
    doError = (doError && events.error == null);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    if (arguments.length > 1)
      er = arguments[1];
    if (er instanceof Error) {
      throw er; // Unhandled 'error' event
    } else {
      // At least give some kind of context to the user
      var err = new Error('Unhandled "error" event. (' + er + ')');
      err.context = er;
      throw err;
    }
    return false;
  }

  handler = events[type];

  if (!handler)
    return false;

  var isFn = typeof handler === 'function';
  len = arguments.length;
  switch (len) {
      // fast cases
    case 1:
      emitNone(handler, isFn, this);
      break;
    case 2:
      emitOne(handler, isFn, this, arguments[1]);
      break;
    case 3:
      emitTwo(handler, isFn, this, arguments[1], arguments[2]);
      break;
    case 4:
      emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
      break;
      // slower
    default:
      args = new Array(len - 1);
      for (i = 1; i < len; i++)
        args[i - 1] = arguments[i];
      emitMany(handler, isFn, this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');

  events = target._events;
  if (!events) {
    events = target._events = objectCreate(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener) {
      target.emit('newListener', type,
          listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (!existing) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
          prepend ? [listener, existing] : [existing, listener];
    } else {
      // If we've already got an array, just append.
      if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
    }

    // Check for listener leak
    if (!existing.warned) {
      m = $getMaxListeners(target);
      if (m && m > 0 && existing.length > m) {
        existing.warned = true;
        var w = new Error('Possible EventEmitter memory leak detected. ' +
            existing.length + ' "' + String(type) + '" listeners ' +
            'added. Use emitter.setMaxListeners() to ' +
            'increase limit.');
        w.name = 'MaxListenersExceededWarning';
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        if (typeof console === 'object' && console.warn) {
          console.warn('%s: %s', w.name, w.message);
        }
      }
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    switch (arguments.length) {
      case 0:
        return this.listener.call(this.target);
      case 1:
        return this.listener.call(this.target, arguments[0]);
      case 2:
        return this.listener.call(this.target, arguments[0], arguments[1]);
      case 3:
        return this.listener.call(this.target, arguments[0], arguments[1],
            arguments[2]);
      default:
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; ++i)
          args[i] = arguments[i];
        this.listener.apply(this.target, args);
    }
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = bind.call(onceWrapper, state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');

      events = this._events;
      if (!events)
        return this;

      list = events[type];
      if (!list)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = objectCreate(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else
          spliceOne(list, position);

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (!events)
        return this;

      // not listening for removeListener, no need to emit
      if (!events.removeListener) {
        if (arguments.length === 0) {
          this._events = objectCreate(null);
          this._eventsCount = 0;
        } else if (events[type]) {
          if (--this._eventsCount === 0)
            this._events = objectCreate(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = objectKeys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = objectCreate(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (!events)
    return [];

  var evlistener = events[type];
  if (!evlistener)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
};

// About 1.5x faster than the two-arg version of Array#splice().
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
    list[i] = list[k];
  list.pop();
}

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function objectCreatePolyfill(proto) {
  var F = function() {};
  F.prototype = proto;
  return new F;
}
function objectKeysPolyfill(obj) {
  var keys = [];
  for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k)) {
    keys.push(k);
  }
  return k;
}
function functionBindPolyfill(context) {
  var fn = this;
  return function () {
    return fn.apply(context, arguments);
  };
}

},{}],2:[function(require,module,exports){
class AdjacencyMatrix {
    constructor(widthLength, heightLength, obstacleList, distance) {
        this.heightLength = Math.floor(heightLength / distance);
        this.widthLength = Math.floor(widthLength / distance);
        this.obstacleList = obstacleList;
        this.distance = distance;
        this.matrix = new Map();
        this.alreadyMoved = [];
    }

    addVertex(v) {
        this.matrix.set(v, {})
    }

    addEdge(v, w, direction) {
        this.matrix.get(v)[direction] = w;
    } 

    checkObstacle(currentX, currentY, objectList) {
        for (let object of objectList) {
            let x = Math.floor(object.x / this.distance);
            let y = Math.floor(object.y / this.distance);
            let width = Math.floor(object.width / this.distance);
            let height = Math.floor(object.height / this.distance);

            if (x < currentX && x + width > currentX && y < currentY && y + height > currentY) {
                return false;
            }
        }
        return true;
    }

    changeToCoordinates(idx) {
        let currentWidthLength = 1;
        let currentHeightLength = 1;

        for (let value = 1; value < (this.heightLength * this.widthLength +1); value++) {
            if (value === idx) {
                console.log(currentHeightLength, currentWidthLength)
                return {
                    x: currentWidthLength * this.distance,
                    y: currentHeightLength * this.distance
                }
            }
            
            if (currentWidthLength < this.widthLength) {
                currentWidthLength += 1
            } else {
                currentWidthLength = 1;
                currentHeightLength += 1;
            }
        }
    }

    traverse(x1, y1, x2, y2) {
        x1 = Math.floor(x1 / this.distance);
        y1 = Math.floor(y1 / this.distance);
        x2 = Math.floor(x2 / this.distance);
        y2 = Math.floor(y2 / this.distance);

        let currentWidthLength = 1;
        let currentHeightLength = 1;

        let final1;
        let final2;
        for (let idx = 1; idx < (this.heightLength * this.widthLength + 1); idx++) {
            if (currentWidthLength === x2 && currentHeightLength === y2) {
                final2 = {
                    x: currentWidthLength,
                    y: currentHeightLength,
                    idx: idx
                }
            }

            if (currentWidthLength === x1 && currentHeightLength === y1) {
                final1 = {
                    x: currentWidthLength,
                    y: currentHeightLength,
                    idx: idx
                }
            }

            if (currentWidthLength < this.widthLength) {
                currentWidthLength += 1
            } else {
                currentWidthLength = 1;
                currentHeightLength += 1;
            }
        }


        return this.findShortestRoute(final1, final2);
        
    }

    findShortestRoute(current, destination, currentList = []) {
        if (current.x === destination.x && current.y === destination.y) {
            console.log(currentList);
            return currentList
        }

        console.log(current, destination)

        let currentNumber = current;
        let destinationNumber = destination;
        
        let matrixValue = this.matrix.get(currentNumber.idx)

        if (currentNumber.y > destinationNumber.y) {
            if (matrixValue.up && !this.alreadyMoved.includes(matrixValue.up)) {
                this.alreadyMoved.push(matrixValue.up);
                currentNumber.idx -= this.widthLength;
                currentList.push(matrixValue.up)
                currentNumber.y -= 1;
                return this.findShortestRoute(currentNumber, destinationNumber, currentList);
            }

            if (matrixValue.left && !this.alreadyMoved.includes(matrixValue.left)) {
                this.alreadyMoved.push(matrixValue.left);
                currentNumber.idx -= 1;
                currentNumber.x -= 1;
                currentList.push(matrixValue.left)
                return this.findShortestRoute(currentNumber, destinationNumber, currentList);
            }

            if (matrixValue.right && !this.alreadyMoved.includes(matrixValue.right)) {
                this.alreadyMoved.push(matrixValue.right);
                currentNumber.idx += 1;
                currentNumber.x += 1;
                currentList.push(matrixValue.right)
                return this.findShortestRoute(currentNumber, destinationNumber, currentList);
            }
        } else {
            if (matrixValue.down && !this.alreadyMoved.includes(matrixValue.down)) {
                this.alreadyMoved.push(matrixValue.down);
                currentNumber.idx += this.widthLength;
                currentList.push(matrixValue.down)
                currentNumber.y += 1;
                return this.findShortestRoute(currentNumber, destinationNumber, currentList);
            }

            if (matrixValue.left && !this.alreadyMoved.includes(matrixValue.left)) {
                this.alreadyMoved.push(matrixValue.left);
                currentNumber.idx -= 1;
                currentNumber.x -= 1;
                currentList.push(matrixValue.left)
                return this.findShortestRoute(currentNumber, destinationNumber, currentList);
            }

            if (matrixValue.right && !this.alreadyMoved.includes(matrixValue.right)) {
                this.alreadyMoved.push(matrixValue.right);
                currentNumber.idx += 1;
                currentNumber.x += 1;
                currentList.push(matrixValue.right)
                return this.findShortestRoute(currentNumber, destinationNumber, currentList);
            }
        }

        // let up;
        // let down;
        // let left;
        // let right;

        // if (currentNumber.y < destinationNumber.y) { 
        //     currentNumber.y += 1; 
        //     down = true;
        //     currentNumber.idx = (down) ? currentNumber.idx + this.widthLength : currentNumber.idx;
        // } else if (currentNumber.y > destinationNumber.y) { 
        //     currentNumber.y -= 1
        //     up = true;
        //     currentNumber.idx = (up) ? currentNumber.idx - this.widthLength : currentNumber.idx;
        // }

        // if (currentNumber.x < destinationNumber.x) { 
        //     currentNumber.x += 1; 
        //     right = true;
        //     currentNumber.idx = (right) ? currentNumber.idx + 1: currentNumber.idx;
        // } else if (currentNumber.x > destinationNumber.x) { 
        //     currentNumber.x -= 1
        //     left = true;
        //     currentNumber.idx = (left) ? currentNumber.idx - 1: currentNumber.idx;
        // }
        
        // return this.findShortestRoute(currentNumber, destinationNumber, currentList.concat(currentNumber.idx))
    }

    addEntity(x, y, entity) {
        let currentWidthLength = 1;
        let currentHeightLength = 1;
        for (let idx = 1; idx < this.heightLength * this.widthLength + 1; idx++) {
            if (!this.get(idx)['entityList']) {
                this.get(idx)['entityList'] = [];
            }
            if (currentWidthLength === x && currentHeightLength === y) {
                this.matrix.get(idx)['entityList'].push(entity);
            }

            if (currentWidthLength < this.widthLength) {
                currentWidthLength += 1
            } else {
                currentWidthLength = 1;
                currentHeightLength += 1;
            }
        }
    }

    get(idx) {
        return this.matrix.get(idx);
    }

    set(idx, entityList) {
        this.matrix.get(idx).entityList = entityList;
    }
    

    createMap() {
        let currentWidthLength = 1;
        let currentHeightLength = 1;
        for (let idx = 1; idx < this.heightLength * this.widthLength + 1; idx++) {
            this.addVertex(idx);
        }
        for (let idx = 1; idx < this.heightLength * this.widthLength + 1; idx++) {
            let left = (currentWidthLength > 1) ? idx - 1 : null;
            let right = (currentWidthLength < this.widthLength) ? idx + 1: null;
            let up = (currentHeightLength > 1) ? idx - this.widthLength : null;
            let down = (currentHeightLength < this.heightLength) ? idx + this.widthLength: null;

            if (left) { this.addEdge(idx, left, "left") }
            if (right) { this.addEdge(idx, right, "right") }
            if (up) { this.addEdge(idx, up, "up") }
            if (down) { this.addEdge(idx, down, "down") }

            if (currentWidthLength < this.widthLength) {
                currentWidthLength += 1
            } else {
                currentWidthLength = 1;
                currentHeightLength += 1;
            }
        }
    }
}

module.exports = AdjacencyMatrix;
},{}],3:[function(require,module,exports){
const Entity = require('./Entity.js');

class Attribute extends Entity {
    constructor(name, description, image, x, y, width, height, level, multiplier) {
        super(100, name, description, image, x, y, width, height, Entity.ATTRIBUTE, level, multiplier);
        this.baseLevel = level;
        this.level = level;
        this.multiplier = multiplier;
        this.baseMultiplier = multiplier;
    }
}

module.exports = Attribute;
},{"./Entity.js":21}],4:[function(require,module,exports){
// const Head = require('./Head.js');
// const Chest = require('./Chest.js');
// const Legs = require('./Legs.js');
// const Arms = require('./Arms.js')
// const Feet = require('./Feet.js');
// const LHand = require('./lHand.js');
// const RHand = require('./rHand.js');
// const Shoulder = require('./Shoulder.js');
// const LFinger = require('./LFinger.js');
// const RFinger = require('./RFinger.js');

class Body {
    constructor(head, chest, legs, arms, feet, lHand, rHand, shoulder, lFinger, rFinger) {
        // this.head = new Head();
        // this.chest = new Chest();
        // this.legs = new Legs();
    }
}

module.exports = Body;
},{}],5:[function(require,module,exports){
const Plain = require('./Plain.js');
const Door = require('./Door.js');

class Building extends Plain {
    constructor(id, name, description, image, x, y, width, height, plainSpace, state, level, upgradePlan, insideImage) {
        super(id, name, description, image, x, y, width, height, plainSpace);
        this.door = Door.create();
        this.state = state;
        this.level = level;
        this.upgradePlan = upgradePlan;
        this.insideImage = insideImage;
    }
    

    retrieveBuildingLocation() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    open() {
        this.state = Building.OPEN;
    }

    
}

Building.OPEN = 'Active'
Building.CLOSED = 'Inactive'

module.exports = Building
},{"./Door.js":17,"./Plain.js":35}],6:[function(require,module,exports){
const Canvas = require('./Canvas.js');
const Component = require('./Component.js');
const TextComponent = require('./TextComponent.js');
const CharacterComponent = require('./CharacterComponent.js');

class Camera {
    constructor(destination) {
        this.canvasList = [];
        this.destination = destination;
        this.onState = false;
    }


    createNewLayer(layer) {
        let canvas = new Canvas(this.destination, layer);
        canvas.start();
        this.canvasList.push(canvas);
        return canvas;
    }

    addNewComponent(entity) {
        let component;
        switch(entity.description) {
            case "DemiGod": component = CharacterComponent.demiGod(entity); break;
            case "Brawler": component = CharacterComponent.block(entity); break;
            case "startButton": component = TextComponent.text(entity); break;
        }

        let addCheck = true;

        for (let canvas of this.canvasList) {
            if (canvas.layer === component.layer){
                canvas.add(component);
                addCheck = false;
            }
        }

        if (addCheck) {
            let canvas = this.createNewLayer(component.layer);
            canvas.add(component);
        }
    }

    updateCanvasList() {
        for (let canvas of this.canvasList) {
            canvas.componentList = [];
        }
    }

    updateLocations(locationObject) {
        for (let object of Object.values(locationObject)) {
            let check = false;
            for (let canvas of this.canvasList) {
                if (canvas.layer !== 0) {
                    if (object.id === canvas.layer) {
                        check = true;
                        canvas.update(object)
                    }
                }
            }
            if (!check) {
                this.addNewComponent(object);
            }
        }
    }

    clear() {
        for (let canvas of this.canvasList) {
            canvas.clear();
        }
    }

    update() {
        for (let canvas of this.canvasList) {
            canvas.draw();
        }
    }

    updateGame() {
        this.clear();
        this.update();
    }
}

module.exports = Camera;
},{"./Canvas.js":7,"./CharacterComponent.js":9,"./Component.js":10,"./TextComponent.js":49}],7:[function(require,module,exports){
class Canvas {
    constructor(parentNode, layer) {
        this.canvas = document.createElement('canvas');
        this.componentList = [];
        this.layer = layer;
        this.parentNode = parentNode;
    }

    setEventTarget(gm) {
        this.eventTarget = gm;
    }

    emitEvent(event) {
        if (this.eventTarget) {
            this.eventTarget.emit(event);
        }
    }

    start() {
        this.canvas.width = document.body.clientWidth;
        this.canvas.height = document.body.clientHeight;
        this.canvas.setAttribute('class', 'layer')
        this.canvas.setAttribute('z-index', this.layer)
        this.context = this.canvas.getContext("2d");
        this.parentNode.appendChild(this.canvas)
    }

    deleteSelf() {
        console.log("remove")
        this.parentNode.removeChild(this.canvas);
    }

    isNotEmpty() {
        return (this.componentList.length > 0);
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    draw() {
        for (let component of this.componentList) {
            component.drawImage(this.context);
        }
        
    }

    update(component) {
        for (let value of this.componentList) {
            if (value.id === component.id) {
                value.update(component)
            }
        }
    }


    add(component) {
        this.componentList.push(component);
    }

    get() {
        return this.componentList;
    }
}

module.exports = Canvas;
},{}],8:[function(require,module,exports){
const Person = require('./Person.js');

class Character extends Person {
    constructor(id, name, description, image, x, y, width, height, stats, state, inventory, endurance, body, alliance, characterClass) {
        super(id, name, description, image, x, y, width, height, stats, state, inventory, endurance, body, alliance, Person.CHARACTER);
        this.characterClass = characterClass;
    }
}

Character.DEMIGOD = 'demigod';



module.exports = Character;
},{"./Person.js":34}],9:[function(require,module,exports){
const Component = require('./Component.js');

class CharacterComponent extends Component {
    constructor(id, x, y, layer, width, height, type, color, componentType, back, left, right, backLeft, backRight, frontLeft, frontRight) {
        super(id, x, y, layer, width, height, type, color, componentType)
        this.back = back;
        this.left = left;
        this.right = right;
        this.backLeft = backLeft;
        this.backRight = backRight;
        this.frontLeft = frontLeft;
        this.frontRight = frontRight;
    }
    
    static demiGod(character) {
        return new CharacterComponent(
            character.id,
            character.x,
            character.y,
            character.id,
            character.width,
            character.height,
            Component.IMAGE,
            "red",
            Component.IMAGE,
            "",
            "",
            "",
            "",
            "",
            "",
            ""
        )
    }

    static brawler(character) {
        return new CharacterComponent(
            character.id,
            character.x,
            character.y,
            character.id,
            "",
            character.width,
            character.height,
            Component.IMAGE,
            "",
            "",
            "",
            "",
            "",
            "",
            ""
        )
    }
}

module.exports = CharacterComponent;
},{"./Component.js":10}],10:[function(require,module,exports){
class Component {
    constructor(id, x, y, layer, width, height, type, color, componentType) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.layer = layer;
        this.width = width;
        this.height = height;
        this.type = type;
        this.color = color;
        this.componentType = componentType;
        this.check = true;
    }

    drawImage(ctx) {
        if (!this.check) {
            if (this.color) {
                // this.image = new Image();
                // this.image.src = this.color;
                // this.image.addEventListener('load', e => {
                //     ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
                // });

                this.check = true;
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height)
            }
            if (this.text) {
                ctx.font = this.font;
                ctx.fillStyle = "white";
                ctx.textAlign = this.textAlign;
                ctx.fillText(this.text, this.x, this.y);
                this.check = true;
            }
        }
    }

    update(object) {
        this.x = object.x;
        this.y = object.y;
        this.check = false;
    }

    static block(character) {
        return new Component(
            character.id,
            character.x,
            character.y,
            character.id,
            character.width,
            character.height,
            'block',
            'black'
        )
    }


    static background() {
        return new Component(
            0,
            0, 0,
            0,
            document.body.clientWidth,
            document.body.clientHeight,
            'block',
            'white'
        )
    }

}

Component.IMAGE = 'image';
Component.BLOCK = 'block';
Component.TEXT = 'text';

Component.CHARACTER = 'character';
Component.ICON = 'icon';

module.exports = Component;
},{}],11:[function(require,module,exports){
const Attribute = require('./Attribute.js');

class Constitution extends Attribute {
    constructor(name, description, image, width, height, entityType, level, multiplier) {
        super(name, description, image, 0, 0, width, height, entityType, level, multiplier);
    }

    static create(level, multiplier) {
        return new Constitution(
            "Constitution",
            "How resiliant a person is to natural or man-made attacks",
            "",
            50, 50,
            level,
            multiplier
        )
    }
}

module.exports = Constitution;
},{"./Attribute.js":3}],12:[function(require,module,exports){
class Controller {
    constructor() {
        document.body.addEventListener('click', (event) => this.emitEvent('click', event));
        document.body.addEventListener('keydown', (event) => this.keyDownUp('keydown', event.keyCode));
        document.body.addEventListener('keyup', (event) => this.keyDownUp('keyup', event.keyCode));
        document.addEventListener('contextmenu', event => event.preventDefault());
    }

    setEventTarget(eventTarget) {
        this.eventTarget = eventTarget;
    }

    emitEvent(event, eventData) {
        if (this.eventTarget) {
            this.eventTarget.emit(event, eventData);
        }
    }
    keyDownUp(type, keyCode) {
        let down = (type == "keydown") ? true : false;

        switch(keyCode) {
            case 37: this.emitEvent('key', { direction: 'left', down: down}); break;
            case 38: this.emitEvent('key', { direction: 'up', down: down}); break;
            case 39: this.emitEvent('key', { direction: 'right', down: down}); break;
        }
    }
}

module.exports = Controller;
},{}],13:[function(require,module,exports){
const Location = require('./Location.js')

class Country extends Location {
    constructor(name, description, image, x, y, width, height, locationsMap, religion, wealth) {
        super(name, description, image, x, y, width, height, locationsMap)
        this.religion = religion;
        this.wealth = wealth;
    }
}


Country.POOR = 'poor';
Country.AVERAGE = 'average';
Country.RICH = 'rich';

module.exports = Country;

},{"./Location.js":30}],14:[function(require,module,exports){
const Character = require('./Character.js');
const Stats = require('./Stats.js');
const State = require('./State.js');
const Inventory = require('./Inventory.js');
const Person = require('./Person.js');

class DemiGod extends Character {
    constructor(id, name, description, image, x, y, width, height, stats, state, inventory, endurance, body, alliance) {
        super(id, name, description, image, x, y, width, height, stats, state, inventory, endurance, body, alliance, Character.DEMIGOD);
    }

    static create(name, x, y) {
        return new DemiGod(
            0,
            name,   
            "DemiGod",
            "",
            x, y,
            100,
            100,
            Stats.create(
                10, 2,
                10, 1,
                10, 1,
                10, 1,
                10, 1,
                10, 1,
                10, 1,
                10, 1,
                10, 2
            ),
            new State(
                100,
                100,
                60, //kg
                0
            ),
            new Inventory(),
            null,
            null, //new body after change
            Person.GOOD
        )
    }
}

module.exports = DemiGod;
},{"./Character.js":8,"./Inventory.js":28,"./Person.js":34,"./State.js":45,"./Stats.js":46}],15:[function(require,module,exports){
const Attribute = require('./Attribute.js');

class Dexterity extends Attribute {
    constructor(name, description, image, width, height, entityType, level, multiplier) {
        super(name, description, image, 0, 0, width, height, entityType, level, multiplier);
    }

    static create(level, multiplier) {
        return new Dexterity(
            "Dexterity",
            "How fast a person can move, or react to things",
            "",
            50, 50,
            level,
            multiplier
        )
    }
}

module.exports = Dexterity;
},{"./Attribute.js":3}],16:[function(require,module,exports){
const Location = require('./Location.js');

class District extends Location {
    constructor(name, description, image, x, y, width, height, locationsMap) {
        super(name, description, image, x, y, width, height, locationsMap);
    }

    static create(locationsMap, name) {
        return new District(
            name,
            "", //description
            "", //image
            0, 0,
            0, 0,
            locationsMap
        )
    }
}

module.exports = District;
},{"./Location.js":30}],17:[function(require,module,exports){
const Props = require('./Props.js');
const Stats = require('./Stats.js');
const State = require('./State.js');
const Inventory = require('./Inventory.js');

class Door extends Props {
    constructor(id, name, description, image, x, y, width, height, stats, state, inventory, endurance, useTime, useAmount) {
        super(id, name, description, image, x, y, width, height, stats, state, inventory, endurance, useTime, useAmount);
        this.locked = false;
    }

    static create(id) {
        return new Door(
            id,
            "Door",
            "A wooden door",
            "",
            0, 0,
            0, 0,
            Stats.create(
                0, 1,
                0, 1,
                0, 1,
                0, 1,
                0, 1,
                0, 1,
                0, 1,
                0, 1,
                0, 1
            ),
            new State(
                100,
                0,
                50,
                0
            ),
            new Inventory(),
            100,
            200,
            null
        )
    }
}

module.exports = Door;
},{"./Inventory.js":28,"./Props.js":37,"./State.js":45,"./Stats.js":46}],18:[function(require,module,exports){
const Planet = require('./Planet.js');
const Greece = require('./Greece.js');
const Italy = require('./Italy.js')
const School = require('./School.js');
const District = require('./District');
const ShoppingMall = require('./ShoppingMall.js')
const Shop = require('./Shop.js')

class Earth extends Planet {
    constructor(countryList, name) {
        super(name, countryList)
    }

    static create() {
        return new Earth([
            Greece.create({
                1: District.create({
                    1: School.greekSchool(),
                },
                "School district"),
                2: District.create({
                    1: ShoppingMall.create({
                        1: Shop.create(),
                        2: Shop.create()
                    })
                }, "Shopping district")
            }),
            Italy.create({
                1: District.create({
                    1: School.greekSchool(),
                },
                "School district"),
                2: District.create({
                    1: ShoppingMall.create({
                        1: Shop.create()
                    })
                }, "Shopping district")
            })
        ],
        "Earth")
    }
    
}

module.exports = Earth
},{"./District":16,"./Greece.js":24,"./Italy.js":29,"./Planet.js":36,"./School.js":40,"./Shop.js":41,"./ShoppingMall.js":44}],19:[function(require,module,exports){
const Attribute = require('./Attribute.js');

class Endurance extends Attribute {
    constructor(name, description, image, width, height, entityType, level, multiplier) {
        super(name, description, image, 0, 0, width, height, entityType, level, multiplier);
    }

    static create(level, multiplier) {
        return new Endurance(
            "Endurance",
            "blah",
            "",
            50, 50,
            level,
            multiplier
        )
    }
}

module.exports = Endurance;
},{"./Attribute.js":3}],20:[function(require,module,exports){
const Camera = require('./Camera.js');
const Controller = require('./Controller.js');
const EE = require('events');
const Matrix = require('./AdjacencyMatrix.js');
const Icon = require('./Icon.js');
const SceneHandler = require('./SceneHandler.js');
const Scene = require('./Scene.js');

let divGameScreen = document.createElement('div');
divGameScreen.setAttribute('id', 'mainBox')
document.body.appendChild(divGameScreen)


class Engine extends EE{
    constructor(gameSpace, refreshRate, zoom) {
        super()
        this.camera = new Camera(divGameScreen)
        this.controller = new Controller();
        this.controller.setEventTarget(this);
        this.gameSpace = gameSpace;
        this.gameSpace.setEventTarget(this);
        this.refreshRate = refreshRate;
        this.zoom = zoom;
        this.on('key', (event) => this.keyDown(event.direction, event.down));
        this.on('click', (event) => this.onClick(event.clientX, event.clientY));
        this.on('nextScene', () => this.nextScene())
        this.player = null;
        this.gameState = {
            scene: "",
            entityCount: 1,
            sceneHandler: new SceneHandler()
        }
    }

    addCharacter(character) {
        let add = character;
        add.id = this.gameState.entityCount;
        this.gameSpace.addCharacter(character);
        this.camera.addNewComponent(character);
        this.gameState.entityCount += 1;
    }

    createLevel(levelWidth, levelHeight, entityList) {
        console.log(entityList)
        let entityXSize;
        let entityYSize;
        let xSize = Math.ceil(levelWidth / this.gameSpace.width);
        let ySize = Math.ceil(levelHeight / this.gameSpace.height);

        let matrix = new Matrix(xSize, ySize, [], 1);
        matrix.createMap();

        for (let entity of entityList) {
            entityXSize = Math.ceil(entity.x / this.gameSpace.width);
            entityYSize = Math.ceil(entity.y / this.gameSpace.height);

            matrix.addEntity(entityXSize, entityYSize, entity)
        }

        return matrix;
    }


    createScene(name, levelWidth, levelHeight, level, func) {
        return new Scene(name, this.createLevel(levelWidth, levelHeight, level), func)
    }

    addScene(scene) {
        this.gameState.sceneHandler.addScene(scene);
        console.log(this.gameState.sceneHandler.sceneList)
    }

    prepareGame(game) {
        let list = []
        for (let scene of game) {
            list.push(this.createScene(scene[0], scene[1], scene[2], scene[3], scene[4])) //name, width, height, list, func
        }
        this.addScene(this.gameState.sceneHandler.joinScenes(list))
    }

    

    keyDown(direction, down) {
        this.gameSpace.keyDown(direction, down);
        this.updateGame()
    }

    updateGame() {
        this.gameState.sceneHandler.getLevel().get(this.gameSpace.levelIdx).entityList = this.gameSpace.entityList;
        this.gameSpace.update();
        this.camera.updateLocations(this.gameSpace.returnEntityLocations())
        this.camera.updateGame()
    }



    setLevel(level) {
        this.gameSpace.setLevel(level);
    }


    onClick(x, y) {
        console.log(this.gameState.scene)
        switch(this.gameState.scene) {
            case 'openWorld': this.gameSpace.whatDidPlayerClick(x, y); break;
            case 'mainScreen': this.gameSpace.clickMainScreen(x, y);
        }
    }

    nextScene() {
        this.gameState.sceneHandler.nextScene();
        this.gameSpace.setLevel(this.gameState.sceneHandler.getLevel())
        for (let idx = 1; idx < this.gameSpace.level.matrix.size; idx++) { //add id values as the entity counter goes up
            for (let entity of this.gameSpace.level.get(idx).entityList) {
                entity.id = this.gameState.entityCount;
                console.log(entity)
                this.gameState.entityCount += 1;
            }
        }
        this.gameSpace.setLevel(this.gameState.sceneHandler.getLevel());
        this.camera.updateCanvasList();
    }

    start() {
        setInterval(() => {
            this.updateGame()
        }, this.refreshRate)
        this.gameSpace.setLevel(this.gameState.sceneHandler.getLevel())
        this.gameState.sceneHandler.runScene();
    }

    mainScreen() {
        this.gameState.scene = 'mainScreen';
        console.log(this.gameState.scene)
    }

    openWorld() {
        this.gameState.scene = 'openWorld';
    }
}

module.exports = Engine;
},{"./AdjacencyMatrix.js":2,"./Camera.js":6,"./Controller.js":12,"./Icon.js":25,"./Scene.js":38,"./SceneHandler.js":39,"events":1}],21:[function(require,module,exports){
class Entity {
    constructor(id, name, description, image, x, y, width, height, entityType) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.image = image;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.entityType = entityType;
    }
}

Entity.INTERACTABLE = 'interactable';
Entity.MISCELLANEOUS = 'miscellaneous';
Entity.ICON = 'icon';
Entity.PLAIN = 'plain';
Entity.ATTRIBUTE = 'attribute';
Entity.QUEST = 'quest';
Entity.LOCATION = 'location';

module.exports = Entity;
},{}],22:[function(require,module,exports){
const Attribute = require('./Attribute.js');

class Faith extends Attribute {
    constructor(name, description, image, width, height, entityType, level, multiplier) {
        super(name, description, image, 0, 0, width, height, entityType, level, multiplier);
    }

    static create(level, multiplier) {
        return new Faith(
            "Faith",
            "How well a person carry things, or hit things",
            "",
            50, 50,
            level,
            multiplier
        )
    }
}

module.exports = Faith;
},{"./Attribute.js":3}],23:[function(require,module,exports){
const DemiGod = require('./DemiGod.js');
const Matrix = require('./AdjacencyMatrix.js');

class GameSpace {
    constructor(gravity, world, height, width) {
        this.gravity = gravity;
        this.world = world;
        this.height = height;
        this.width = width;
        this.entityList = []
        this.player = null;
        this.cameraState = false;
        this.moveLocation = null;
        this.level;
        this.levelIdx = 1;
    }

    setEventTarget(eventTarget) {
        this.eventTarget = eventTarget;
    }

    emitEvent(event, eventData) {
        if (this.eventTarget) {
            this.eventTarget.emit(event, eventData);
        }
    }

    setLevel(level) {
        this.level = level;
    }

    addCharacter(character) {
        this.entityList.push(character);
    }

    collideObject(object) {
        let finalIdx;
        for (let idx = 0; idx < this.entityList.length; idx++) { //find idx of object to be removed if it leaves boundaries
            if (this.entityList[idx] === object) {
                finalIdx = idx;
            }
        }

        if (object.x < 0) { 
            object.x = 0; object.velocityX = 0;
            let move = this.level.get(this.levelIdx).left;
            if (move) {  
                this.entityList.splice(finalIdx, 1)
                this.entityList = this.level.get(move).entityList; //get entityList
                this.entityList.push(object)
                this.levelIdx = move;
                object.x = this.width - object.width; //if moved, then change x coordinates accordingly
                this.player.moving = false;
            }
        } else if (object.x + object.width > this.width) { 
            object.x = this.width - object.width;
            let move = this.level.get(this.levelIdx).right;
            if (move) {    //if right panel exists, move there
                this.entityList.splice(finalIdx, 1)
                this.entityList = this.level.get(move).entityList;
                this.entityList.push(object)
                this.levelIdx = move;
                object.x = 0;
                this.player.moving = false;
            }
        
        } else if (object.y < 0) { 
            object.y = 0; object.velocityY = 0; 
            let move = this.level.get(this.levelIdx).up;
            if (move) {  
                this.entityList.splice(finalIdx, 1)
                this.entityList = this.level.get(move).entityList;
                this.entityList.push(object)
                this.levelIdx = move;
                object.y = this.height - object.height;
                this.player.moving = false;
            }
        } else if (object.y + object.height > this.height) { 
            object.y = this.height - object.height;
            let move = this.level.get(this.levelIdx).down;
            if (move) {
                this.entityList.splice(finalIdx, 1)
                this.entityList = this.level.get(move).entityList;
                this.entityList.push(object)
                this.levelIdx = move;
                object.y = 0;
                this.player.moving = false;
            }
        }
    }

    collisionCheck(mainObject, object) {
        let check;
        if (mainObject.x < object.x && mainObject.x + mainObject.width > object.x && mainObject.y > object.y && mainObject.y < object.y + object.height) {
            mainObject.x = object.x - mainObject.width;
            check = true;
        } else if (mainObject.x > object.x && mainObject.x < object.x + object.width && mainObject.y > object.y && mainObject.y < object.y + object.height) {
            mainObject.x = object.x + object.width;
            check = true;
        }
        
        if (mainObject.y < object.y && mainObject.y + mainObject.height > object.y && mainObject.x < object.x && mainObject.x + mainObject.width > object.x) {
            mainObject.y = object.y + mainObject.height;
            check = true;
        } else if (mainObject.y > object.y && object.y + object.height > mainObject.y && mainObject.x < object.x && mainObject.x + mainObject.width > object.x) {
            mainObject.y = object.y + object.height;
            check = true;
        }

        if (check) {
            let playerInEntity;
            for (let entity of this.entityList) {
                if (entity === this.player) {
                    playerInEntity = entity;
                }
            }
            this.player.moving = false;
            playerInEntity.start = {};
            playerInEntity.moving = false;
        }
    }

    locationChecker(x, y, object) {
        return (object.x < x && object.x + object.width > x && object.y < y && object.y + object.height > y)
    }

    whatDidPlayerClick(x, y) {
        x += 52;
        y += 53;
        let walkCheck = true;
        for (let entity of this.entityList) {
            console.log(entity, x, y)
            if (this.locationChecker(x, y, entity)) {
                //interact with item;
                this.player = entity;
                walkCheck = false;
            }
        }

        if (walkCheck) {
            console.log("madei ti")
            this.clickMove(x, y);
        }
    }

    clickMainScreen(x, y) {
        x += 225;
        y += 101.5;
        let startButton;
        for (let entity of this.entityList) {
            if (entity.name === 'startButton') {
                startButton = entity;
            }
        }

        if (this.locationChecker(x, y, startButton)) {
            this.emitEvent('nextScene');
        }
    }

    setLevel(level) {
        this.level = level;
        this.entityList = this.level.get(this.levelIdx).entityList;
    }

    update() {
        if (this.player) {
            this.entityListPositionUpdate();
            let playerInEntity;
            for (let entity of this.entityList) {
                if (entity === this.player) {
                    playerInEntity = entity;
                }
            }
            if (playerInEntity) {
                this.collideObject(playerInEntity)

            }
            for (let entity of this.entityList) {
                if (entity !== playerInEntity) {
                    if (playerInEntity) {
                        this.collisionCheck(playerInEntity, entity)

                    }
                }
            }
        }
        // if (this.player && this.moveLocation) {
        //     let playerInEntity;
        //     for (let entity of this.entityList) {
        //         if (entity === this.player) { playerInEntity = entity; }
        //     }
        //     if (this.player.moveIdx < this.moveLocation.length) {
        //         let coordinates = this.matrix.changeToCoordinates(this.moveLocation[this.player.moveIdx]);
        //         playerInEntity.x = coordinates.x;
        //         playerInEntity.y = coordinates.y;
        //         this.player.moveIdx += 1;
        //     } else {
        //         this.moveLocation = null;
        //         this.player.moveIdx = 0;
        //     }
        //     this.collideObject(playerInEntity);
        // }
    }

    entityListPositionUpdate() {
        if (this.player.moving) {
            if (!this.cameraState) {
                let playerInEntity;
                for (let entity of this.entityList) {
                    if (entity === this.player) {
                        playerInEntity = entity;
                    }
                }

                playerInEntity.x = playerInEntity.start.x + playerInEntity.direction.x * playerInEntity.currentSteps;
                playerInEntity.y = playerInEntity.start.y + playerInEntity.direction.y * playerInEntity.currentSteps;
                if (playerInEntity.currentSteps < playerInEntity.steps) {
                    playerInEntity.currentSteps += 1;
                } else {
                    playerInEntity.moving = false;
                    playerInEntity.start.x = null;
                    playerInEntity.start.y = null;
                }
            } else {
                for (let entity of this.entityList) {
                    if (entity !== this.player) {
                        entity.x = entity.start.x - entity.direction.x * entity.currentSteps;
                        entity.y = entity.start.y - entity.direction.y * entity.currentSteps;
                        if (entity.currentSteps < entity.steps) {
                            entity.currentSteps += 1;
                        } else {
                            this.player.moving = false;
                            entity.moving = false;
                            entity.start.x = null;
                            entity.start.y = null;
                        }
                    }
                }
            }
        } 

    }
    
    returnEntityLocations() {
        let final = {};
        for (let idx = 0; idx < this.entityList.length; idx++) {
            final[idx] = this.entityList[idx];
        }
        return final;
    }

    keyDown(direction, down) {
        if (down) {
            switch(direction) {
                case 'up': this.moveUp(); break;
                case 'down': this.moveDown(); break;
                case 'left': this.moveLeft(); break;
                case 'right': this.moveRight();
            }
        }
    }

    clickMove(x, y) {
        if (this.player) {
            let playerInEntity;
            for (let entity of this.entityList) {
                if (entity === this.player) {
                    playerInEntity = entity;
                }
            }

            playerInEntity.currentSteps = 1;
            playerInEntity.start = {};
            playerInEntity.start.x = playerInEntity.x;
            playerInEntity.start.y = playerInEntity.y;
            x -= playerInEntity.width / 2;
            y -= playerInEntity.height / 2;

            let xabs = Math.abs(x - playerInEntity.x);
            let yabs = Math.abs(y - playerInEntity.y);
            let length = Math.sqrt( Math.pow(xabs, 2) + Math.pow(yabs, 2));
            playerInEntity.steps = Math.floor(length) / 25;
            playerInEntity.moving = true;
            playerInEntity.direction = {};
            playerInEntity.steps = (!playerInEntity.steps) ? 0.1 : playerInEntity.steps;
            playerInEntity.direction.x = (x - playerInEntity.x) / playerInEntity.steps;
            playerInEntity.direction.y = (y - playerInEntity.y) / playerInEntity.steps;

            let differenceX = playerInEntity.x + (x - playerInEntity.x) / playerInEntity.steps + 1;
            let differenceY = playerInEntity.y + (y - playerInEntity.y) / playerInEntity.steps + 1;

            if (differenceX > 0 && differenceY > 0) {                  //Check what direction the character is walking in
                if (((differenceX / 4) * 3) > differenceY) {
                    playerInEntity.moveDirection = 'left';
                } else if (((differenceY / 4) * 3) > differenceX) {
                    playerInEntity.movingDirection = 'up'
                } else {
                    playerInEntity.movingDirection = 'upLeft'
                }
            } else if (differenceX < 0 && differenceY < 0) {
                differenceX = Math.abs(differenceX);
                differenceY = Math.abs(differenceY);
                if (((differenceX / 4) * 3) > differenceY) {
                    playerInEntity.moveDirection = 'right';
                } else if (((differenceY / 4) * 3) > differenceX) {
                    playerInEntity.movingDirection = 'down'
                } else {
                    playerInEntity.movingDirection = 'downRight'
                }
            } else if (differenceX < 0 && differenceY > 0) {
                differenceX = Math.abs(differenceX);
                if (((differenceX / 4) * 3) > differenceY) {
                    playerInEntity.moveDirection = 'right';
                } else if (((differenceY / 4) * 3) > differenceX) {
                    playerInEntity.movingDirection = 'up'
                } else {
                    playerInEntity.movingDirection = 'upRight'
                }
            } else if (differenceX > 0 && differenceY < 0) {
                differenceY = Math.abs(differenceY);
                if (((differenceX / 4) * 3) > differenceY) {
                    playerInEntity.moveDirection = 'left';
                } else if (((differenceY / 4) * 3) > differenceX) {
                    playerInEntity.movingDirection = 'down'
                } else {
                    playerInEntity.movingDirection = 'downLeft'
                }
            } else if (differenceX === 0 && differenceY < 0) {
                playerInEntity.moveDirection = 'down';
            } else if (differenceX === 0 && differenceY > 0) {
                playerInEntity.moveDirection = 'up';
            } else if (differenceX > 0 && differenceY === 0) {
                playerInEntity.moveDirection = 'left';
            } else if (differenceX < 0 && differenceY === 0) {
                playerInEntity.moveDirection = 'right';
            }
        }   
    }



    // jumpUp() {
    //     if (!this.jumping) {
    //         this.jumping = true;
    //         this.velocityY -= this.jump;
    //     }
    // }

    moveLeft(x) { this.player.velocityX = x; }
    moveRight(x) { this.player.velocityX = x; }
    moveUp(x) { this.player.velocityY = x; }
    moveDown(x) { this.player.velocityY = x; }
}


module.exports = GameSpace;
},{"./AdjacencyMatrix.js":2,"./DemiGod.js":14}],24:[function(require,module,exports){
const Country = require('./Country.js');

class Greece extends Country {
    constructor(name, description, image, x, y, width, height, locationsMap, religion, wealth){
        super(name, description, image, x, y, width, height, locationsMap, religion, wealth);
    }

    static create(locationsMap) {
        return new Greece(
            "Greece",
            "The country Greece",
            "",
            0, 0,
            0, 0,
            locationsMap,
            "Greek",
            Country.RICH
        )
    }
}

module.exports = Greece;
},{"./Country.js":13}],25:[function(require,module,exports){
const Entity = require('./Entity.js');

class Icon extends Entity {
    constructor(id, name, description, image, x, y, width, height, text, font, fillStyle, textAlign, use) {
        super(id, name, description, image, x, y, width, height, Entity.ICON)
        this.text = text;
        this.font = font;
        this.fillStyle = fillStyle;
        this.textAlign = textAlign;

        this.use = use;
    }

    setEventTarget(eventTarget) {
        this.eventTarget = eventTarget;
    }

    emitEvent(event, eventData) {
        if (this.eventTarget) {
            this.eventTarget.emit(event, eventData);
        }
    }

    static startButton(x, y, width, height, text) {
        return new Icon(
            1,
            "startButton",
            "startButton",
            "grey",
            x, y,
            width, height, 
            text,
            "80px Arial",
            "white",
            "center",
            () => {
                this.emitEvent(this.text, this);
            }
        )
    }
}

module.exports = Icon;
},{"./Entity.js":21}],26:[function(require,module,exports){
const Attribute = require('./Attribute.js');

class Intelligence extends Attribute {
    constructor(name, description, image, width, height, entityType, level, multiplier) {
        super(name, description, image, 0, 0, width, height, entityType, level, multiplier);
    }

    static create(level, multiplier) {
        return new Intelligence(
            "Intelligence",
            "brains",
            "",
            50, 50,
            level,
            multiplier
        )
    }

}

module.exports = Intelligence;
},{"./Attribute.js":3}],27:[function(require,module,exports){
const Entity = require('./Entity.js')

class Interactable extends Entity {
    constructor(id, name, description, image, x, y, width, height, interactableType, stats, state, inventory, endurance) {
        super(id, name, description, image, x, y, width, height, Entity.INTERACTABLE)
        this.interactableType = interactableType;
        this.stats = stats;
        this.state = state;
        this.inventory = inventory;
        this.endurance = endurance;
        this.use = function(user) {
            console.log(user, "Used")
        }
    }
}

Interactable.USABLE = 'usable';
Interactable.PERSON = 'person';

module.exports = Interactable;                                     
},{"./Entity.js":21}],28:[function(require,module,exports){
class Inventory {
    constructor() {
        this.list = []
        this.weight = 0;
    }

    add(item) {
        this.list.push(item)
    }

    take(item) {
        for (let piece in this.list) {
            if (item === this.list[piece]) {
                let final = this.list[piece];
                this.list.splice(piece, 1);
                return final;
            }
        }
    }
}

module.exports = Inventory;
},{}],29:[function(require,module,exports){
const Country = require('./Country.js');

class Italy extends Country {
    constructor(name, description, image, x, y, width, height, locationsMap, religion, wealth){
        super(name, description, image, x, y, width, height, locationsMap, religion, wealth);
    }

    static create(locationsMap) {
        return new Italy(
            "Italy",
            "The country Italy",
            "",
            0, 0,
            0, 0,
            locationsMap,
            "Roman",
            Country.RICH
        )
    }
}

module.exports = Italy;
},{"./Country.js":13}],30:[function(require,module,exports){
const Entity = require('./Entity.js');

class Location extends Entity {
    constructor(id, name, description, image, x, y, width, height, locationsMap) {
        super(id, name, description, image, x, y, width, height, Entity.LOCATION);
        this.locationsMap = locationsMap
    }
}

module.exports = Location;
},{"./Entity.js":21}],31:[function(require,module,exports){
const Attribute = require('./Attribute.js');

class Luck extends Attribute {
    constructor(name, description, image, width, height, entityType, level, multiplier) {
        super(name, description, image, 0, 0, width, height, entityType, level, multiplier);
    }

    static create(level, multiplier) {
        return new Luck(
            "Luck",
            "How well a person carry things, or hit things",
            "",
            50, 50,
            level,
            multiplier
        )
    }
}

module.exports = Luck;
},{"./Attribute.js":3}],32:[function(require,module,exports){
const Attribute = require('./Attribute.js');

class Memory extends Attribute {
    constructor(name, description, image, width, height, entityType, level, multiplier) {
        super(name, description, image, 0, 0, width, height, entityType, level, multiplier);
    }

    static create(level, multiplier) {
        return new Memory(
            "Memory",
            "ability memory",
            "",
            50, 50,
            level,
            multiplier
        )
    }
}

module.exports = Memory;
},{"./Attribute.js":3}],33:[function(require,module,exports){
const Person = require('./Person.js');

class Npc extends Person {
    constructor(name, description, image, x, y, width, height, stats, state, inventory, endurance, body, alliance){
        super(name, description, image, x, y, width, height, stats, state, inventory, endurance, body, alliance, Person.NPC)
    }

    
}

module.exports = Npc;
},{"./Person.js":34}],34:[function(require,module,exports){
const Interactable = require('./Interactable.js');

class Person extends Interactable {
    constructor(id, name, description, image, x, y, width, height, stats, state, inventory, endurance, body, alliance, personType) {
        super(id, name, description, image, x, y, width, height, Interactable.PERSON, stats, state, inventory, endurance);
        this.body = body;
        this.alliance = alliance;
        this.personType = personType;
    }
}

Person.CHARACTER = 'character';
Person.NPC = 'npc';

Person.GOOD = 'good';
Person.LAWFULGOOD = 'lawfulGood'
Person.EVIL = 'evil';

module.exports = Person;
},{"./Interactable.js":27}],35:[function(require,module,exports){
const Entity = require('./Entity.js');

class Plain extends Entity {
    constructor(id, name, description, image, x, y, width, height, plainSpace) {
        super(id, name, description, image, x, y, width, height, Entity.PLAIN);
        this.plainSpace = plainSpace;
    }
}

module.exports = Plain;
},{"./Entity.js":21}],36:[function(require,module,exports){
class Planet {
    constructor(name, countryList) {
        this.name = name;
        this.countryList = countryList;
    }

    
}

module.exports = Planet
},{}],37:[function(require,module,exports){
const Usable = require('./Usable.js');

class Props extends Usable {
    constructor(id, name, description, image, x, y, width, height, stats, state, inventory, endurance, useTime, useAmount) {
        super(id, name, description, image, x, y, width, height, stats, state, inventory, endurance, useTime, useAmount)
    }
}

module.exports = Props;
},{"./Usable.js":52}],38:[function(require,module,exports){
class Scene {
    constructor(name, level, run) {
        this.name = name;
        this.level = level;
        this.run = run;
        this.connectedScenes = []
    }

    connect(scene) {
        this.connectedScenes.push(scene);
    }
}

module.exports = Scene;
},{}],39:[function(require,module,exports){
class SceneHandler {
    constructor() {
        this.sceneList = []
        this.firstScene = null;
        this.currentScene = null;
        this.savedScene = null;
    }

    joinScenes(sceneList) {
        let firstScene = sceneList[0];
        this.sceneList.push(sceneList[0]);
        for (let idx = 0; idx < sceneList.length - 1; idx++) {
            sceneList[idx].connect(sceneList[idx+1]);
            this.sceneList.push(sceneList[idx+1]);
        }

        return firstScene;
    }

    setScene(scene) {
        this.currentScene = scene;
    }

    runScene() {
        console.log(this.currentScene)
        this.currentScene.run();
    }

    nextScene(choice = 0) {
        this.currentScene = this.currentScene.connectedScenes[choice];
        this.runScene();
    }

    addScene(scene) {
        if (!this.firstScene) {
            this.firstScene = scene;
            this.currentScene = this.firstScene;
        } else {
            this.sceneList.push(scene);
            this.currentScene.connect(scene);
        }
    }

    getLevel() {
        return this.currentScene.level;
    }
}

module.exports = SceneHandler;
},{}],40:[function(require,module,exports){
const Building = require('./Building.js');

class School extends Building {
    constructor(id, name, description, image, x, y, width, height, plainSpace, state, level, upgradePlan, insideImage) {
        super(id, name, description, image, x, y, width, height, plainSpace, state, level, upgradePlan, insideImage)
    }

    static create(id, name, description, image, x, y, width, height, plainSpace, state, level, upgradePlan, insideImage) {
        return new School(id,
            name, description,
            image, x, y,
            width, height,
            plainSpace,
            state, level,
            upgradePlan,
            insideImage
        )
    }

    static greekSchool(id) {
        return new School(
            id,
            "Greek school",
            "School in the greek faction of earth",
            "",
            0, 0,
            0, 0,
            [],
            Building.OPEN,
            1,
            null,
            "" //the image of inside the building
        )
    }
}

module.exports = School;
},{"./Building.js":5}],41:[function(require,module,exports){
const Building = require('./Building.js')
const ShopKeeper = require('./ShopKeeper.js')
const ShopUpgradePlan = require('./ShopUpgradePlan.js')

class Shop extends Building {
    constructor(name, description, image, x, y, width, height, plainSpace, state, level, upgradePlan, insideImage) {
        super(name, description, image, x, y, width, height, plainSpace, state, level, upgradePlan, insideImage);
    }

    static create() {
        let plan = new ShopUpgradePlan();
        plan.prepare();

        return new Shop(
            "Shop",
            "A shop",
            "",
            0, 0,
            400, 300,
            [
                ShopKeeper.create(0, 0)
            ],
            Building.CLOSED,
            1,
            plan,
            ""
        )
    }
}

module.exports = Shop
},{"./Building.js":5,"./ShopKeeper.js":42,"./ShopUpgradePlan.js":43}],42:[function(require,module,exports){
const Npc = require('./Npc.js')
const stats = require('./stats.js');
const inventory = require('./inventory.js');
const intelligence = require('./intelligence.js');
const experience = require('./experience.js');
const Status = require('./Status.js')
const Body = require('./Body.js')

class ShopKeeper extends Npc {
    constructor(name, description, image, x, y, width, height, stats, inventory, status, body, abilityList, favor) {
        super(name, description, image, x, y, width, height, stats, inventory, status, body, abilityList, Npc.SHOPKEEPER, favor);
    }

    static create(x, y) {
        return new ShopKeeper()
    }
}

module.exports = ShopKeeper
},{"./Body.js":4,"./Npc.js":33,"./Status.js":47,"./experience.js":54,"./intelligence.js":56,"./inventory.js":57,"./stats.js":58}],43:[function(require,module,exports){
const UpgradePlan = require('./UpgradePlan.js')
const UpgradeToken = require('./UpgradeToken.js')
const shop = require('./Shop.js')

class ShopUpgradePlan extends UpgradePlan {
    constructor() {
        super()
    }

    cheaperOne() {
        function upgrade() {
            shop.weaponShelf.cheapen(10)
        }
        return new UpgradeToken(upgrade,
        "Cheaper(1)",
        50)
    }

    cheaperTwo() {
        function upgrade() {
            shop.armorShelf.cheapen(20)
        }
        return new UpgradeToken(upgrade,
        "Cheaper(2)",
        60)
    }

    moreGoldOne() {
        function upgrade() {
            shop.moreGold(100)
        }
        return new UpgradeToken(upgrade,
        "More Gold(1)",
        30)
    }

    moreGoldTwo() {
        function upgrade() {
            shop.moreGold(200)
        }
        return new UpgradeToken(upgrade,
        "More Gold(2)",
        50)
    }

    moreStocksOne() {
        function upgrade() {
            shop.weaponShelf.moreStocks(1)
            shop.armorShelf.moreStocks(1)
        }
        return new UpgradeToken(upgrade,
        "Greater Stocks(1)",
        100)
    }

    moreStocksTwo() {
        function upgrade(){
            shop.weaponShelf.moreStocks(2)
            shop.armorShelf.moreStocks(2)
        }
        return new UpgradeToken(upgrade,
        "Greater Stocks(2)",
        200)
    }

    moreStocksThree() {
        function upgrade() {
            shop.weaponShelf.moreStocks(3)
            shop.armorShelf.moreStocks(3)
        }
        return new UpgradeToken(upgrade,
        "Greater Stocks(3)",
        300)
    }

    prepare() {
        const two = this.cheaperOne()
        const three = this.cheaperTwo()
        const four = this.moreGoldOne()
        const five = this.moreGoldTwo()
        const one = this.moreStocksOne()
        const six = this.moreStocksTwo()
        const seven = this.moreStocksThree()

        this.add(one, null)
        this.add(two, one)
        this.add(three, two)
        this.add(four, one)
        this.add(five, four)
        this.add(six, five)
        this.add(seven, three)
    }
}

module.exports = ShopUpgradePlan
},{"./Shop.js":41,"./UpgradePlan.js":50,"./UpgradeToken.js":51}],44:[function(require,module,exports){
const Building = require('./Building.js');
const Door = require

class ShoppingMall extends Building {
    constructor(name, description, image, x, y, width, height, plainSpace, state, level, upgradePlan, insideImage) {
        super(name, description, image, x, y, width, height, plainSpace, state, level, upgradePlan, insideImage)
    }

    static create(plainSpace, name) {
        return new ShoppingMall(
            name,
            "", //description
            "", //image
            0, 0,
            0,0,
            plainSpace,
            Building.OPEN,
            1,
            null,
            "" //inside image
        )
    }
}

module.exports = ShoppingMall;
},{"./Building.js":5}],45:[function(require,module,exports){
const Entity = require('./Entity.js');
const Status = require('./Status.js');

class State extends Entity {
    constructor(health, stamina, weight, chi) {
        super("State", "Character/object's current state", "", 0, 0, 0, 0); //x, y, width, height all 0 at start, but they can be expanded
        this.status = new Status();
        this.health = health;
        this.healthCap = health;
        this.stamina = stamina;
        this.staminaCap = stamina;
        this.weight = weight;
        this.chi = chi;
    }
}

module.exports = State;
},{"./Entity.js":21,"./Status.js":47}],46:[function(require,module,exports){
const S = require('./Strength.js');
const D = require('./Dexterity.js');
const E = require('./Endurance.js');
const I = require('./Intelligence.js');
const C = require('./Constitution.js');
const M = require('./Memory.js');
const W = require('./Wits.js');
const L = require('./Luck.js');
const F = require('./Faith.js');


class Stats {
    constructor(strength, dexterity, endurance, intelligence, constitution, memory, wits, luck, faith) {
        this.strength = strength;
        this.dexterity = dexterity;
        this.endurance = endurance;
        this.intelligence = intelligence;
        this.constitution = constitution;
        this.memory = memory;
        this.wits = wits;
        this.luck = luck;
        this.faith = faith;
    }

    static create(str, strM, dex, dexM, end, endM, int, intM, cons, consM, mem, memM, wits, witsM, luck, luckM, faith, faithM) {
        return new Stats(
            S.create(str, strM),
            D.create(dex, dexM),
            E.create(end, endM),
            I.create(int, intM),
            C.create(cons, consM),
            M.create(mem, memM),
            W.create(wits, witsM),
            L.create(luck, luckM),
            F.create(faith, faithM)
        )
    }

}

module.exports = Stats;
},{"./Constitution.js":11,"./Dexterity.js":15,"./Endurance.js":19,"./Faith.js":22,"./Intelligence.js":26,"./Luck.js":31,"./Memory.js":32,"./Strength.js":48,"./Wits.js":53}],47:[function(require,module,exports){
class Status {
    constructor() {
        this.buff = []
        this.debuff = []
    }

    applyEffect(effect) {
        this[effect.type].push(effect)
    }

    removeEffect(effect) {
        for (let x = 0; x < this[effect.type].length; x++) {
            if (this[effect.type][x].name === effect.name) {
                this[effect.type].splice(x);
                break;
            }
        }
    }


}

module.exports = Status
},{}],48:[function(require,module,exports){
const Attribute = require('./Attribute.js');

class Strength extends Attribute {
    constructor(name, description, image, width, height, level, multipler) {
        super(name, description, image, 0, 0, width, height, level, multipler);
    }

    static create(level, multiplier) {
        return new Strength(
            "Strength",
            "How well a person carry things, or hit things",
            "",
            50, 50,
            level,
            multiplier
        )
    }
}

module.exports = Strength;
},{"./Attribute.js":3}],49:[function(require,module,exports){
const Component = require('./Component.js');

class TextComponent extends Component {
    constructor(id, x, y, layer, width, height, type, color, text, font, fillStyle, textAlign) {
        super(id, x, y, layer, width, height, type, color);
        this.text = text;
        this.font = font;
        this.fillStyle = fillStyle;
        this.textAlign = textAlign;
    }

    static text(object) {
        return new TextComponent(
            object.id, object.x,
            object.y,
            object.id,
            object.width,
            object.height,
            null,
            object.image,
            object.text,
            object.font,
            object.fillStyle,
            object.textAlign
        )
    }
}

module.exports = TextComponent;
},{"./Component.js":10}],50:[function(require,module,exports){
class UpgradePlan {
    constructor() {
        this.first = null
    }

    add(token, selectedToken, currentToken = this.first, layer = 1) {
        if (currentToken === null) {
            this.first = token
            return
        }
        if (selectedToken === currentToken) {
            currentToken.connect(token)
            return
        } else {
            let idx = 0
            while (currentToken.hasNext(idx)) {
                this.add(token, selectedToken, currentToken.hasNext(idx), layer + 1)
                idx++
            }
        }
    }
    

    traverse(action = (value, layer) => {
        console.log(value.name)
        console.log("On layer:", layer,"\n") }, currentToken = this.first, layer = 1) 
    {
        if (currentToken === null) {
            return
        }
        action(currentToken, layer)
        let idx = 0
        while (true) {
            let next = currentToken.hasNext(idx)
            if (next) {
                this.traverse(action, next, layer + 1)
            } else {
                return
            }
            idx += 1
        }
    }
}

module.exports = UpgradePlan
},{}],51:[function(require,module,exports){
class UpgradeToken {
    constructor(upgrade, name, cost) {
        this.next = []
        this.upgrade = upgrade
        this.name = name
        this.cost = cost
        this.unlocked = false
    }

    hasNext(direction) {
        return this.next[direction]
    }

    connect(upgrade) {
        this.next.push(upgrade)
    }
}

module.exports = UpgradeToken
},{}],52:[function(require,module,exports){
const Interactable = require('./Interactable.js');

class Usable extends Interactable {
    constructor(id, name, description, image, x, y, width, height, stats, state, inventory, endurance, useTime, useAmount) {
        super(id, name, description, image, x, y, width, height, Interactable.USABLE, stats, state, inventory, endurance)
        this.useTime = useTime;
        this.useAmount = useAmount;
    }
}

module.exports = Usable;
},{"./Interactable.js":27}],53:[function(require,module,exports){
const Attribute = require('./Attribute.js');

class Wits extends Attribute {
    constructor(name, description, image, width, height, entityType, level, multiplier) {
        super(name, description, image, 0, 0, width, height, entityType, level, multiplier);
    }

    static create(level, multiplier) {
        return new Wits(
            "Wits",
            "reaction speed",
            "",
            50, 50,
            level,
            multiplier
        )
    }
}

module.exports = Wits;
},{"./Attribute.js":3}],54:[function(require,module,exports){
class Experience {
    constructor() {
        this.experience = 0;
        this.cap = 10000;
    }

    set xp(experience) {
        this.experience += experience;
        if (this.xp > this.cap) {
            this.experience = this.cap;
        }
    }

    get xp() {
        return this.experience;
    }
}

module.exports = Experience;
},{}],55:[function(require,module,exports){
const Engine = require('./Engine.js');
const GameState = require('./GameSpace.js');
const Earth = require('./Earth.js')
const DemiGod = require('./DemiGod.js');
const Icon = require('./Icon.js');

const earth = Earth.create(); //create the world

const engine = new Engine(
    new GameState(
        0.8,
        earth, //pass in the world
        document.body.clientHeight,
        document.body.clientWidth
    ),
    50, //framerate
    1
)

const scene1 = [
    "MainScreen", 
    document.body.clientWidth, 
    document.body.clientHeight, 
    [
        Icon.startButton(engine.gameSpace.width / 2, engine.gameSpace.height / 2, 450, 200, 'Start Game')
    ], 
    () => { 
        engine.mainScreen() 
    }
]

const scene2 = [
    "Intro", //name
    3000, //width
    1500, //height
    [   
        DemiGod.create("bad", 900, 900), //entities
        DemiGod.create("ygit", 500, 500),
        DemiGod.create("Hazar", 100, 100)
    ], 
    () => { 
        engine.openWorld() //function to play
    }
]

scene3 = [
    "Second chapter", 
    3000, 
    1500, 
    [
        DemiGod.create("yuh", 1000, 500)
    ], 
    ()=>{}
]

scene4 = [
    "Third Chapter", 
    6000, 
    2000, 
    [
        DemiGod.create("yeah", 500, 500)
    ], 
    ()=>{}
]

let game = [
    scene1,
    scene2,
    scene3,
    scene4
]

engine.prepareGame(game);

engine.start();


},{"./DemiGod.js":14,"./Earth.js":18,"./Engine.js":20,"./GameSpace.js":23,"./Icon.js":25}],56:[function(require,module,exports){
arguments[4][26][0].apply(exports,arguments)
},{"./Attribute.js":3,"dup":26}],57:[function(require,module,exports){
arguments[4][28][0].apply(exports,arguments)
},{"dup":28}],58:[function(require,module,exports){
arguments[4][46][0].apply(exports,arguments)
},{"./Constitution.js":11,"./Dexterity.js":15,"./Endurance.js":19,"./Faith.js":22,"./Intelligence.js":26,"./Luck.js":31,"./Memory.js":32,"./Strength.js":48,"./Wits.js":53,"dup":46}]},{},[55]);
