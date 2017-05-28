export function isObject(obj) {
  return obj !== null && typeof obj === 'object';
}

export const isArray = Array.isArray;

let _offid = 0;

/**
 * 初始化子组件的运行时环境
 * 1.初始化组件的$parent属性
 * 2.如果是离屏组件，则创建新的canvas
 */
export function initCtx(van) {
  var comps = van.$components;
  for (var key in comps) {
    if (comps.hasOwnProperty(key)) {
      comps[key].$parent = van;

      // 如果是离屏组件，则创建canvas节点
      if (comps[key].$off) {
        toOffCanvas(comps[key]);
      } else {
        initCtx(comps[key]);
      }
    }
  }
}

/**
 * 根据组件信息创建一个离屏组件
 */
export function toOffCanvas(component) {
  var rootCanvas = component.$canvas;

  // 创建canvas并设置id，样式
  var offCanvas = document.createElement('canvas');
  var _cid = _offid++;

  // set component id
  offCanvas.id = _cid;
  offCanvas.setAttribute('_cid', _cid);

  // insert canvas element into DOM tree
  // rootCanvas.after(offCanvas);

  if (component.background) {
    rootCanvas.before(offCanvas);
  } else {
    rootCanvas.after(offCanvas);
  }

  // set off-scrren canvas style
  offCanvas.style.position = 'absolute';
  offCanvas.style.left = 0;
  offCanvas.style.top = 0;
  offCanvas.width = rootCanvas.width;
  offCanvas.height = rootCanvas.height;

  // 将创建的canvas和器ctx都挂载到组件
  component.$canvas = offCanvas;
  component.$ctx = offCanvas.getContext('2d');
  initCtx(component);
}

// merge two object
export function mergeTo(from, to) {
  for (var key in from) {

    // number,string,null,undefined,function,array,
    // if it is number, function, string, null, undefined
    if (key === 'data') {
      to[key] = JSON.parse(JSON.stringify(from[key]));
    } else {
      var vo = from[key];
      to[key] = vo;
    }

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

export function isFunction(value) {
  return typeof value === 'function';
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

/**
 * 消息提示
 * @param {string} message : 所提示消息
 * @param {string} type : 消息类型
 */
export function tip(message, type) {
  if (!debug) {
    return;
  }
  if (type === 'warn') {
    console.warn(message);
  } else if (type === 'error') {
    console.error(message);
  } else if (type === 'info') {
    console.info(message);
  } else {
    console.log(message);
  }
}


/**
 * 复制
 */
export function copys() {
  var src, copyIsArray, copy, name, options, clone,
    target = arguments[0] || {},
    i = 1,
    length = arguments.length,
    deep = false;

  // Handle a deep copy situation
  if (typeof target === 'boolean') {
    deep = target;

    // skip the boolean and the target
    target = arguments[ i ] || {};
    i++;
  }

  // Handle case when target is a string or something (possible in deep copy)
  if (typeof target !== 'object' && !isFunction(target)) {
    target = {};
  }

  // extend jQuery itself if only one argument is passed
  if (i === length) {
    target = this;
    i--;
  }

  for (; i < length; i++) {
    // Only deal with non-null/undefined values
    if ((options = arguments[ i ]) != null) {
      // Extend the base object
      for (name in options) {
        src = target[ name ];
        copy = options[ name ];

        // Prevent never-ending loop
        if (target === copy) {
          continue;
        }

        // Recurse if we're merging plain objects or arrays
        if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
          if (copyIsArray) {
            copyIsArray = false;
            clone = src && isArray(src) ? src : [];

          } else {
            clone = src && isPlainObject(src) ? src : {};
          }

          // Never move original objects, clone them
          target[ name ] = copys(deep, clone, copy);

        // Don't bring in undefined values
        } else if (copy !== undefined) {
          target[name] = copy;
        }
      }
    }
  }

  // Return the modified object
  return target;
};
