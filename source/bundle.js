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
        super(100, name, description, image, x, y, width, height, Entity.ATTRIBUTE, level, multiplier);
        this.baseLevel = level;
        this.level = level;
        this.multiplier = multiplier;
        this.baseMultiplier = multiplier;
    }
}

module.exports = Attribute;
},{"./Entity.js":13}],3:[function(require,module,exports){
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
    constructor(id, name, description, image, x, y, width, height, plainSpace, state, level, upgradePlan, insideImage, outsideWidth, outsideHeight, floorList) {
        super(id, name, description, image, x, y, width, height, plainSpace);
        this.door = Door.create();
        this.state = state;
        this.level = level;
        this.upgradePlan = upgradePlan;
        this.insideImage = insideImage;
        this.outsideWidth = outsideWidth;
        this.outsideHeight = outsideHeight;
        this.floorList = floorList;
        this.inside = false;
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
},{"./Door.js":10,"./Plain.js":28}],5:[function(require,module,exports){
const Plain = require('./Plain.js');
const Stairs = require('./Stairs.js')

class BuildingFloor extends Plain {
    constructor(id, name, description, image, x, y, width, height, plainSpace, floorLevel) {
        super(id, name, description, image, x, y, width, height, plainSpace);
        this.floorLevel = floorLevel;
        this.stairs = new Stairs();
    }
}

module.exports = BuildingFloor;
},{"./Plain.js":28,"./Stairs.js":36}],6:[function(require,module,exports){
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
},{"./Attribute.js":2}],7:[function(require,module,exports){
const Entity = require('./Entity.js')

class Country extends Entity {
    constructor(id, name, description, image, x, y, width, height, locationsMap, religion, wealth) {
        super(id, name, description, image, x, y, width, height, Entity.COUNTRY)
        this.locationsMap = locationsMap;
        this.religion = religion;
        this.wealth = wealth;
    }
}


Country.POOR = 'poor';
Country.AVERAGE = 'average';
Country.RICH = 'rich';

module.exports = Country;

},{"./Entity.js":13}],8:[function(require,module,exports){
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
},{"./Attribute.js":2}],9:[function(require,module,exports){
const Location = require('./Location.js');
const School = require('./School.js');
const ShoppingMall = require('./ShoppingMall.js');

class District extends Location {
    constructor(id, name, description, image, x, y, width, height, entityList, startPosition) {
        super(id, name, description, image, x, y, width, height, entityList, startPosition);
    }

    static create(locationsMap, name, width, height) {
        return new District(
            0,
            name,
            "", //description
            "", //image
            0, 0,
            width, height,
            locationsMap
        )
    }

    static centralDistrict() {
        return new District(
            0,
            "Central District",
            "The Main City Centre of Greece",
            "",
            0, 0,
            25000, 25000,
            [
                ShoppingMall.greeceMall()
            ],
            {
                x: 100,
                y: 100
            }
        )
    }

    static schoolDistrict() {
        return new District(
            0,
            "School District",
            "School District",
            "assets/ahego.jpg",
            0, 0,
            8000, 5000,
            [
                School.greekSchool()
            ],
            {
                x: 100,
                y: 100
            }
        )
    }
}

module.exports = District;
},{"./Location.js":20,"./School.js":31,"./ShoppingMall.js":35}],10:[function(require,module,exports){
const Props = require('./Props.js');
const Stats = require('./Stats.js');
const State = require('./State.js');
const NoInventory = require('./NoInventory.js');

class Door extends Props {
    constructor(id, name, description, image, x, y, width, height, stats, state, inventory, endurance, useTime, useAmount) {
        super(id, name, description, image, x, y, width, height, stats, state, inventory, endurance, useTime, useAmount);
        this.locked = false;
    }

    static create() {
        return new Door(
            0,
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
            new NoInventory(),
            100,
            200,
            null
        )
    }
}

module.exports = Door;
},{"./NoInventory.js":23,"./Props.js":30,"./State.js":37,"./Stats.js":38}],11:[function(require,module,exports){
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
                "School District": District.schoolDistrict(),
                "Central District": District.centralDistrict()
            }),
            Italy.create({
                "School District": District.schoolDistrict(),
                "Central District": District.centralDistrict()
            })
        ],
        "Earth")
    }
}

module.exports = Earth
},{"./District":9,"./Greece.js":15,"./Italy.js":19,"./Planet.js":29,"./School.js":31,"./Shop.js":32,"./ShoppingMall.js":35}],12:[function(require,module,exports){
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
},{"./Attribute.js":2}],13:[function(require,module,exports){
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
Entity.COUNTRY = 'country';

module.exports = Entity;
},{}],14:[function(require,module,exports){
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
},{"./Attribute.js":2}],15:[function(require,module,exports){
const Country = require('./Country.js');

class Greece extends Country {
    constructor(id, name, description, image, x, y, width, height, locationsMap, religion, wealth){
        super(id, name, description, image, x, y, width, height, locationsMap, religion, wealth);
    }

    static create(locationsMap) {
        return new Greece(
            0,
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
},{"./Country.js":7}],16:[function(require,module,exports){
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

    static mainMenu(x, y, width, height) {
        return new Icon(
            0,
            "mainMenu",
            "mainMenu",
            "brown",
            x, y,
            width, height,
            null,
            null,
            null,
            null,
            null
        )
    }
}

module.exports = Icon;
},{"./Entity.js":13}],17:[function(require,module,exports){
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
},{"./Attribute.js":2}],18:[function(require,module,exports){
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
},{"./Entity.js":13}],19:[function(require,module,exports){
const Country = require('./Country.js');

class Italy extends Country {
    constructor(id, name, description, image, x, y, width, height, locationsMap, religion, wealth){
        super(id, name, description, image, x, y, width, height, locationsMap, religion, wealth);
    }

    static create(locationsMap) {
        return new Italy(
            0,
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
},{"./Country.js":7}],20:[function(require,module,exports){
const Entity = require('./Entity.js');

class Location extends Entity {
    constructor(id, name, description, image, x, y, width, height, entityList, startPosition) {
        super(id, name, description, image, x, y, width, height, Entity.LOCATION);
        this.entityList = entityList;
        this.startPosition = startPosition;
    }
}

module.exports = Location;
},{"./Entity.js":13}],21:[function(require,module,exports){
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
},{"./Attribute.js":2}],22:[function(require,module,exports){
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
},{"./Attribute.js":2}],23:[function(require,module,exports){
class NoInventory {
    constructor() {

    }

    add(item) {
    }

    take(item) {

    }
}

module.exports = NoInventory;
},{}],24:[function(require,module,exports){
class NoState {
    constructor() {

    }
}

module.exports = NoState;
},{}],25:[function(require,module,exports){
class NoStats {
    constructor() {

    }

    static create() {
        return new NoStats();
    }
}

module.exports = NoStats;
},{}],26:[function(require,module,exports){
const Person = require('./Person.js');

class Npc extends Person {
    constructor(name, description, image, x, y, width, height, stats, state, inventory, endurance, body, alliance){
        super(name, description, image, x, y, width, height, stats, state, inventory, endurance, body, alliance, Person.NPC)
    }

    
}

module.exports = Npc;
},{"./Person.js":27}],27:[function(require,module,exports){
const Interactable = require('./Interactable.js');

class Person extends Interactable {
    constructor(id, name, description, image, x, y, width, height, stats, state, inventory, endurance, body, alliance, personType, controllable) {
        super(id, name, description, image, x, y, width, height, Interactable.PERSON, stats, state, inventory, endurance);
        this.body = body;
        this.alliance = alliance;
        this.personType = personType;
        this.controllable = controllable;
    }
}

Person.CHARACTER = 'character';
Person.NPC = 'npc';

Person.GOOD = 'good';
Person.LAWFULGOOD = 'lawfulGood'
Person.EVIL = 'evil';

Person.CONTROL = 'control';
Person.UNCONTROL = 'uncontrol';

module.exports = Person;
},{"./Interactable.js":18}],28:[function(require,module,exports){
const Entity = require('./Entity.js');

class Plain extends Entity {
    constructor(id, name, description, image, x, y, width, height, plainSpace) {
        super(id, name, description, image, x, y, width, height, Entity.PLAIN);
        this.plainSpace = plainSpace;
    }
}

module.exports = Plain;
},{"./Entity.js":13}],29:[function(require,module,exports){
class Planet {
    constructor(name, countryList) {
        this.name = name;
        this.countryList = countryList;
    }

    
}

module.exports = Planet
},{}],30:[function(require,module,exports){
const Usable = require('./Usable.js');

class Props extends Usable {
    constructor(id, name, description, image, x, y, width, height, stats, state, inventory, endurance, useTime, useAmount) {
        super(id, name, description, image, x, y, width, height, stats, state, inventory, endurance, useTime, useAmount)
    }
}

module.exports = Props;
},{"./Usable.js":43}],31:[function(require,module,exports){
const Building = require('./Building.js');
const BuildingFloor = require('./BuildingFloor.js');

class School extends Building {
    constructor(id, name, description, image, x, y, width, height, plainSpace, state, level, upgradePlan, insideImage, outsideWidth, outsideHeight, floorList) {
        super(id, name, description, image, x, y, width, height, plainSpace, state, level, upgradePlan, insideImage, outsideWidth, outsideHeight, floorList);
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

    static greekSchool() {
        return new School(
            0,
            "Greek School",
            "Greek School",
            "",
            0, 0,
            10000, 6000,
            [],
            Building.OPEN,
            1,
            null,
            "", //the image of inside the building
            5000, 1000,
            [
                new BuildingFloor(0, "Floor 1", "Greek school", "", 0, 0, 10000, 6000, [], 1)
            ]
        )
    }
}

module.exports = School;
},{"./Building.js":4,"./BuildingFloor.js":5}],32:[function(require,module,exports){
const Building = require('./Building.js')
const ShopKeeper = require('./ShopKeeper.js')
const ShopUpgradePlan = require('./ShopUpgradePlan.js')

class Shop extends Building {
    constructor(id, name, description, image, x, y, width, height, plainSpace, state, level, upgradePlan, insideImage, outsideWidth, outsideHeight, floorList) {
        super(id, name, description, image, x, y, width, height, plainSpace, state, level, upgradePlan, insideImage, outsideWidth, outsideHeight, floorList);
    }

    static create(x, y) {
        let plan = new ShopUpgradePlan();
        plan.prepare();

        return new Shop(
            0,
            "Shop",
            "A shop",
            "",
            x, y,
            400, 300,
            [
                ShopKeeper.create(0, 0)
            ],
            Building.CLOSED,
            1,
            plan,
            "",
            500,
            500,
            []
        )
    }
}

module.exports = Shop
},{"./Building.js":4,"./ShopKeeper.js":33,"./ShopUpgradePlan.js":34}],33:[function(require,module,exports){
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
},{"./Body.js":3,"./Npc.js":26,"./Status.js":39,"./experience.js":45,"./intelligence.js":46,"./inventory.js":47,"./stats.js":49}],34:[function(require,module,exports){
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
},{"./Shop.js":32,"./UpgradePlan.js":41,"./UpgradeToken.js":42}],35:[function(require,module,exports){
const Building = require('./Building.js');
const Shop = require('./Shop.js');
const BuildingFloor = require('./BuildingFloor.js');

class ShoppingMall extends Building {
    constructor(id, name, description, image, x, y, width, height, plainSpace, state, level, upgradePlan, insideImage, outsideWidth, outsideHeight, floorList) {
        super(id, name, description, image, x, y, width, height, plainSpace, state, level, upgradePlan, insideImage, outsideWidth, outsideHeight, floorList)
    }

    static create(plainSpace, name) {
        return new ShoppingMall(
            0,
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

    static greeceMall() {
        return new ShoppingMall(
            0,
            "Greece Shopping Mall",
            "Greece's central Shopping mall",
            "",
            0, 0,
            10000, 8000,
            [
                Shop.create(100, 100),
                Shop.create(600, 100),
                Shop.create(1100, 100),
                Shop.create(1600, 100)
            ],
            Building.OPEN,
            1,
            null,
            "" ,
            2000,
            1000,
            [
                new BuildingFloor(0, "Floor 1", "Mall floor", "", 0, 0, 10000, 8000, [Shop.create(100, 100)], 1)

            ]
        )
    }
}

module.exports = ShoppingMall;
},{"./Building.js":4,"./BuildingFloor.js":5,"./Shop.js":32}],36:[function(require,module,exports){
const Interactable = require('./Interactable.js');
const NoStats = require('./NoStats.js');
const NoState = require('./NoState.js');
const NoInventory = require('./noInventory.js');

class Stairs extends Interactable {
    constructor(id, name, description, image, x, y, width, height, interactableType, stats, state, inventory, endurance) {
        super(id, name, description, image, x, y, width, height, interactableType, stats, state, inventory, endurance);
        // this.up = ()=>{};
        // this.down() = ()=>{};
    }

    static create() {
        return new Stairs(
            0,
            "Stairs",
            "Stairs",
            "",
            0, 0,
            300, 300,
            Interactable.STAIRS,
            new NoStats(),
            new NoState(),
            new NoInventory(),
            null
        )
    }
}

module.exports = Stairs;
},{"./Interactable.js":18,"./NoState.js":24,"./NoStats.js":25,"./noInventory.js":48}],37:[function(require,module,exports){
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
},{"./Entity.js":13,"./Status.js":39}],38:[function(require,module,exports){
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
},{"./Constitution.js":6,"./Dexterity.js":8,"./Endurance.js":12,"./Faith.js":14,"./Intelligence.js":17,"./Luck.js":21,"./Memory.js":22,"./Strength.js":40,"./Wits.js":44}],39:[function(require,module,exports){
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
},{}],40:[function(require,module,exports){
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
},{"./Attribute.js":2}],41:[function(require,module,exports){
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
},{}],42:[function(require,module,exports){
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
},{}],43:[function(require,module,exports){
const Interactable = require('./Interactable.js');

class Usable extends Interactable {
    constructor(id, name, description, image, x, y, width, height, stats, state, inventory, endurance, useTime, useAmount) {
        super(id, name, description, image, x, y, width, height, Interactable.USABLE, stats, state, inventory, endurance)
        this.useTime = useTime;
        this.useAmount = useAmount;
    }
}

module.exports = Usable;
},{"./Interactable.js":18}],44:[function(require,module,exports){
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
},{"./Attribute.js":2}],45:[function(require,module,exports){
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
},{}],46:[function(require,module,exports){
arguments[4][17][0].apply(exports,arguments)
},{"./Attribute.js":2,"dup":17}],47:[function(require,module,exports){
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
},{}],48:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"dup":23}],49:[function(require,module,exports){
arguments[4][38][0].apply(exports,arguments)
},{"./Constitution.js":6,"./Dexterity.js":8,"./Endurance.js":12,"./Faith.js":14,"./Intelligence.js":17,"./Luck.js":21,"./Memory.js":22,"./Strength.js":40,"./Wits.js":44,"dup":38}],50:[function(require,module,exports){
const Component = require('./Component.js');

class BackgroundComponent extends Component {
    constructor(id, x, y, layer, width, height, type, color) {
        super(id, x, y, layer, width, height, type, color, Component.BACKGROUND);
    }

    static mainMenu(entity) {
        return new BackgroundComponent(
            entity.id,
            entity.x,
            entity.y,
            0,
            entity.width, entity.height,
            Component.BLOCK,
            entity.image
        )
    }

    static schoolDistrict(entity) {
        return new BackgroundComponent(
            entity.id,
            entity.x, 
            entity.y,
            0,
            entity.width,
            entity.height,
            Component.IMAGE,
            entity.image
        )
    }

    static greekSchool(entity) {
        return new BackgroundComponent(
            entity.id,
            entity.x,
            entity.y,
            0,
            entity.width,
            entity.height,
            Component.IMAGE,
            entity.image
        )
    }
}

module.exports = BackgroundComponent;
},{"./Component.js":55}],51:[function(require,module,exports){
const Component = require('./Component.js');

class BuildingComponent extends Component {
    constructor(id, x, y, layer, width, height, type, color) {
        super(id, x, y, layer, width, height, type, color, Component.BUILDING)
    }

    static greekSchool(entity){
        return new BuildingComponent(
            entity.id,
            entity.x,
            entity.y,
            1,
            entity.outsideWidth,
            entity.outsideHeight,
            Component.IMAGE,
            ""
        )
    }
}

module.exports = BuildingComponent;
},{"./Component.js":55}],52:[function(require,module,exports){
const Canvas = require('./Canvas.js');
const Component = require('./Component.js');
const TextComponent = require('./TextComponent.js');
const CharacterComponent = require('./CharacterComponent.js');
const BackgroundComponent = require('./BackgroundComponent.js');
const BuildingComponent = require('./BuildingComponent.js');

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
        console.log(entity)
        switch(entity.description) {
            case "DemiGod": component = CharacterComponent.create(entity); break;
            case "Brawler": component = CharacterComponent.create(entity); break;
            case "startButton": component = TextComponent.text(entity); break;
            case "School District": component = BackgroundComponent.schoolDistrict(entity); break;
            case "Greek School": component = (entity.inside) ? BackgroundComponent.greekSchool(entity) : BuildingComponent.greekSchool(entity); break;
            case "mainMenu": component = BackgroundComponent.mainMenu(entity); 
        }

        let addCheck = true;
        for (let canvas of this.canvasList) {
            if (canvas.layer === component.layer){
                canvas.add(component);
                addCheck = false;
            }
        }

        if (addCheck) {
            let newCanvas = this.createNewLayer(component.layer);
            newCanvas.add(component)
        }
    }

    preRender(entityList) {
        for (let entity of entityList) {
            this.addNewComponent(entity);
        }
    }

    updateCanvasList() {
        for (let canvas of this.canvasList) {
            canvas.clear();
            canvas.componentList = [];
        }
    }

    updateLocations(locationObject) {
        for (let object of Object.values(locationObject)) {
            let check = false;
            for (let canvas of this.canvasList) {
                if (canvas.hasThisComponent(object)) {
                    canvas.update(object);
                    check = true;

                }
            }
            if (!check) {
                this.addNewComponent(object);
            }
        }
    }


    update() {
        for (let canvas of this.canvasList) {
                canvas.draw();
        }
    }

    clear() {
        for (let canvas of this.canvasList) {
            canvas.clear();
        }
    }

    updateGame(locationObject) {
        this.updateLocations(locationObject);
    }
}

module.exports = Camera;
},{"./BackgroundComponent.js":50,"./BuildingComponent.js":51,"./Canvas.js":53,"./CharacterComponent.js":54,"./Component.js":55,"./TextComponent.js":62}],53:[function(require,module,exports){
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

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let component of this.componentList) {
            component.drawImage(this.context);
        }
    }

    update(component) {
        for (let value of this.componentList) {
            if (value.id === component.id) {
                if (value.update(component)) { 
                    this.draw();
                }
            }
        }
    }

    hasThisComponent(entity) {
        for (let component of this.componentList) {
            if (component.id == entity.id) return true;
        }
    }

    add(component) {
        this.componentList.push(component);
        component.drawImage(this.context);
    }

    get() {
        return this.componentList;
    }
}

module.exports = Canvas;
},{}],54:[function(require,module,exports){
const Component = require('./Component.js');

class CharacterComponent extends Component {
    constructor(id, x, y, layer, width, height, type, color, back, left, right, backLeft, backRight, frontLeft, frontRight) {
        super(id, x, y, layer, width, height, type, color, Component.CHARACTER)
        this.back = back;
        this.left = left;
        this.right = right;
        this.backLeft = backLeft;
        this.backRight = backRight;
        this.frontLeft = frontLeft;
        this.frontRight = frontRight;
    }

    
    static create(character) {
        return new CharacterComponent(
            character.id,
            character.x,
            character.y,
            1,
            character.width,
            character.height,
            Component.IMAGE,
            character.image,
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
},{"./Component.js":55}],55:[function(require,module,exports){
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
    }

    drawImage(ctx) {
        if (this.type === 'block') {
            this.check = true;
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height)

        } else if (this.type === 'image') {
            this.image = new Image();
            this.image.src = this.color;
            this.image.addEventListener('load', e => {
                ctx.drawImage(this.image, this.x - this.width/4, this.y - this.height/4, this.width, this.height);
            });

        } 
            
        if (this.text) {
            ctx.font = this.font;
            ctx.fillStyle = this.fillStyle;
            ctx.textAlign = this.textAlign;
            ctx.fillText(this.text, this.x, this.y);
            this.check = true;
        }
    }

    update(object) {
        let updateCheck = (this.x !== object.x || this.y !== object.y)
        this.x = object.x;
        this.y = object.y;
        this.width = object.width;
        this.height = object.height;
        return updateCheck;
    }
}

Component.IMAGE = 'image';
Component.BLOCK = 'block';
Component.TEXT = 'text';

Component.CHARACTER = 'character';
Component.ICON = 'icon';
Component.BUILDING = 'building';

module.exports = Component;
},{}],56:[function(require,module,exports){
class Controller {
    constructor() {
        document.body.addEventListener('mousedown', (event) => this.emitEvent('mousedown', event));
        document.body.addEventListener('mouseup', (event) => this.emitEvent('mouseup', event));
        document.body.addEventListener('keydown', (event) => this.keyDownUp('keydown', event.keyCode));
        document.body.addEventListener('keyup', (event) => this.keyDownUp('keyup', event.keyCode));
        document.addEventListener('contextmenu', (event) => this.emitEvent('rightclick', event));
    }

    setEventTarget(eventTarget) {
        this.eventTarget = eventTarget;
    }

    emitEvent(event, eventData) {
        if (event === 'rightclick') {
            event.preventDefault(); //don't bring up the settings box;
        };

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
            case 40: this.emitEvent('key', { direction: 'down', down: down}); break;
        }
    }
}

module.exports = Controller;
},{}],57:[function(require,module,exports){
const Camera = require('./Camera.js');
const Controller = require('./Controller.js');
const EE = require('events');
const SceneHandler = require('./SceneHandler.js');
const Scene = require('./Scene.js');

let divGameScreen = document.createElement('div');
divGameScreen.setAttribute('id', 'mainBox')
document.body.appendChild(divGameScreen)


class Engine extends EE {
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
        this.on('mousedown', (event) => this.mouseDown(event.clientX, event.clientY));
        this.on('mouseup', (event) => this.mouseUp(event.clientX, event.clientY));
        this.on('rightclick', (event) => this.onClick(event.clientX, event.clientY));
        this.on('nextScene', () => this.nextScene());
        this.on('locationChange', (location) => this.locationChange(location));
        this.gameState = {
            scene: "",
            entityCount: 2,
            sceneHandler: new SceneHandler()
        }
    }

    locationChange(location) {
        this.gameSpace.setLocation(location);
    }

    preRender(location) {
        let entityList;
        if (location instanceof Array) { entityList = location; }
        else if (location.plainSpace) { entityList = [...location.plainSpace]; entityList.push(location) }
        else if (location.entityList) { entityList = [...location.entityList]; entityList.push(location) }

        if (entityList) {
            for (let entity of entityList) {
                entity.id = this.gameState.entityCount;
                this.gameState.entityCount += 1;
            }
            this.camera.preRender(entityList);
        } else {
            throw new Error('location not found', location)
        }
    }

    createScene(name, level, func) {
        return new Scene(name, level, func, (level.startPosition) ? level.startPosition: null);
    }

    addScene(scene) {
        this.gameState.sceneHandler.addScene(scene);
    }

    prepareGame(game) {
        let list = []
        for (let scene of game) {
            list.push(this.createScene(scene[0], scene[1], scene[2])); //name, list, background, func
        }
        this.addScene(this.gameState.sceneHandler.joinScenes(list))
    }

    keyDown(direction, down) {
        this.gameSpace.keyDown(direction, down);
    }

    updateGame() {
        this.gameSpace.update(); //update locations
        this.camera.updateGame(this.gameSpace.returnEntityLocations()) //redraw and update components
        this.gameState.sceneHandler.updateScene(this.gameSpace.currentMap.entityList);
    }
    
    onClick(x, y) {
        switch (this.gameState.scene) {
            case 'openWorld': this.gameSpace.whatDidPlayerClick(x, y); break;
            case 'mainScreen': this.gameSpace.clickMainScreen(x, y);
        }
    }

    mouseUp(x, y) {
        switch (this.gameState.scene) {
            case 'openWorld': this.gameSpace.mouseUp(x, y); break;
            case 'mainScreen': this.gameSpace.clickMainScreen(x, y); break
        }
    }

    mouseDown(x, y) {
        switch (this.gameState.scene) {
            case 'openWorld': this.gameSpace.mouseDown(x, y); break;
        }
    }

    nextScene() {
        this.gameState.sceneHandler.nextScene();
        this.gameSpace.setLocation(this.gameState.sceneHandler.getScene().level);
        this.camera.updateCanvasList(); //empty component lists
        this.preRender(this.gameState.sceneHandler.getScene().level)
        this.locationChange(this.gameState.sceneHandler.getScene().level)
    }

    start() {
        setInterval(() => {
            this.updateGame()
        }, this.refreshRate)
        this.gameState.sceneHandler.runScene();
        this.preRender(this.gameState.sceneHandler.getScene().level);
        this.locationChange(this.gameState.sceneHandler.getScene().level)
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
},{"./Camera.js":52,"./Controller.js":56,"./Scene.js":60,"./SceneHandler.js":61,"events":1}],58:[function(require,module,exports){
class GameSpace {
    constructor(gravity, world, screenWidth, screenHeight, gameType) {
        this.gravity = gravity;
        this.world = world;
        this.currentLocation = null;
        this.gameType = gameType;
        this.currentMap = {
            width: null,
            height: null,
            entityList: []
        }
        this.screen = {
            selectedEntities: null,
            box: {},
            entityList: [],
            width: screenWidth,
            height: screenHeight,
            x: 0,
            y: 0
        }
    }

    setEventTarget(eventTarget) {
        this.eventTarget = eventTarget;
    }

    emitEvent(event, eventData) {
        if (this.eventTarget) {
            this.eventTarget.emit(event, eventData);
        }
    }

    setLocation(location) {
        if (location instanceof Array) { this.screen.entityList = [...location]; this.currentMap.entityList = [...location]; }
        else if (location.plainSpace) { this.currentLocation = [...location.plainSpace]; this.currentMap.entityList = [...location.plainSpace]; this.currentMap.entityList.push(location); }
        else if (location.entityList) { this.currentLocation = [...location.entityList]; this.currentMap.entityList = [...location.entityList]; this.currentMap.entityList.push(location); }
        //this function sets location and map according to the passed object;
        if (this.currentLocation) { 
            this.currentMap.width = this.currentLocation.width;
            this.currentMap.height = this.currentLocation.height;
        } else {
            this.currentMap.width = this.screen.width;
            this.currentMap.height = this.screen.height;
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
        } else if (mainObject.y < object.y && mainObject.y + mainObject.height > object.y && mainObject.x < object.x && mainObject.x + mainObject.width > object.x) {
            mainObject.y = object.y + mainObject.height;
            check = true;
        } else if (mainObject.y > object.y && object.y + object.height > mainObject.y && mainObject.x < object.x && mainObject.x + mainObject.width > object.x) {
            mainObject.y = object.y + object.height;
            check = true;
        }

        if (check) {
            this.player.moving = false;
        }
    }

    whatDidPlayerClick(x, y) {
        let walkCheck = true;
        for (let entity of this.screen.entityList) {
            if (this.gameType.isInside({
                x: x,
                y: y,
                width: 0,
                height: 0
            }, entity)) {
                //interact with item;
                this.player = entity;
                walkCheck = false;
            }
        }

        if (walkCheck) {
            this.gameType.clickMove(this.screen.selectedEntities, x, y, this.screen.box);
        }
    }

    mouseUp(x, y) {
        this.screen.selectedEntities = [];
        this.screen.box = {};
        x += 52;
        y += 53;
        this.screen.box = this.gameType.mouseUp(x, y);
        for (let entity of this.screen.entityList) {
            if (this.gameType.isInside(entity, this.screen.box)) this.screen.selectedEntities.push(entity); //if entity is inside drawn box, add it to selected entities
        }

        this.screen.box = (this.screen.box.length === 1) ? this.screen.box[1] : this.screen.box; //if the box only has one entity then there is no array 
    }

    mouseDown(x, y) {
        x += 52;
        y += 53;
        this.gameType.mouseDown(x, y);
    }

    clickMainScreen(x, y) {
        x += 225;
        y += 101.5;
        let startButton;
        console.log(this);
        for (let entity of this.screen.entityList) {
            if (entity.name === 'startButton') {
                startButton = entity;
            }
        }

        if (this.gameType.isInside({
            x: x,
            y: y,
            width: 0,
            height: 0
        }, startButton)) {
            this.emitEvent('nextScene');
        }
    }

    returnEntityLocations() {
        let final = {};
        for (let idx = 0; idx < this.screen.entityList.length; idx++) {
            final[idx] = this.screen.entityList[idx];
        }
        return final;
    }

    keyDown(direction, down) {
        this.gameType.keyDown(direction, down);
        if (this.screen.x < 0) { this.screen.x = 0; }
        else if (this.screen.x + this.screen.width > this.currentMap.width) { this.screen.x = this.currentMap.width - this.screen.width; }
        else if (this.screen.y < 0) { this.screen.y = 0; }
        else if (this.screen.y + this.screen.height > this.currentMap.height) { this.screen.y = this.currentMap.height - this.screen.height; }
    }

    update() {
        this.screen.entityList = this.gameType.screenMove(this.screen, this.currentMap); //check screen moving
        this.gameType.entityListPositionUpdate(this.screen.entityList); //update moving entities
    }
}


module.exports = GameSpace;
},{}],59:[function(require,module,exports){
class IsotopeGameFunctions {
    constructor() {
        this.screenX = 0;
        this.screenY = 0;
        this.clickX = null;
        this.clickY = null;
    }

    mouseDown(x, y) {
        this.clickX = x;
        this.clickY = y;
    }

    mouseUp(x, y) {
        let box;
        if (this.clickX && this.clickY) {
            box = { //creating a box
                x: (Math.sign(this.clickX - x) ? x : this.clickX),
                y: (Math.sign(this.clickY - y) ? y : this.clickY),
                width: Math.abs(this.clickX - x),
                height: Math.abs(this.clickY - y)
            }
        }

        this.clickX = null;
        this.clickY = null;

        return box
    }

    keyDown(direction, down) {
        switch (direction) {
            case 'up': this.up(down); break;
            case 'down': this.down(down); break;
            case 'left': this.left(down); break;
            case 'right': this.right(down);
        }

    }

    left(down) { (down) ? this.screenX = 20 : this.screenX = 0; }
    right(down) { (down) ? this.screenX = -20 : this.screenX = 0; }
    up(down) { (down) ? this.screenY = 20 : this.screenY = 0; }
    down(down) { (down) ? this.screenY = -20 : this.screenY = 0; }

    screenMove(screen, map) {
        screen.x += this.screenX;
        screen.y += this.screenY;

        for (let entity of screen.entityList) {
            entity.x += this.screenX;
            entity.y += this.screenY;
        }
        return this.entityListCheck(screen, map);
    }

    entityListCheck(screen, map) {
        let entityList = [];
        for (let entity of map.entityList) { //check which entities are inside the screen and isn't
            if (this.isInside(entity, screen)) {
                entityList.push(entity);
            }
        }
        return entityList;
    }

    isInside(object1, object2) {
        let object1Right = object1.x + object1.width;
        let object1Left = object1.x;
        let object1Top = object1.y;
        let object1Bottom = object1.y + object1.height;

        let object2Right = object2.x + object2.width;
        let object2Left = object2.x;
        let object2Top = object2.y;
        let object2Bottom = object2.y + object2.height;
        // if (object1.x < object2.x && object1.x + object1.width > object2.x && ((object1.y < object2.y && object1.y + object1.height > object2.y) || (object1.y + object1.height > object2.y + object2.height && object1.y < object2.y + object2.height))) {
        //     return true;
        // } else if (object1.x + object1.width > object2.x && object1.x < object2.x && ((object1.y < object2.y && object1.y + object1.height > object2.y) || (object1.y + object1.height > object2.y + object2.height && object1.y < object2.y + object2.height))) {
        //     return true;
        // } else {
        //     console.log("you dumb");
        //     return false;
        // }

        return !(object1Right < object2Left ||
            object1Left > object2Right ||
            object1Bottom < object2Top ||
            object1Top > object2Bottom)
    }

    clickMove(object, x, y, box) {
        if (object instanceof Array) { //since we selected more than one entity in a box
            let origX = x + box.width / 2; //entities need to walk to the position they were in the box
            let origY = y + box.height / 2;
            for (let entity of object) {
                x = origX + (entity.x - origX);
                y = origY + (entity.y - origY);
                entity.currentSteps = 1;
                entity.start = {
                    x: object.x,
                    y: object.y
                };
                x -= entity.width / 2;
                y -= entity.height / 2;
                entity.steps = Math.floor(Math.sqrt(Math.pow(Math.abs(x - entity.x), 2) + Math.pow(Math.abs(y - entity.y), 2))) / 25;
                entity.steps = (!entity.steps) ? 0.1 : entity.steps;
                //find the distance (vector line equation);

                entity.moving = true;
                entity.direction = {
                    x: (x - entity.x) / entity.steps,
                    y: (y - entity.y) / entity.steps
                };
            }
        } else {
            object.currentSteps = 1;
            object.start = {
                x: object.x,
                y: object.y
            };
            x -= object.width / 2;
            y -= object.height / 2;
            object.steps = Math.floor(Math.sqrt(Math.pow(Math.abs(x - object.x), 2) + Math.pow(Math.abs(y - object.y), 2))) / 25;
            object.steps = (!object.steps) ? 0.1 : object.steps;
            //find the distance (vector line equation);

            object.moving = true;
            object.direction = {
                x: (x - object.x) / object.steps,
                y: (y - object.y) / object.steps
            };
        }
    }

    entityListPositionUpdate(entityList) {
        for (let entity of entityList) {
            if (entity.moving) {
                entity.x = entity.start.x + entity.direction.x * entity.currentSteps;
                entity.y = entity.start.y + entity.direction.y * entity.currentSteps;
                if (entity.currentSteps < entity.steps) {
                    entity.currentSteps += 1;
                } else {
                    entity.moving = false;
                    entity.start = {
                        x: null,
                        y: null
                    }
                    entity.direction = {
                        x: null,
                        y: null
                    }
                }
            }
        }
    }
}

module.exports = IsotopeGameFunctions;
},{}],60:[function(require,module,exports){
class Scene {
    constructor(name, level, run, startPosition) {
        this.name = name;
        this.level = level;
        this.startPosition = startPosition;
        this.run = run;
        this.connectedScenes = []
    }

    connect(scene) {
        this.connectedScenes.push(scene);
    }
}

module.exports = Scene;
},{}],61:[function(require,module,exports){
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

    getScene() {
        return this.currentScene;
    }

    updateScene(entityList) {
        this.currentScene.level = entityList;
    }
}

module.exports = SceneHandler;
},{}],62:[function(require,module,exports){
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
            2,
            object.width,
            object.height,
            Component.BLOCK,
            object.image,
            object.text,
            object.font,
            object.fillStyle,
            object.textAlign
        )
    }
}

module.exports = TextComponent;
},{"./Component.js":55}],63:[function(require,module,exports){
const Engine = require('./engine/Engine.js');
const GameSpace = require('./engine/GameSpace.js');
const Earth = require('./data/Earth.js')
const Icon = require('./data/Icon.js');
const IGF = require('./engine/IsotopeGameFunctions.js');


const earth = Earth.create(); //create the world
console.log(earth)

const engine = new Engine(
    new GameSpace(
        0.8,
        earth, //pass in the world
        document.body.clientWidth,
        document.body.clientHeight,
        new IGF()
    ),
    100, //framerate
    1
)

const scene1 = [
    "MainScreen", //scene name
    [ //scene entityList;
        Icon.mainMenu(engine.gameSpace.screen.width / 2, engine.gameSpace.screen.height / 2, engine.gameSpace.screen.width / 2, engine.gameSpace.screen.height / 2),
        Icon.startButton(engine.gameSpace.screen.width / 2, engine.gameSpace.screen.height / 2, 450, 200, 'Start Game')
    ], 
    () => { //scene start function
        engine.mainScreen() 
    }
]

const scene2 = [
    "Intro", //name  
        earth.countryList[0].locationsMap["School District"], //map
    () => { 
        engine.openWorld() //function to play
    }
]



let game = [
    scene1,
    scene2
]

engine.prepareGame(game);


engine.start();


},{"./data/Earth.js":11,"./data/Icon.js":16,"./engine/Engine.js":57,"./engine/GameSpace.js":58,"./engine/IsotopeGameFunctions.js":59}]},{},[63]);
