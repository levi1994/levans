export function isObject(obj) {
  return obj !== null && typeof obj === 'object';
}

export const isArray = Array.isArray;

let _offid = 0;
// Recursively set the runtime environment
// for component and subcomponent
export function initCtx(van) {
  var comps = van.$components;
  for (var key in comps) {
    if (comps.hasOwnProperty(key)) {
      comps[key].$parent = van;

      // if it is off canvas component,
      // create a canvas element
      if (comps[key].$off) {
        var rootCanvas = van.$canvas;

        // create a canvas element after root canvas
        var offCanvas = document.createElement('canvas');
        offCanvas.id = key + _offid++;
        rootCanvas.after(offCanvas);
        offCanvas.style.position = 'absolute';
        offCanvas.style.left = 0;
        offCanvas.style.top = 0;
        offCanvas.width = rootCanvas.width;
        offCanvas.height = rootCanvas.height;
        comps[key].$canvas = offCanvas;
        comps[key].$ctx = offCanvas.getContext('2d');
      } else {
        comps[key].$ctx = van.$ctx;
        comps[key].$canvas = van.$canvas;
        initCtx(comps[key]);
      }
    }
  }
}

// merge two object
export function mergeTo(from, to) {
  for (var key in from) {
    var vo = from[key];
    to[key] = vo;
  }
  return to;
}

export function isUndef(v) {
  return v === undefined || v === null;
}

export function isDef(v) {
  return v !== undefined && v !== null;
}

export function isTrue(v) {
  return v === true;
}

/**
 * Check if value is primitive
 */
export function isPrimitive(value) {
  return typeof value === 'string' || typeof value === 'number';
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
export function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

/**
 * Simple bind, faster than native
 */
export function bind(fn, ctx) {
  function boundFn(a) {
    const l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx);
  }
  // record original fn length
  boundFn._length = fn.length;
  return boundFn;
}

/**
 * Mix properties into target object.
 */
export function extend(to, _from) {
  for (const key in _from) {
    to[key] = _from[key];
  }
  return to;
}

/**
 * Ensure a function is called only once.
 */
export function once(fn) {
  let called = false;
  return function() {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  };
}

/**
  * Show tip message
  */
let debug = true;
export function closeDebug() {
  debug = false;
}

export function tip(message, type) {
  if (!debug) {
    return;
  }
  console.log(message);
}
