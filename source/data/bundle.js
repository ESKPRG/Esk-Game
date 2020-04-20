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
const Entity = require('./Entity.js');

class Attribute extends Entity {
    constructor(name, description, image, x, y, width, height, level, multiplier) {
        super(name, description, image, x, y, width, height, Entity.ATTRIBUTE, level, multiplier);
        this.baseLevel = level;
        this.level = level;
        this.multiplier = multiplier;
        this.baseMultiplier = multiplier;
    }
}

module.exports = Attribute;
},{"./Entity.js":19}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
const Plain = require('./Plain.js');
const Door = require('./Door.js');

class Building extends Plain {
    constructor(name, description, image, x, y, width, height, plainSpace, state, level, upgradePlan, insideImage) {
        super(name, description, image, x, y, width, height, plainSpace);
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
},{"./Door.js":15,"./Plain.js":32}],5:[function(require,module,exports){
const Canvas = require('./Canvas.js');
const Component = require('./Component.js');

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
            case "DemiGod": component = Component.demiGod(entity); break;
            case "Brawler": component = Component.block(entity);
        }
        let canvas = this.createNewLayer(component.layer);
        canvas.set(component);
    }

    updateLocations(locationObject) {
        for (let object of Object.values(locationObject)) {
            for (let canvas of this.canvasList) {
                if (canvas.layer !== 0) {
                    if (object.id === canvas.layer) {
                        canvas.component.update(object)
                    }
                }
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
},{"./Canvas.js":6,"./Component.js":8}],6:[function(require,module,exports){
class Canvas {
    constructor(parentNode, layer) {
        this.canvas = document.createElement('canvas');
        this.component = null;
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

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    draw() {
        this.component.drawImage(this.context);
    }


    set(component) {
        this.component = component;
    }

    get() {
        return this.component;
    }
}

module.exports = Canvas;
},{}],7:[function(require,module,exports){
const Person = require('./Person.js');

class Character extends Person {
    constructor(name, description, image, x, y, width, height, stats, state, inventory, endurance, body, alliance, characterClass) {
        super(name, description, image, x, y, width, height, stats, state, inventory, endurance, body, alliance, Person.CHARACTER);
        this.characterClass = characterClass;
    }
}

Character.DEMIGOD = 'demigod';



module.exports = Character;
},{"./Person.js":31}],8:[function(require,module,exports){
class Component {
    constructor(id, x, y, layer, width, height, type, color) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.layer = layer;
        this.width = width;
        this.height = height;
        this.type = type;
        this.color = color;
    }

    drawImage(ctx) {   
        if (this.type === 'image') {
            this.image = new Image();
            this.image.src = this.color;
            this.image.addEventListener('load', e => {
                ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            });
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
    }

    update(object) {
        this.x = object.x;
        this.y = object.y;
    }

    static demiGod(character) {
        return new Component(
            character.id,
            character.x, character.y,
            character.id,
            character.width,
            character.height,
            'block',
            "red"
        )
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
            'blue'
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

module.exports = Component;
},{}],9:[function(require,module,exports){
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
},{"./Attribute.js":2}],10:[function(require,module,exports){
class Controller {
    constructor() {
        document.body.addEventListener('click', (event) => this.emitEvent('click', event));
        document.body.addEventListener('keydown', (event) => this.keyDownUp('keydown', event.keyCode));
        document.body.addEventListener('keyup', (event) => this.keyDownUp('keyup', event.keyCode));
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
},{}],11:[function(require,module,exports){
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

},{"./Location.js":27}],12:[function(require,module,exports){
const Character = require('./Character.js');
const Stats = require('./Stats.js');
const State = require('./State.js');
const Inventory = require('./Inventory.js');
const Person = require('./Person.js');

class DemiGod extends Character {
    constructor(name, description, image, x, y, width, height, stats, state, inventory, endurance, body, alliance) {
        super(name, description, image, x, y, width, height, stats, state, inventory, endurance, body, alliance, Character.DEMIGOD);
    }

    static create(name, x, y) {
        return new DemiGod(
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
},{"./Character.js":7,"./Inventory.js":25,"./Person.js":31,"./State.js":40,"./Stats.js":41}],13:[function(require,module,exports){
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
},{"./Attribute.js":2}],14:[function(require,module,exports){
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
},{"./Location.js":27}],15:[function(require,module,exports){
const Props = require('./Props.js');
const Stats = require('./Stats.js');
const State = require('./State.js');
const Inventory = require('./Inventory.js');

class Door extends Props {
    constructor(name, description, image, x, y, width, height, stats, state, inventory, endurance, useTime, useAmount) {
        super(name, description, image, x, y, width, height, stats, state, inventory, endurance, useTime, useAmount);
        this.locked = false;
    }

    static create() {
        return new Door(
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
},{"./Inventory.js":25,"./Props.js":34,"./State.js":40,"./Stats.js":41}],16:[function(require,module,exports){
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
},{"./District":14,"./Greece.js":22,"./Italy.js":26,"./Planet.js":33,"./School.js":35,"./Shop.js":36,"./ShoppingMall.js":39}],17:[function(require,module,exports){
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
},{"./Attribute.js":2}],18:[function(require,module,exports){
const Camera = require('./Camera.js');
const Controller = require('./Controller.js');
const EE = require('events');

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
        this.refreshRate = refreshRate;
        this.zoom = zoom;
        this.on('key', (event) => this.keyDown(event.direction, event.down));
        this.on('click', (event) => this.onClick(event.clientX, event.clientY));
        this.gameState = {
            scene: "mainScreen"
        }
    }

    addCharacter(character) {
        this.gameSpace.addCharacter(character);
        this.camera.addNewComponent(character);
    }

    keyDown(direction, down) {
        this.gameSpace.keyDown(direction, down);
        this.updateGame()
    }

    updateGame() {
        if (this.gameState.scene === "inGame") {
            this.gameSpace.update()
        }
        this.camera.updateLocations(this.gameSpace.returnEntityLocations())
        this.camera.updateGame()
    }

    onClick(x, y) {
        this.gameSpace.clickMove(x, y);
    }

    start() {
        setInterval(() => {
            this.updateGame()
        }, this.refreshRate)
    }
}

module.exports = Engine;
},{"./Camera.js":5,"./Controller.js":10,"events":1}],19:[function(require,module,exports){
class Entity {
    constructor(name, description, image, x, y, width, height, entityType) {
        this.id = Math.floor((Math.random() * 1000000) + 1);
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
Entity.PLAIN = 'plain';
Entity.ATTRIBUTE = 'attribute';
Entity.QUEST = 'quest';
Entity.LOCATION = 'location'

module.exports = Entity;
},{}],20:[function(require,module,exports){
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
},{"./Attribute.js":2}],21:[function(require,module,exports){
const DemiGod = require('./DemiGod.js');

class GameState {
    constructor(gravity, world, height, width) {
        this.gravity = gravity;
        this.world = world;
        this.height = height;
        this.width = width;
        this.entityList = []
        this.player = null;
        this.cameraState = false;
    }

    addCharacter(character) {
        this.entityList.push(character);
    }

    collideObject(object) {
        if (object.x < 0) { object.x = 0; object.velocityX = 0; }
        else if (object.x + object.width > this.width) { object.x = this.width - object.width; }
        if (object.y < 0) { object.y = 0; object.velocityY = 0; }
        else if (object.y + object.height > this.height) { object.y = this.height - object.height;  }
    }

    collisionCheck(mainObject, object) {
        if (mainObject.x < object.x && mainObject.x + mainObject.width > object.x && mainObject.y > object.y && mainObject.y < object.y + object.height) {
            mainObject.x = object.x - mainObject.width;
        } else if (mainObject.x > object.x && mainObject.x < object.x + object.width && mainObject.y > object.y && mainObject.y < object.y + object.height) {
            mainObject.x = object.x + object.width;
        } else if (mainObject.y < object.y && mainObject.y + mainObject.height > object.y && mainObject.x < object.x && mainObject.x + mainObject.width > object.x) {
            mainObject.y = object.y + mainObject.height;
        } else if (mainObject.y > object.y && object.y + object.height > mainObject.y && mainObject.x < object.x && mainObject.x + mainObject.width > object.x) {
            mainObject.y = object.y + object.height;
        }
    }

    update() {
        this.player = this.entityList[0];
        if (this.cameraState) {
            this.player.x = document.body.clientWidth / 2;
            this.player.y = document.body.clientHeight / 2;
        }
        this.entityListPositionUpdate();
        let playerInEntity;
        for (let entity of this.entityList) {
            if (entity === this.player) {
                playerInEntity = entity;
            }
        }
        this.collideObject(playerInEntity)
        for (let entity of this.entityList) {
            if (entity !== playerInEntity) {
                this.collisionCheck(playerInEntity, entity)
            }
        }
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
            let entity = this.entityList[idx];
            final[idx] = {
                id: entity.id,
                x: entity.x,
                y: entity.y
            }
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
        if (!this.cameraState) {
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
            console.log(playerInEntity.steps)
            playerInEntity.direction.x = (x - playerInEntity.x) / playerInEntity.steps;
            playerInEntity.direction.y = (y - playerInEntity.y) / playerInEntity.steps;
        } else {
            for (let entity of this.entityList) {
                let playerInEntity;
                for (let entity of this.entityList) {
                    if (entity === this.player) {
                        playerInEntity = entity;
                    }
                }
                if (entity !== this.player) {
                    entity.currentSteps = 1;
                    entity.start = {}
                    entity.start.x = entity.x;
                    entity.start.y = entity.y;
                    let xchange = playerInEntity.x - x;
                    let ychange = playerInEntity.y - y;
                    x = entity.x + xchange + playerInEntity.width / 2;
                    y = entity.y + ychange + playerInEntity.height / 2;

                    let xabs = Math.abs(entity.start.x + x);
                    let yabs = Math.abs(entity.start.y + y);
                    let length = Math.sqrt( Math.pow(xabs, 2) + Math.pow(yabs, 2));
                    entity.steps = Math.floor(length) / 25;
                    entity.moving = true;
                    entity.direction = {};
                    entity.direction.x = (entity.x - x) / entity.steps;
                    entity.direction.y = (entity.y - y) / entity.steps;
                    playerInEntity.moving = true;
                }
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


module.exports = GameState;
},{"./DemiGod.js":12}],22:[function(require,module,exports){
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
},{"./Country.js":11}],23:[function(require,module,exports){
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
},{"./Attribute.js":2}],24:[function(require,module,exports){
const Entity = require('./Entity.js')

class Interactable extends Entity {
    constructor(name, description, image, x, y, width, height, interactableType, stats, state, inventory, endurance) {
        super(name, description, image, x, y, width, height, Entity.INTERACTABLE)
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
},{"./Entity.js":19}],25:[function(require,module,exports){
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
},{}],26:[function(require,module,exports){
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
},{"./Country.js":11}],27:[function(require,module,exports){
const Entity = require('./Entity.js');

class Location extends Entity {
    constructor(name, description, image, x, y, width, height, locationsMap) {
        super(name, description, image, x, y, width, height, Entity.LOCATION);
        this.locationsMap = locationsMap
    }
}

module.exports = Location;
},{"./Entity.js":19}],28:[function(require,module,exports){
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
},{"./Attribute.js":2}],29:[function(require,module,exports){
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
},{"./Attribute.js":2}],30:[function(require,module,exports){
const Person = require('./Person.js');

class Npc extends Person {
    constructor(name, description, image, x, y, width, height, stats, state, inventory, endurance, body, alliance){
        super(name, description, image, x, y, width, height, stats, state, inventory, endurance, body, alliance, Person.NPC)
    }

    
}

module.exports = Npc;
},{"./Person.js":31}],31:[function(require,module,exports){
const Interactable = require('./Interactable.js');

class Person extends Interactable {
    constructor(name, description, image, x, y, width, height, stats, state, inventory, endurance, body, alliance, personType) {
        super(name, description, image, x, y, width, height, Interactable.PERSON, stats, state, inventory, endurance);
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
},{"./Interactable.js":24}],32:[function(require,module,exports){
const Entity = require('./Entity.js');

class Plain extends Entity {
    constructor(name, description, image, x, y, width, height, plainSpace) {
        super(name, description, image, x, y, width, height, Entity.PLAIN);
        this.plainSpace = plainSpace;
    }
}

module.exports = Plain;
},{"./Entity.js":19}],33:[function(require,module,exports){
class Planet {
    constructor(name, countryList) {
        this.name = name;
        this.countryList = countryList;
    }

    
}

module.exports = Planet
},{}],34:[function(require,module,exports){
const Usable = require('./Usable.js');

class Props extends Usable {
    constructor(name, description, image, x, y, width, height, stats, state, inventory, endurance, useTime, useAmount) {
        super(name, description, image, x, y, width, height, stats, state, inventory, endurance, useTime, useAmount)
    }
}

module.exports = Props;
},{"./Usable.js":46}],35:[function(require,module,exports){
const Building = require('./Building.js');

class School extends Building {
    constructor(name, description, image, x, y, width, height, plainSpace, state, level, upgradePlan, insideImage) {
        super(name, description, image, x, y, width, height, plainSpace, state, level, upgradePlan, insideImage)
    }

    static create(name, description, image, x, y, width, height, plainSpace, state, level, upgradePlan, insideImage) {
        return new School(
            name, description,
            image, x, y,
            width, height,
            plainSpace,
            state, level,
            upgradePlan,
            insideImage
        )
    }

    static greekSchool() {
        return new School(
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
},{"./Building.js":4}],36:[function(require,module,exports){
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
},{"./Building.js":4,"./ShopKeeper.js":37,"./ShopUpgradePlan.js":38}],37:[function(require,module,exports){
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
},{"./Body.js":3,"./Npc.js":30,"./Status.js":42,"./experience.js":48,"./intelligence.js":50,"./inventory.js":51,"./stats.js":52}],38:[function(require,module,exports){
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
},{"./Shop.js":36,"./UpgradePlan.js":44,"./UpgradeToken.js":45}],39:[function(require,module,exports){
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
},{"./Building.js":4}],40:[function(require,module,exports){
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
},{"./Entity.js":19,"./Status.js":42}],41:[function(require,module,exports){
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
},{"./Constitution.js":9,"./Dexterity.js":13,"./Endurance.js":17,"./Faith.js":20,"./Intelligence.js":23,"./Luck.js":28,"./Memory.js":29,"./Strength.js":43,"./Wits.js":47}],42:[function(require,module,exports){
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
},{}],43:[function(require,module,exports){
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
},{"./Attribute.js":2}],44:[function(require,module,exports){
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
},{}],45:[function(require,module,exports){
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
},{}],46:[function(require,module,exports){
const Interactable = require('./Interactable.js');

class Usable extends Interactable {
    constructor(name, description, image, x, y, width, height, stats, state, inventory, endurance, useTime, useAmount) {
        super(name, description, image, x, y, width, height, Interactable.USABLE, stats, state, inventory, endurance)
        this.useTime = useTime;
        this.useAmount = useAmount;
    }
}

module.exports = Usable;
},{"./Interactable.js":24}],47:[function(require,module,exports){
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
},{"./Attribute.js":2}],48:[function(require,module,exports){
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
},{}],49:[function(require,module,exports){
const Engine = require('./Engine.js');
const GameState = require('./GameState.js');
const Earth = require('./Earth.js')


const engine = new Engine(
    new GameState(
        0.8,
        Earth.create(),
        document.body.clientHeight,
        document.body.clientWidth
    ),
    20,
    1
)



console.log(engine)

engine.start();


},{"./Earth.js":16,"./Engine.js":18,"./GameState.js":21}],50:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"./Attribute.js":2,"dup":23}],51:[function(require,module,exports){
arguments[4][25][0].apply(exports,arguments)
},{"dup":25}],52:[function(require,module,exports){
arguments[4][41][0].apply(exports,arguments)
},{"./Constitution.js":9,"./Dexterity.js":13,"./Endurance.js":17,"./Faith.js":20,"./Intelligence.js":23,"./Luck.js":28,"./Memory.js":29,"./Strength.js":43,"./Wits.js":47,"dup":41}]},{},[49]);
