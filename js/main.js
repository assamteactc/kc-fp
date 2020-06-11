var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.createTemplateTagFirstArg = function (a) {
  return a.raw = a
};
$jscomp.createTemplateTagFirstArgWithRaw = function (a, b) {
  a.raw = b;
  return a
};
$jscomp.arrayIteratorImpl = function (a) {
  var b = 0;
  return function () {
    return b < a.length ? {
      done: !1,
      value: a[b++]
    } : {
      done: !0
    }
  }
};
$jscomp.arrayIterator = function (a) {
  return {
    next: $jscomp.arrayIteratorImpl(a)
  }
};
$jscomp.makeIterator = function (a) {
  var b = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
  return b ? b.call(a) : $jscomp.arrayIterator(a)
};
$jscomp.getGlobal = function (a) {
  a = ["object" == typeof globalThis && globalThis, a, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global];
  for (var b = 0; b < a.length; ++b) {
    var c = a[b];
    if (c && c.Math == Math) return c
  }
  throw Error("Cannot find global object");
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.SIMPLE_FROUND_POLYFILL = !1;
$jscomp.ISOLATE_POLYFILLS = !1;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function (a, b, c) {
  if (a == Array.prototype || a == Object.prototype) return a;
  a[b] = c.value;
  return a
};
$jscomp.IS_SYMBOL_NATIVE = "function" === typeof Symbol && "symbol" === typeof Symbol("x");
$jscomp.TRUST_ES6_POLYFILLS = !$jscomp.ISOLATE_POLYFILLS || $jscomp.IS_SYMBOL_NATIVE;
$jscomp.polyfills = {};
$jscomp.propertyToPolyfillSymbol = {};
$jscomp.POLYFILL_PREFIX = "$jscp$";
var $jscomp$lookupPolyfilledValue = function (a, b) {
  var c = $jscomp.propertyToPolyfillSymbol[b];
  if (null == c) return a[b];
  c = a[c];
  return void 0 !== c ? c : a[b]
};
$jscomp.polyfill = function (a, b, c, d) {
  b && ($jscomp.ISOLATE_POLYFILLS ? $jscomp.polyfillIsolated(a, b, c, d) : $jscomp.polyfillUnisolated(a, b, c, d))
};
$jscomp.polyfillUnisolated = function (a, b, c, d) {
  c = $jscomp.global;
  a = a.split(".");
  for (d = 0; d < a.length - 1; d++) {
    var e = a[d];
    e in c || (c[e] = {});
    c = c[e]
  }
  a = a[a.length - 1];
  d = c[a];
  b = b(d);
  b != d && null != b && $jscomp.defineProperty(c, a, {
    configurable: !0,
    writable: !0,
    value: b
  })
};
$jscomp.polyfillIsolated = function (a, b, c, d) {
  var e = a.split(".");
  a = 1 === e.length;
  d = e[0];
  d = !a && d in $jscomp.polyfills ? $jscomp.polyfills : $jscomp.global;
  for (var f = 0; f < e.length - 1; f++) {
    var g = e[f];
    g in d || (d[g] = {});
    d = d[g]
  }
  e = e[e.length - 1];
  c = $jscomp.IS_SYMBOL_NATIVE && "es6" === c ? d[e] : null;
  b = b(c);
  null != b && (a ? $jscomp.defineProperty($jscomp.polyfills, e, {
    configurable: !0,
    writable: !0,
    value: b
  }) : b !== c && ($jscomp.propertyToPolyfillSymbol[e] = $jscomp.IS_SYMBOL_NATIVE ? $jscomp.global.Symbol(e) : $jscomp.POLYFILL_PREFIX + e, e = $jscomp.propertyToPolyfillSymbol[e], $jscomp.defineProperty(d, e, {
    configurable: !0,
    writable: !0,
    value: b
  })))
};
$jscomp.FORCE_POLYFILL_PROMISE = !1;
$jscomp.polyfill("Promise", function (a) {
  function b() {
    this.batch_ = null
  }

  function c(a) {
    return a instanceof e ? a : new e(function (b, c) {
      b(a)
    })
  }
  if (a && !$jscomp.FORCE_POLYFILL_PROMISE) return a;
  b.prototype.asyncExecute = function (a) {
    if (null == this.batch_) {
      this.batch_ = [];
      var b = this;
      this.asyncExecuteFunction(function () {
        b.executeBatch_()
      })
    }
    this.batch_.push(a)
  };
  var d = $jscomp.global.setTimeout;
  b.prototype.asyncExecuteFunction = function (a) {
    d(a, 0)
  };
  b.prototype.executeBatch_ = function () {
    for (; this.batch_ && this.batch_.length;) {
      var a = this.batch_;
      this.batch_ = [];
      for (var b = 0; b < a.length; ++b) {
        var c = a[b];
        a[b] = null;
        try {
          c()
        } catch (m) {
          this.asyncThrow_(m)
        }
      }
    }
    this.batch_ = null
  };
  b.prototype.asyncThrow_ = function (a) {
    this.asyncExecuteFunction(function () {
      throw a;
    })
  };
  var e = function (a) {
    this.state_ = 0;
    this.result_ = void 0;
    this.onSettledCallbacks_ = [];
    var b = this.createResolveAndReject_();
    try {
      a(b.resolve, b.reject)
    } catch (k) {
      b.reject(k)
    }
  };
  e.prototype.createResolveAndReject_ = function () {
    function a(a) {
      return function (d) {
        c || (c = !0, a.call(b, d))
      }
    }
    var b = this,
      c = !1;
    return {
      resolve: a(this.resolveTo_),
      reject: a(this.reject_)
    }
  };
  e.prototype.resolveTo_ = function (a) {
    if (a === this) this.reject_(new TypeError("A Promise cannot resolve to itself"));
    else if (a instanceof e) this.settleSameAsPromise_(a);
    else {
      a: switch (typeof a) {
      case "object":
        var b = null != a;
        break a;
      case "function":
        b = !0;
        break a;
      default:
        b = !1
      }
      b ? this.resolveToNonPromiseObj_(a) : this.fulfill_(a)
    }
  };
  e.prototype.resolveToNonPromiseObj_ = function (a) {
    var b = void 0;
    try {
      b = a.then
    } catch (k) {
      this.reject_(k);
      return
    }
    "function" == typeof b ? this.settleSameAsThenable_(b, a) : this.fulfill_(a)
  };
  e.prototype.reject_ = function (a) {
    this.settle_(2, a)
  };
  e.prototype.fulfill_ = function (a) {
    this.settle_(1, a)
  };
  e.prototype.settle_ = function (a, b) {
    if (0 != this.state_) throw Error("Cannot settle(" + a + ", " + b + "): Promise already settled in state" + this.state_);
    this.state_ = a;
    this.result_ = b;
    this.executeOnSettledCallbacks_()
  };
  e.prototype.executeOnSettledCallbacks_ = function () {
    if (null != this.onSettledCallbacks_) {
      for (var a = 0; a < this.onSettledCallbacks_.length; ++a) f.asyncExecute(this.onSettledCallbacks_[a]);
      this.onSettledCallbacks_ = null
    }
  };
  var f = new b;
  e.prototype.settleSameAsPromise_ = function (a) {
    var b = this.createResolveAndReject_();
    a.callWhenSettled_(b.resolve, b.reject)
  };
  e.prototype.settleSameAsThenable_ = function (a, b) {
    var c = this.createResolveAndReject_();
    try {
      a.call(b, c.resolve, c.reject)
    } catch (m) {
      c.reject(m)
    }
  };
  e.prototype.then = function (a, b) {
    function c(a, b) {
      return "function" == typeof a ? function (b) {
        try {
          d(a(b))
        } catch (r) {
          f(r)
        }
      } : b
    }
    var d, f, g = new e(function (a, b) {
      d = a;
      f = b
    });
    this.callWhenSettled_(c(a, d), c(b, f));
    return g
  };
  e.prototype["catch"] = function (a) {
    return this.then(void 0, a)
  };
  e.prototype.callWhenSettled_ = function (a, b) {
    function c() {
      switch (d.state_) {
      case 1:
        a(d.result_);
        break;
      case 2:
        b(d.result_);
        break;
      default:
        throw Error("Unexpected state: " + d.state_);
      }
    }
    var d = this;
    null == this.onSettledCallbacks_ ? f.asyncExecute(c) : this.onSettledCallbacks_.push(c)
  };
  e.resolve = c;
  e.reject = function (a) {
    return new e(function (b, c) {
      c(a)
    })
  };
  e.race = function (a) {
    return new e(function (b, d) {
      for (var e = $jscomp.makeIterator(a), f = e.next(); !f.done; f = e.next()) c(f.value).callWhenSettled_(b, d)
    })
  };
  e.all = function (a) {
    var b = $jscomp.makeIterator(a),
      d = b.next();
    return d.done ? c([]) : new e(function (a, e) {
      function f(b) {
        return function (c) {
          g[b] = c;
          h--;
          0 == h && a(g)
        }
      }
      var g = [],
        h = 0;
      do g.push(void 0), h++, c(d.value).callWhenSettled_(f(g.length - 1), e), d = b.next(); while (!d.done)
    })
  };
  return e
}, "es6", "es3");
$jscomp.initSymbol = function () {};
$jscomp.polyfill("Symbol", function (a) {
  if (a) return a;
  var b = function (a, b) {
    this.$jscomp$symbol$id_ = a;
    $jscomp.defineProperty(this, "description", {
      configurable: !0,
      writable: !0,
      value: b
    })
  };
  b.prototype.toString = function () {
    return this.$jscomp$symbol$id_
  };
  var c = 0,
    d = function (a) {
      if (this instanceof d) throw new TypeError("Symbol is not a constructor");
      return new b("jscomp_symbol_" + (a || "") + "_" + c++, a)
    };
  return d
}, "es6", "es3");
$jscomp.initSymbolIterator = function () {};
$jscomp.polyfill("Symbol.iterator", function (a) {
  if (a) return a;
  a = Symbol("Symbol.iterator");
  for (var b = "Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(" "), c = 0; c < b.length; c++) {
    var d = $jscomp.global[b[c]];
    "function" === typeof d && "function" != typeof d.prototype[a] && $jscomp.defineProperty(d.prototype, a, {
      configurable: !0,
      writable: !0,
      value: function () {
        return $jscomp.iteratorPrototype($jscomp.arrayIteratorImpl(this))
      }
    })
  }
  return a
}, "es6", "es3");
$jscomp.initSymbolAsyncIterator = function () {};
$jscomp.iteratorPrototype = function (a) {
  a = {
    next: a
  };
  a[Symbol.iterator] = function () {
    return this
  };
  return a
};
$jscomp.underscoreProtoCanBeSet = function () {
  var a = {
      a: !0
    },
    b = {};
  try {
    return b.__proto__ = a, b.a
  } catch (c) {}
  return !1
};
$jscomp.setPrototypeOf = $jscomp.TRUST_ES6_POLYFILLS && "function" == typeof Object.setPrototypeOf ? Object.setPrototypeOf : $jscomp.underscoreProtoCanBeSet() ? function (a, b) {
  a.__proto__ = b;
  if (a.__proto__ !== b) throw new TypeError(a + " is not extensible");
  return a
} : null;
$jscomp.generator = {};
$jscomp.generator.ensureIteratorResultIsObject_ = function (a) {
  if (!(a instanceof Object)) throw new TypeError("Iterator result " + a + " is not an object");
};
$jscomp.generator.Context = function () {
  this.isRunning_ = !1;
  this.yieldAllIterator_ = null;
  this.yieldResult = void 0;
  this.nextAddress = 1;
  this.finallyAddress_ = this.catchAddress_ = 0;
  this.finallyContexts_ = this.abruptCompletion_ = null
};
$jscomp.generator.Context.prototype.start_ = function () {
  if (this.isRunning_) throw new TypeError("Generator is already running");
  this.isRunning_ = !0
};
$jscomp.generator.Context.prototype.stop_ = function () {
  this.isRunning_ = !1
};
$jscomp.generator.Context.prototype.jumpToErrorHandler_ = function () {
  this.nextAddress = this.catchAddress_ || this.finallyAddress_
};
$jscomp.generator.Context.prototype.next_ = function (a) {
  this.yieldResult = a
};
$jscomp.generator.Context.prototype.throw_ = function (a) {
  this.abruptCompletion_ = {
    exception: a,
    isException: !0
  };
  this.jumpToErrorHandler_()
};
$jscomp.generator.Context.prototype["return"] = function (a) {
  this.abruptCompletion_ = {
    "return": a
  };
  this.nextAddress = this.finallyAddress_
};
$jscomp.generator.Context.prototype.jumpThroughFinallyBlocks = function (a) {
  this.abruptCompletion_ = {
    jumpTo: a
  };
  this.nextAddress = this.finallyAddress_
};
$jscomp.generator.Context.prototype.yield = function (a, b) {
  this.nextAddress = b;
  return {
    value: a
  }
};
$jscomp.generator.Context.prototype.yieldAll = function (a, b) {
  var c = $jscomp.makeIterator(a),
    d = c.next();
  $jscomp.generator.ensureIteratorResultIsObject_(d);
  if (d.done) this.yieldResult = d.value, this.nextAddress = b;
  else return this.yieldAllIterator_ = c, this.yield(d.value, b)
};
$jscomp.generator.Context.prototype.jumpTo = function (a) {
  this.nextAddress = a
};
$jscomp.generator.Context.prototype.jumpToEnd = function () {
  this.nextAddress = 0
};
$jscomp.generator.Context.prototype.setCatchFinallyBlocks = function (a, b) {
  this.catchAddress_ = a;
  void 0 != b && (this.finallyAddress_ = b)
};
$jscomp.generator.Context.prototype.setFinallyBlock = function (a) {
  this.catchAddress_ = 0;
  this.finallyAddress_ = a || 0
};
$jscomp.generator.Context.prototype.leaveTryBlock = function (a, b) {
  this.nextAddress = a;
  this.catchAddress_ = b || 0
};
$jscomp.generator.Context.prototype.enterCatchBlock = function (a) {
  this.catchAddress_ = a || 0;
  a = this.abruptCompletion_.exception;
  this.abruptCompletion_ = null;
  return a
};
$jscomp.generator.Context.prototype.enterFinallyBlock = function (a, b, c) {
  c ? this.finallyContexts_[c] = this.abruptCompletion_ : this.finallyContexts_ = [this.abruptCompletion_];
  this.catchAddress_ = a || 0;
  this.finallyAddress_ = b || 0
};
$jscomp.generator.Context.prototype.leaveFinallyBlock = function (a, b) {
  var c = this.finallyContexts_.splice(b || 0)[0];
  if (c = this.abruptCompletion_ = this.abruptCompletion_ || c) {
    if (c.isException) return this.jumpToErrorHandler_();
    void 0 != c.jumpTo && this.finallyAddress_ < c.jumpTo ? (this.nextAddress = c.jumpTo, this.abruptCompletion_ = null) : this.nextAddress = this.finallyAddress_
  } else this.nextAddress = a
};
$jscomp.generator.Context.prototype.forIn = function (a) {
  return new $jscomp.generator.Context.PropertyIterator(a)
};
$jscomp.generator.Context.PropertyIterator = function (a) {
  this.object_ = a;
  this.properties_ = [];
  for (var b in a) this.properties_.push(b);
  this.properties_.reverse()
};
$jscomp.generator.Context.PropertyIterator.prototype.getNext = function () {
  for (; 0 < this.properties_.length;) {
    var a = this.properties_.pop();
    if (a in this.object_) return a
  }
  return null
};
$jscomp.generator.Engine_ = function (a) {
  this.context_ = new $jscomp.generator.Context;
  this.program_ = a
};
$jscomp.generator.Engine_.prototype.next_ = function (a) {
  this.context_.start_();
  if (this.context_.yieldAllIterator_) return this.yieldAllStep_(this.context_.yieldAllIterator_.next, a, this.context_.next_);
  this.context_.next_(a);
  return this.nextStep_()
};
$jscomp.generator.Engine_.prototype.return_ = function (a) {
  this.context_.start_();
  var b = this.context_.yieldAllIterator_;
  if (b) return this.yieldAllStep_("return" in b ? b["return"] : function (a) {
    return {
      value: a,
      done: !0
    }
  }, a, this.context_["return"]);
  this.context_["return"](a);
  return this.nextStep_()
};
$jscomp.generator.Engine_.prototype.throw_ = function (a) {
  this.context_.start_();
  if (this.context_.yieldAllIterator_) return this.yieldAllStep_(this.context_.yieldAllIterator_["throw"], a, this.context_.next_);
  this.context_.throw_(a);
  return this.nextStep_()
};
$jscomp.generator.Engine_.prototype.yieldAllStep_ = function (a, b, c) {
  try {
    var d = a.call(this.context_.yieldAllIterator_, b);
    $jscomp.generator.ensureIteratorResultIsObject_(d);
    if (!d.done) return this.context_.stop_(), d;
    var e = d.value
  } catch (f) {
    return this.context_.yieldAllIterator_ = null, this.context_.throw_(f), this.nextStep_()
  }
  this.context_.yieldAllIterator_ = null;
  c.call(this.context_, e);
  return this.nextStep_()
};
$jscomp.generator.Engine_.prototype.nextStep_ = function () {
  for (; this.context_.nextAddress;) try {
    var a = this.program_(this.context_);
    if (a) return this.context_.stop_(), {
      value: a.value,
      done: !1
    }
  } catch (b) {
    this.context_.yieldResult = void 0, this.context_.throw_(b)
  }
  this.context_.stop_();
  if (this.context_.abruptCompletion_) {
    a = this.context_.abruptCompletion_;
    this.context_.abruptCompletion_ = null;
    if (a.isException) throw a.exception;
    return {
      value: a["return"],
      done: !0
    }
  }
  return {
    value: void 0,
    done: !0
  }
};
$jscomp.generator.Generator_ = function (a) {
  this.next = function (b) {
    return a.next_(b)
  };
  this["throw"] = function (b) {
    return a.throw_(b)
  };
  this["return"] = function (b) {
    return a.return_(b)
  };
  this[Symbol.iterator] = function () {
    return this
  }
};
$jscomp.generator.createGenerator = function (a, b) {
  var c = new $jscomp.generator.Generator_(new $jscomp.generator.Engine_(b));
  $jscomp.setPrototypeOf && $jscomp.setPrototypeOf(c, a.prototype);
  return c
};
$jscomp.asyncExecutePromiseGenerator = function (a) {
  function b(b) {
    return a.next(b)
  }

  function c(b) {
    return a["throw"](b)
  }
  return new Promise(function (d, e) {
    function f(a) {
      a.done ? d(a.value) : Promise.resolve(a.value).then(b, c).then(f, e)
    }
    f(a.next())
  })
};
$jscomp.asyncExecutePromiseGeneratorFunction = function (a) {
  return $jscomp.asyncExecutePromiseGenerator(a())
};
$jscomp.asyncExecutePromiseGeneratorProgram = function (a) {
  return $jscomp.asyncExecutePromiseGenerator(new $jscomp.generator.Generator_(new $jscomp.generator.Engine_(a)))
};
var MAX_SLOT = 99,
  INITIAL_MAX_LEVEL_PLANE = [1, 4, 5, 7, 8, 102, 103],
  IMAGES = {},
  SHOOT_DOWN_TABLE, SHOOT_DOWN_TABLE_ENEMY, AIR_STATUS_TABLE, $target = null,
  confirmType = null,
  basicSortedPlanes = [],
  isOut = !1,
  isDefMode = !1,
  battleCount = 1,
  displayBattle = 1,
  timer = !1,
  planePreset = null,
  initialProf120Plane = [1, 4, 5, 7, 8, 102, 103, 104],
  chartData = null,
  isCtrlPress = !1,
  presets = null,
  backUpPresets = null,
  releaseTimer = null,
  setting = null,
  usedPlane = [],
  chartDataSet = null,
  mainColor = "#000000",
  undoHisotry = {
    index: 0,
    histories: []
  };

function isContain(a, b) {
  for (var c = $jscomp.makeIterator(a), d = c.next(); !d.done; d = c.next()) {
    d = d.value;
    for (var e = $jscomp.makeIterator(b), f = e.next(); !f.done; f = e.next())
      if (d === f.value) return !0
  }
  return !1
}

function shuffleArray(a) {
  for (var b = a.length - 1; 0 < b; b--) {
    var c = Math.floor(Math.random() * (b + 1)),
      d = a[b];
    a[b] = a[c];
    a[c] = d
  }
}

function castInt(a, b) {
  b = void 0 === b ? 0 : b;
  var c = parseInt(a);
  return isNaN(c) ? b : c
}

function castFloat(a, b) {
  b = void 0 === b ? 0 : b;
  var c = parseFloat(a);
  return isNaN(c) ? b : c
}

function utf8_to_b64(a) {
  try {
    return LZString.compressToEncodedURIComponent(a)
  } catch (b) {
    return ""
  }
}

function b64_to_utf8(a) {
  try {
    return LZString.decompressFromEncodedURIComponent(a)
  } catch (b) {
    return ""
  }
}

function copyInputTextToClipboard(a) {
  try {
    if (!a.attr("id")) return !1;
    document.getElementById(a.attr("id")).select();
    return document.execCommand("copy")
  } catch (b) {
    return !1
  }
}

function getUrlParams() {
  var a = location.search;
  if ("" === a) return {};
  var b = {};
  a = $jscomp.makeIterator(a.slice(1).split("&"));
  for (var c = a.next(); !c.done; c = a.next()) c = c.value.split("="), b[c[0]] = c[1];
  window.history.replaceState("", "", location.pathname);
  return b
}

function getArraySum(a) {
  for (var b = 0, c = a.length; c--;) b += a[c];
  return b
}

function getArrayMax(a) {
  for (var b = -Infinity, c = a.length; c--;) a[c] > b && (b = a[c]);
  return b
}

function getArrayMin(a) {
  for (var b = Infinity, c = a.length; c--;) a[c] < b && (b = a[c]);
  return b
}

function postURLData(a) {
  var b;
  return $jscomp.asyncExecutePromiseGeneratorProgram(function (c) {
    return 1 == c.nextAddress ? (b = {
      longDynamicLink: "https://aircalc.page.link/?link=" + a,
      suffix: {
        option: "SHORT"
      }
    }, c.yield(fetch("https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=" + xxx, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(b)
    }).then(function (a) {
      return a.json()
    }), 2)) : c["return"](c.yieldResult)
  })
}

function hexToRGB(a) {
  "#" == a.slice(0, 1) && (a = a.slice(1));
  3 == a.length && (a = a.slice(0, 1) + a.slice(0, 1) + a.slice(1, 2) + a.slice(1, 2) + a.slice(2, 3) + a.slice(2, 3));
  return [a.slice(0, 2), a.slice(2, 4), a.slice(4, 6)].map(function (a) {
    return parseInt(a, 16)
  })
}

function setPreCalculateTable() {
  if (!AIR_STATUS_TABLE) {
    AIR_STATUS_TABLE = [];
    for (var a = 0; 1E3 >= a; a++) {
      for (var b = new Uint16Array(Math.max(3 * a + 1, 2)), c = 0; c <= b.length; c++)
        if (0 === a && 0 === c) b[c] = 5;
        else if (a >= 3 * c) b[c] = 0;
      else if (2 * a >= 3 * c) b[c] = 1;
      else if (3 * a > 2 * c) b[c] = 2;
      else if (3 * a > c) b[c] = 3;
      else {
        b[c] = 4;
        break
      }
      AIR_STATUS_TABLE.push(b)
    }
  }
  if (!SHOOT_DOWN_TABLE)
    for (SHOOT_DOWN_TABLE = [], a = [
        [7, 15],
        [20, 45],
        [30, 75],
        [45, 105],
        [65, 150]
      ], b = a.length, c = 0; c <= MAX_SLOT; c++) {
      for (var d = [], e = 0; e < b; e++) {
        for (var f = [], g = a[e][0]; g <= a[e][1]; g++) f.push(c * g / 256);
        shuffleArray(f);
        d.push(f)
      }
      SHOOT_DOWN_TABLE.push(d)
    }
  if (!SHOOT_DOWN_TABLE_ENEMY) {
    SHOOT_DOWN_TABLE_ENEMY = [];
    a = 0;
    b = ENEMY_DATA.length;
    for (c = 0; c < b; c++)
      for (d = ENEMY_DATA[c].slot.length, e = 0; e < d; e++) a < ENEMY_DATA[c].slot[e] && (a = ENEMY_DATA[c].slot[e]);
    for (b = 0; b <= a; b++) {
      c = [];
      d = AIR_STATUS.length;
      for (e = 0; e < d; e++) {
        f = [];
        for (var h = g = AIR_STATUS[e].rate; 0 <= h; h--)
          for (var k = 0; k <= g; k++) f.push(Math.floor(b * (.65 * h + .35 * k) / 10));
        shuffleArray(f);
        c.push(f)
      }
      SHOOT_DOWN_TABLE_ENEMY.push(c)
    }
  }
  window.clearTimeout(releaseTimer);
  releaseTimer = setTimeout(function () {
    SHOOT_DOWN_TABLE_ENEMY = SHOOT_DOWN_TABLE = AIR_STATUS_TABLE = null
  }, 18E4)
}

function getPlanes(a) {
  var b = [];
  return b = 0 === a ? basicSortedPlanes.concat() : PLANE_DATA.filter(function (b) {
    return Math.abs(castInt(b.type)) === Math.abs(castInt(a))
  })
}

function getPlaneCss(a) {
  var b = PLANE_TYPE.find(function (b) {
    return b.id === castInt(a)
  });
  return b ? b.css : ""
}

function getProfString(a) {
  switch (a) {
  case 1:
    return "|";
  case 2:
    return "||";
  case 3:
    return "|||";
  case 4:
    return "/";
  case 5:
    return "//";
  case 6:
    return "///";
  case 7:
    return ">>"
  }
  return ""
}

function replaceKnji(a) {
  a && (a = a.replace("601", "�Z�Z��"), a = a.replace("634", "�Z�O�l"), a = a.replace("931", "��O��"), a = a.replace("22", "���"), a = a.replace("34", "�O�l"), a = a.replace("96", "��Z"), a = a.replace("97", "�㎵"), a = a.replace("99", "���"));
  return a
}

function checkInvalidPlane(a, b) {
  if (-1 === a) return !0;
  if (0 === a && 100 < Math.abs(b.type)) return !1;
  if (0 === a) return !0;
  var c = SHIP_DATA.find(function (b) {
      return b.id === a
    }),
    d = LINK_SHIP_EQUIPMENT.find(function (a) {
      return a.type === c.type
    }),
    e = SPECIAL_LINK_SHIP_EQUIPMENT.find(function (a) {
      return a.shipId === c.id
    }),
    f = [];
  if (d) {
    d = $jscomp.makeIterator(d.e_type);
    for (var g = d.next(); !g.done; g = d.next()) f.push(g.value);
    if (e)
      for (d = $jscomp.makeIterator(e.equipmentTypes), g = d.next(); !g.done; g = d.next()) f.push(g.value)
  }
  return f.includes(Math.abs(b.type)) ? 151 === b.id ? e ? e.equipmentIds.includes(b.id) : !1 : !0 : e && e.equipmentIds.includes(b.id)
}

function validateInputNumber(a, b, c) {
  c = void 0 === c ? 0 : c;
  return (new RegExp(/^[0-9]+$/)).test(a) ? a > b ? b : a < c ? c : castInt(a) : c
}

function validateInputNumberFloat(a, b, c) {
  c = void 0 === c ? 0 : c;
  return (new RegExp(/^\d+(\.\d+)?$/)).test(a) ? a > b ? b : a < c ? c : a : c
}

function initializeSetting() {
  (setting = loadLocalStorage("setting")) || (setting = {});
  setting.hasOwnProperty("version") || (setting.version = "0.0.0");
  setting.hasOwnProperty("simulateCount") || (setting.simulateCount = 5E3);
  setting.hasOwnProperty("autoSave") || (setting.autoSave = !0);
  setting.hasOwnProperty("emptySlotInvisible") || (setting.emptySlotInvisible = !1);
  setting.hasOwnProperty("inStockOnly") || (setting.inStockOnly = !1);
  setting.hasOwnProperty("visibleEquipped") || (setting.visibleEquipped = !1);
  setting.hasOwnProperty("visibleFinal") || (setting.visibleFinal = !0);
  setting.hasOwnProperty("enemyDisplayImage") || (setting.enemyDisplayImage = !0);
  setting.hasOwnProperty("enemyFleetDisplayImage") || (setting.enemyFleetDisplayImage = !1);
  setting.hasOwnProperty("copyToClipboard") || (setting.copyToClipboard = !1);
  setting.hasOwnProperty("airRaidMax") || (setting.airRaidMax = !0);
  setting.hasOwnProperty("isUnion") || (setting.isUnion = !0);
  setting.hasOwnProperty("backUpEnabled") || (setting.backUpEnabled = !0);
  setting.hasOwnProperty("backUpCount") || (setting.backUpCount = 10);
  setting.hasOwnProperty("selectedHistory") || (setting.selectedHistory = [
    [],
    []
  ]);
  setting.hasOwnProperty("orderByFrequency") || (setting.orderByFrequency = !1);
  setting.hasOwnProperty("themeColor") || (setting.themeColor = "normal");
  setting.hasOwnProperty("contentsOrder") || (setting.contentsOrder = []);
  setting.hasOwnProperty("favoriteOnly") || (setting.favoriteOnly = !1);
  setting.hasOwnProperty("favoritePlane") || (setting.favoritePlane = []);
  if (!setting.hasOwnProperty("defaultProf")) {
    setting.defaultProf = [];
    var a = PLANE_TYPE.filter(function (a) {
      return 0 < a.id && 104 !== a.id
    });
    a = $jscomp.makeIterator(a);
    for (var b = a.next(); !b.done; b = a.next()) b = b.value, b = {
      id: b.id,
      prof: INITIAL_MAX_LEVEL_PLANE.includes(b.id) ? 7 : 0
    }, setting.defaultProf.push(b)
  }
  setting.hasOwnProperty("displayMode") || (setting.displayMode = {
    modal_plane_select: "single",
    modal_ship_select: "single",
    modal_enemy_select: "single"
  });
  setting.hasOwnProperty("orderBy") || (setting.orderBy = {
    modal_plane_select: ["default", "desc"]
  });
  setting.hasOwnProperty("copyToClipbord") && (setting.copyToClipboard = setting.copyToClipbord, delete setting.copyToClipbord);
  setting.hasOwnProperty("visibleEquiped") && (setting.visibleEquipped = setting.visibleEquiped, delete setting.visibleEquiped);
  saveLocalStorage("setting", setting)
}

function initialize(a) {
  var b = document.createDocumentFragment();
  b = "";
  for (var c = 0; c < PLANE_TYPE.length; c++) {
    b = new Image;
    var d = PLANE_TYPE[c].id;
    b.src = "./img/type/type" + d + ".png";
    IMAGES["type" + d] = b;
    c === PLANE_TYPE.length - 1 && b.addEventListener("load", function () {
      setPlaneStockTable()
    }, !1)
  }
  initializeSetting();
  c = CHANGE_LOG[CHANGE_LOG.length - 1];
  document.getElementById("latest_version").textContent = c.id;
  if (setting.version !== c.id) {
    b = document.createDocumentFragment();
    d = $jscomp.makeIterator(c.changes);
    for (var e = d.next(); !e.done; e = d.next()) {
      e = e.value;
      var f = document.createElement("div");
      f.className = "mt-3";
      var g = document.createElement("div"),
        h = document.createElement("span");
      h.className = "mr-1 pt-1 badge badge-pill badge-" + (0 === e.type ? "success" : 1 === e.type ? "info" : "danger");
      h.textContent = 0 === e.type ? "�V�K" : 1 === e.type ? "�ύX" : "�C��";
      var k = document.createElement("span");
      k.innerHTML = e.title;
      g.appendChild(h);
      g.appendChild(k);
      f.appendChild(g);
      e.content && (g = document.createElement("div"), g.className = "font_size_12 pl-3", g.innerHTML = e.content, f.appendChild(g));
      b.appendChild(f)
    }
    document.getElementById("version").textContent = c.id;
    document.getElementById("version_inform_body").appendChild(b);
    deleteLocalStorage("version");
    deleteLocalStorage("autoSave");
    deleteLocalStorage("simulateCount");
    deleteLocalStorage("emptySlotInvisible");
    deleteLocalStorage("modalDisplayMode");
    deleteLocalStorage("defaultProf");
    (b = loadLocalStorage("planeStock")) && 0 < b.length && !b[0].num.length && deleteLocalStorage("planeStock")
  }
  setShipType(SHIP_TYPE.filter(function (a) {
    return 15 > a.id
  }).map(function (a) {
    return a.id
  }));
  document.getElementById("display_final").checked = setting.visibleFinal;
  document.getElementById("frequent_ship").checked = setting.orderByFrequency;
  f = e = d = b = "";
  for (g = 1; 10 >= g; g++) b += '<td class="td_battle battle' + g + '">' + g + "���</td>", d += '<td class="td_battle battle' + g + ' fap"></td>', e += '<td class="td_battle battle' + g + ' eap"></td>', f += '<td class="td_battle battle' + g + ' cond"></td>';
  $("#shoot_down_table").find(".tr_header").append(b + '<td class="td_battle battle_end">�o����</td><td class="td_battle battle_death">�S�ŗ�</td>');
  $(".tr_fap").append(d + '<td class="td_battle battle_end fap font_size_11" colspan="2"></td>');
  $(".tr_eap").append(e + '<td class="td_battle battle_end eap" rowspan="2" colspan="2"></td>');
  $(".tr_cond").append(f);
  b = "";
  for (d = 1; 10 >= d; d++) b += '\n\t\t\t<li class="nav-item ' + (1 === d ? "" : "d-none") + '">\n\t\t\t\t<a class="nav-link ' + ("#000000" === mainColor ? "" : "nav-link-dark") + " " + (1 === d ? "active" : "") + '" data-toggle="tab" data-disp="' + d + '" href="#">' + d + "���</a>\n\t\t\t</li>";
  $("#display_battle_tab").html(b);
  b = $("#rate_table").find("thead").html();
  for (d = 0; 7 >= d; d++) $("#rate_table tbody").append(b);
  $("#rate_table tbody").find("tr").each(function (a, b) {
    var c = Math.floor(a / 2) + 1,
      d = a % 2 + 1;
    $(b).attr("id", "rate_row_" + (a + 1));
    6 > a ? ($(b).find(".rate_td_name").html('<span class="mr-1">��n' + c + '</span><span class="text-nowrap">' + d + "�g��</span>"), $(b)[0].dataset.base_no = c - 1, $(b).addClass("cur_pointer land_base_detail")) : 6 === a ? $(b).find(".rate_td_name").text("�{��") : 7 === a && $(b).find(".rate_td_name").text("�h��");
    0 === a % 2 ? $(b).addClass("rate_tr_border_top") : 6 <= a && $(b).addClass("rate_tr_border_top rate_tr_border_bottom")
  });
  b = $("#init_prof_parent").html();
  d = PLANE_TYPE.filter(function (a) {
    return 0 < a.id && 104 !== a.id
  });
  d = $jscomp.makeIterator(d);
}

function setShipType(a) {
  for (var b = $jscomp.makeIterator(SHIP_TYPE), c = b.next(); !c.done; c = b.next())
    if (c = c.value, a.includes(c.id)) {
      var d = document.createElement("option");
      d.value = c.id;
      d.textContent = c.name;
      document.getElementById("ship_type_select").appendChild(d)
    }
}

function clearPlaneDiv(a) {
  a.removeClass(getPlaneCss(a[0].dataset.type));
  a[0].dataset.planeid = "";
  a[0].dataset.type = "";
  a.find(".plane_img").attr("src", "./img/type/undefined.png").attr("alt", "");
  a.find(".cur_move").removeClass("cur_move");
  a.find(".drag_handle").removeClass("drag_handle");
  a.find(".plane_name_span").text("�@�̂�I��");
  a.find("select").val("0").change();
  a.find(".remodel_select").prop("disabled", !0).addClass("remodel_disabled");
  a.find(".remodel_value").text(0);
  a.find(".btn_remove_plane").addClass("opacity0");
  a = a.find(".prof_select");
  a.attr("src", "./img/util/prof0.png").attr("alt", "").data("prof", 0);
  a.addClass("prof_none").removeClass("prof_yellow prof_blue")
}

function clearPlaneDivAll(a) {
  "landBase" === a.attr("id") ? ($(".lb_plane").each(function (a, c) {
    return setLBPlaneDiv($(c))
  }), $("#modal_collectively_setting").modal("hide")) : "friendFleet" === a.attr("id") && $(".ship_plane").each(function (a, c) {
    return clearPlaneDiv($(c))
  })
}

function setLBPlaneDiv(a, b) {
  b = void 0 === b ? {
    id: 0,
    slot: 0,
    remodel: 0
  } : b;
  var c = castInt(b.id),
    d = PLANE_DATA.find(function (a) {
      return a.id === c
    }),
    e = setPlaneDiv(a, b);
  b.hasOwnProperty("slot") || (b.slot = 0);
  var f = 18;
  e && d && RECONNAISSANCES.includes(d.type) && (f = 4);
  a.find(".slot_input").attr("max", f);
  a.find(".slot_range").attr("max", f);
  d = b.slot;
  if (0 === d || d > f) d = f;
  e || (d = 0);
  a.find(".slot").text(d)
}

function setPlaneDiv(a, b, c) {
  b = void 0 === b ? {
    id: 0,
    remodel: 0,
    prof: -1
  } : b;
  c = void 0 === c ? !1 : c;
  if (!b.id) return clearPlaneDiv(a), !1;
  var d = PLANE_DATA.find(function (a) {
    return a.id === b.id
  });
  if (!d) return clearPlaneDiv(a), !1;
  b.hasOwnProperty("remodel") || (b.remodel = 0);
  b.hasOwnProperty("prof") || (b.prof = -1);
  if (a.closest(".ship_tab").hasClass("ship_tab")) {
    var e = castInt(a.closest(".ship_tab")[0].dataset.shipid);
    if (!checkInvalidPlane(e, d)) return clearPlaneDiv(a), !1;
    8 !== d.type || 1490 !== e && 386 !== e || (b.hasOwnProperty("slot"), b.slot = 1, c = !0)
  }
  a.removeClass(getPlaneCss(a[0].dataset.type)).addClass(getPlaneCss(d.type));
  a[0].dataset.planeid = d.id;
  a[0].dataset.type = d.type;
  a.find(".plane_name_span").text(d.abbr ? d.abbr : d.name).attr("title", d.abbr ? d.name : "");
  a.find(".plane_img").attr("src", "./img/type/type" + d.type + ".png").attr("alt", d.type);
  a.find(".plane_img").parent().addClass("cur_move drag_handle");
  a.find(".plane_name").addClass("drag_handle");
  a.find(".btn_remove_plane").removeClass("opacity0");
  e = a.find(".remodel_select");
  e.prop("disabled", !d.canRemodel).removeClass("remodel_disabled");
  d.canRemodel ? e.find(".remodel_value").text(Math.min(b.remodel, 10)) : (e.addClass("remodel_disabled"), e.find(".remodel_value").text(0));
  e = 0;
  var f = setting.defaultProf.find(function (a) {
    return a.id === Math.abs(d.type)
  });
  f && (e = f.prof);
  312 === d.id && (e = 2);
  0 <= b.prof && (e = b.prof);
  f = a.find(".prof_select");
  f.attr("src", "./img/util/prof" + e + ".png").removeClass("prof_yellow prof_blue prof_none");
  f[0].dataset.prof = e;
  3 < e ? a.find(".prof_select").addClass("prof_yellow") : 0 < e ? a.find(".prof_select").addClass("prof_blue") : a.find(".prof_select").addClass("prof_none");
  c && (b.hasOwnProperty("slot") || (b.slot = 0), a.find(".slot").text(b.slot));
  return !0
}

function setShipDiv(a, b) {
  var c = SHIP_DATA.find(function (a) {
    return a.id === b
  });
  c && (a[0].dataset.shipid = c.id, a.find(".ship_img").attr("src", "./img/ship/" + b + ".png"), a.find(".ship_img").removeClass("d-none"), a.find(".ship_name_span").text(c.name), a.find(".ship_plane").each(function (b, e) {
    var d = $(e),
      g = {
        id: castInt(d[0].dataset.planeid),
        remodel: castInt(d.find(".remodel_value").text()),
        prof: castInt(d.find(".prof_select")[0].dataset.prof)
      };
    a[0].dataset.shipid && setPlaneDiv(d, g);
    d.find(".slot").text(0);
    d.find(".slot_ini").data("ini", 0);
    b < c.slot.length ? (d.removeClass("d-none").addClass("d-flex"), d.find(".slot").text(c.slot[b]), d.find(".slot_ini").data("ini", c.slot[b])) : (clearPlaneDiv(d), d.removeClass("d-flex").addClass("d-none"))
  }))
}

function clearShipDiv(a) {
  a[0].dataset.shipid = "";
  a.find(".ship_img").addClass("d-none");
  a.find(".ship_img").attr("src", "./img/ship/0.png");
  a.find(".ship_name_span").text("�͖���I��");
  a.find(".ship_plane").each(function (a, c) {
    var b = $(c);
    clearPlaneDiv(b);
    b.find(".slot").text(0);
    b.find(".slot_input").attr("max", 99);
    b.find(".slot_range").attr("max", 99);
    4 > a ? b.removeClass("d-none").addClass("d-flex") : b.removeClass("d-flex").addClass("d-none")
  })
}

function clearShipDivAll(a) {
  a = void 0 === a ? 2 : a;
  $(".ship_tab").each(function (a, c) {
    return clearShipDiv($(c))
  });
  $(".display_ship_count").each(function (b, c) {
    $(c).val(a);
    display_ship_count_Changed($(c), !0)
  })
}

function setEnemyDiv(a, b, c) {
  c = void 0 === c ? 0 : c;
  if (a) {
    var d = createEnemyObject(b),
      e = $("#enemy_fleet_display_text").prop("checked");
    0 !== d.id && (a[0].dataset.enemyid = d.id, a.removeClass("d-none no_enemy").addClass("d-flex"), a.find(".enemy_name_text").html(drawEnemyGradeColor(d.name)), a.find(".enemy_name_img").attr("src", "./img/enemy/" + d.id + ".png"), e ? (a.addClass("py-0_5").removeClass("pb-0_1 min-h-31px"), a.find(".enemy_name_img_parent").addClass("d-none").removeClass("d-flex"), a.find(".enemy_name_text").removeClass("d-none")) : (a.removeClass("py-0_5").addClass("pb-0_1 min-h-31px"), a.find(".enemy_name_img_parent").addClass("d-flex").removeClass("d-none"), a.find(".enemy_name_text").addClass("d-none")), e = 0, -1 === b && 0 < c ? e = c : 0 < d.ap ? e = d.ap : 0 < d.lbAp && (e = "(" + d.lbAp + ")"), a.find(".enemy_ap").text(e))
  }
}

function clearEnemyDiv(a) {
  a[0].dataset.enemyid = 0;
  a.addClass("no_enemy");
  a.addClass("py-0_5").removeClass("pb-0_1 min-h-31px");
  a.find(".enemy_name_img_parent").addClass("d-none").removeClass("d-flex");
  a.find(".enemy_name_img").attr("src", "./img/enemy/-1.png");
  a.find(".enemy_name_text").removeClass("d-none");
  a.find(".enemy_name_text").text("�G�͂�I��");
  a.find(".enemy_ap").text(0)
}

function clearEnemyDivAll(a) {
  a = void 0 === a ? 1 : a;
  $(".battle_content").each(function (a, c) {
    $(c)[0].dataset.celldata = "";
    $(c).find(".enemy_content").each(function (a, b) {
      return clearEnemyDiv($(b))
    })
  });
  $("#battle_count").val(a);
  createEnemyInput(a);
  clearEnemyDiv($("#air_raid_enemies").find(".enemy_content"))
}

function drawChangeValue(a, b, c, d) {
  castInt(b) !== castInt(c) ? ($inline = $(a), $inline.text(c).stop(), d ? $inline.css("color", c < b ? "#0c5" : c > b ? "#f00" : mainColor) : $inline.css("color", c > b ? "#0c5" : c < b ? "#f00" : mainColor), $inline.delay(500).animate({
    color: mainColor
  }, 1E3)) : $(a).css("color", mainColor)
}

function drawEnemyGradeColor(a) {
  a.includes("elite") ? a = a.replace("elite", '<span class="text-danger">elite</span>') : a.includes("��flagship") ? a = a.replace("flagship", '<span class="text-primary">flagship</span>') : a.includes("flagship") && (a = a.replace("flagship", '<span class="text-warning">flagship</span>'));
  return a
}

function createPlaneTable(a) {
  var b = $("#modal_plane_select").find(".modal-dialog"),
    c = $("#plane_tbody"),
    d = document.getElementById("plane_tbody"),
    e = document.createDocumentFragment(),
    f = b.find(".toggle_display_type.selected").data("mode"),
    g = loadPlaneStock(),
    h = setting.inStockOnly,
    k = setting.visibleEquipped,
    m = setting.favoriteOnly,
    l = $("#plane_sort_select").val();
  "multi" === f ? (b.addClass("modal-xl"), c.addClass("d-flex flex-wrap"), c.prev().addClass("d-none").removeClass("d-flex")) : (b.removeClass("modal-xl"), c.removeClass("d-flex flex-wrap"), c.prev().addClass("d-flex").removeClass("d-none"));
  h ? ($("#disp_equipped").closest("div").removeClass("d-none"), $("#disp_in_stock").prop("checked", !0)) : ($("#disp_equipped").closest("div").addClass("d-none"), $("#disp_in_stock").prop("checked", !1));
  b = a.length;
  for (var n = 0, u = 0, p = 0, q = 0, r = {}, t = 0; t < b; r = {
      $jscomp$loop$prop$plane$306: r.$jscomp$loop$prop$plane$306
    }, t++) {
    r.$jscomp$loop$prop$plane$306 = a[t];
    var w = r.$jscomp$loop$prop$plane$306.antiAir + 1.5 * r.$jscomp$loop$prop$plane$306.interception,
      y = r.$jscomp$loop$prop$plane$306.antiAir + r.$jscomp$loop$prop$plane$306.interception + 2 * r.$jscomp$loop$prop$plane$306.antiBomber,
      v = 0 < r.$jscomp$loop$prop$plane$306.antiBomber || 0 < r.$jscomp$loop$prop$plane$306.interception;
    if (!m || setting.favoritePlane.includes(r.$jscomp$loop$prop$plane$306.id)) {
      if (h && g) {
        var x = g.find(function (a) {
            return function (b) {
              return b.id === a.$jscomp$loop$prop$plane$306.id
            }
          }(r)),
          B = usedPlane.find(function (a) {
            return function (b) {
              return b.id === a.$jscomp$loop$prop$plane$306.id
            }
          }(r)),
          z = B ? getArraySum(B.num) : 0;
        q = x ? getArraySum(x.num) : 0;
        if (0 >= q || !k && z >= q) continue;
        p = q - z;
        for (q = 10; 0 <= q; q--)
          if (B && (x.num[q] -= B.num[q]), 0 < x.num[q]) {
            u = q;
            break
          }
      }
      x = document.createElement("div");
      x.className = "plane plane_tr d-flex py-2 py-lg-1" + ("multi" === f ? " tr_multi" : "");
      x.dataset.planeid = r.$jscomp$loop$prop$plane$306.id;
      x.dataset.type = r.$jscomp$loop$prop$plane$306.type;
      x.dataset.remodel = u;
      h && k && 0 >= p && (x.classList.remove("plane_tr", "plane"), x.classList.add("plane_tr_disabled"));
      B = document.createElement("div");
      B.className = "align-self-center size-25";
      q = document.createElement("canvas");
      z = q.getContext("2d");
      q.width = 25;
      q.height = 25;
      z.drawImage(IMAGES["type" + r.$jscomp$loop$prop$plane$306.type], 0, 0, 25, 25);
      z = document.createElement("div");
      z.className = "pl-1 plane_td_name align-self-center";
      z.textContent = r.$jscomp$loop$prop$plane$306.name;
      var A = document.createElement("div");
      A.className = "ml-1 plane_td_stock align-self-center";
      A.textContent = "�~" + (0 < p ? p : 0);
      var C = document.createElement("div");
      C.className = "ml-auto plane_td_basic align-self-center " + (v ? "text_existTooltip" : "");
      v && (C.dataset.toggle = "tooltip", C.title = "�o����:" + w + " , �h��:" + y);
      switch (l) {
      case "battle_anti_air":
        C.textContent = w;
        break;
      case "defense_anti_air":
        C.textContent = y;
        break;
      default:
        C.textContent = r.$jscomp$loop$prop$plane$306.antiAir
      }
      w = document.createElement("div");
      w.className = "plane_td_basic align-self-center";
      w.textContent = r.$jscomp$loop$prop$plane$306.radius;
      "multi" === f && n !== r.$jscomp$loop$prop$plane$306.type && "default" === l && (n = document.createElement("div"), n.className = "d-flex w-100 mt-3 mb-1", y = document.createElement("div"), y.className = "font_size_12 font_color_half align-self-center", y.textContent = PLANE_TYPE.find(function (a) {
        return function (b) {
          return b.id === a.$jscomp$loop$prop$plane$306.type
        }
      }(r)).name, v = document.createElement("div"), v.className = "flex-grow-1 border-bottom align-self-center mx-2", n.appendChild(y), n.appendChild(v), e.appendChild(n));
      B.appendChild(q);
      x.appendChild(B);
      x.appendChild(z);
      (0 < p || h && k) && x.appendChild(A);
      "single" === f && (x.appendChild(C), x.appendChild(w));
      e.appendChild(x);
      n = r.$jscomp$loop$prop$plane$306.type
    }
  }
  d.innerHTML = "";
  d.appendChild(e);
  c.find(".text_existTooltip").tooltip()
}

function setPlaneStockTable() {
  for (var a = document.getElementById("plane_stock_tbody"), b = document.createDocumentFragment(), c = PLANE_DATA.filter(function (a) {
      return 0 < a.id
    }), d = loadPlaneStock(), e = c.length, f = {}, g = 0; g < e; f = {
      $jscomp$loop$prop$plane$308: f.$jscomp$loop$prop$plane$308
    }, g++) {
    f.$jscomp$loop$prop$plane$308 = c[g];
    var h = f.$jscomp$loop$prop$plane$308.antiAir + 1.5 * f.$jscomp$loop$prop$plane$308.interception,
      k = f.$jscomp$loop$prop$plane$308.antiAir + f.$jscomp$loop$prop$plane$308.interception + 2 * f.$jscomp$loop$prop$plane$308.antiBomber,
      m = d.find(function (a) {
        return function (b) {
          return b.id === a.$jscomp$loop$prop$plane$308.id
        }
      }(f)),
      l = document.createElement("div");
    l.className = "stock_tr py-1 d-flex type_" + Math.abs(f.$jscomp$loop$prop$plane$308.type);
    l.dataset.planeid = f.$jscomp$loop$prop$plane$308.id;
    var n = document.createElement("div");
    n.className = "stock_td_type align-self-center";
    var u = document.createElement("canvas"),
      p = u.getContext("2d");
    u.width = 24;
    u.height = 24;
    p.drawImage(IMAGES["type" + f.$jscomp$loop$prop$plane$308.type], 0, 0, 24, 24);
    p = document.createElement("div");
    p.className = "stock_td_name font_size_14 text-left align-self-center";
    p.textContent = f.$jscomp$loop$prop$plane$308.name;
    var q = document.createElement("div");
    q.className = "stock_td_fav font_size_18 align-self-center " + (setting.favoritePlane.includes(f.$jscomp$loop$prop$plane$308.id) ? "plane_fav" : "plane_unfav");
    var r = document.createElement("i");
    r.className = "fas fa-heart";
    q.appendChild(r);
    r = document.createElement("div");
    r.className = "stock_td_aa align-self-center";
    r.textContent = h + (k != h ? " ( " + k + " )" : "");
    h = document.createElement("div");
    h.className = "stock_td_range align-self-center";
    h.textContent = f.$jscomp$loop$prop$plane$308.radius;
    k = document.createElement("div");
    k.className = "stock_td_stock align-self-center px-2";
    k.textContent = m ? getArraySum(m.num) : 99;
    n.appendChild(u);
    l.appendChild(n);
    l.appendChild(p);
    l.appendChild(q);
    l.appendChild(r);
    l.appendChild(h);
    l.appendChild(k);
    b.appendChild(l)
  }
  a.innerHTML = "";
  a.appendChild(b);
  $("#stock_type_select").change()
}

function initializeShipTable() {
  var a = $("#modal_ship_select").find(".modal-dialog"),
    b = document.getElementById("ship_tbody"),
    c = document.createDocumentFragment();
  a = a.find(".toggle_display_type.selected").data("mode");
  for (var d = $jscomp.makeIterator(SHIP_DATA), e = d.next(); !e.done; e = d.next()) {
    e = e.value;
    var f = document.createElement("div");
    f.className = "ship ship_tr d-flex " + ("multi" === a ? "tr_multi" : "py-1");
    f.dataset.shipid = e.id;
    f.id = "ship_tr_" + e.id;
    var g = document.createElement("div");
    g.className = "ml-1 align-self-center pt-1";
    var h = document.createElement("img");
    h.width = 120;
    h.height = 30;
    h.src = "./img/ship/" + e.id + ".png";
    g.appendChild(h);
    h = document.createElement("div");
    h.className = "ml-1 align-self-center";
    var k = document.createElement("div");
    k.className = "text-primary font_size_11";
    k.textContent = "ID : " + (1E3 < e.id ? e.orig + "b" : e.id);
    var m = document.createElement("div");
    m.textContent = e.name;
    h.appendChild(k);
    h.appendChild(m);
    f.appendChild(g);
    f.appendChild(h);
    for (g = 0; 5 > g; g++) h = document.createElement("div"), h.className = "ship_td_slot font_size_12 align-self-center " + (0 === g ? "ml-auto" : ""), h.textContent = g < e.slot.length ? e.slot[g] : "", f.appendChild(h);
    c.appendChild(f)
  }
  b.innerHTML = "";
  b.appendChild(c)
}

function createShipTable(a) {
  var b = document.getElementById("modal_ship_select").getElementsByClassName("modal-dialog")[0],
    c = document.getElementById("ship_tbody"),
    d = b.querySelector(".toggle_display_type.selected").dataset.mode,
    e = document.getElementById("display_final").checked,
    f = document.getElementById("ship_word").value.trim(),
    g = document.getElementById("frequent_ship").checked;
  c.childElementCount || initializeShipTable();
  setting.visibleFinal = e;
  setting.orderByFrequency = g;
  saveLocalStorage("setting", setting);
  var h = c.getElementsByClassName("ship_tr");
  h = Array.prototype.slice.call(h).map(function (a) {
    return {
      mst: SHIP_DATA.find(function (b) {
        return b.id === castInt(a.dataset.shipid)
      }),
      dom: a
    }
  });
  c.innerHTML = "";
  h.sort(function (a, b) {
    return a.mst.type !== b.mst.type ? a.mst.type - b.mst.type : a.mst.orig !== b.mst.orig ? a.mst.orig - b.mst.orig : a.mst.id - b.mst.id
  });
  if (g && setting.selectedHistory[1]) {
    var k = setting.selectedHistory[1];
    h.sort(function (a, b) {
      return k.filter(function (a) {
        return a === b.mst.id
      }).length - k.filter(function (b) {
        return b === a.mst.id
      }).length
    })
  }
  var m = -1;
  g = {};
  h = $jscomp.makeIterator(h);
  for (var l = h.next(); !l.done; g = {
      $jscomp$loop$prop$e$310: g.$jscomp$loop$prop$e$310
    }, l = h.next()) {
    g.$jscomp$loop$prop$e$310 = l.value;
    if (0 === a[0] && m !== g.$jscomp$loop$prop$e$310.mst.type) {
      l = document.createDocumentFragment();
      m = document.createElement("div");
      m.className = "w-100 d-flex mt-3";
      var n = document.createElement("div");
      n.className = "font_size_12 font_color_half align-self-center";
      n.textContent = SHIP_TYPE.find(function (a) {
        return function (b) {
          return b.id === a.$jscomp$loop$prop$e$310.mst.type
        }
      }(g)).name;
      var u = document.createElement("div");
      u.className = "flex-grow-1 border-bottom align-self-center mx-2";
      m.appendChild(n);
      m.appendChild(u);
      l.appendChild(m);
      c.appendChild(l);
      m = g.$jscomp$loop$prop$e$310.mst.type
    }
    c.appendChild(g.$jscomp$loop$prop$e$310.dom)
  }
  "multi" === d ? (b.classList.add("modal-xl"), c.classList.add("d-flex", "flex-wrap"), b = b.getElementsByClassName("scroll_thead")[0], b.classList.add("d-none"), b.classList.remove("d-flex")) : (b.classList.remove("modal-xl"), c.classList.remove("d-flex", "flex-wrap"), b = b.getElementsByClassName("scroll_thead")[0], b.classList.add("d-flex"), b.classList.remove("d-none"));
  b = $jscomp.makeIterator(SHIP_DATA);
  for (g = b.next(); !g.done; g = b.next()) g = g.value, h = document.getElementById("ship_tr_" + g.id), "multi" === d ? h.classList.add("tr_multi") : h.classList.remove("tr_multi"), 0 !== a[0] && !a.includes(g.type) || e && !g["final"] || f && !g.name.includes(f) ? (h.classList.add("d-none"), h.classList.remove("d-flex")) : (h.classList.add("d-flex"), h.classList.remove("d-none"));
  if ("multi" === d)
    for (a = $jscomp.makeIterator(c.getElementsByClassName("ship_td_slot")), l = a.next(); !l.done; l = a.next()) l.value.classList.add("d-none");
  else
    for (a = $jscomp.makeIterator(c.getElementsByClassName("ship_td_slot")), l = a.next(); !l.done; l = a.next()) l.value.classList.remove("d-none")
}

function createEnemyInput(a) {
  battleCount = a;
  $(".battle_content").each(function (a, c) {
    a < battleCount ? $(c).removeClass("d-none") : $(c).addClass("d-none")
  });
  $("#battle_count").val(a);
  $("#landBase_target").find("option").each(function (a, c) {
    a < battleCount ? $(c).prop("disabled", !1).removeClass("d-none") : $(c).prop("disabled", !0).addClass("d-none")
  });
  $("#landBase_target").val(battleCount);
  $("#display_battle_tab").find(".nav-link").each(function (a, c) {
    $(c).removeClass("active");
    a < battleCount ? $(c).parent().removeClass("d-none") : $(c).parent().addClass("d-none")
  });
  $("#display_battle_tab").find('[data-disp="' + battleCount + '"]').addClass("active");
  displayBattle = battleCount
}

function initializeEnemyTable() {
  for (var a = document.createDocumentFragment(), b = [], c = 0, d = {}, e = $jscomp.makeIterator(ENEMY_TYPE), f = e.next(); !f.done; d = {
      $jscomp$loop$prop$typeObject$312: d.$jscomp$loop$prop$typeObject$312
    }, f = e.next()) d.$jscomp$loop$prop$typeObject$312 = f.value, 1 !== d.$jscomp$loop$prop$typeObject$312.id && (f = ENEMY_DATA.filter(function (a) {
    return function (b) {
      return b.type[0] === a.$jscomp$loop$prop$typeObject$312.id
    }
  }(d)), b = b.concat(f.sort(function (a, b) {
    return a.orig > b.orig ? 1 : a.orig < b.orig ? -1 : a.id - b.id
  })));
  d = ENEMY_DATA.filter(function (a) {
    return 1 === a.type[0]
  });
  b = b.concat(d.sort(function (a, b) {
    return a.id > b.id ? 1 : -1
  }));
  d = {};
  b = $jscomp.makeIterator(b);
  for (e = b.next(); !e.done; d = {
      $jscomp$loop$prop$enemy$317: d.$jscomp$loop$prop$enemy$317
    }, e = b.next()) {
    d.$jscomp$loop$prop$enemy$317 = e.value;
    e = f = 0;
    for (var g = d.$jscomp$loop$prop$enemy$317.slot.length, h = {
        $jscomp$loop$prop$i$316: 0
      }; h.$jscomp$loop$prop$i$316 < g; h = {
        $jscomp$loop$prop$i$316: h.$jscomp$loop$prop$i$316
      }, h.$jscomp$loop$prop$i$316++) {
      var k = ENEMY_PLANE_DATA.find(function (a, b) {
        return function (c) {
          return c.id === a.$jscomp$loop$prop$enemy$317.eqp[b.$jscomp$loop$prop$i$316]
        }
      }(d, h));
      k && (5 !== k.type ? f += Math.floor(k.antiAir * Math.sqrt(d.$jscomp$loop$prop$enemy$317.slot[h.$jscomp$loop$prop$i$316])) : e += Math.floor(k.antiAir * Math.sqrt(d.$jscomp$loop$prop$enemy$317.slot[h.$jscomp$loop$prop$i$316])))
    }
    e += f;
    g = document.createElement("div");
    g.className = "enemy enemy_tr d-flex";
    g.dataset.enemyid = d.$jscomp$loop$prop$enemy$317.id;
    g.id = "enemy_tr_" + d.$jscomp$loop$prop$enemy$317.id;
    h = document.createElement("div");
    h.className = "ml-1 align-self-center pt-1_5";
    k = document.createElement("img");
    k.width = 128;
    k.height = 32;
    k.src = "./img/enemy/" + d.$jscomp$loop$prop$enemy$317.id + ".png";
    h.appendChild(k);
    k = document.createElement("div");
    k.className = "ml-1 align-self-center";
    var m = document.createElement("div");
    m.className = "text-primary font_size_11";
    m.textContent = "ID : " + (d.$jscomp$loop$prop$enemy$317.id + 1500);
    var l = document.createElement("div");
    l.className = "font_size_12";
    l.innerHTML = drawEnemyGradeColor(d.$jscomp$loop$prop$enemy$317.name);
    k.appendChild(m);
    k.appendChild(l);
    c !== d.$jscomp$loop$prop$enemy$317.type[0] && -1 !== d.$jscomp$loop$prop$enemy$317.id && (c = document.createElement("div"), c.className = "w-100 d-flex mt-3 divide_line", m = document.createElement("div"), m.className = "font_size_12 font_color_half align-self-center", m.textContent = ENEMY_TYPE.find(function (a) {
      return function (b) {
        return b.id === a.$jscomp$loop$prop$enemy$317.type[0]
      }
    }(d)).name, l = document.createElement("div"), l.className = "flex-grow-1 border-bottom align-self-center mx-2", c.appendChild(m), c.appendChild(l), a.appendChild(c), c = d.$jscomp$loop$prop$enemy$317.type[0]);
    g.appendChild(h);
    g.appendChild(k);
    h = document.createElement("div");
    h.className = "ml-auto align-self-center enemy_td_ap";
    h.textContent = f;
    f = document.createElement("div");
    f.className = "enemy_td_lbAp align-self-center";
    f.textContent = e;
    g.appendChild(h);
    g.appendChild(f);
    a.appendChild(g)
  }
  document.getElementById("enemy_tbody").appendChild(a)
}

function createEnemyTable(a) {
  var b = document.getElementById("modal_enemy_select").getElementsByClassName("modal-dialog")[0],
    c = document.getElementById("enemy_tbody"),
    d = b.querySelector(".toggle_display_type.selected").dataset.mode,
    e = $("#enemy_word").val().trim();
  c.childElementCount || initializeEnemyTable();
  "multi" === d ? (b.classList.add("modal-xl"), c.classList.add("d-flex", "flex-wrap"), b = b.getElementsByClassName("scroll_thead")[0], b.classList.add("d-none"), b.classList.remove("d-flex")) : (b.classList.remove("modal-xl"), c.classList.remove("d-flex", "flex-wrap"), b = b.getElementsByClassName("scroll_thead")[0], b.classList.add("d-flex"), b.classList.remove("d-none"));
  b = $jscomp.makeIterator(ENEMY_DATA);
  for (var f = b.next(); !f.done; f = b.next()) {
    f = f.value;
    var g = document.getElementById("enemy_tr_" + f.id);
    "multi" === d ? g.classList.add("enemy_tr_multi") : g.classList.remove("enemy_tr_multi");
    0 !== a[0] && !isContain(a, f.type) || e && !f.name.includes(e) ? (g.classList.add("d-none"), g.classList.remove("d-flex")) : (g.classList.add("d-flex"), g.classList.remove("d-none"))
  }
  if ("multi" === d) {
    if (0 === a[0])
      for (d = $jscomp.makeIterator(c.getElementsByClassName("divide_line")), a = d.next(); !a.done; a = d.next()) a = a.value, a.classList.add("d-flex"), a.classList.remove("d-none");
    else
      for (d = $jscomp.makeIterator(c.getElementsByClassName("divide_line")), a = d.next(); !a.done; a = d.next()) a = a.value, a.classList.remove("d-flex"), a.classList.add("d-none");
    d = $jscomp.makeIterator(c.getElementsByClassName("enemy_td_ap"));
    for (a = d.next(); !a.done; a = d.next()) a.value.classList.add("d-none");
    c = $jscomp.makeIterator(c.getElementsByClassName("enemy_td_lbAp"));
    for (a = c.next(); !a.done; a = c.next()) a.value.classList.add("d-none")
  } else {
    d = $jscomp.makeIterator(c.getElementsByClassName("divide_line"));
    for (a = d.next(); !a.done; a = d.next()) a = a.value, a.classList.add("d-none"), a.classList.remove("d-flex");
    d = $jscomp.makeIterator(c.getElementsByClassName("enemy_td_ap"));
    for (a = d.next(); !a.done; a = d.next()) a.value.classList.remove("d-none");
    c = $jscomp.makeIterator(c.getElementsByClassName("enemy_td_lbAp"));
    for (a = c.next(); !a.done; a = c.next()) a.value.classList.remove("d-none")
  }
  $("#modal_enemy_select").find(".btn_remove").prop("disabled", !0)
}

function loadPlanePreset() {
  var a = $("#modal_plane_preset");
  (planePreset = loadLocalStorage("planePreset")) || (planePreset = DEFAULT_PLANE_PRESET.concat());
  for (var b = castInt($("#modal_plane_preset").data("parentid")), c = "", d = planePreset.length, e = 0; e < d; e++) {
    for (var f = planePreset[e], g = '\n\t\t\t<div class="preset_td preset_td_info text-danger cur_help ml-auto" data-toggle="tooltip" data-boundary="window"\n\t\t\t\ttitle="�S�Ă̑������W�J�ł��܂���B">\n\t\t\t\t<i class="fas fa-exclamation-triangle"></i>\n\t\t\t</div>\n\t\t', h = 0, k = {}, m = $jscomp.makeIterator(f.planes), l = m.next(); !l.done; k = {
        $jscomp$loop$prop$planeId$319: k.$jscomp$loop$prop$planeId$319
      }, l = m.next()) k.$jscomp$loop$prop$planeId$319 = l.value, checkInvalidPlane(b, PLANE_DATA.find(function (a) {
      return function (b) {
        return b.id === a.$jscomp$loop$prop$planeId$319
      }
    }(k))) && (g = '\n\t\t\t\t<div class="preset_td preset_td_info text-warning cur_help ml-auto" data-toggle="tooltip" data-boundary="window"\n\t\t\t\t\ttitle="�W�J�ł��Ȃ��������܂܂�Ă��܂��B">\n\t\t\t\t\t<i class="fas fa-exclamation-triangle"></i>\n\t\t\t\t</div>\n\t\t\t', h++), h === f.planes.length && (g = "");
    c += '\n\t\t\t<div class="preset_tr d-flex px-1 py-2 my-1 w-100 cur_pointer" data-presetid="' + f.id + '">\n\t\t\t\t<div class="preset_td text-primary">' + (e + 1) + '.</div>\n\t\t\t\t<div class="preset_td ml-2">' + f.name + "</div>\n\t\t\t\t\t" + g + "\n\t\t\t</div>\n\t\t"
  }
  a.find(".alert").addClass("d-none");
  a.find(".preset_tr").removeClass("preset_selected");
  a.find(".preset_tbody").html(c);
  a.find(".preset_name").val("���̃v���Z�b�g�ꗗ���N���b�N").prop("disabled", !0);
  a.find(".is-invalid").removeClass("is-invalid");
  a.find(".is-valid").removeClass("is-valid");
  a.find(".preset_preview_tbody").html("");
  a.find(".btn:not(.btn_cancel)").prop("disabled", !0);
  $(".preset_td_info").tooltip()
}

function drawPlanePresetPreview(a) {
  var b = "",
    c = [],
    d = $("#modal_plane_preset"),
    e = castInt($("#modal_plane_preset").data("parentid"));
  d.find(".alert").addClass("d-none");
  if (a) {
    d.find(".preset_name").val(a.name);
    for (var f = {}, g = $jscomp.makeIterator(a.planes), h = g.next(); !h.done; f = {
        $jscomp$loop$prop$id$321: f.$jscomp$loop$prop$id$321
      }, h = g.next()) f.$jscomp$loop$prop$id$321 = h.value, c.push(PLANE_DATA.find(function (a) {
      return function (b) {
        return b.id === a.$jscomp$loop$prop$id$321
      }
    }(f)))
  } else d.find(".preset_name").val(""),
    $target.find("." + ($target.attr("class").includes("lb_tab") ? "lb_plane" : "ship_plane")).each(function (a, b) {
      if (!$(b).attr("class").includes("d-none")) {
        var d = PLANE_DATA.find(function (a) {
          return a.id === castInt($(b)[0].dataset.planeid)
        });
        d && c.push(d)
      }
    }), 0 === c.length && d.find(".alert").removeClass("d-none");
  f = $jscomp.makeIterator(c);
  for (g = f.next(); !g.done; g = f.next()) g = g.value, h = !checkInvalidPlane(e, g), b += '\n\t\t<div class="preset_preview_tr d-flex justify-content-start border-bottom" data-planeid="' + g.id + '">\n\t\t\t<div class="preset_preview_td_type"><img class="img-size-25" src="./img/type/type' + g.type + '.png"></div>\n\t\t\t<div class="preset_preview_td_name ml-1 py-2">' + g.name + "</div>\n\t\t\t" + (h ? '\n\t\t<div class="preset_preview_td_info ml-2 text-warning cur_help" data-toggle="tooltip" title="�W�J��ɕs�K���ȑ����ł�">\n\t\t\t<i class="fas fa-exclamation-triangle"></i>\n\t\t</div>\n\t' : "") + "\n\t\t</div>\n\t\t";
  d.find(".btn_expand_preset").prop("disabled", !a);
  d.find(".btn_delete_preset").prop("disabled", !a);
  d.find(".btn_commit_preset").prop("disabled", !0);
  d.find(".preset_name").prop("disabled", 0 === c.length);
  d.find(".is-invalid").removeClass("is-invalid");
  d.find(".is-valid").removeClass("is-valid");
  d.find(".preset_preview_tbody").html(b);
  d.find(".preset_preview_td_info").tooltip()
}

function updatePlanePreset() {
  var a = castInt($(".preset_selected").data("presetid")),
    b = [];
  $(".preset_preview_tr").each(function (a, c) {
    return b.push(castInt($(c)[0].dataset.planeid))
  });
  for (var c = 0, d = $jscomp.makeIterator(planePreset), e = d.next(); !e.done; e = d.next()) e = e.value, c < e.id && (c = e.id);
  c = {
    id: -1 === a ? c + 1 : a,
    name: $("#modal_plane_preset").find(".preset_name").val().replace(/^\s+|\s+$/g, ""),
    planes: b
  };
  planePreset = planePreset.filter(function (b) {
    return b.id !== a
  });
  planePreset.push(c);
  planePreset.sort(function (a, b) {
    return a.id - b.id
  });
  saveLocalStorage("planePreset", planePreset)
}

function deletePlanePreset() {
  var a = castInt($(".preset_selected").data("presetid"));
  planePreset = planePreset.filter(function (b) {
    return b.id !== a
  });
  planePreset.sort(function (a, c) {
    return a.id - c.id
  });
  saveLocalStorage("planePreset", planePreset)
}

function createMapSelect() {
  for (var a = "", b = {}, c = $jscomp.makeIterator(WORLD_DATA), d = c.next(); !d.done; b = {
      $jscomp$loop$prop$world$323: b.$jscomp$loop$prop$world$323
    }, d = c.next()) {
    d = d.value;
    b.$jscomp$loop$prop$world$323 = d.world;
    var e = MAP_DATA.filter(function (a) {
      return function (b) {
        return Math.floor(b.area / 10) === a.$jscomp$loop$prop$world$323
      }
    }(b));
    a += '<optgroup label="' + d.name + '">';
    d = $jscomp.makeIterator(e);
    for (e = d.next(); !e.done; e = d.next()) e = e.value, a += '<option value="' + e.area + '">' + (1E3 < b.$jscomp$loop$prop$world$323 ? "E" : b.$jscomp$loop$prop$world$323) + "-" + e.area % 10 + " : " + e.name + "</option>"
  }
  $("#map_select").html(a)
}

function createNodeSelect() {
  var a = castInt($("#map_select").val()),
    b = -1;
  1E3 > a ? $("#select_difficulty_div").addClass("d-none") : ($("#select_difficulty_div").removeClass("d-none"), b = castInt($("#select_difficulty").val()));
  $("#map_img").attr("src", "./img/map/" + a + ".png");
  var c = ENEMY_PATTERN.filter(function (c) {
    return c.area === a && c.lv === b
  });
  c = c.filter(function (a, b, c) {
    return c.findIndex(function (b) {
      return b.node === a.node
    }) === b
  });
  c.sort(function (a, b) {
    return "��P" == a.node && "��P" == b.node ? 0 : "��P" == a.node ? -1 : "��P" == b.node ? 1 : 0
  });
  for (var d = c.length, e = "", f = "", g = 0; g < d; g++) {
    var h = c[g].node,
      k = c[g].coords;
    e += '\n\t\t<div class="d-flex node_tr justify-content-center py-1 w-100 cur_pointer" data-node="' + h + '">\n\t\t\t<div class="align-self-center">' + h + "</div>\n\t\t</div>\n\t";
    "" !== k && (f += '<area class="node" title="' + h + '" coords="' + k + '" shape="rect">')
  }
  $("#node_tbody").html(e);
  $("#clickable_nodes").html(f);
  $("#enemy_pattern_tbody").html("");
  $("#enemy_pattern_select").html('<li class="nav-item"><a class="nav-link ' + ("#000000" === mainColor ? "" : "nav-link-dark") + ' active" data-toggle="tab" href="#">�Ґ�1</a></li>');
  $("#enemy_pattern_air_power").text("0");
  $("#enemy_display_mode_parent").addClass("d-none").removeClass("d-flex");
  $("#btn_expand_enemies").prop("disabled", !0);
  $("#btn_continue_expand").prop("disabled", !0)
}

function createEnemyPattern(a) {
  a = void 0 === a ? 0 : a;
  var b = castInt($("#map_select").val()),
    c = $(".node_selected").data("node"),
    d = -1;
  1E3 > b ? $("#select_difficulty_div").addClass("d-none") : ($("#select_difficulty_div").removeClass("d-none"), d = castInt($("#select_difficulty").val()));
  for (var e = "", f = 0, g = 0, h = ENEMY_PATTERN.filter(function (a) {
      return a.area === b && a.node === c && a.lv === d
    }), k = h[a], m = k.enemies, l = m.length, n = {
      $jscomp$loop$prop$index$325: 0
    }; n.$jscomp$loop$prop$index$325 < l; n = {
      $jscomp$loop$prop$index$325: n.$jscomp$loop$prop$index$325
    }, n.$jscomp$loop$prop$index$325++) {
    var u = ENEMY_DATA.find(function (a) {
        return function (b) {
          return b.id === m[a.$jscomp$loop$prop$index$325]
        }
      }(n)),
      p = createEnemyObject(u.id);
    f += p.ap;
    g += p.aabo;
    e += '\n\t\t<div class="enemy_pattern_tr mx-1 d-flex border-bottom" data-enemyid="' + u.id + '">\n\t\t\t<div class="mr-1 align-self-center enemy_pattern_tr_image">\n\t\t\t\t<img src="./img/enemy/' + u.id + '.png" class="enemy_img">\n\t\t\t</div>\n\t\t\t<div class="align-self-center enemy_pattern_tr_text">\n\t\t\t\t<div class="font_size_11 text-primary">ID: ' + (u.id + 1500) + "</div>\n\t\t\t\t<div>" + drawEnemyGradeColor(u.name) + "</div>\n\t\t\t</div>\n\t\t</div>\n\t\t"
  }
  n = FORMATION.find(function (a) {
    return a.id === k.form
  });
  g = 2 * Math.floor(n.correction * g);
  $("#enemy_pattern_anti_air").text(g);
  $("#enemy_pattern_formation").text(n.name);
  if (0 === a) {
    a = "";
    for (g = 0; g < h.length; g++) a += '\n\t\t\t<li class="nav-item">\n\t\t\t\t<a class="nav-link ' + ("#000000" === mainColor ? "" : "nav-link-dark") + " " + (0 === g ? "active" : "") + '" data-toggle="tab" data-disp="' + g + '" href="#">\n\t\t\t\t\t' + (h[g].remarks ? h[g].remarks : "�Ґ�" + (g + 1)) + "\n\t\t\t\t\t</a>\n\t\t\t</li>\n\t\t\t";
    $("#enemy_pattern_select").html(a)
  }
  h = getAirStatusBorder(f);
  $("#enemy_pattern_tbody").html(e);
  $("#enemy_pattern_air_power").text(f);
  $("#enemy_pattern_status0").text(h[0]);
  $("#enemy_pattern_status1").text(h[1]);
  $("#enemy_pattern_status2").text(h[2]);
  $("#enemy_pattern_status3").text(h[3]);
  $("#btn_expand_enemies").prop("disabled", !1);
  $("#btn_continue_expand").prop("disabled", !1);
  6 < l ? ($("#enemy_display_mode_parent").removeClass("d-none").addClass("d-flex"), setting.enemyDisplayImage ? $("#enemy_pattern_tbody").find(".enemy_pattern_tr_text").addClass("d-none") : $("#enemy_pattern_tbody").find(".enemy_pattern_tr_image").addClass("d-none")) : $("#enemy_display_mode_parent").addClass("d-none").removeClass("d-flex")
}

function expandEnemy() {
  var a = castInt($("#map_select").val()),
    b = $(".node_selected").data("node"),
    c = castInt($("#enemy_pattern_select").find(".nav-link.active").data("disp")),
    d = -1;
  1E3 <= a && (d = castInt($("#select_difficulty").val()));
  var e = ENEMY_PATTERN.filter(function (c) {
    return c.area === a && c.node === b && c.lv === d
  })[c];
  isDefMode || "��P" !== b ? isDefMode && "��P" !== b && (isDefMode = !1, $(".ohuda_select").each(function (a, b) {
    0 === castInt($(b).val()) && $(b).val(-1)
  }), $target = $(".battle_content:first")) : (isDefMode = !0, $(".ohuda_select").each(function (a, b) {
    $(b).val(0)
  }), $target = $("#air_raid_enemies"));
  c = isDefMode && 5 !== e.type ? 3 : e.type;
  $target.find(".cell_type").val(c);
  changeFormationSelectOption($target.find(".formation"), c);
  $target.find(".formation").val(e.form);
  $target.find(".enemy_content").each(function (a, b) {
    a < e.enemies.length ? setEnemyDiv($(b), e.enemies[a]) : clearEnemyDiv($(b))
  });
  $target.find(".enemy_range").text(e.radius);
  $target[0].dataset.celldata = a + "_" + e.node + (e.remarks ? "(" + e.remarks + ")" : "")
}

function loadMainPreset(a) {
  a = void 0 === a ? !1 : a;
  var b = $("#modal_main_preset");
  a = $("#main_preset_back_up").hasClass("active") || a;
  (presets = loadLocalStorage("presets")) || (presets = []);
  (backUpPresets = loadLocalStorage("backUpPresets")) || (backUpPresets = []);
  a = a ? backUpPresets : presets;
  for (var c = "", d = 0; d < a.length; d++) {
    var e = a[d];
    c += '\n\t\t\t<div class="preset_tr d-flex px-1 py-2 my-1 w-100 cur_pointer" data-presetid="' + e[0] + '">\n\t\t\t\t<div class="preset_td text-primary">' + (d + 1) + '.</div>\n\t\t\t\t<div class="preset_td ml-2 font_size_12">' + e[1] + "</div>\n\t\t\t</div>\n\t\t"
  }
  b.find(".preset_selected").removeClass("preset_selected");
  b.find(".is-invalid").removeClass("is-invalid");
  b.find(".is-valid").removeClass("is-valid");
  b.find(".preset_tbody").html(c);
  b.find(".preset_name").val("").prop("disabled", !0);
  b.find(".btn:not(.btn_cancel)").prop("disabled", !0);
  b.find(".btn_commit_preset_header").addClass("d-none");
  b.find(".btn_commit_preset_header").tooltip("hide");
  b.find(".btn_output_url").prop("disabled", !1);
  b.find(".btn_output_deck").prop("disabled", !1);
  b.find("#preset_remarks").prop("disabled", !0).val("");
  b.find(".preset_data").data("presetid", 0);
  $("#main_preset_load_tab").find("input").val("")
}

function drawMainPreset(a) {
  var b = $("#modal_main_preset");
  b.find(".btn_expand_preset").prop("disabled", !a);
  b.find(".btn_delete_preset").prop("disabled", !a);
  if (a && 0 < a[0]) b.find(".preset_data").data("presetid", a[0]), b.find(".preset_name").val(a[1]), b.find("#preset_remarks").val(a[3]), b.find(".btn_commit_preset").text("�Ґ��ύX"), b.find(".btn_commit_preset").prop("disabled", !1), b.find(".btn_commit_preset_header").removeClass("d-none"), b.find(".btn_commit_preset_header").prop("disabled", !1);
  else if (a && 0 > a[0]) {
    for (var c = 0, d = $jscomp.makeIterator(presets), e = d.next(); !e.done; e = d.next()) e = e.value, c < e[0] && (c = e[0]);
    b.find(".preset_data").data("presetid", castInt(c) + 1);
    b.find(".preset_name").val(a[1]);
    b.find("#preset_remarks").val(a[3]);
    b.find(".btn_commit_preset").text("�v���Z�b�g�ۑ�");
    b.find(".btn_commit_preset").prop("disabled", !0);
    b.find(".btn_commit_preset_header").addClass("d-none")
  } else {
    a = 0;
    c = $jscomp.makeIterator(presets);
    for (d = c.next(); !d.done; d = c.next()) d = d.value, a < d[0] && (a = d[0]);
    b.find(".preset_data").data("presetid", castInt(a) + 1);
    b.find(".btn_commit_preset").text("�V�K�o�^");
    b.find(".btn_commit_preset").prop("disabled", !0);
    b.find(".btn_commit_preset_header").addClass("d-none");
    b.find(".preset_name").val("");
    b.find("#preset_remarks").val("")
  }
  b.find(".is-invalid").removeClass("is-invalid");
  b.find(".is-valid").removeClass("is-valid");
  b.find(".preset_name").prop("disabled", !1);
  b.find("#preset_remarks").prop("disabled", !1);
  b.find(".alert").addClass("hide").removeClass("show")
}

function updateMainPreset() {
  for (var a = createPreset(), b = !1, c = 0; c < presets.length; c++)
    if (presets[c][0] === a[0]) {
      presets[c] = a;
      b = !0;
      break
    }
  b || presets.push(a);
  saveLocalStorage("presets", presets);
  $("#modal_main_preset").find(".task").text(b ? "�Ґ��X�V" : "�V�K�o�^");
  $("#modal_main_preset").find(".alert").removeClass("hide").addClass("show")
}

function updateMainPresetName() {
  var a = presets.find(function (a) {
    return a[0] === castInt($("#modal_main_preset").find(".preset_data").data("presetid"))
  });
  if (a) {
    var b = $("#modal_main_preset").find(".preset_name").val().trim();
    0 === b.length && (b = new Date, b = "preset-" + (b.getFullYear() + "" + b.getMonth() + 1 + b.getDate()));
    a[1] = b;
    a[3] = $("#preset_remarks").val().trim()
  }
  saveLocalStorage("presets", presets);
  $("#modal_main_preset").find(".task").text("�X�V");
  $("#modal_main_preset").find(".alert").removeClass("hide").addClass("show")
}

function expandMainPreset(a, b, c, d) {
  b = void 0 === b ? !0 : b;
  c = void 0 === c ? !0 : c;
  d = void 0 === d ? !0 : d;
  if (a) try {
    $(".lb_plane").each(function (c, d) {
      var e = a[0];
      e && 0 !== e.length && ((e = e[0].find(function (a) {
        return a[4] === c
      })) && 0 !== e.length ? (e = {
        id: e[0],
        prof: e[1],
        remodel: e[2],
        slot: e[3]
      }, setLBPlaneDiv($(d), e)) : b && setLBPlaneDiv($(d)))
    });
    $(".ohuda_select").each(function (b, c) {
      var d = a[0];
      $(c).find("option").prop("disabled", !1);
      d && 0 !== d.length ? $(c).val(castInt(d[1][b], -1)) : $(c).val(-1);
      ohuda_Changed($(c), !0)
    });
    if (c) {
      clearShipDivAll(6);
      var e = 0,
        f = 0;
      $(".ship_tab").each(function (b, c) {
        var d = a[1].find(function (a) {
          return a[2] === b
        });
        if (d) {
          var g = $(c);
          setShipDiv(g, d[0]);
          g.find(".ship_plane").each(function (a, b) {
            var c = $(b),
              e = d[1].find(function (b) {
                return b[4] === a
              });
            e && !c.hasClass("d-none") && (setPlaneDiv(c, {
              id: e[0],
              prof: e[1],
              remodel: e[2],
              slot: e[3]
            }, !0), 6 <= e.length && e[5] && plane_unlock_Clicked(c.find(".plane_unlock")))
          });
          4 <= d.length && (g.find(".ship_disabled").prop("checked", d[3]), d[3] ? g.addClass("opacity4") : g.removeClass("opacity4"));
          6 >= b ? e = b + 1 : f = b + 1 - 6
        }
      });
      e = Math.min(Math.max(e, 2), 6);
      $("#friendFleet_item1").find(".display_ship_count").val(1 === e % 2 ? e + 1 : e);
      display_ship_count_Changed($("#friendFleet_item1").find(".display_ship_count"), !0);
      f = Math.min(Math.max(f, 2), 6);
      $("#friendFleet_item2").find(".display_ship_count").val(1 === f % 2 ? f + 1 : f);
      display_ship_count_Changed($("#friendFleet_item2").find(".display_ship_count"), !0)
    }
    c = 1;
    for (var g = 0; g < a[2].length; g++) c < a[2][g][0] + 1 && (c = a[2][g][0] + 1);
    c = Math.min(c, 10);
    if (0 !== a[2].length || d) clearEnemyDivAll(c),
      $("#battle_count").val(c);
    $(isDefMode ? "#air_raid_enemies" : ".battle_content").each(function (b, c) {
      var d = a[2].find(function (a) {
        return a[0] === b
      });
      if (d) {
        3 <= d.length ? $(c)[0].dataset.celldata = d[2] : $(c)[0].dataset.celldata = "";
        if (4 <= d.length) {
          var e = castInt(d[3]);
          isDefMode ? $(c).find(".cell_type").val([0, 5].includes(e) ? 5 : 3) : $(c).find(".cell_type").val(e);
          cell_type_Changed($(c).find(".cell_type"), !1)
        } else $(c).find(".cell_type").val(1);
        5 <= d.length ? $(c).find(".formation").val(d[4]) : $(c).find(".formation").val(1);
        e = 0;
        d = $jscomp.makeIterator(d[1]);
        for (var f = d.next(); !f.done; f = d.next()) {
          f = f.value;
          var g = $(c).find(".enemy_content").eq(e++);
          0 < f ? setEnemyDiv(g, f) : 0 > f ? setEnemyDiv(g, -1, -f) : clearEnemyDiv(g);
          g.addClass("d-flex").removeClass("d-none")
        }
      }
    })
  } catch (h) {
    $(".ohuda_select").val(-1), $(".lb_plane").each(function (a, b) {
      setLBPlaneDiv($(b))
    }), clearShipDivAll(6), clearEnemyDivAll(1), $("#battle_count").val(1), d = $("#modal_confirm"), d.find(".modal-body").html('\n\t\t\t<div class="px-2">\n\t\t\t\t<div>��x�A�u���E�U�ɕۑ����ꂽ�{�T�C�g�̐ݒ���폜���Ă݂Ă��������B�u�ڍאݒ�v���̍ŉ����̐ݒ�폜�{�^������폜���\�ł��B</div>\n\t\t\t\t<div class="h6 mt-4">�Ǐ󂪉��P���Ȃ��ꍇ</div>\n\t\t\t\t<div class="px-2">\n\t\t\t\t\t�\���󂠂�܂���A���萔�ł����A�ǂ̂悤�ȑ�����s�����ۂɂ��̉�ʂ��\�����ꂽ��\n\t\t\t\t\t<a href="https://odaibako.net/u/noro_006" target="_blank">������</a>�܂ł��񍐂���������΍K���ł��B\n\t\t\t\t</div>\n\t\t\t\t<div class="mt-2 px-2">�񍐂𒸂�����A�\�Ȍ��葁���̃o�O�t�B�b�N�X�ɓw�߂܂��B</div>\n\t\t\t\t<div class="mt-3 px-2 font_size_8">message : ' + h.message + '</div>\n\t\t\t\t<div class="px-2 font_size_8">stack : ' + h.stack + "</div>\n\t\t\t</div>\n\t\t"), confirmType = "Error", d.modal("show")
  }
}

function createLandBasePreset() {
  var a = [
    [],
    []
  ];
  $(".ohuda_select").each(function (b, c) {
    a[1].push(castInt($(c).val()))
  });
  $(".lb_plane:not(.ui-draggable-dragging)").each(function (b, c) {
    var d = $(c);
    d = [castInt(d[0].dataset.planeid), castInt(d.find(".prof_select")[0].dataset.prof), castInt(d.find(".remodel_value").text()), castInt(d.find(".slot").text()), b];
    0 !== d[0] && a[0].push(d)
  });
  return a
}

function createFriendFleetPreset() {
  var a = [],
    b = 0;
  $(".ship_tab").each(function (c, d) {
    6 === c && (b = 6);
    if (!$(d).attr("class").includes("d-none")) {
      var e = [castInt($(d)[0].dataset.shipid), [], b, $(d).find(".ship_disabled").prop("checked") ? 1 : 0];
      $(d).find(".ship_plane:not(.ui-draggable-dragging)").each(function (a, b) {
        var c = $(b);
        c = [castInt(c[0].dataset.planeid), castInt(c.find(".prof_select")[0].dataset.prof), castInt(c.find(".remodel_value").text()), castInt(c.find(".slot").text()), a, c.find(".plane_unlock").hasClass("d-none") ? 1 : 0];
        0 !== c[0] && e[1].push(c)
      });
      if (0 !== e[0] || 0 !== e[1].length) a.push(e), b++
    }
  });
  return a
}

function createEnemyFleetPreset() {
  var a = [];
  $(isDefMode ? "#air_raid_enemies" : ".battle_content").each(function (b, c) {
    if (!$(c).attr("class").includes("d-none")) {
      var d = [b, [], $(c)[0].dataset.celldata, castInt($(c).find(".cell_type").val()), castInt($(c).find(".formation").val())];
      $(c).find(".enemy_content").each(function (a, b) {
        var c = castInt($(b)[0].dataset.enemyid),
          e = castInt($(b).find(".enemy_ap").text());
        d[3] !== CELL_TYPE.grand && 6 <= a || (0 === c ? d[1].push(0) : 0 < c ? d[1].push(c) : 0 < e && d[1].push(-e))
      });
      0 !== d[1].length && a.push(d)
    }
  });
  return a
}

function createPreset() {
  var a = $("#modal_main_preset").find(".preset_name").val().trim();
  0 === a.length && (a = "");
  return [castInt($("#modal_main_preset").find(".preset_data").data("presetid")), a, encodePreset(), $("#preset_remarks").val().trim()]
}

function encodePreset() {
  try {
    var a = [createLandBasePreset(), createFriendFleetPreset(), createEnemyFleetPreset()],
      b = JSON.stringify(a),
      c = utf8_to_b64(b),
      d = b64_to_utf8(c);
    JSON.parse(d);
    return c
  } catch (e) {
    return utf8_to_b64(JSON.stringify([
      [],
      [],
      []
    ]))
  }
}

function decodePreset(a) {
  try {
    var b = b64_to_utf8(a);
    return JSON.parse(b)
  } catch (c) {
    return [
      [],
      [],
      []
    ]
  }
}

function deleteMainPreset(a) {
  if ($("#main_preset_back_up").hasClass("active")) {
    backUpPresets = backUpPresets.filter(function (b) {
      return b[0] !== a
    });
    backUpPresets.sort(function (a, b) {
      return a[0] - b[0]
    });
    for (var b = 0; b < backUpPresets.length; b++) backUpPresets[b][0] = -(b + 1);
    saveLocalStorage("backUpPresets", backUpPresets)
  } else presets = presets.filter(function (b) {
    return b[0] !== a
  }), presets.sort(function (a, b) {
    return a[0] - b[0]
  }), saveLocalStorage("presets", presets);
  b = $("#modal_main_preset");
  b.find(".alert").removeClass("hide").addClass("show");
  b.find(".task").text("�폜");
  loadMainPreset()
}

function readDeckBuilder(a) {
  if (!a) return null;
  try {
    a = decodeURIComponent(a).trim('"');
    var b = JSON.parse(a),
      c = [],
      d = [
        [],
        [-1, -1, -1]
      ];
    Object.keys(b).forEach(function (a) {
      var e = b[a];
      if ("version" !== a && e) {
        if (0 === a.indexOf("a") && e.hasOwnProperty("items")) {
          var f = castInt(a.replace("a", "")) - 1;
          d[1][f] = e.hasOwnProperty("mode") ? 1 === e.mode ? 2 : 2 === e.mode ? 0 : -1 : -1;
          Object.keys(e.items).forEach(function (a) {
            var b = e.items[a];
            if (b && b.hasOwnProperty("id")) {
              var c = [0, 0, 0, 18, castInt(a.replace("i", "")) - 1 + 4 * f];
              Object.keys(b).forEach(function (a) {
                "id" === a ? c[0] = castInt(b[a]) : "mas" === a ? c[1] = castInt(b[a]) : "rf" === a && (c[2] = castInt(b[a]))
              });
              d[0].push(c)
            }
          })
        }
        if (0 === a.indexOf("f")) {
          var g = castInt(a.replace("f", "")) - 1,
            h = [g, []];
          Object.keys(e).forEach(function (a) {
            var b = e[a];
            if (b && b.hasOwnProperty("items")) {
              var c = SHIP_DATA.find(function (a) {
                return a.deckid === castInt(b.id)
              });
              if (c) {
                var d = [c.id, [], castInt(a.replace("s", "")) - 1 + 6 * g];
                Object.keys(b.items).forEach(function (a) {
                  var e = b.items[a];
                  if (e && e.hasOwnProperty("id") && PLANE_DATA.find(function (a) {
                      return a.id === castInt(e.id)
                    })) {
                    a = castInt(a.replace("i", "")) - 1;
                    var f = [0, 0, 0, c.slot[a], a];
                    Object.keys(e).forEach(function (a) {
                      "id" === a ? f[0] = castInt(e[a]) : "mas" === a ? f[1] = castInt(e[a]) : "rf" === a && (f[2] = castInt(e[a]))
                    });
                    d[1].push(f)
                  }
                });
                h[1].push(d)
              }
            }
          });
          c.push(h)
        }
      }
    });
    var e = c.find(function (a) {
      return 0 === a[0]
    })[1];
    if (2 <= c.length) {
      var f = c.find(function (a) {
          return 1 === a[0]
        })[1],
        g = e.concat(f);
      return [d, g, []]
    }
    return [d, e, []]
  } catch (h) {
    return null
  }
}

function convertToDeckBuilder() {
  try {
    for (var a = createFriendFleetPreset(), b = createLandBasePreset(), c = {
        version: 4,
        f1: {},
        f2: {},
        a1: {
          mode: 0,
          items: {}
        },
        a2: {
          mode: 0,
          items: {}
        },
        a3: {
          mode: 0,
          items: {}
        }
      }, d = $jscomp.makeIterator(b[0]), e = d.next(); !e.done; e = d.next()) {
      var f = e.value;
      c["a" + (Math.floor(f[4] / 4) + 1)].items["i" + (Math.floor(f[4] % 4) + 1)] = {
        id: f[0],
        rf: f[2],
        mas: f[1]
      }
    }
    for (d = 0; d < b[1].length; d++) {
      var g = b[1][d];
      c["a" + (d + 1)].mode = 0 < g ? 1 : 0 === g ? 2 : 0
    }
    b = {};
    for (g = 0; g < a.length; b = {
        $jscomp$loop$prop$ship$327: b.$jscomp$loop$prop$ship$327
      }, g++) {
      b.$jscomp$loop$prop$ship$327 = a[g];
      var h = SHIP_DATA.find(function (a) {
        return function (b) {
          return b.id === a.$jscomp$loop$prop$ship$327[0]
        }
      }(b));
      if (h) {
        d = {
          i1: null,
          i2: null,
          i3: null,
          i4: null,
          i5: null
        };
        var k = $jscomp.makeIterator(b.$jscomp$loop$prop$ship$327[1]);
        for (e = k.next(); !e.done; e = k.next()) {
          var m = e.value,
            l = {
              id: m[0],
              rf: m[2],
              mas: m[1]
            };
          d["i" + castInt(m[4] + 1)] = l
        }
        var n = {
            id: "" + h.deckid,
            lv: 99,
            luck: -1,
            items: d
          },
          u = b.$jscomp$loop$prop$ship$327[2];
        6 > u ? c.f1["s" + (u % 6 + 1)] = n : c.f2["s" + (u % 6 + 1)] = n
      }
    }
    return JSON.stringify(c)
  } catch (p) {
    return ""
  }
}

function readEquipmentJson(a) {
  try {
    for (var b = JSON.parse(a), c = loadPlaneStock(), d = $jscomp.makeIterator(c), e = d.next(); !e.done; e = d.next()) e.value.num = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    a = {};
    for (var f = $jscomp.makeIterator(b), g = f.next(); !g.done; a = {
        $jscomp$loop$prop$planeId$329: a.$jscomp$loop$prop$planeId$329
      }, g = f.next()) {
      var h = g.value;
      if (!h.hasOwnProperty("api_slotitem_id") || !h.hasOwnProperty("api_level")) return !1;
      a.$jscomp$loop$prop$planeId$329 = h.api_slotitem_id;
      var k = h.api_level,
        m = c.find(function (a) {
          return function (b) {
            return b.id === a.$jscomp$loop$prop$planeId$329
          }
        }(a));
      m && m.num[k]++
    }
    c.sort(function (a, b) {
      return a.id - b.id
    });
    saveLocalStorage("planeStock", c);
    setting.inStockOnly = !0;
    saveLocalStorage("setting", setting)
  } catch (l) {
    return !1
  }
  return !0
}

function loadPlaneStock() {
  var a = loadLocalStorage("planeStock");
  if (a && a.length) {
    var b = {},
      c = $jscomp.makeIterator(PLANE_DATA);
    for (d = c.next(); !d.done; b = {
        $jscomp$loop$prop$plane$156$331: b.$jscomp$loop$prop$plane$156$331
      }, d = c.next()) b.$jscomp$loop$prop$plane$156$331 = d.value, a.find(function (a) {
      return function (b) {
        return b.id === a.$jscomp$loop$prop$plane$156$331.id
      }
    }(b)) || (a.push({
      id: b.$jscomp$loop$prop$plane$156$331.id,
      num: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }), saveLocalStorage("planeStock", a))
  } else {
    a = [];
    b = $jscomp.makeIterator(PLANE_DATA);
    for (var d = b.next(); !d.done; d = b.next()) a.push({
      id: d.value.id,
      num: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    });
    a = a.concat();
    saveLocalStorage("planeStock", a)
  }
  return a
}

function updatePlaneSelectedHistory(a) {
  setting.selectedHistory[0].unshift(a);
  setting.selectedHistory[0] = setting.selectedHistory[0].splice(0, 100);
  saveLocalStorage("setting", setting)
}

function updateShipSelectedHistory(a) {
  setting.selectedHistory[1].unshift(a);
  setting.selectedHistory[1] = setting.selectedHistory[1].splice(0, 100);
  saveLocalStorage("setting", setting)
}

function drawResult() {
  $("#rate_table tbody").find(".rate_tr").addClass("d-none disabled_tr");
  $(".progress_area").addClass("d-none disabled_bar").removeClass("d-flex");
  for (var a = Object.create(chartData), b = a.own.length, c = {}, d = 0; d < b; c = {
      $jscomp$loop$prop$abbr$333: c.$jscomp$loop$prop$abbr$333
    }, d++) {
    var e = a.own[d],
      f = a.enemy[d],
      g = a.rate[d],
      h = getAirStatusBorder(f),
      k = isDefMode ? getAirStatusIndex(e, f) : a.rate[d].indexOf(getArrayMax(a.rate[d])),
      m = 0,
      l = !1,
      n = isDefMode ? 8 : 1 === b ? 7 : d + 1,
      u = $("#result_bar_" + n),
      p = $("#rate_row_" + n);
    4 === k ? m = e / h[3] * 10 : 3 === k ? m = e / h[2] * 20 : 2 === k ? m = e / h[1] * 45 : 1 >= k && (m = e / h[0] * 90);
    if (5 === k && (7 > n || 8 === n)) k = 0, m = 100;
    else if (5 === k) {
      c.$jscomp$loop$prop$abbr$333 = $("#shoot_down_table").find(".cond.battle" + displayBattle).text();
      var q = AIR_STATUS.find(function (a) {
        return function (b) {
          return b.abbr === a.$jscomp$loop$prop$abbr$333
        }
      }(c));
      q && (k = q.id);
      0 === k && (m = 100)
    }
    q = u.data("airstatus");
    u.removeClass("bar_status" + q).addClass("bar_status" + k).css({
      width: (100 < m ? 100 : m) + "%"
    }).data("airstatus", k);
    p.find(".rate_td_ap").text(e);
    f = '<span class="mr-1">' + f + '</span><span class="text-nowrap">( ';
    for (m = 0; m < h.length - 1; m++) 0 !== m && (f += " / "), f = h[m] <= e ? f + ("<b>" + h[m] + "</b>") : f + h[m];
    p.find(".rate_td_eap").html(f + " )</span>");
    for (e = 0; e < g.length; e++) p.find(".rate_td_status" + e).text("-"), isDefMode ? p.find(".rate_td_status" + k).text("100 %") : 0 < g[e] && (l = 100 * g[e], p.find(".rate_td_status" + e).text((100 === l ? 100 : l.toFixed(2)) + " %"), l = !0);
    if (l || isDefMode && 8 === n) p.removeClass("d-none disabled_tr"), u.closest(".progress_area").addClass("d-flex").removeClass("d-none disabled_bar")
  }
  d = c = b = 0;
  a = castInt($("#calculate_count").val());
  for (g = 0; g < chartData.slots.length; g++)
    if (k = chartData.slots[g], n = 100 * k.deathRate, l = document.getElementsByClassName("slot" + k.slot + " shipNo" + k.shipNo)[0]) u = castInt(l.getElementsByClassName("battle1")[0].textContent), l.getElementsByClassName("battle1")[0].textContent && (p = '\n\t\t<div class="text-left">\n\t\t\t<div>�ő�c���F' + k.max + "</div>\n\t\t\t<div>�ŏ��c���F" + k.min + "</div>\n\t\t\t<div>�S�ŉ񐔁F" + k.death + " / " + a + "</div>\n\t\t\t<div>���N���b�N�ŏڍ׌v�Z</div>\n\t\t</div>", e = l.getElementsByClassName("battle_end")[0], e.textContent = Math.round(k.avg), e.dataset.toggle = "tooltip", e.dataset.html = "true", e.title = p, l = l.getElementsByClassName("battle_death")[0], l.textContent = 0 === k.deathRate ? "-" : 10 <= n ? n.toFixed(1) + " %" : n.toFixed(2) + " %", l.dataset.toggle = "tooltip", l.dataset.html = "true", l.title = p, 0 < u && (b += 5 * (u - k.avg), c += 5 * (u - k.max), d += 5 * (u - k.min)));
  $(".battle_end.fap").html('<img src="./img/util/bauxite.png" class="img-size-18" alt="�{�[�L�T�C�g"> ����');
  $(".battle_end.eap").html(c + " ~ " + d + " ( " + b.toFixed(1) + " )");
  $("#shoot_down_table_tbody .battle_end").tooltip();
  $("#shoot_down_table_tbody .battle_death").tooltip();
  for (b = 0; b < chartData.enSlots.length; b++) c = chartData.enSlots[b], d = document.getElementsByClassName("enemy_no_" + c[0] + " slot_" + c[1])[0], g = c[2] / a, d.getElementsByClassName("td_avg_slot")[0].textContent = 0 === g ? "0" : g.toFixed(1), d.getElementsByClassName("td_max_slot")[0].textContent = c[3], d.getElementsByClassName("td_min_slot")[0].textContent = c[4];
  display_result_Changed()
}

function loadLocalStorage(a) {
  if (!window.localStorage) return null;
  try {
    return JSON.parse(window.localStorage.getItem(a))
  } catch (b) {
    return null
  }
}

function saveLocalStorage(a, b) {
  if (!window.localStorage || 0 === a.length) return !1;
  try {
    return window.localStorage.setItem(a, JSON.stringify(b)), !0
  } catch (c) {
    return window.localStorage.removeItem(a), !1
  }
}

function deleteLocalStorage(a) {
  if (!window.localStorage || 0 === a.length) return !1;
  window.localStorage.removeItem(a);
  return !0
}

function getAirStatusIndex(a, b) {
  if (1E3 >= a) {
    var c = AIR_STATUS_TABLE[a].length - 1;
    return b < c ? AIR_STATUS_TABLE[a][b] : AIR_STATUS_TABLE[a][c]
  }
  c = getAirStatusBorder(b);
  for (var d = c.length, e = 0; e < d; e++)
    if (a >= c[e]) return 0 !== a ? e : 4
}

function getLBAirStatusIndex(a, b) {
  return 0 === a && 0 === b ? 0 : getAirStatusIndex(a, b)
}

function getAirStatusBorder(a) {
  return 0 === a ? [0, 0, 0, 0, 0] : [3 * a, Math.ceil(1.5 * a), Math.floor(a / 1.5) + 1, Math.floor(a / 3) + 1, 0]
}

function calculate() {
  var a = {
    landBaseData: [],
    friendFleetData: [],
    battleData: []
  };
  calculateInit(a);
  mainCalculate(a);
  rateCalculate(a);
  drawResult()
}

function calculateInit(a) {
  document.getElementById("ship_info_table").getElementsByTagName("tbody")[0].innerHTML = "";
  document.getElementById("shoot_down_table").getElementsByTagName("tbody")[0].innerHTML = "";
  document.getElementById("enemy_shoot_down_table").getElementsByTagName("tbody")[0].innerHTML = "";
  document.getElementById("input_summary").value = "";
  for (var b = $jscomp.makeIterator(document.getElementById("shoot_down_table").getElementsByTagName("tfoot")[0].getElementsByClassName("td_battle")), c = b.next(); !c.done; c = b.next()) c.value.innerHTML = "";
  b = $jscomp.makeIterator(document.getElementById("shoot_down_table").getElementsByTagName("td"));
  for (c = b.next(); !c.done; c = b.next()) c.value.classList.remove("airStatus0", "airStatus1", "airStatus2", "airStatus3", "airStatus4");
  isDefMode ? (document.getElementById("ship_info").classList.add("d-none"), document.getElementById("shoot_down_table_content").classList.add("d-none"), document.getElementById("friendFleet").classList.add("d-none"), document.getElementById("normal_enemies").classList.add("d-none"), document.getElementById("display_battle_tab").classList.add("d-none"), document.getElementById("air_raid_enemies").classList.remove("d-none"), b = document.getElementById("battle_count_content"), b.classList.add("d-none"), b.classList.remove("d-flex")) : (document.getElementById("ship_info").classList.remove("d-none"), document.getElementById("shoot_down_table_content").classList.remove("d-none"), document.getElementById("friendFleet").classList.remove("d-none"), document.getElementById("normal_enemies").classList.remove("d-none"), document.getElementById("display_battle_tab").classList.remove("d-none"), document.getElementById("air_raid_enemies").classList.add("d-none"), b = document.getElementById("battle_count_content"), b.classList.add("d-flex"), b.classList.remove("d-none"));
  usedPlane = [];
  updateLandBaseInfo(a.landBaseData);
  updateFriendFleetInfo(a.friendFleetData);
  updateEnemyFleetInfo(a.battleData);
  var d = encodePreset();
  0 !== undoHisotry.index && undoHisotry.histories.splice(0, undoHisotry.index);
  undoHisotry.histories.unshift(d);
  undoHisotry.histories = undoHisotry.histories.splice(0, 20);
  document.getElementById("btn_undo").classList.remove("disabled");
  document.getElementById("btn_redo").classList.add("disabled");
  undoHisotry.index = 0;
  if (document.getElementById("auto_save").checked && (saveLocalStorage("autoSaveData", d), setting.autoSave = !0, saveLocalStorage("setting", setting), document.getElementById("backup_enabled").checked && !document.getElementById("suspend_backup").checked)) {
    (backUpPresets = loadLocalStorage("backUpPresets")) || (backUpPresets = []);
    b = new Date;
    a = [b.getFullYear().toString(), ("0" + (b.getMonth() + 1)).slice(-2), ("0" + b.getDate()).slice(-2)];
    b = [("0" + b.getHours()).slice(-2), ("0" + b.getMinutes()).slice(-2), ("0" + b.getSeconds()).slice(-2)];
    a = [0, "backup-" + a.join("") + b.join(""), d, a.join("/") + " " + b.join(":") + "�̕Ґ�"];
    backUpPresets = backUpPresets.filter(function (a) {
      return a[2] !== d
    });
    backUpPresets.unshift(a);
    backUpPresets = backUpPresets.splice(0, setting.backUpCount);
    for (a = 0; a < backUpPresets.length; a++) backUpPresets[a][0] = -(a + 1);
    saveLocalStorage("backUpPresets", backUpPresets)
  }
  setting.emptySlotInvisible = document.getElementById("empty_slot_invisible").checked;
  saveLocalStorage("setting", setting);
  chartData = {
    own: [],
    enemy: [],
    rate: [],
    slots: [],
    enSlots: []
  };
  setPreCalculateTable()
}

function updateLandBaseInfo(a, b) {
  b = void 0 === b ? !0 : b;
  for (var c = 0, d = 0, e = 0, f = "", g, h = castInt(document.getElementById("landBase_target").value), k = document.getElementsByClassName("lb_tab"), m = 0; m < k.length; m++) {
    var l = k[m],
      n = m + 1,
      u = {
        baseNo: n,
        planes: [],
        ap: 0,
        mode: -1
      };
    g = "��" + n + "��n�q����F";
    for (var p = l.getElementsByClassName("lb_plane"), q = 0; q < p.length; q++) {
      var r = q + 1;
      if (4 <= q) break;
      var t = createLBPlaneObject(p[q], q);
      u.planes.push(t);
      u.ap += t.ap;
      if (b) {
        r = document.getElementsByClassName("lb_info_lb_" + n + " slot" + r)[0];
        var w = r.getElementsByClassName("info_plane")[0],
          y = (t.abbr ? t.abbr : t.name) + (0 !== t.remodel ? "��" + t.remodel : "");
        w.classList = "info_plane " + getPlaneCss(t.type).replace("css", "shoot_table");
        w.textContent = y ? y + " " + getProfString(t.level) : "-";
        w = r.getElementsByClassName("info_slot")[0];
        var v = castInt(w.textContent);
        drawChangeValue(w, v, t.slot);
        y || (w.textContent = "");
        w = r.getElementsByClassName("info_ap")[0];
        v = castInt(w.textContent);
        drawChangeValue(w, v, t.ap);
        y || (w.textContent = "");
        c += 0 === t.id ? 0 : Math.ceil(t.slot * (101 === t.type ? 1.5 : 1));
        d += 0 === t.id ? 0 : 101 === t.type ? Math.floor(.7 * t.slot) : Math.ceil(.6 * t.slot);
        e += t.cost * (RECONNAISSANCES.includes(t.type) ? 4 : 18);
        g += " " + (y ? y + " " + getProfString(t.level) : "") + ","
      }
    }
    g += "\n";
    q = !0;
    t = $jscomp.makeIterator(u.planes);
    for (p = t.next(); !p.done; p = t.next()) 0 < p.value.id && (q = !1);
    if (q)
      for (u.mode = -1, l.getElementsByClassName("ohuda_select")[0].value = "-1", p = $jscomp.makeIterator(l.getElementsByClassName("ohuda_select")[0].getElementsByTagName("option")), q = p.next(); !q.done; q = p.next()) q = q.value, -1 !== castInt(q.value, -1) && (q.disabled = !0);
    else
      for (p = $jscomp.makeIterator(l.getElementsByClassName("ohuda_select")[0].getElementsByTagName("option")), q = p.next(); !q.done; q = p.next()) q.value.disabled = !1;
    u.mode = castInt(l.getElementsByClassName("ohuda_select")[0].value);
    updateLBAirPower(u);
    a.push(u);
    if (b) {
      t = l.getElementsByClassName("resource")[0];
      p = t.getElementsByClassName("bauxite")[0];
      q = t.getElementsByClassName("fuel")[0];
      t = t.getElementsByClassName("ammo")[0];
      1 > u.mode && (d = c = 0);
      drawChangeValue(q, castInt(q.textContent), c, !0);
      drawChangeValue(t, castInt(t.textContent), d, !0);
      drawChangeValue(p, castInt(p.textContent), e, !0);
      e = d = c = 0;
      n = document.getElementsByClassName("lb_info_lb_" + n);
      q = n[0].getElementsByClassName("info_sumAp")[0];
      drawChangeValue(q, castInt(q.textContent), u.ap);
      q = l.getElementsByClassName("ap")[0];
      drawChangeValue(q, castInt(q.textContent), u.ap);
      p = getRange(u);
      q = n[0].getElementsByClassName("info_range")[0];
      drawChangeValue(q, castInt(q.textContent), p);
      q = l.getElementsByClassName("range")[0];
      drawChangeValue(q, castInt(q.textContent), p);
      0 < u.mode && (l = document.getElementById("battle_container").getElementsByClassName("enemy_range"), l.length >= h - 1 && castInt(l[h - 1].textContent) > p && (f += (f.length ? "," : "") + (m + 1)));
      n = $jscomp.makeIterator(n);
      for (l = n.next(); !l.done; l = n.next()) l = l.value, -1 !== u.mode ? l.classList.remove("d-none") : l.classList.add("d-none"); - 1 !== u.mode && u.planes.length && (document.getElementById("input_summary").value += g.trim() + "\n")
    }
  }
  if (b) {
    c = 0;
    d = document.getElementById("lb_info_table").getElementsByTagName("tbody")[0].getElementsByClassName("lb_info_tr");
    d = $jscomp.makeIterator(d);
    for (e = d.next(); !e.done; e = d.next()) e.value.classList.contains("d-none") || c++;
    document.getElementById("lb_info").classList.remove("col-lg-8", "col-xl-7");
    document.getElementById("lb_info").classList.add("col-lg-6");
    if (0 < c) {
      $("#lb_info_table tbody").find(".info_defAp").remove();
      d = $jscomp.makeIterator(document.getElementById("lb_info_table").getElementsByTagName("tbody")[0].getElementsByClassName("info_defAp"));
      for (e = d.next(); !e.done; e = d.next()) e.value.remove();
      if (isDefMode) {
        e = d = 0;
        g = $jscomp.makeIterator(a);
        for (h = g.next(); !h.done; h = g.next())
          if (h = h.value, -1 !== h.mode)
            for (d += h.ap, h = $jscomp.makeIterator(h.planes), p = h.next(); !p.done; p = h.next()) ROCKETS.includes(p.value.id) && e++;
        g = (0 === e ? .5 : 1 === e ? .8 : 2 === e ? 1.1 : 1.2) * d;
        document.getElementById("lb_info").classList.add("col-lg-8", "col-xl-7");
        document.getElementById("lb_info").classList.remove("col-lg-6");
        h = document.getElementById("lb_info_table");
        k = $jscomp.makeIterator(h.getElementsByClassName("info_range"));
        for (e = k.next(); !e.done; e = k.next()) e.value.classList.add("d-none");
        k = $jscomp.makeIterator(h.getElementsByClassName("info_defAp"));
        for (e = k.next(); !e.done; e = k.next()) e.value.classList.remove("d-none");
        e = $jscomp.makeIterator(h.getElementsByClassName("lb_info_tr"));
        for (l = e.next(); !l.done; l = e.next())
          if (h = l.value, !h.classList.contains("d-none")) {
            e = document.createElement("td");
            e.className = "info_defAp";
            e.rowSpan = c;
            e.textContent = d;
            h.appendChild(e);
            e = document.createElement("td");
            e.className = "info_defAp info_defApEx";
            e.rowSpan = c;
            e.textContent = Math.floor(g);
            h.appendChild(e);
            break
          }
      } else {
        c = document.getElementById("lb_info_table");
        d = $jscomp.makeIterator(c.getElementsByClassName("info_range"));
        for (e = d.next(); !e.done; e = d.next()) e.value.classList.remove("d-none");
        c = $jscomp.makeIterator(c.getElementsByClassName("info_defAp"));
        for (e = c.next(); !e.done; e = c.next()) e.value.classList.add("d-none")
      }
      document.getElementById("ng_range").textContent = f;
      document.getElementById("lb_info_table").getElementsByClassName("info_warning")[0].classList.add("d-none");
      f.length ? document.getElementById("lb_range_warning").classList.remove("d-none") : document.getElementById("lb_range_warning").classList.add("d-none");
      document.getElementById("input_summary").value += "\n"
    } else document.getElementById("lb_info_table").getElementsByClassName("info_warning")[0].classList.remove("d-none"), document.getElementById("lb_range_warning").classList.add("d-none")
  }
}

function createLBPlaneObject(a) {
  var b = castInt(a.dataset.planeid),
    c = castInt(a.dataset.type),
    d = getPlanes(c).find(function (a) {
      return a.id === b
    });
  c = a.getElementsByClassName("slot")[0];
  var e = c.textContent,
    f = castInt(e);
  0 === e.length ? f = 0 : 18 < f ? (f = 18, c.textContent = f) : 0 > f && (f = 0, c.textContent = "0");
  a = {
    id: 0,
    name: "",
    abbr: "",
    type: 0,
    antiAir: 0,
    antiBomber: 0,
    interception: 0,
    scout: 0,
    ap: 0,
    radius: 999,
    cost: 0,
    slot: f,
    remodel: castInt(a.getElementsByClassName("remodel_value")[0].textContent),
    level: castInt(a.getElementsByClassName("prof_select")[0].dataset.prof),
    avoid: 0,
    canAttack: !1,
    canBattle: !1
  };
  d && (a.id = d.id, a.name = d.name, a.abbr = d.abbr, a.type = d.type, RECONNAISSANCES.includes(a.type) && 4 < a.slot && (c.textContent = 4, a.slot = 4), a.antiAir = d.antiAir, a.antiBomber = d.antiBomber, a.interception = d.interception, a.scout = d.scout, a.radius = d.radius, a.cost = d.cost, a.ap = getAirPower_lb(a), a.avoid = d.avoid, a.canAttack = ATTACKERS.includes(d.type), (c = usedPlane.find(function (a) {
    return a.id === d.id
  })) ? c.num[a.remodel]++ : (c = {
    id: d.id,
    num: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  }, c.num[a.remodel]++, usedPlane.push(c)));
  return a
}

function getAirPower_lb(a) {
  if (0 === a.id) return 0;
  var b = a.type,
    c = a.antiAir,
    d = a.antiBomber,
    e = a.interception,
    f = a.remodel,
    g = a.level;
  a = a.slot;
  if ([1, -1, 7, 102, 103].includes(b)) switch (c = isDefMode ? (.2 * f + c + e + 2 * d) * Math.sqrt(a) : (.2 * f + c + 1.5 * e) * Math.sqrt(a), g) {
  case 2:
    c += 2;
    break;
  case 3:
    c += 5;
    break;
  case 4:
    c += 9;
    break;
  case 5:
    c += 14;
    break;
  case 6:
    c += 14;
    break;
  case 7:
    c += 22
  } else if ([6].includes(b)) switch (c = 1 * c * Math.sqrt(a), g) {
  case 2:
    c += 1;
    break;
  case 3:
    c += 1;
    break;
  case 4:
    c += 1;
    break;
  case 5:
    c += 3;
    break;
  case 6:
    c += 3;
    break;
  case 7:
    c += 6
  } else c = [3].includes(b) && 0 < c ? 1 * (.25 * f + c) * Math.sqrt(a) : [101].includes(b) ? 1 * (.5 * Math.sqrt(f) + c) * Math.sqrt(a) : 1 * c * Math.sqrt(a);
  if (0 < a) switch (g) {
  case 1:
    c += Math.sqrt(1);
    break;
  case 2:
    c += Math.sqrt(2.5);
    break;
  case 3:
    c += Math.sqrt(4);
    break;
  case 4:
    c += Math.sqrt(5.5);
    break;
  case 5:
    c += Math.sqrt(7);
    break;
  case 6:
    c += Math.sqrt(8.5);
    break;
  case 7:
    c += Math.sqrt((initialProf120Plane.includes(Math.abs(b)) ? 120 : 100) / 10)
  }
  return c = 0 < a ? Math.floor(c) : 0
}

function getReconnaissancesAdjust(a, b) {
  b = void 0 === b ? !1 : b;
  if (!b && 104 === a.type) return 9 === a.scout ? 1.18 : 8 === a.scout ? 1.15 : 1;
  if (b) {
    if (104 === a.type) return 9 === a.scout ? 1.24 : 1.18;
    if (4 === a.type) return 8 < a.scout ? 1.3 : 1.2;
    if ([5, 8].includes(a.type)) return 8 < a.scout ? 1.16 : 8 === a.scout ? 1.13 : 1.1
  }
  return 1
}

function updateLBAirPower(a) {
  for (var b = a.ap, c = [a.ap], d = a.ap, e = $jscomp.makeIterator(a.planes), f = e.next(); !f.done; f = e.next()) c.push(b * getReconnaissancesAdjust(f.value, isDefMode));
  b = $jscomp.makeIterator(c);
  for (c = b.next(); !c.done; c = b.next()) c = c.value, d = d < c ? c : d;
  a.ap = Math.floor(d)
}

function getRange(a) {
  for (var b = 999, c = 1, d = $jscomp.makeIterator(a.planes), e = d.next(); !e.done; e = d.next()) e = e.value, b = e.radius < b ? e.radius : b;
  a = $jscomp.makeIterator(a.planes);
  for (e = a.next(); !e.done; e = a.next()) d = e.value, [4, 5, 8, 104].includes(d.type) && (c = c < d.radius ? d.radius : c);
  return 999 > c && c > b ? Math.round(b + Math.min(Math.sqrt(c - b), 3)) : 999 === b ? 0 : b
}

function updateAp(a) {
  return 0 !== a.id && a.canBattle && 0 !== a.slot ? 0 >= a.slot ? a.slot = 0 : Math.floor(a.antiAir * Math.sqrt(a.slot) + a.bonusAp) : 0
}

function getBonusAA(a, b) {
  if (0 === a.id) return 0;
  var c = a.type,
    d = a.remodel;
  return FIGHTERS.includes(Math.abs(c)) ? .2 * d + b : 3 === c && 0 < b ? .25 * d + b : 101 === c ? .5 * Math.sqrt(d) + b : b
}

function getBonusAp(a) {
  if (0 === a.id || 0 === a.slot) return 0;
  var b = a.type;
  a = a.level;
  var c = 0;
  if ([1, -1, 7].includes(b)) switch (a) {
  case 2:
    c += 2;
    break;
  case 3:
    c += 5;
    break;
  case 4:
    c += 9;
    break;
  case 5:
    c += 14;
    break;
  case 6:
    c += 14;
    break;
  case 7:
    c += 22
  } else if ([6].includes(b)) switch (a) {
  case 2:
    c += 1;
    break;
  case 3:
    c += 1;
    break;
  case 4:
    c += 1;
    break;
  case 5:
    c += 3;
    break;
  case 6:
    c += 3;
    break;
  case 7:
    c += 6
  }
  switch (a) {
  case 1:
    c += Math.sqrt(1);
    break;
  case 2:
    c += Math.sqrt(2.5);
    break;
  case 3:
    c += Math.sqrt(4);
    break;
  case 4:
    c += Math.sqrt(5.5);
    break;
  case 5:
    c += Math.sqrt(7);
    break;
  case 6:
    c += Math.sqrt(8.5);
    break;
  case 7:
    c += Math.sqrt((initialProf120Plane.includes(Math.abs(b)) ? 120 : 100) / 10)
  }
  return c
}

function updateFriendFleetInfo(a, b) {
  b = void 0 === b ? !0 : b;
  var c = [],
    d = 0,
    e = [0, 0],
    f = "",
    g = null,
    h = $("#union_fleet").prop("checked");
  g = h ? document.getElementsByClassName("ship_tab") : $(".friendFleet_tab.show.active")[0].getElementsByClassName("ship_tab");
  setting.isUnion = h;
  saveLocalStorage("setting", setting);
  for (var k = {}, m = 0; m < g.length; k = {
      $jscomp$loop$prop$shipId$335: k.$jscomp$loop$prop$shipId$335
    }, m++) {
    f = g[m];
    var l = m + 1;
    if (!f.classList.contains("d-none") && !f.getElementsByClassName("ship_disabled")[0].checked) {
      for (var n = c.length = 0, u = $jscomp.makeIterator(f.getElementsByClassName("ship_plane")), p = u.next(); !p.done; p = u.next()) p = p.value, p.classList.contains("ui-draggable") || (p = createFleetPlaneObject(p, l, n++), c.push(p));
      p = !1;
      u = n = 0;
      for (var q = $jscomp.makeIterator(c), r = q.next(); !r.done; r = q.next()) r = r.value, n += r.ap, !p && 0 < r.id && (p = !0), 0 < r.id && 0 < r.slot && u++;
      p && a.push(c.concat());
      if (b)
        if (p = f.getElementsByClassName("ap")[0], q = castInt(p.textContent), drawChangeValue(p, q, n), e[6 >= l ? 0 : 1] += n, d += n, 0 < u) {
          k.$jscomp$loop$prop$shipId$335 = castInt(f.dataset.shipid);
          q = k.$jscomp$loop$prop$shipId$335 ? SHIP_DATA.find(function (a) {
            return function (b) {
              return b.id === a.$jscomp$loop$prop$shipId$335
            }
          }(k)) : null;
          r = document.createDocumentFragment();
          p = document.createDocumentFragment();
          var t = !0,
            w = document.getElementById("empty_slot_invisible").checked;
          q && !w && (u = q.slot.length);
          f = (q ? q.name : "���w��") + "�F";
          for (var y = 0; y < c.length; y++) {
            var v = c[y],
              x = v.name;
            if (q || 0 !== v.id && 0 !== v.slot) {
              if (q && y === q.slot.length) break;
              f += " " + x + " " + getProfString(v.level) + ",";
              if (!q || !w || 0 !== v.id && 0 !== v.slot) {
                var B = getPlaneCss(v.type).replace("css", "shoot_table"),
                  z = document.createElement("tr");
                z.className = "slot" + y + " shipNo" + l;
                z.dataset.shipid = q ? q.id : 0;
                z.dataset.shipindex = a.length - 1;
                z.dataset.slotindex = y;
                z.dataset.css = B + "_hover";
                if (t) {
                  var A = document.createElement("td");
                  A.rowSpan = u;
                  A.className = "td_name align-middle";
                  A.textContent = q ? q.name : "���w��";
                  z.appendChild(A)
                }
                A = document.createElement("td");
                A.className = "pl-1 td_plane_name align-middle " + B;
                A.textContent = x;
                z.appendChild(A);
                for (A = 1; 10 >= A; A++) {
                  var C = document.createElement("td");
                  C.className = "td_battle battle" + A + " align-middle";
                  z.appendChild(C)
                }
                A = document.createElement("td");
                A.className = "td_battle battle_end align-middle";
                z.appendChild(A);
                A = document.createElement("td");
                A.className = "td_battle battle_death align-middle";
                z.appendChild(A);
                r.appendChild(z);
                z = document.createElement("tr");
                z.className = "ship_info_tr slot" + (y + 1);
                t && (A = document.createElement("td"), A.rowSpan = u, A.className = "info_name", A.textContent = q ? q.name : "���w��", z.appendChild(A));
                A = document.createElement("td");
                A.className = "info_plane " + B;
                B = (v.abbr ? v.abbr : v.name) + (0 !== v.remodel ? "��" + v.remodel : "");
                A.textContent = (B ? B : x) + " " + getProfString(v.level);
                z.appendChild(A);
                x = document.createElement("td");
                x.className = "info_slot";
                x.textContent = v.slot;
                z.appendChild(x);
                x = document.createElement("td");
                x.className = "info_ap";
                x.textContent = v.ap;
                z.appendChild(x);
                t && (t = document.createElement("td"), t.rowSpan = u, t.className = "info_sumAp", t.textContent = n, z.appendChild(t));
                p.appendChild(z);
                t = !1
              }
            }
          }
          document.getElementById("shoot_down_table_tbody").appendChild(r);
          l = document.getElementById("ship_info_table").getElementsByTagName("tbody")[0];
          l.appendChild(p);
          l = l.getElementsByTagName("tr");
          if (0 < l.length)
            for (l = $jscomp.makeIterator(l[l.length - 1].getElementsByTagName("td")), n = l.next(); !n.done; n = l.next()) n.value.classList.add("last_slot");
          document.getElementById("input_summary").value += f.slice(0, -1) + "\n"
        } else if (0 === document.getElementById("shoot_down_table_tbody").getElementsByTagName("tr").length) {
        l = document.createElement("tr");
        l.className = "slot0 shipNo0";
        n = document.createElement("td");
        n.className = "td_name align-middle";
        n.textContent = "���I��";
        l.appendChild(n);
        n = document.createElement("td");
        n.className = "td_plane_name text-nowrap align-middle text-center";
        n.textContent = "-";
        l.appendChild(n);
        for (n = 1; 10 >= n; n++) u = document.createElement("td"), u.className = "td_battle battle" + n + " align-middle", l.appendChild(u);
        n = document.createElement("td");
        n.className = "td_battle battle_end align-middle";
        n.textContent = d;
        l.appendChild(n);
        document.getElementById("shoot_down_table_tbody").appendChild(l)
      }
    }
  }
  if (b) {
    if (h)
      for (c = 0; c < e.length; c++) document.getElementsByClassName("fleet_ap")[c].textContent = e[c];
    else $(".friendFleet_tab.show.active")[0].getElementsByClassName("fleet_ap")[0].textContent = e[0];
    e = document.getElementById("ship_info_table").getElementsByTagName("tbody")[0];
    (c = e.getElementsByTagName("tr").length) ? (g = document.createElement("td"), g.className = "info_fleetAp", g.rowSpan = c, g.textContent = d, e.getElementsByClassName("ship_info_tr")[0].appendChild(g), $("#ship_info_table").find(".info_warning").addClass("d-none"), document.getElementById("ship_info_table").getElementsByClassName("info_warning")[0].classList.add("d-none")) : document.getElementById("ship_info_table").getElementsByClassName("info_warning")[0].classList.remove("d-none");
    d = $("#input_summary");
    e = (d.val() + "\n").match(/\n/g).length;
    d.height(castInt(d.css("lineHeight")) * e + 2);
    d.val(d.val().trim())
  }
}

function createFleetPlaneObject(a, b, c) {
  var d = castInt(a.dataset.planeid),
    e = castInt(a.dataset.type),
    f = getPlanes(e).find(function (a) {
      return a.id === d
    });
  e = a.getElementsByClassName("slot")[0].textContent;
  var g = castInt(e);
  0 === e.length ? g = 0 : g > MAX_SLOT ? (g = MAX_SLOT, a.getElementsByClassName("slot")[0].textContent = g) : 0 > g && (g = 0, a.getElementsByClassName("slot")[0].textContent = g);
  a = {
    fleetNo: b,
    slotNo: c,
    id: 0,
    name: "-",
    type: 0,
    antiAir: 0,
    ap: 0,
    bonusAp: 0,
    canBattle: !1,
    canAttack: !1,
    remodel: castInt(a.getElementsByClassName("remodel_value")[0].textContent),
    level: castInt(a.getElementsByClassName("prof_select")[0].dataset.prof),
    slot: g,
    origSlot: g,
    origAp: 0,
    avoid: 0
  };
  f && (a.id = f.id, a.name = f.abbr ? f.abbr : f.name, a.type = f.type, a.canBattle = !RECONNAISSANCES.includes(f.type), a.canAttack = ATTACKERS.includes(f.type), a.antiAir = getBonusAA(a, f.antiAir), a.bonusAp = getBonusAp(a), a.ap = updateAp(a), a.origAp = a.ap, a.avoid = f.avoid, (b = usedPlane.find(function (a) {
    return a.id === f.id
  })) ? b.num[a.remodel]++ : (b = {
    id: f.id,
    num: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  }, b.num[a.remodel]++, usedPlane.push(b)));
  return a
}

function getFriendFleetAP(a, b) {
  for (var c = 0, d = a.length, e = 0; e < d; e++) {
    var f = a[e],
      g = f.length;
    if (!(6 < f[0].fleetNo && b !== CELL_TYPE.grand))
      for (var h = 0; h < g; h++) c += f[h].ap
  }
  return c
}

function updateEnemyFleetInfo(a, b) {
  b = void 0 === b ? !0 : b;
  var c = null,
    d = 0,
    e = 0,
    f = 0,
    g = "999-1",
    h = "",
    k = !1,
    m = !0,
    l = {},
    n = $jscomp.makeIterator(document.getElementsByClassName("battle_content"));
  for (d = n.next(); !d.done; l = {
      $jscomp$loop$prop$formationId$337: l.$jscomp$loop$prop$formationId$337
    }, d = n.next()) {
    var u = d.value;
    isDefMode && (u = document.getElementById("air_raid_enemies"));
    if (isDefMode && 0 < a.length) break;
    if (!u.classList.contains("d-none")) {
      c = {
        enemies: [],
        cellType: 0,
        stage2: [],
        isAllSubmarine: !1
      };
      f = e = d = 0;
      m = !0;
      c.cellType = castInt(u.getElementsByClassName("cell_type")[0].value);
      for (var p = $jscomp.makeIterator(u.getElementsByClassName("enemy_content")), q = p.next(); !q.done; q = p.next()) {
        var r = q.value,
          t = castInt(r.dataset.enemyid);
        q = createEnemyObject(t);
        if (!r.classList.contains("d-none")) {
          if (c.cellType !== CELL_TYPE.grand && 6 === c.enemies.length) break; - 1 === t && (r = r.getElementsByClassName("enemy_ap")[0], r = castInt(r.textContent), q.ap = r, q.lbAp = r, q.origAp = r, q.origLbAp = r);
          m && !q.type.includes(18) && (m = !1);
          c.enemies.push(q);
          d += q.ap;
          e += q.lbAp;
          f += q.aabo
        }
      }
      c.enemies.length && (c.isAllSubmarine = m);
      l.$jscomp$loop$prop$formationId$337 = castInt(u.getElementsByClassName("formation")[0].value);
      m = (m = FORMATION.find(function (a) {
        return function (b) {
          return b.id === a.$jscomp$loop$prop$formationId$337
        }
      }(l))) ? m.correction : 1;
      c.stage2 = createStage2Table(c.enemies, c.cellType, l.$jscomp$loop$prop$formationId$337);
      a.push(c);
      b && (c = u.getElementsByClassName("enemy_sum_ap")[0], drawChangeValue(c, c.textContent, d, !0), c = u.getElementsByClassName("enemy_sum_lbap")[0], drawChangeValue(c, c.textContent, e, !0), c = u.getElementsByClassName("enemy_range")[0], castInt(c.textContent) ? c.parentNode.classList.remove("d-none") : c.parentNode.classList.add("d-none"), c = u.getElementsByClassName("fleet_AA")[0], drawChangeValue(c, c.textContent, 2 * Math.floor(m * f), !0), d = u.dataset.celldata ? u.dataset.celldata : g.replace("-", "") + "_�蓮", e = d.split("_")[0].slice(0, -1), e = 1E3 < e ? "E-" : e + "-", e += d.split("_")[0].slice(-1), d = d.split("_")[1], "999-1" === g ? g = e : k || g === e || (k = !0), h += h ? " �� " + d : d)
    }
  }
  if (b) {
    isDefMode || (g.includes("999-") ? document.getElementById("route").value = "�C�斢�w��" : document.getElementById("route").value = k ? "�ʊC��̃Z�������݂��Ă��܂��B" : g + "�F" + h);
    h = a[isDefMode ? 0 : displayBattle - 1].enemies.filter(function (a) {
      return 0 < a.slots.length
    });
    g = document.createDocumentFragment();
    k = 0;
    l = {};
    for (n = 0; n < h.length; l = {
        $jscomp$loop$prop$enemy$339: l.$jscomp$loop$prop$enemy$339
      }, n++)
      if (l.$jscomp$loop$prop$enemy$339 = h[n], !l.$jscomp$loop$prop$enemy$339.isSpR && l.$jscomp$loop$prop$enemy$339.slots.length) {
        d = "";
        e = document.createDocumentFragment();
        for (f = {
            $jscomp$loop$prop$j$341: 0
          }; f.$jscomp$loop$prop$j$341 < l.$jscomp$loop$prop$enemy$339.slots.length; f = {
            $jscomp$loop$prop$j$341: f.$jscomp$loop$prop$j$341
          }, f.$jscomp$loop$prop$j$341++)
          if (p = ENEMY_PLANE_DATA.find(function (a, b) {
              return function (c) {
                return c.id === a.$jscomp$loop$prop$enemy$339.eqp[b.$jscomp$loop$prop$j$341]
              }
            }(l, f))) m = l.$jscomp$loop$prop$enemy$339.slots[f.$jscomp$loop$prop$j$341], q = getPlaneCss(p.type).replace("css", "shoot_table"), u = f.$jscomp$loop$prop$j$341 === l.$jscomp$loop$prop$enemy$339.slots.length - 1 ? " last_slot" : "", c = document.createElement("tr"), c.className = "enemy_no_" + k + " slot_" + f.$jscomp$loop$prop$j$341, c.dataset.rowindex = k, c.dataset.slotindex = f.$jscomp$loop$prop$j$341, c.dataset.css = q + "_hover", d += '<img src="./img/plane/' + p.id + '.png" class="img-size-36" title="' + p.name + '">', r = document.createElement("td"), r.className = "pl-1 td_plane_name align-middle " + q + u, r.textContent = p.name, c.appendChild(r), p = document.createElement("td"),
            p.className = "td_init_slot align-middle" + u, p.textContent = m, c.appendChild(p), p = document.createElement("td"), p.className = "td_avg_slot align-middle" + u, p.textContent = m, c.appendChild(p), p = document.createElement("td"), p.className = "td_max_slot align-middle" + u, p.textContent = m, c.appendChild(p), p = document.createElement("td"), p.className = "td_min_slot align-middle" + u, p.textContent = m, c.appendChild(p), isDefMode ? document.getElementsByClassName("td_detail_slot")[0].classList.add("d-none") : (m = document.createElement("td"), m.className = "td_detail_slot align-middle" + u, m.innerHTML = '<i class="fas fa-file-text"></i>', c.appendChild(m), document.getElementsByClassName("td_detail_slot")[0].classList.remove("d-none")), e.appendChild(c);
        f = document.createElement("td");
        f.rowSpan = l.$jscomp$loop$prop$enemy$339.slots.length;
        f.className = "td_name align-middle last_slot";
        f.innerHTML = "<div>" + drawEnemyGradeColor(l.$jscomp$loop$prop$enemy$339.name) + "</div><div>" + d + "</div>";
        e.firstChild.insertBefore(f, e.firstChild.firstChild);
        g.appendChild(e);
        k++
      }
    g.childNodes.length || (h = document.createElement("tr"), k = document.createElement("td"), k.colSpan = 6, k.className = "font_size_11", k.textContent = "�퓬�@�A�U���@�𓋍ڂ����G�͂̂��Ȃ��퓬�ł��B", h.appendChild(k), g.appendChild(h));
    document.getElementById("enemy_shoot_down_tbody").appendChild(g)
  }
}

function createStage2Table(a, b, c) {
  var d = [
      [
        [],
        []
      ],
      [
        [],
        []
      ],
      [
        [],
        []
      ],
      [
        [],
        []
      ],
      [
        [],
        []
      ],
      [
        [],
        []
      ]
    ],
    e = a.length,
    f = [],
    g = 0;
  AVOID_TYPE[5].adj[0] = castFloat($("#free_anti_air_weight").val());
  AVOID_TYPE[5].adj[1] = castFloat($("#free_anti_air_bornus").val());
  for (var h = 0; h < e; h++) {
    var k = a[h];
    if (0 !== k.id) {
      f.push(k.aaw);
      for (var m = 0; m < AVOID_TYPE.length; m++) {
        var l = Math.floor(k.aaw * AVOID_TYPE[m].adj[0]);
        b === CELL_TYPE.grand ? 6 > h ? d[m][0].push(.8 * l / 400) : d[m][0].push(.48 * l / 400) : d[m][0].push(l / 400)
      }
      g += k.aabo
    }
  }
  h = FORMATION.find(function (a) {
    return a.id === c
  });
  g = Math.floor((h ? h.correction : 1) * g);
  for (h = 0; h < e; h++)
    if (0 !== a[h].id)
      for (k = f.shift(), m = 0; m < AVOID_TYPE.length; m++) {
        l = Math.floor(k * AVOID_TYPE[m].adj[0]);
        var n = 2 * Math.floor(g * AVOID_TYPE[m].adj[1]);
        b === CELL_TYPE.grand ? 6 > h ? d[m][1].push(Math.floor(.8 * (l + n) * .09375)) : d[m][1].push(Math.floor(.045 * (l + n))) : d[m][1].push(Math.floor(.09375 * (l + n)))
      }
  return d
}

function createEnemyObject(a) {
  var b = ENEMY_DATA.find(function (b) {
      return b.id === a
    }),
    c = {
      id: 0,
      type: [0],
      name: "",
      slots: [],
      antiAir: [],
      eqp: [],
      orgSlots: [],
      isSpR: !1,
      ap: 0,
      lbAp: 0,
      origAp: 0,
      origLbAp: 0,
      aaw: 0,
      aabo: 0
    };
  if (0 !== a && b) {
    for (var d = {}, e = $jscomp.makeIterator(b.eqp), f = e.next(); !f.done; d = {
        $jscomp$loop$prop$id$189$343: d.$jscomp$loop$prop$id$189$343
      }, f = e.next())
      if (d.$jscomp$loop$prop$id$189$343 = f.value, f = ENEMY_PLANE_DATA.find(function (a) {
          return function (b) {
            return b.id === a.$jscomp$loop$prop$id$189$343
          }
        }(d))) c.antiAir.push(f.antiAir),
        5 !== f.type || c.isSpR || (c.isSpR = !0);
    c.id = b.id;
    c.type = b.type;
    c.name = b.name;
    c.eqp = b.eqp.concat();
    c.slots = b.slot.concat();
    c.orgSlots = b.slot.concat();
    c.aaw = b.aaw;
    c.aabo = b.aabo;
    c.ap = 0;
    c.lbAp = 0;
    updateEnemyAp(c);
    c.origAp = c.ap;
    c.origLbAp = c.lbAp
  }
  return c
}

function getEnemyFleetLBAP(a) {
  for (var b = 0, c = a.length, d = 0; d < c; d++) b += a[d].lbAp;
  return b
}

function getEnemyFleetAP(a) {
  for (var b = 0, c = a.length, d = 0; d < c; d++) b += a[d].ap;
  return b
}

function shootDownHalf(a, b) {
  for (var c = $jscomp.makeIterator(b), d = c.next(); !d.done; d = c.next()) {
    d = d.value;
    for (var e = 0; e < d.slots.length; e++) {
      var f = d.slots[e];
      d.slots[e] = f - Math.floor(getShootDownSlotHalf(a, f))
    }
    updateEnemyAp(d)
  }
}

function shootDownEnemy(a, b) {
  for (var c = b.length, d = 0; d < c; d++) {
    for (var e = b[d], f = e.slots.length, g = 0; g < f; g++) e.slots[g] -= getShootDownSlot(a, e.slots[g]);
    updateEnemyAp(e)
  }
}

function getShootDownSlot(a, b) {
  return SHOOT_DOWN_TABLE_ENEMY[b][a][Math.floor(Math.random() * SHOOT_DOWN_TABLE_ENEMY[b][a].length)]
}

function getShootDownSlotHalf(a, b) {
  return AIR_STATUS[a].rate / 2 * b / 10
}

function updateEnemyAp(a) {
  if (-1 !== a.id) {
    a.ap = 0;
    a.lbAp = 0;
    for (var b = a.antiAir.length, c = 0; c < b; c++) a.isSpR ? a.lbAp += Math.floor(a.antiAir[c] * Math.sqrt(Math.floor(a.slots[c]))) : a.ap += Math.floor(a.antiAir[c] * Math.sqrt(Math.floor(a.slots[c])));
    a.lbAp += a.ap
  }
}

function doJetPhaseHalf(a, b, c) {
  for (var d = b.stage2[0][0].length, e = 0; e < a.length; e++)
    for (var f = 0; f < a[e].length; f++) {
      var g = a[e][f];
      if (9 === g.type && ($("#shoot_down_table_tbody").find(".shipNo" + g.fleetNo + ".slot" + g.slotNo + " .battle" + (c + 1)).text(0 < g.id ? Math.round(g.slot) : ""), !(!d || b.cellType > CELL_TYPE.grand || b.isAllSubmarine))) {
        for (var h = 0, k = 0; 1E3 > k; k++) {
          var m = g.slot;
          m -= Math.floor(.6 * getShootDownSlotFF(0, Math.round(m)));
          var l = Math.floor(Math.random() * d);
          m -= Math.floor(b.stage2[g.avoid][0][l] * m) * Math.floor(2 * Math.random());
          m -= b.stage2[g.avoid][1][l] * Math.floor(2 * Math.random());
          h += 0 < m ? m : 0
        }
        g.slot = h / 1E3;
        g.ap = updateAp(g)
      }
    }
}

function doJetPhase(a, b) {
  var c = b.stage2[0][0].length;
  if (!(!c || b.cellType > CELL_TYPE.grand || b.isAllSubmarine))
    for (var d = 0; d < a.length; d++)
      for (var e = 0; e < a[d].length; e++) {
        var f = a[d][e];
        if (9 === f.type) {
          f.slot -= Math.floor(.6 * getShootDownSlotFF(0, Math.round(f.slot)));
          var g = Math.floor(Math.random() * c);
          f.slot -= Math.floor(b.stage2[f.avoid][0][g] * f.slot) * Math.floor(2 * Math.random());
          f.slot -= b.stage2[f.avoid][1][g] * Math.floor(2 * Math.random());
          f.ap = updateAp(f)
        }
      }
}

function shootDownHalfFriend(a, b, c, d) {
  var e = getFriendFleetAP(a, d.cellType);
  e = getAirStatusIndex(e, b);
  var f = d.stage2[0][0].length;
  a = $jscomp.makeIterator(a);
  for (var g = a.next(); !g.done; g = a.next()) {
    g = $jscomp.makeIterator(g.value);
    for (var h = g.next(); !h.done; h = g.next())
      if (h = h.value, 9 !== h.type && $("#shoot_down_table_tbody").find(".shipNo" + h.fleetNo + ".slot" + h.slotNo + " .battle" + (c + 1)).text(0 < h.id ? Math.round(h.slot) : ""), 0 !== h.slot && h.canBattle && !(6 < h.fleetNo && d.cellType !== CELL_TYPE.grand) && d.cellType !== CELL_TYPE.night) {
        5 === e && (e = 0);
        if (!f) return;
        for (var k = 0, m = 0; 1E3 > m; m++) {
          var l = h.slot,
            n = getShootDownSlotFF(e, Math.round(l));
          l -= Math.floor(9 === h.type ? .6 * n : n);
          h.canAttack && d.cellType <= CELL_TYPE.grand && (n = Math.floor(Math.random() * f), l -= Math.floor(d.stage2[h.avoid][0][n] * l) * Math.floor(2 * Math.random()), l -= d.stage2[h.avoid][1][n] * Math.floor(2 * Math.random()));
          k += 0 < l ? l : 0
        }
        h.slot = k / 1E3;
        h.ap = updateAp(h)
      }
  }
  $("#shoot_down_table").find(".eap.battle" + (c + 1)).text(b)
}

function shootDownFriend(a, b, c) {
  var d = b.length,
    e = c.stage2[0][0].length;
  if (e)
    for (var f = 0; f < d; f++)
      for (var g = b[f], h = g.length, k = 0; k < h; k++) {
        var m = g[k];
        if (!(0 >= m.slot || !m.canBattle || 6 < m.fleetNo && c.cellType < CELL_TYPE.normal)) {
          5 === a && (a = 0);
          var l = getShootDownSlotFF(a, m.slot);
          m.slot -= Math.floor(9 === m.type ? .6 * l : l);
          m.canAttack && c.cellType <= CELL_TYPE.grand && (l = Math.floor(Math.random() * e), m.slot -= Math.floor(c.stage2[m.avoid][0][l] * m.slot) * Math.floor(2 * Math.random()), m.slot -= c.stage2[m.avoid][1][l] * Math.floor(2 * Math.random()));
          m.ap = updateAp(m)
        }
      }
}

function getShootDownSlotFF(a, b) {
  var c = SHOOT_DOWN_TABLE[b][a];
  return c[Math.floor(Math.random() * c.length)]
}

function getLandBasePower(a, b, c) {
  var d = PLANE_DATA.find(function (b) {
    return b.id === a
  });
  if (!d) return 0;
  var e = Math.abs(d.type),
    f = 0,
    g = 0;
  switch (e) {
  case 2:
    f = .2 * c + d.torpedo;
    g = 1;
    break;
  case 3:
    f = 0 * c + d.bomber;
    g = 1;
    break;
  case 6:
    f = .2 * c + d.bomber;
    g = 1;
    break;
  case 9:
    f = 0 * c + d.bomber;
    g = .7071;
    break;
  case 101:
    f = .7 * c + d.torpedo, g = .8
  }
  b = Math.floor(g * (f * Math.sqrt(1.8 * b) + 25));
  return 101 === e ? 1.8 * b : 1 * b
}

function mainCalculate(a) {
  var b = a.landBaseData,
    c = a.friendFleetData;
  a = a.battleData;
  var d = isDefMode ? 0 : displayBattle - 1,
    e = castInt($("#landBase_target").val()) - 1;
  d = d < a.length ? d : a.length - 1;
  if (isDefMode) {
    for (d = c = 0; 3 > d; d++) - 1 !== b[d].mode && (c += b[d].ap);
    b = !1;
    a = $jscomp.makeIterator(a);
    for (d = a.next(); !d.done; d = a.next()) {
      d = d.value;
      e = $jscomp.makeIterator(d.enemies);
      for (var f = e.next(); !f.done; f = e.next())
        if (d.cellType === CELL_TYPE.highAirRaid) {
          c = castInt($(".info_defApEx").text());
          b = !0;
          break
        }
      if (b) break
    }
    chartData.own.push(c)
  } else {
    $("#shoot_down_table").find("td").removeClass("d-none");
    for (f = battleCount + 1; 10 >= f; f++) $("#shoot_down_table").find(".battle" + f).addClass("d-none");
    for (f = 0; f < battleCount; f++) {
      var g = a[f].enemies,
        h = a[f].cellType;
      f === e && calculateLandBasePhase(b, g, d === e);
      doJetPhaseHalf(c, a[f], f);
      f === d && (fap = getFriendFleetAP(c, h), eap = getEnemyFleetAP(g), chartData.own.push(fap), chartData.enemy.push(eap));
      shootDownHalfFriend(c, getEnemyFleetAP(g), f, a[f])
    }
  }
}

function calculateLandBasePhase(a, b, c) {
  for (var d = 0; 3 > d; d++) {
    var e = a[d].ap;
    if (0 < a[d].mode) {
      var f = getEnemyFleetLBAP(b);
      c && (chartData.own.push(e), chartData.enemy.push(f));
      shootDownHalf(getLBAirStatusIndex(e, f), b)
    } else c && chartData.own.push(0);
    2 === a[d].mode ? (f = getEnemyFleetLBAP(b), c && (chartData.own.push(e), chartData.enemy.push(f)), shootDownHalf(getLBAirStatusIndex(e, f), b)) : c && chartData.own.push(0)
  }
}

function rateCalculate(a) {
  var b = a.landBaseData,
    c = a.friendFleetData,
    d = a.battleData,
    e = castInt($("#calculate_count").val());
  $("#calculate_count").val(0 === e ? ++e : e);
  var f = isDefMode ? 0 : castInt($("#landBase_target").val()) - 1,
    g = c.concat(),
    h = g.length,
    k = d.concat();
  c = isDefMode ? 0 : displayBattle - 1;
  var m = [0, 0, 0, 0, 0, 0, 0],
    l = [0, 0, 0, 0, 0, 0],
    n = [],
    u = [],
    p = [];
  a = [];
  for (var q = [], r = [], t = [], w = isDefMode ? 1 : battleCount, y = chartData.own[0], v = $jscomp.makeIterator(k), x = v.next(); !x.done; x = v.next()) x = x.value, x.enemies = x.enemies.filter(function (a) {
    return 0 < a.slots.length
  });
  c = c < d.length ? c : d.length - 1;
  for (d = 0; 6 > d; d++) p.push([0, 0, 0, 0, 0, 0]);
  b = $jscomp.makeIterator(b);
  for (d = b.next(); !d.done; d = b.next()) d = d.value, n.push(d.ap), u.push(d.mode);
  for (b = 0; b < h; b++)
    for (d = 0; d < g[b].length; d++) q.push(Array(e));
  for (b = 0; b < w; b++) r.push(0);
  for (b = 0; b < k[c].enemies.length; b++)
    if (d = k[c].enemies[b], !d.isSpR)
      for (v = 0 === t.length ? 0 : t[t.length - 1][0] + 1, x = 0; x < d.slots.length; x++) t.push([v, x, 0, 0, 999, []]);
  b = $jscomp.makeIterator(g);
  for (d = b.next(); !d.done; d = b.next())
    for (d = $jscomp.makeIterator(d.value), v = d.next(); !v.done; v = d.next()) v = v.value, v.slot = v.origSlot, v.ap = v.origAp;
  for (b = 0; b < e; b++) {
    d = $jscomp.makeIterator(k[f].enemies);
    for (v = d.next(); !v.done; v = d.next()) v = v.value, v.slots = v.orgSlots.concat(), v.ap = v.origAp, v.lbAp = v.origLbAp;
    calculateLandBase(n, u, k[f].enemies, m, p);
    for (d = 0; d < w; d++) {
      doJetPhase(g, k[d]);
      v = k[d].enemies;
      x = k[d].cellType;
      var B = isDefMode ? y : getFriendFleetAP(g, x);
      x = getEnemyFleetAP(v);
      var z = getAirStatusIndex(B, x);
      d === c && l[z]++;
      r[d] += B;
      shootDownFriend(z, g, k[d]);
      if (d === c)
        for (shootDownEnemy(z, v), z = B = 0; z < v.length; z++) {
          var A = v[z];
          if (!A.isSpR) {
            for (var C = A.slots, F = 0; F < C.length; F++) {
              var D = C[F],
                E = t[B++];
              E[2] += D;
              E[3] < D && (E[3] = D);
              E[4] > D && (E[4] = D);
              E[5].push(x)
            }
            A.slots = A.orgSlots.concat();
            A.ap = A.origAp;
            A.lbAp = A.origLbAp
          }
        }
    }
    for (d = 0; d < h; d++)
      for (v = g[d], x = v.length, B = 0; B < x; B++) q[5 * d + B][b] = v[B].slot, v[B].slot = v[B].origSlot, v[B].ap = v[B].origAp
  }
  k = m.map(function (a) {
    return Math.round(a / e)
  });
  m = castInt($("#shoot_down_table").find(".fap.battle" + (f + 1)).text());
  n = castInt(k[6]);
  if (0 < m || 0 < n) $("#shoot_down_table").find(".eap.battle" + (f + 1)).text(n), $("#shoot_down_table").find(".cond.battle" + (f + 1)).text(AIR_STATUS[getAirStatusIndex(m, n)].abbr);
  f === c && (a = p.concat(), chartData.enemy = k);
  a.push(l);
  f = $jscomp.makeIterator(a);
  for (l = f.next(); !l.done; l = f.next())
    for (l = l.value, p = l.length, k = 0; k < p; k++) l[k] /= e;
  isDefMode && (chartData.enemy[0] = chartData.enemy[6], a[0] = a[6]);
  for (l = f = 0; l < h; l++)
    for (p = 0; p < g[l].length; p++) k = q[f++], m = {
      shipNo: g[l][p].fleetNo,
      slot: g[l][p].slotNo,
      max: getArrayMax(k),
      min: getArrayMin(k),
      avg: k.reduce(function (a, b) {
        return a + b
      }) / e,
      death: k.filter(function (a) {
        return 0 === a
      }).length,
      deathRate: 0
    }, m.deathRate = m.death / k.length, chartData.slots.push(m);
  for (g = 0; g < w; g++) h = Math.round(r[g] / e), q = castInt($("#shoot_down_table").find(".eap.battle" + (g + 1)).text()), q = getAirStatusIndex(h, q), $("#shoot_down_table").find(".fap.battle" + (g + 1)).text(h), $("#shoot_down_table").find(".cond.battle" + (g + 1)).text(AIR_STATUS[q].abbr).addClass("airStatus" + q);
  isDefMode || (chartData.own[chartData.own.length - 1] = Math.round(r[c] / e));
  chartData.rate = a.concat();
  chartData.enSlots = t.concat()
}

function calculateLandBase(a, b, c, d, e) {
  for (var f = 0; 3 > f; f++) {
    var g = a[f];
    if (0 < b[f]) {
      var h = 2 * f,
        k = getEnemyFleetLBAP(c);
      d[h] += k;
      k = getLBAirStatusIndex(g, k);
      e[h][k]++;
      shootDownEnemy(k, c)
    }
    2 === b[f] && (h = 2 * f + 1, k = getEnemyFleetLBAP(c), d[h] += k, g = getLBAirStatusIndex(g, k), e[h][g]++, shootDownEnemy(g, c))
  }
  d[6] += isDefMode ? getEnemyFleetLBAP(c) : getEnemyFleetAP(c)
}

function detailCalculate() {
  var a = castInt($("#detail_info").data("base_no")),
    b = castInt($("#detail_info").data("slot_no"));
  switch ($("#detail_info").data("mode")) {
  case "enemy_slot_detail":
    enemySlotDetailCalculate(a, b);
    break;
  case "fleet_slot_detail":
    fleetSlotDetailCalculate(a, b, castInt($("#detail_info").data("ship_id")));
    break;
  case "land_base_detail":
    landBaseDetailCalculate(a, b)
  }
}

function fleetSlotDetailCalculate(a, b, c) {
  c = void 0 === c ? 0 : c;
  setPreCalculateTable();
  var d = [],
    e = [],
    f = [];
  updateLandBaseInfo(d, !1);
  updateFriendFleetInfo(e, !1);
  updateEnemyFleetInfo(f, !1);
  var g = castInt($("#calculate_count").val()),
    h = isDefMode ? 0 : displayBattle - 1,
    k = isDefMode ? 0 : castInt($("#landBase_target").val()) - 1,
    m = [],
    l = e[a],
    n = PLANE_DATA.find(function (a) {
      return a.id === l[b].id
    });
  h = h < f.length ? h : f.length - 1;
  var u = 2 === Math.abs(n.type) ? [.8, 1.5] : ATTACKERS.includes(n.type) ? [1] : [0],
    p = .2 * (3 === Math.abs(n.type) ? 0 : l[b].remodel) + (2 === Math.abs(n.type) ? n.torpedo : n.bomber);
  n = $jscomp.makeIterator(f);
  for (var q = n.next(); !q.done; q = n.next()) q = q.value, q.enemies = q.enemies.filter(function (a) {
    return 0 < a.slots.length
  });
  n = [];
  q = [];
  d = $jscomp.makeIterator(d);
  for (var r = d.next(); !r.done; r = d.next()) r = r.value, n.push(r.ap), q.push(r.mode);
  for (d = 0; d < g; d++) {
    if (k <= h) {
      r = $jscomp.makeIterator(f[k].enemies);
      for (var t = r.next(); !t.done; t = r.next()) t = t.value, t.slots = t.orgSlots.concat(), t.ap = t.origAp, t.lbAp = t.origLbAp;
      r = f[k].enemies;
      for (t = 0; 3 > t; t++) {
        var w = n[t];
        if (0 < q[t]) {
          var y = getEnemyFleetLBAP(r);
          y = getLBAirStatusIndex(w, y);
          shootDownEnemy(y, r)
        }
        2 === q[t] && (y = getEnemyFleetLBAP(r), w = getLBAirStatusIndex(w, y), shootDownEnemy(w, r))
      }
    }
    for (r = 0; r < battleCount; r++) doJetPhase(e, f[r]), t = f[r].enemies, w = f[r].cellType, w = isDefMode ? defAp : getFriendFleetAP(e, w), t = getEnemyFleetAP(t), t = getAirStatusIndex(w, t), shootDownFriend(t, e, f[r]);
    for (r = 0; r < e.length; r++)
      for (t = e[r], w = t.length, y = 0; y < w; y++) r === a && y === b && m.push(t[y].slot), t[y].slot = t[y].origSlot, t[y].ap = t[y].origAp
  }
  updateDetailChart(m, "�c�@�� [�@]", {
    mode: "index",
    callbacks: {
      title: function (a, b) {
        var c = a[0].xLabel;
        if (!c) return "�c�@���F" + c + " �@\n�q���ΉF0";
        var d = 2 === u.length ? Math.floor(u[1] * (p * Math.sqrt(c) + 25)) : 0;
        return "�c�@���F" + c + " �@\n�q���ΉF" + (Math.floor(u[0] * (p * Math.sqrt(c) + 25)) + (d ? " or " + d : ""))
      },
      label: function (a, b) {
        return [a.yLabel + " %"]
      }
    }
  });
  f = SHIP_DATA.find(function (a) {
    return a.id === c
  });
  e = "";
  g = 0;
  $("#land_base_detail_table").addClass("d-none");
  $("#detail_fire").addClass("d-none").removeClass("d-flex");
  $("#detail_wave").addClass("d-none").removeClass("d-flex");
  $("#detail_info").data("mode", "fleet_slot_detail");
  $("#detail_info").data("ship_id", c);
  $("#detail_info").data("base_no", a);
  $("#detail_info").data("slot_no", b);
  $("#detail_warning").html("\n\t\t<div>�� �q���Η͂̓L���b�v�O�ŃN���e�B�J���␳�A�G�ڕ␳�Ȃ��B�����؎̂�</div>\n\t\t<div>�� �ŏI�퓬�̍q���I�����_�ł̎c���̕��z��\�����Ă��܂��B</div>");
  a = {};
  h = $jscomp.makeIterator(l);
  for (k = h.next(); !k.done; a = {
      $jscomp$loop$prop$pl$345: a.$jscomp$loop$prop$pl$345
    }, k = h.next()) {
    a.$jscomp$loop$prop$pl$345 = k.value;
    k = PLANE_DATA.find(function (a) {
      return function (b) {
        return b.id === a.$jscomp$loop$prop$pl$345.id
      }
    }(a));
    if (g === (f ? f.slot.length : 4)) break;
    e += '\n\t\t<div class="row mt-0_5 ' + (b === g ? "text-primary" : "") + '">\n\t\t\t<div class="col-2 align-self-center text-right">\n\t\t\t\t<div class="btn_show_detail py-0_5 ' + (b === g ? "selected" : "") + " " + (k ? "" : "disabled") + '" data-slot_no="' + g + '">�\��</div>\n\t\t\t</div>\n\t\t\t<div class="col d-flex align-self-center font_size_12 pl-0">\n\t\t\t\t<img src="./img/type/' + (k ? "type" + k.type : "undefined") + '.png" class="plane_img_sm align-self-center">\n\t\t\t\t<div class="align-self-center">' + (k ? k.abbr ? k.abbr : k.name : "-") + '</div>\n\t\t\t</div>\n\t\t\t<div class="col font_size_11 align-self-center">\n\t\t\t\t' + (k ? "(����: " + l[g].slot + "�@" + (k.torpedo ? "�@����: " + k.torpedo : "") + (k.bomber ? "�@����: " + k.bomber : "") + ")" : "") + "\n\t\t\t</div>\n\t\t</div>";
    g++
  }
  a = '\n\t\t<img src="./img/ship/' + c + '.png" class="ship_img align-self-center ' + (c ? "" : "d-none") + '">\n\t\t<span class="ml-1 align-self-center">' + (f ? f.name : "���w��") + "</span>\n\t";
  $("#detail_legend").html(a);
  $("#detail_info").html(e)
}

function landBaseDetailCalculate(a, b) {
  setPreCalculateTable();
  var c = [],
    d = [];
  updateLandBaseInfo(c, !1);
  updateEnemyFleetInfo(d, !1);
  var e = castInt($("#calculate_count").val()),
    f = isDefMode ? 0 : castInt($("#landBase_target").val()) - 1,
    g = [],
    h = d[f],
    k = h.enemies,
    m = c[a].planes;
  for (f = d = 0; f < m.length; f++) {
    var l = m[f];
    0 === m[b].id && 0 !== l.id && (b = f);
    d += l.slot
  }
  l = h.cellType <= CELL_TYPE.grand;
  var n = h.stage2[0][0].length,
    u = $("#detail_wave1").prop("checked");
  f = [];
  for (var p = $jscomp.makeIterator(c), q = p.next(); !q.done; q = p.next()) {
    q = $jscomp.makeIterator(q.value.planes);
    for (var r = q.next(); !r.done; r = q.next()) r = r.value, r.origSlot = r.slot, r.origAp = r.ap
  }
  for (q = 0; q < e; q++) {
    p = $jscomp.makeIterator(k);
    for (r = p.next(); !r.done; r = p.next()) r = r.value, r.slots = r.orgSlots.concat(), r.ap = r.origAp, r.lbAp = r.origLbAp;
    for (p = 0; 3 > p; p++) {
      r = c[p];
      var t = r.ap;
      if (0 < r.mode) {
        var w = getEnemyFleetLBAP(k);
        w = getLBAirStatusIndex(t, w);
        shootDownEnemy(w, k);
        if (u && p === a) {
          for (var y = 0, v = 0; v < r.planes.length; v++) {
            var x = r.planes[v],
              B = x.origSlot;
            5 === w && (w = 0);
            var z = getShootDownSlotFF(w, x.slot);
            x.slot -= Math.floor(9 === x.type ? .6 * z : z);
            x.canAttack && l && (z = Math.floor(Math.random() * n), x.slot -= Math.floor(h.stage2[x.avoid][0][z] * x.slot) * Math.floor(2 * Math.random()), x.slot -= h.stage2[x.avoid][1][z] * Math.floor(2 * Math.random()));
            z = 0 > x.slot ? 0 : x.slot;
            v === b && g.push(z);
            y += z;
            x.slot = B
          }
          f.push(y)
        }
      }
      if (2 === r.mode && (w = getEnemyFleetLBAP(k), t = getLBAirStatusIndex(t, w), shootDownEnemy(t, k), !u && p === a)) {
        for (y = w = 0; y < r.planes.length; y++) v = r.planes[y], x = v.origSlot, 5 === t && (t = 0), B = getShootDownSlotFF(t, v.slot), v.slot -= Math.floor(9 === v.type ? .6 * B : B), v.canAttack && l && (B = Math.floor(Math.random() * n), v.slot -= Math.floor(h.stage2[v.avoid][0][B] * v.slot) * Math.floor(2 * Math.random()), v.slot -= h.stage2[v.avoid][1][B] * Math.floor(2 * Math.random())), B = 0 > v.slot ? 0 : v.slot, y === b && g.push(B), w += B, v.slot = x;
        f.push(w)
      }
    }
  }
  var A = m[b].id,
    C = m[b].remodel,
    F = m.find(function (a) {
      return 312 === a.id
    }) ? 1.15 : m.find(function (a) {
      return 311 === a.id
    }) ? 1.125 : 1,
    D = h.cellType === CELL_TYPE.grand ? 1.1 : 1;
  updateDetailChart(g, "�c�@�� [�@]", {
    mode: "index",
    callbacks: {
      title: function (a, b) {
        var c = a[0].xLabel,
          d = "�q���ΉF" + (getLandBasePower(A, c, C) * F * D).toFixed(1);
        return c ? "�c�@���F" + c + " �@\n" + d : "�c�@���F0 �@\n�q���ΉF0"
      },
      label: function (a, b) {
        return [a.yLabel + " %"]
      }
    }
  });
  k = h = g = 0;
  f = $jscomp.makeIterator(f);
  for (q = f.next(); !q.done; q = f.next()) m = q.value, l = m / d, 0 === m ? k++ : .25 > l ? h++ : .4 > l && g++;
  $("#status_s").text(100 * g / e + " %");
  $("#status_m").text(100 * h / e + " %");
  $("#status_l").text(100 * k / e + " %");
  e = "";
  d = 0;
  $("#land_base_detail_table").removeClass("d-none");
  $("#detail_fire").addClass("d-none").removeClass("d-flex");
  $("#detail_wave").removeClass("d-none").addClass("d-flex");
  $("#detail_info").data("mode", "land_base_detail");
  $("#detail_info").data("base_no", a);
  $("#detail_info").data("slot_no", b);
  $("#detail_warning").html("\n\t\t<div>�� �q���Η͂̓N���e�B�J���␳�A�G�ڕ␳�Ȃ��őΐ���͂̏ꍇ</div>\n\t\t<div>�� �ΓG�A���␳�A����␳�ɂ��ẮA�Y������퓬�A�����ł���ΗL��</div>");
  g = {};
  c = $jscomp.makeIterator(c[a].planes);
  for (f = c.next(); !f.done; g = {
      $jscomp$loop$prop$pl$347: g.$jscomp$loop$prop$pl$347
    }, f = c.next()) g.$jscomp$loop$prop$pl$347 = f.value, f = PLANE_DATA.find(function (a) {
    return function (b) {
      return b.id === a.$jscomp$loop$prop$pl$347.id
    }
  }(g)), e += '\n\t\t<div class="row mt-0_5 ' + (b === d ? "text-primary" : "") + '">\n\t\t\t<div class="col-2 align-self-center text-right">\n\t\t\t\t<div class="btn_show_detail py-0_5 ' + (b === d ? "selected" : "") + " " + (f ? "" : "disabled") + '" data-slot_no="' + d + '">�\��</div>\n\t\t\t</div>\n\t\t\t<div class="col d-flex align-self-center font_size_12 pl-0">\n\t\t\t\t<img src="./img/type/' + (f ? "type" + f.type : "undefined") + '.png" class="plane_img_sm align-self-center">\n\t\t\t\t<div class="align-self-center">' + (f ? f.abbr ? f.abbr : f.name : "-") + '</div>\n\t\t\t</div>\n\t\t\t<div class="col font_size_11 align-self-center">\n\t\t\t\t' + (f ? "(����: " + g.$jscomp$loop$prop$pl$347.slot + "�@" + (f.torpedo ? "�@����: " + f.torpedo : "") + (f.bomber ? "�@����: " + f.bomber : "") + ")" : "") + "\n\t\t\t</div>\n\t\t</div>", d++;
  $("#detail_legend").html("<span>��" + (a + 1) + "��n�q���</span>");
  $("#detail_info").html(e)
}

function enemySlotDetailCalculate(a, b) {
  setPreCalculateTable();
  var c = [],
    d = [],
    e = [];
  updateLandBaseInfo(c, !1);
  updateFriendFleetInfo(d, !1);
  updateEnemyFleetInfo(e, !1);
  var f = castInt($("#calculate_count").val()),
    g = isDefMode ? 0 : displayBattle - 1;
  g = g < e.length ? g : e.length - 1;
  var h = isDefMode ? 0 : castInt($("#landBase_target").val()) - 1,
    k = [],
    m = e[g].enemies.filter(function (a) {
      return 0 < a.slots.length && !a.isSpR
    })[a],
    l = ENEMY_DATA.find(function (a) {
      return a.id === m.id
    }),
    n = ENEMY_PLANE_DATA.find(function (a) {
      return a.id === l.eqp[b]
    }),
    u = 2 === Math.abs(n.type) ? [.8, 1.5] : 1 === Math.abs(n.type) ? [0] : [1],
    p = 2 === Math.abs(n.type) ? n.torpedo : n.bomber;
  n = $("#slot_detail").prop("checked");
  for (var q = $jscomp.makeIterator(e), r = q.next(); !r.done; r = q.next()) r = r.value, r.enemies = r.enemies.filter(function (a) {
    return 0 < a.slots.length
  });
  q = [];
  r = [];
  c = $jscomp.makeIterator(c);
  for (var t = c.next(); !t.done; t = c.next()) t = t.value, q.push(t.ap), r.push(t.mode);
  for (c = 0; c < f; c++) {
    if (h <= g) {
      t = $jscomp.makeIterator(e[h].enemies);
      for (var w = t.next(); !w.done; w = t.next()) w = w.value,
        w.slots = w.orgSlots.concat(), w.ap = w.origAp, w.lbAp = w.origLbAp;
      t = e[h].enemies;
      for (w = 0; 3 > w; w++) {
        var y = q[w];
        if (0 < r[w]) {
          var v = getEnemyFleetLBAP(t);
          v = getLBAirStatusIndex(y, v);
          shootDownEnemy(v, t)
        }
        2 === r[w] && (v = getEnemyFleetLBAP(t), y = getLBAirStatusIndex(y, v), shootDownEnemy(y, t))
      }
    }
    for (t = 0; t <= g; t++)
      if (w = e[t].enemies, y = e[t].cellType, y = isDefMode ? defAp : getFriendFleetAP(d, y), v = getEnemyFleetAP(w), y = getAirStatusIndex(y, v), t === g)
        for (shootDownEnemy(y, w), n ? k.push(m.slots[b]) : m.slots[b] ? k.push(Math.floor(u[Math.floor(Math.random() * u.length)] * (p * Math.sqrt(m.slots[b]) + 25))) : k.push(0), y = 0; y < w.length; y++) v = w[y], v.isSpR || (v.slots = v.orgSlots.concat(), v.ap = v.origAp, v.lbAp = v.origLbAp);
      else shootDownFriend(y, d, e[t]);
    for (t = 0; t < d.length; t++)
      for (w = d[t], y = w.length, v = 0; v < y; v++) w[v].slot = w[v].origSlot, w[v].ap = w[v].origAp
  }
  updateDetailChart(k, n ? "�c�@�� [�@]" : "�q���Η�", {
    mode: "index",
    callbacks: {
      title: function (a, b) {
        var c = a[0].xLabel;
        if ($("#slot_detail").prop("checked")) {
          if (!c) return "�c�@���F" + c + " �@\n�q���ΉF0";
          var d = 2 === u.length ? Math.floor(u[1] * (p * Math.sqrt(c) + 25)) : 0;
          return "�c�@���F" + c + " �@\n�q���ΉF" + (Math.floor(u[0] * (p * Math.sqrt(c) + 25)) + (d ? " or " + d : ""))
        }
        return "�q���ΉF" + c
      },
      label: function (a, b) {
        return [a.yLabel + " %"]
      }
    }
  });
  $("#land_base_detail_table").addClass("d-none");
  $("#detail_fire").removeClass("d-none").addClass("d-flex");
  $("#detail_wave").addClass("d-none").removeClass("d-flex");
  $("#detail_info").data("mode", "enemy_slot_detail");
  $("#detail_info").data("base_no", a);
  $("#detail_info").data("slot_no", b);
  $("#detail_info").data("battle_no", g);
  $("#detail_warning").text("�� �q���Η͂̓L���b�v�O�ŃN���e�B�J���A�G�ڕ␳�Ȃ������؎̂�");
  d = "";
  e = 0;
  f = {};
  g = $jscomp.makeIterator(l.eqp);
  for (h = g.next(); !h.done; f = {
      $jscomp$loop$prop$id$349: f.$jscomp$loop$prop$id$349
    }, h = g.next()) f.$jscomp$loop$prop$id$349 = h.value, h = ENEMY_PLANE_DATA.find(function (a) {
    return function (b) {
      return b.id === a.$jscomp$loop$prop$id$349
    }
  }(f)), d += '\n\t\t<div class="row mt-0_5 ' + (b === e ? "text-primary" : "") + '">\n\t\t\t<div class="col-2 align-self-center text-right">\n\t\t\t\t<div class="btn_show_detail py-0_5 ' + (b === e ? "selected" : "") + " " + (h ? "" : "disabled") + '" data-slot_no="' + e + '">�\��</div>\n\t\t\t</div>\n\t\t\t<div class="col d-flex align-self-center">\n\t\t\t\t<img src="./img/type/type' + h.type + '.png" class="plane_img_sm align-self-center">\n\t\t\t\t<div class="align-self-center">' + h.name + '</div>\n\t\t\t</div>\n\t\t\t<div class="col font_size_12 align-self-center">\n\t\t\t\t(����: ' + m.slots[e++] + "�@" + (h.torpedo ? "�@����: " + h.torpedo : "") + (h.bomber ? "�@����: " + h.bomber : "") + ")</span>\n\t\t\t</div>\n\t\t</div>";
  e = '\n\t\t<img src="./img/enemy/' + l.id + '.png" class="ship_img align-self-center">\n\t\t<span class="ml-1 text-primary font_size_11 align-self-center">ID: ' + (l.id + 1500) + '</span>\n\t\t<span class="ml-1 align-self-center">' + l.name + "</span>\n\t";
  $("#detail_legend").html(e);
  $("#detail_info").html(d)
}

function updateDetailChart(a, b, c) {
  for (var d = [], e = [], f = [], g = getArrayMax(a), h = getArrayMin(a), k = a.length, m = 0, l = 0, n = 0, u = 0, p = 0, q = {
      $jscomp$loop$prop$i$351: h
    }; q.$jscomp$loop$prop$i$351 <= g; q = {
      $jscomp$loop$prop$i$351: q.$jscomp$loop$prop$i$351
    }, q.$jscomp$loop$prop$i$351++) {
    var r = a.filter(function (a) {
      return function (b) {
        return b === a.$jscomp$loop$prop$i$351
      }
    }(q)).length;
    r && (d.push(q.$jscomp$loop$prop$i$351), e.push((100 * r / k).toFixed(1E5 <= k ? 5 : 1E4 <= k ? 4 : 1E3 <= k ? 3 : 2)), p += 100 * r / k, f.push(p.toFixed(1)), !m && 50 <= p && (m = q.$jscomp$loop$prop$i$351), !l && 90 <= p && (l = q.$jscomp$loop$prop$i$351), !n && 95 <= p && (n = q.$jscomp$loop$prop$i$351), !u && 99 <= p && (u = q.$jscomp$loop$prop$i$351))
  }
  $("#detail_max").text(g);
  $("#detail_min").text(h);
  $("#detail_50").text(m);
  $("#detail_90").text(l);
  $("#detail_95").text(n);
  $("#detail_99").text(u);
  chartDataSet ? (chartDataSet.data.labels = d, chartDataSet.data.datasets[0].data = e, chartDataSet.data.datasets[1].data = f, chartDataSet.options.scales.xAxes[0].scaleLabel.labelString = b, chartDataSet.options.tooltips = c, chartDataSet.update()) : (a = document.getElementById("detailChart"), g = "rgba(" + hexToRGB(mainColor).join(",") + ", 0.8)", chartDataSet = new Chart(a, {
    type: "bar",
    data: {
      labels: d,
      datasets: [{
        label: "�m�����z",
        data: e,
        borderColor: "rgb(255, 70, 100)",
        backgroundColor: "rgba(255, 120, 180, 0.4)",
        yAxisID: "y-axis-1"
      }, {
        label: "�ݐϊm��",
        data: f,
        type: "line",
        fill: !1,
        borderColor: "rgb(54, 162, 255)",
        yAxisID: "y-axis-2"
      }]
    },
    options: {
      responsive: !0,
      scales: {
        xAxes: [{
          scaleLabel: {
            display: !0,
            labelString: b,
            fontColor: g
          },
          gridLines: {
            display: !1
          },
          ticks: {
            fontSize: 10,
            fontColor: g
          }
        }],
        yAxes: [{
          id: "y-axis-1",
          type: "linear",
          position: "left",
          gridLines: {
            display: !0,
            color: "rgba(128, 128, 128, 0.2)"
          },
          scaleLabel: {
            display: !0,
            labelString: "�m�����z [��]",
            fontColor: g
          },
          ticks: {
            min: 0,
            fontColor: g
          }
        }, {
          id: "y-axis-2",
          type: "linear",
          position: "right",
          gridLines: {
            display: !0,
            color: "rgba(128, 128, 128, 0.2)"
          },
          scaleLabel: {
            display: !0,
            labelString: "�ݐϊm�� [��]",
            fontColor: g
          },
          ticks: {
            max: 100,
            min: 0,
            stepSize: 25,
            fontColor: g
          }
        }]
      },
      legend: {
        display: !0,
        labels: {
          fontColor: g
        }
      },
      tooltips: c
    }
  }))
}

function autoExpand() {
  if ($("#mode_1").prop("checked")) isDefMode = !1, autoExpandNormal();
  else if ($("#mode_2").prop("checked") || $("#mode_3").prop("checked")) isDefMode = !0, autoExpandDefense();
  calculate()
}

function autoExpandNormal() {
  var a = loadPlaneStock(),
    b = $("#allow_fighter").prop("checked"),
    c = $("#auto_land_base_1").prop("checked"),
    d = $("#auto_land_base_2").prop("checked"),
    e = $("#auto_land_base_3").prop("checked"),
    f = $("#auto_fleet").prop("checked");
  c || $("#lb_item1").find(".lb_plane").each(function (b, c) {
    var d = a.find(function (a) {
        return a.id === castInt($(c)[0].dataset.planeid)
      }),
      e = castInt($(c).find(".remodel_value").text());
    d && d.num[e]--
  });
  d || $("#lb_item2").find(".lb_plane").each(function (b, c) {
    var d = a.find(function (a) {
        return a.id === castInt($(c)[0].dataset.planeid)
      }),
      e = castInt($(c).find(".remodel_value").text());
    d && d.num[e]--
  });
  e || $("#lb_item3").find(".lb_plane").each(function (b, c) {
    var d = a.find(function (a) {
        return a.id === castInt($(c)[0].dataset.planeid)
      }),
      e = castInt($(c).find(".remodel_value").text());
    d && d.num[e]--
  });
  f && autoFleetExpand(a);
  $(".ship_tab").find(".ship_plane").each(function (b, c) {
    var d = a.find(function (a) {
        return a.id === castInt($(c)[0].dataset.planeid)
      }),
      e = castInt($(c).find(".remodel_value").text());
    d && d.num[e]--
  });
  if (c || d || e) {
    var g = [];
    f = castInt($("#dest_range").val());
    for (var h = {}, k = $jscomp.makeIterator(a), m = k.next(); !m.done; h = {
        $jscomp$loop$prop$stock$353: h.$jscomp$loop$prop$stock$353
      }, m = k.next())
      if (h.$jscomp$loop$prop$stock$353 = m.value, !(0 >= getArraySum(h.$jscomp$loop$prop$stock$353.num) || (m = PLANE_DATA.find(function (a) {
          return function (b) {
            return b.id === a.$jscomp$loop$prop$stock$353.id
          }
        }(h)), m.radius < f || -101 === m.type || !b && 1 === Math.abs(m.type)))) {
        var l = "type" + Math.abs(FIGHTERS.includes(m.type) ? 1 : m.type);
        g.hasOwnProperty(l) || (g[l] = []);
        for (var n = 0; n < h.$jscomp$loop$prop$stock$353.num.length; n++)
          for (var u = 0; u < h.$jscomp$loop$prop$stock$353.num[n]; u++) {
            var p = {
              id: m.id,
              type: m.type,
              antiAir: m.antiAir + 1.5 * m.interception,
              torpedo: m.torpedo,
              bomber: m.bomber,
              remodel: n
            };
            p.antiAir = getBonusAA(p, p.antiAir);
            g[l].push(p)
          }
      }
    Object.keys(g).forEach(function (a) {
      "type1" === a ? g[a].sort(function (a, b) {
        return a.antiAir === b.antiAir ? b.radius - a.radius : b.antiAir - a.antiAir
      }) : "type2" === a ? g[a].sort(function (a, b) {
        return a.torpedo === b.torpedo ? b.radius - a.radius : b.torpedo - a.torpedo
      }) : "type101" === a ? g[a].sort(function (a, b) {
        return 186 === a.id && 186 === b.id ? b.antiAir - a.antiAir : 186 === a.id ? -1 : 186 === b.id ? 1 : a.torpedo === b.torpedo ? b.radius - a.radius : b.torpedo - a.torpedo
      }) : ["type3", "type6"].includes(a) ? g[a].sort(function (a, b) {
        return a.bomber === b.bomber ? b.antiAir - a.antiAir : b.bomber - a.bomber
      }) : ["type4", "type5", "type8", "type104"].includes(a) && g[a].sort(function (a, b) {
        return a.scout === b.scout ? b.antiAir - a.antiAir : b.scout - a.scout
      })
    });
    if (c) {
      var q = autoLandBaseExpand(g);
      $("#lb_item1").find(".lb_plane").each(function (a, b) {
        setLBPlaneDiv($(b), q[a])
      });
      $("#lb_item1").find(".ohuda_select").val(0 < q.length ? 2 : -1)
    }
    if (d) {
      var r = autoLandBaseExpand(g);
      $("#lb_item2").find(".lb_plane").each(function (a, b) {
        setLBPlaneDiv($(b), r[a])
      });
      $("#lb_item2").find(".ohuda_select").val(0 < r.length ? 2 : -1)
    }
    if (e) {
      var t = autoLandBaseExpand(g);
      $("#lb_item3").find(".lb_plane").each(function (a, b) {
        setLBPlaneDiv($(b), t[a])
      });
      $("#lb_item3").find(".ohuda_select").val(0 < t.length ? 2 : -1)
    }
  }
}

function autoFleetExpand(a) {
  var b = castInt($("#dest_ap").val()),
    c = $('.ship_tab[data-shipid!=""]'),
    d = !$("#no_FBA").prop("checked"),
    e = [],
    f = {};
  a = $jscomp.makeIterator(a);
  for (var g = a.next(); !g.done; f = {
      $jscomp$loop$prop$stock$355: f.$jscomp$loop$prop$stock$355
    }, g = a.next())
    if (f.$jscomp$loop$prop$stock$355 = g.value, [16, 19, 23, 26].includes(f.$jscomp$loop$prop$stock$355.id) && (f.$jscomp$loop$prop$stock$355.num = [60, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), !(0 >= getArraySum(f.$jscomp$loop$prop$stock$355.num) || (g = PLANE_DATA.find(function (a) {
        return function (b) {
          return b.id === a.$jscomp$loop$prop$stock$355.id
        }
      }(f)), 100 < g.type))) {
      var h = "type" + Math.abs(FIGHTERS.includes(g.type) ? "1" : g.type);
      e.hasOwnProperty(h) || (e[h] = []);
      for (var k = 0; k < f.$jscomp$loop$prop$stock$355.num.length; k++)
        for (var m = 0; m < f.$jscomp$loop$prop$stock$355.num[k]; m++) {
          var l = {
            id: g.id,
            type: g.type,
            antiAir: g.antiAir + 1.5 * g.interception,
            torpedo: g.torpedo,
            bomber: g.bomber,
            avoid: g.avoid,
            remodel: k,
            stock: 1
          };
          l.antiAir = getBonusAA(l, l.antiAir);
          e[h].push(l)
        }
    }
  Object.keys(e).forEach(function (a) {
    "type1" === a ? e[a].sort(function (a, b) {
      return b.antiAir - a.antiAir
    }) : "type2" === a ? e[a].sort(function (a, b) {
      return a.torpedo === b.torpedo ? b.antiAir - a.antiAir : b.torpedo - a.torpedo
    }) : ["type3", "type6"].includes(a) && e[a].sort(function (a, b) {
      return a.avoid === b.avoid ? b.bomber - a.bomber : b.avoid - a.avoid
    })
  });
  var n = [],
    u = 0;
  c.each(function (a, b) {
    var c = SHIP_DATA.find(function (a) {
      return a.id === castInt($(b)[0].dataset.shipid)
    });
    if (c) {
      var d = [];
      $(b).find(".ship_plane:not(.d-none)").each(function (b, f) {
        var g = castInt($(f).find(".slot").text()),
          h = $(f).find(".plane_unlock").hasClass("d-none"),
          k = {
            shipId: c.id,
            shipType: c.type,
            slotNo: b,
            num: g,
            plane: {
              id: 0,
              ap: 0
            },
            order: u++,
            num_: g,
            slotId: "ship" + a + "_slot" + b,
            isLock: h,
            lockedPlane: null
          };
        if (h) {
          var l = PLANE_DATA.find(function (a) {
            return a.id === castInt($(f)[0].dataset.planeid)
          });
          if (l) {
            var n = castInt($(f).find(".remodel_value").text());
            k.lockedPlane = {
              id: l.id,
              remodel: n
            };
            Object.keys(e).forEach(function (a) {
              var b = e[a].findIndex(function (a) {
                return a.id === l.id && a.remodel === n
              }); - 1 < b && e[a].splice(b, 1)
            })
          }
        } else 0 === g && (k.isLock = !0);
        [1, 2, 3].includes(c.type) ? 10 > g && (k.num_ = g - 100) : k.num_ = g - 100;
        d.push(k)
      });
      n = n.concat(d)
    }
  });
  g = [2, 6];
  f = 0;
  n.sort(function (a, b) {
    return b.num_ - a.num_
  });
  h = $jscomp.makeIterator(n);
  for (a = h.next(); !a.done; a = h.next())
    for (k = a.value, l = !1, m = $jscomp.makeIterator(g), a = m.next(); !a.done; a = m.next()) {
      a = a.value;
      if (k.isLock) {
        k.lockedPlane && (a = getShipPlaneObject(k.num, k.lockedPlane), k.plane = a, f += a.ap);
        l = !0;
        break
      }
      var p = k.shipType;
      d && [1, 2, 3].includes(p) && 1 === k.slotNo && (a = 3);
      p = {};
      var q = $jscomp.makeIterator(e["type" + a]);
      for (a = q.next(); !a.done; p = {
          $jscomp$loop$prop$plane$255$357: p.$jscomp$loop$prop$plane$255$357
        }, a = q.next())
        if (p.$jscomp$loop$prop$plane$255$357 = a.value, !(0 >= p.$jscomp$loop$prop$plane$255$357.stock)) {
          checkInvalidPlane(k.shipId, PLANE_DATA.find(function (a) {
            return function (b) {
              return b.id === a.$jscomp$loop$prop$plane$255$357.id
            }
          }(p))) && (a = getShipPlaneObject(k.num, p.$jscomp$loop$prop$plane$255$357), k.plane = a, f += a.ap, p.$jscomp$loop$prop$plane$255$357.stock--, l = !0);
          break
        }
      if (l) break
    }
  n.sort(function (a, b) {
    return a.num_ === b.num_ ? b.slotNo - a.slotNo : a.num_ - b.num_
  });
  g = f;
  h = [];
  d = [];
  k = [];
  for (m = 0; m < n.length && !(f >= b); m++)
    if (!n[m].isLock) {
      d = [];
      k = [];
      f = $jscomp.makeIterator(e.type1);
      for (a = f.next(); !a.done; a = f.next()) a = a.value, k.push({
        id: a.id,
        remodel: a.remodel,
        antiAir: a.antiAir,
        stock: a.stock
      });
      f = g;
      h.push(n[m]);
      for (l = h.length - 1; 0 <= l; l--) {
        p = h[l];
        q = !1;
        var r = {},
          t = $jscomp.makeIterator(k);
        for (a = t.next(); !a.done; r = {
            $jscomp$loop$prop$plane$262$359: r.$jscomp$loop$prop$plane$262$359
          }, a = t.next())
          if (r.$jscomp$loop$prop$plane$262$359 = a.value, !(0 >= r.$jscomp$loop$prop$plane$262$359.stock)) {
            if (checkInvalidPlane(p.shipId, PLANE_DATA.find(function (a) {
                return function (b) {
                  return b.id === a.$jscomp$loop$prop$plane$262$359.id
                }
              }(r)))) {
              a = getShipPlaneObject(p.num, r.$jscomp$loop$prop$plane$262$359);
              var w = p.plane.ap;
              if (w < a.ap) {
                d.push(a);
                f += a.ap - w;
                r.$jscomp$loop$prop$plane$262$359.stock--;
                q = !0;
                break
              }
            }
            if (q) break
          }
        q || d.push(p.plane)
      }
    }
  b = 0;
  f = d.length;
  for (a = 0; a < n.length; a++)
    if (!n[a].isLock) {
      if (b >= f) break;
      n[a].plane = d[f - 1 - b++]
    }
  n.sort(function (a, b) {
    return a.order - b.order
  });
  u = 0;
  c.each(function (a, b) {
    $(b).find(".ship_plane:not(.d-none)").each(function (b, c) {
      var d = n.find(function (c) {
        return c.slotId === "ship" + a + "_slot" + b
      });
      d ? (setPlaneDiv($(c), d.plane), u++) : setPlaneDiv($(c))
    })
  })
}

function autoLandBaseExpand(a) {
  for (var b = castInt($("#dest_ap").val()), c = [{
      id: 0,
      ap: 0,
      remodel: 0
    }, {
      id: 0,
      ap: 0,
      remodel: 0
    }, {
      id: 0,
      ap: 0,
      remodel: 0
    }, {
      id: 0,
      ap: 0,
      remodel: 0
    }], d = c.length, e = 0, f = !1, g = [], h = $jscomp.makeIterator([101, 2, 3, 6, 9]), k = h.next(); !k.done; k = h.next())
    if ((k = a["type" + k.value]) && 0 !== k.length) {
      for (var m = 0; m < k.length && !(g.push(k[m]), f = g.length === d); m++);
      if (f) break
    }
  for (h = 0; h < g.length; h++) k = getLandBasePlaneObject(g[h]), c[c.length - 1 - h] = k, e += k.ap;
  if (f && e >= b) {
    b = [];
    e = $jscomp.makeIterator(c);
    for (c = e.next(); !c.done; c = e.next())
      for (c = c.value, b.push({
          id: c.id,
          remodel: c.remodel
        }), d = {}, f = $jscomp.makeIterator(b), c = f.next(); !c.done; d = {
          $jscomp$loop$prop$plane$269$361: d.$jscomp$loop$prop$plane$269$361
        }, c = f.next()) d.$jscomp$loop$prop$plane$269$361 = c.value, Object.keys(a).forEach(function (b) {
        return function (c) {
          var d = a[c].findIndex(function (a) {
            return a.id === b.$jscomp$loop$prop$plane$269$361.id && a.remodel === b.$jscomp$loop$prop$plane$269$361.remodel
          }); - 1 < d && a[c].splice(d, 1)
        }
      }(d));
    return b
  }
  g = [];
  f = !1;
  if (h = a.type1)
    for (k = 0; k < h.length && !(g.push(h[k]), f = g.length === d); k++);
  for (d = 0; d < g.length && !(f = c[d].ap, h = getLandBasePlaneObject(g[d]), f < h.ap && (c[d] = h, e += c[d].ap - f), e >= b); d++);
  b = [];
  e = $jscomp.makeIterator(c);
  for (c = e.next(); !c.done; c = e.next())(c = c.value) && b.push({
    id: c.id,
    remodel: c.remodel
  });
  e = {};
  d = $jscomp.makeIterator(b);
  for (c = d.next(); !c.done; e = {
      $jscomp$loop$prop$plane$274$363: e.$jscomp$loop$prop$plane$274$363
    }, c = d.next()) e.$jscomp$loop$prop$plane$274$363 = c.value, Object.keys(a).forEach(function (b) {
    return function (c) {
      var d = a[c].findIndex(function (a) {
        return a.id === b.$jscomp$loop$prop$plane$274$363.id && a.remodel === b.$jscomp$loop$prop$plane$274$363.remodel
      }); - 1 < d && a[c].splice(d, 1)
    }
  }(e));
  return b
}

function getLandBasePlaneObject(a) {
  var b = {
      id: 0,
      type: 0,
      antiAir: 0,
      antiBomber: 0,
      interception: 0,
      scout: 0,
      ap: 0,
      slot: 18,
      remodel: 0,
      level: 0
    },
    c = PLANE_DATA.find(function (b) {
      return b.id === a.id
    });
  b.id = a.id;
  b.type = a.type;
  RECONNAISSANCES.includes(b.type) && 4 < b.slot && (b.slot = 4);
  b.antiAir = c.antiAir;
  b.antiBomber = c.antiBomber;
  b.interception = c.interception;
  b.scout = c.scout;
  b.remodel = a.remodel;
  b.level = setting.defaultProf.find(function (b) {
    return b.id === Math.abs(a.type)
  }).prof;
  b.ap = getAirPower_lb(b);
  return b
}

function getShipPlaneObject(a, b) {
  var c = PLANE_DATA.find(function (a) {
      return a.id === b.id
    }),
    d = {
      id: 0,
      type: 0,
      antiAir: 0,
      ap: 0,
      bonusAp: 0,
      remodel: 0,
      level: 0,
      slot: a,
      canBattle: !0
    };
  d.id = c.id;
  d.name = c.name;
  d.type = c.type;
  d.canBattle = !RECONNAISSANCES.includes(c.type);
  d.remodel = b.remodel;
  d.antiAir = getBonusAA(d, c.antiAir);
  d.level = setting.defaultProf.find(function (a) {
    return a.id === Math.abs(c.type)
  }).prof;
  d.bonusAp = getBonusAp(d);
  d.ap = updateAp(d);
  return {
    id: d.id,
    ap: d.ap,
    remodel: d.remodel,
    name: d.name
  }
}

function autoExpandDefense() {
  var a = $("#auto_land_base_1").prop("checked"),
    b = $("#auto_land_base_2").prop("checked"),
    c = $("#auto_land_base_3").prop("checked");
  $(".lb_plane").each(function (a, b) {
    setLBPlaneDiv($(b))
  });
  var d = 0;
  a && d++;
  b && d++;
  c && d++;
  if (0 < d) {
    d = autoLandBaseExpandDef(d);
    if (a) {
      var e = d[0].planes;
      $("#lb_item1").find(".lb_plane").each(function (a, b) {
        setLBPlaneDiv($(b), e[a])
      });
      $("#lb_item1").find(".ohuda_select").val(0)
    }
    if (b) {
      var f = d[a ? 1 : 0].planes;
      $("#lb_item2").find(".lb_plane").each(function (a, b) {
        setLBPlaneDiv($(b), f[a])
      });
      $("#lb_item2").find(".ohuda_select").val(0)
    }
    if (c) {
      var g = d[a && b ? 2 : a || b ? 1 : 0].planes;
      $("#lb_item3").find(".lb_plane").each(function (a, b) {
        setLBPlaneDiv($(b), g[a])
      });
      $("#lb_item3").find(".ohuda_select").val(0)
    }
  }
}

function autoLandBaseExpandDef(a) {
  var b = castInt($("#dest_ap").val()),
    c = loadPlaneStock(),
    d = $("#mode_3").prop("checked"),
    e = [],
    f = [],
    g = 4 * a,
    h = {};
  c = $jscomp.makeIterator(c);
  for (var k = c.next(); !k.done; h = {
      $jscomp$loop$prop$stock$365: h.$jscomp$loop$prop$stock$365
    }, k = c.next()) {
    h.$jscomp$loop$prop$stock$365 = k.value;
    if (25 === h.$jscomp$loop$prop$stock$365.id || 19 === h.$jscomp$loop$prop$stock$365.id) h.$jscomp$loop$prop$stock$365.num = [g, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    if (!(0 >= getArraySum(h.$jscomp$loop$prop$stock$365.num)))
      if (k = PLANE_DATA.find(function (a) {
          return function (b) {
            return b.id === a.$jscomp$loop$prop$stock$365.id
          }
        }(h)), RECONNAISSANCES.includes(k.type))
        for (var m = 10; 0 <= m; m--) {
          if (!(1 > h.$jscomp$loop$prop$stock$365.num[m])) {
            var l = {
              id: k.id,
              antiAir: k.antiAir,
              type: k.type,
              adjust: 1,
              scout: k.scout,
              remodel: m
            };
            l.adjust = getReconnaissancesAdjust(l, !0);
            for (var n = 0; n < h.$jscomp$loop$prop$stock$365.num[m]; n++) f.push(l)
          }
        } else
          for (m = 10; 0 <= m; m--)
            if (!(1 > h.$jscomp$loop$prop$stock$365.num[m]) && (l = {
                id: k.id,
                type: k.type,
                remodel: m,
                antiAir: k.antiAir + k.interception + 2 * k.antiBomber,
                interception: k.interception,
                antiBomber: k.antiBomber,
                isRocket: 0
              }, l.antiAir = getBonusAA(l, l.antiAir), 0 !== l.antiAir))
              for (n = 0; n < h.$jscomp$loop$prop$stock$365.num[m]; n++) e.push(Object.assign({}, l))
  }
  if (d) {
    e.sort(function (a, b) {
      return b.antiAir - a.antiAir
    });
    for (g = 0; 3 > g; g++) h = e.findIndex(function (a) {
      return 0 === a.isRocket && ROCKETS.includes(a.id)
    }), -1 < h && (e[h].isRocket = 1);
    e.sort(function (a, b) {
      return b.isRocket - a.isRocket
    })
  } else e.sort(function (a, b) {
    return a.antiAir === b.antiAir ? b.radius - a.radius : b.antiAir - a.antiAir
  });
  f.sort(function (a, b) {
    return b.adjust === a.adjust ? b.scout - a.scout : b.adjust - a.adjust
  });
  e = e.filter(function (b, c) {
    return c < 4 * a
  });
  g = [];
  for (h = 0; h < a; h++) {
    c = {
      ap: 0,
      planes: []
    };
    for (k = 0; 4 > k; k++) c.planes.push({
      id: 0
    });
    g.push(c)
  }
  for (k = c = h = 0; k < a; k++) {
    m = {
      ap: 0,
      planes: []
    };
    l = {
      ap: 0,
      planes: []
    };
    for (n = 0; 4 > n; n++) {
      var u = e[n],
        p = getLandBasePlaneObject(u);
      m.planes.push(p);
      m.ap += p.ap;
      l.planes.push(p);
      l.ap += p.ap;
      h += p.ap;
      if (d) {
        if (ROCKETS.includes(u.id) && c++, Math.floor((0 === c ? .5 : 1 === c ? .8 : 2 === c ? 1.1 : 1.2) * h) >= b) break
      } else if (h >= b) break
    }
    f.length > k && !(3 > l.planes.length && h >= b) && (n = getLandBasePlaneObject(f[k]), u = Math.min(l.planes.length, 3), (p = l.planes[u]) || (p = {
      id: 0,
      ap: 0
    }), p = p.ap, l.planes[u] = n, l.ap += n.ap - p, updateLBAirPower(l));
    if (l.ap >= m.ap || l.ap >= b) n = m.ap, m = l, h += l.ap - n;
    l = m.planes.length;
    if (4 !== l)
      for (n = 0; n < 4 - l; n++) m.planes.push({
        id: 0,
        ap: 0
      });
    g[k] = m;
    l = {};
    m = $jscomp.makeIterator(m.planes);
    for (n = m.next(); !n.done; l = {
        $jscomp$loop$prop$isFirst$367: l.$jscomp$loop$prop$isFirst$367,
        $jscomp$loop$prop$plane$290$368: l.$jscomp$loop$prop$plane$290$368
      }, n = m.next()) l.$jscomp$loop$prop$plane$290$368 = n.value, l.$jscomp$loop$prop$isFirst$367 = !0, e = e.filter(function (a) {
      return function (b) {
        return a.$jscomp$loop$prop$isFirst$367 && b.id === a.$jscomp$loop$prop$plane$290$368.id ? a.$jscomp$loop$prop$isFirst$367 = !1 : !0
      }
    }(l));
    if (d) {
      if (Math.floor((0 === c ? .5 : 1 === c ? .8 : 2 === c ? 1.1 : 1.2) * h) >= b) break
    } else if (h >= b) break
  }
  return g
}

function modal_Closed(a) {
  switch (a.attr("id")) {
  case "modal_plane_select":
  case "modal_ship_select":
  case "modal_enemy_select":
  case "modal_enemy_pattern":
  case "modal_collectively_setting":
    $target = null;
    calculate();
    break;
  case "modal_plane_preset":
    planePreset = $target = null;
    calculate();
    break;
  case "modal_main_preset":
    calculate();
    break;
  case "modal_result_detail":
    setTimeout(function () {
      chartDataSet.destroy();
      chartDataSet = null
    }, 80)
  }
}

function sidebar_Clicked(a) {
  a = a.attr("href");
  var b = $("#" === a || "" === a ? "html" : a);
  "#first_time_content" === a ? first_time_Clicked() : "#site_manual_content" === a ? site_manual_Clicked() : "#site_abstract_content" === a || "#site_FAQ_content" === a || "#site_history_content" === a ? scrollContent($(a)) : $("body,html").animate({
    scrollTop: b.offset().top - 60
  }, 300, "swing");
  return !1
}

function btn_content_trade_Clicked(a) {
  $("body,html").animate({
    scrollTop: 0
  }, 200, "swing");
  $(".btn_commit_trade").addClass("d-table").removeClass("d-none");
  $(".round_button:not(.btn_commit_trade)").addClass("d-none").removeClass("d-table");
  $("#main_contents").find(".collapse_content").each(function () {
    $(this).parent().addClass("trade_enabled");
    $(this).attr("class").includes("show") && $(this).addClass("tmpHide").collapse("hide")
  });
  a.blur()
}

function main_contents_Sortable_End() {
  var a = [],
    b = $("#side_index");
  b.find("li").each(function (b, d) {
    a.push($(d).clone())
  });
  b.empty();
  setting.contentsOrder = [];
  $("#main_contents > div").each(function (c, d) {
    var e = $(d).attr("id");
    setting.contentsOrder.push(e);
    for (var f = $jscomp.makeIterator(a), g = f.next(); !g.done; g = f.next())
      if (g = g.value, g.attr("id") === "li_" + e) {
        b.append(g);
        break
      }
  });
  saveLocalStorage("setting", setting)
}

function commit_content_order() {
  if ($("#landBase_content").hasClass("collapsing")) return !1;
  $(".tmpHide").collapse("show");
  $(".trade_enabled").removeClass("trade_enabled");
  $(".btn_commit_trade").removeClass("d-table").addClass("d-none");
  $(".round_button:not(.btn_commit_trade)").removeClass("d-none").addClass("d-table")
}

function btn_ex_setting_Clicked(a) {
  a = a.closest(".contents").attr("id");
  var b = $("#modal_collectively_setting");
  b.find(".btn").removeClass("d-none");
  b.data("target", a);
  switch (a) {
  case "landBase":
    b.find(".modal-title").text("�ꊇ�ݒ�@-��n�q���-");
    b.find(".btn_remove_ship_all").addClass("d-none");
    b.find(".btn_remove_enemy_all").addClass("d-none");
    b.find(".btn_slot_default").addClass("d-none");
    b.find(".coll_slot_range").attr("max", 18).data("target", a);
    break;
  case "friendFleet":
    b.find(".modal-title").text("�ꊇ�ݒ�@-�͖�-"),
      b.find(".btn_remove_enemy_all").addClass("d-none"), b.find(".coll_slot_range").attr("max", 99).data("target", a)
  }
  b.modal("show")
}

function btn_air_raid_Clicked() {
  $(".lb_tab").each(function (a, b) {
    var c = !1;
    $(b).find(".lb_plane").each(function (a, b) {
      var d = setting.airRaidMax ? 4 : Math.ceil(4 * Math.random()),
        e = castInt($(b).find(".slot").text());
      !c && 1 < e && ($(b).find(".slot").text(1 > e - d ? 1 : e - d), c = !0)
    })
  });
  calculate()
}

function btn_supply_Clicked() {
  $(".lb_tab").each(function (a, b) {
    $(b).find(".lb_plane").each(function (a, b) {
      $(b).find(".slot").text(18)
    })
  });
  calculate()
}

function btn_capture_Clicked(a) {
  var b = a.closest(".contents"),
    c = b.css("backgroundColor");
  b.width(1E3);
  "dark" === setting.themeColor || "dark-gradient" === setting.themeColor ? b.css("backgroundColor", "rgb(43, 43, 50)") : "deep-blue" === setting.themeColor ? b.css("backgroundColor", "rgb(10, 20, 45)") : b.css("backgroundColor", "#ffffff");
  b.find(".lb_tab").removeClass("tab-pane fade");
  var d = b.find(".no_capture:not(.d-none)");
  d.addClass("d-none");
  b.find(".round_button").addClass("d-none").removeClass("d-table");
  b.find(".custom-checkbox").addClass("d-none");
  b.find(".custom-select").addClass("pt-0");
  b.find(".custom-select option").addClass("d-none");
  b.find(".form-control").addClass("pt-0");
  b.find(".general_box").addClass("general_box_capture");
  var e = window.pageYOffset;
  html2canvas(b[0], {
    onrendered: function (a) {
      var f = a.toDataURL();
      if ($("#clipboard_mode").prop("checked") && "function" === typeof ClipboardItem) try {
        a.toBlob(function (a) {
          var b = {};
          navigator.clipboard.write([new ClipboardItem((b[a.type] = a, b))])
        })
      } catch (h) {
        downloadImage(f)
      } else downloadImage(f);
      b.css("backgroundColor", c);
      b.find(".custom-checkbox").removeClass("d-none");
      b.find(".round_button:not(.btn_commit_trade)").removeClass("d-none").addClass("d-table");
      d.removeClass("d-none");
      b.find(".custom-select").removeClass("pt-0");
      b.find(".custom-select option").removeClass("d-none");
      b.find(".form-control").removeClass("pt-0");
      b.find(".general_box").removeClass("general_box_capture");
      b.width("");
      "none" === $("#lb_tab_select").css("display") || $("#lb_item1").attr("class").includes("tab-pane") || ($(".lb_tab").addClass("tab-pane fade"), $(".lb_tab:first").tab("show"));
      window.scrollTo(0, e)
    }
  })
}

function downloadImage(a) {
  var b = new Date,
    c = ("0" + (b.getMonth() + 1)).slice(-2),
    d = ("0" + b.getDate()).slice(-2),
    e = ("0" + b.getHours()).slice(-2),
    f = ("0" + b.getMinutes()).slice(-2),
    g = ("0" + b.getSeconds()).slice(-2);
  b = "screenshot_" + b.getFullYear() + c + d + e + f + g + ".jpg";
  if (window.navigator.msSaveBlob) {
    a = atob(a.replace(/^.*,/, ""));
    c = new Uint8Array(a.length);
    for (d = 0; d < a.length; d++) c[d] = a.charCodeAt(d);
    a = new Blob([c], ["image/png"]);
    window.navigator.msSaveOrOpenBlob(a, b)
  } else c = document.getElementById("getImage"), c.href = a, c.download = b, c.click()
}

function btn_reset_content_Clicked(a) {
  switch (a.closest(".contents").attr("id")) {
  case "landBase":
    $(".lb_plane").each(function (a, c) {
      return setLBPlaneDiv($(c))
    });
    isDefMode = !1;
    break;
  case "friendFleet":
    clearShipDivAll();
    break;
  case "enemyFleet":
    clearEnemyDivAll()
  }
  calculate()
}

function btn_remove_plane_all_Clicked(a) {
  a = $("#" + $("#modal_collectively_setting").data("target"));
  clearPlaneDivAll(a)
}

function btn_remove_ship_all_Clicked() {
  clearShipDivAll();
  $("#modal_collectively_setting").modal("hide")
}

function btn_slot_max_Clicked(a) {
  a = $("#" + $("#modal_collectively_setting").data("target"));
  "landBase" === a.attr("id") ? $(".coll_slot_range").val(18) : "friendFleet" === a.attr("id") && $(".coll_slot_range").val(99);
  coll_slot_range_Changed($(".coll_slot_range"))
}

function btn_slot_default_Clicked(a) {
  a = $("#" + $("#modal_collectively_setting").data("target"));
  "friendFleet" === a.attr("id") && a.find(".ship_plane").each(function (a, c) {
    $(c).find(".slot").text($(c).find(".slot_ini").data("ini"))
  })
}

function btn_slot_min_Clicked() {
  $(".coll_slot_range").val(0);
  coll_slot_range_Changed($(".coll_slot_range"))
}

function coll_slot_range_Changed(a) {
  var b = $("#" + $("#modal_collectively_setting").data("target")),
    c = castInt(a.val());
  c = c > castInt(a.attr("max")) ? castInt(a.attr("max")) : c;
  "landBase" === b.attr("id") ? b.find(".lb_plane").each(function (a, b) {
    return $(b).find(".slot").text(c)
  }) : "friendFleet" === b.attr("id") && b.find(".ship_plane").each(function (a, b) {
    return $(b).find(".slot").text(c)
  });
  $(".coll_slot_input").val(c)
}

function coll_slot_input_Changed(a) {
  var b = validateInputNumber(a.val(), castInt($(".coll_slot_range").attr("max")));
  a.val(b);
  $(".coll_slot_range").val(b);
  coll_slot_range_Changed($(".coll_slot_range"))
}

function btn_remodel_Clicked(a) {
  var b = $("#" + $("#modal_collectively_setting").data("target")),
    c = castInt(a[0].dataset.remodel);
  "landBase" === b.attr("id") ? b.find(".lb_plane").each(function (a, b) {
    return $(b).find(".remodel_select:not(.remodel_disabled)").find(".remodel_value").text(c)
  }) : "friendFleet" === b.attr("id") && b.find(".ship_plane").each(function (a, b) {
    return $(b).find(".remodel_select:not(.remodel_disabled)").find(".remodel_value").text(c)
  })
}

function btn_fighter_prof_max_Clicked() {
  var a = $("#" + $("#modal_collectively_setting").data("target"));
  "landBase" === a.attr("id") ? a.find(".lb_plane").each(function (a, c) {
    FIGHTERS.includes(Math.abs(castInt($(c)[0].dataset.type))) && setProficiency($(c).find(".prof_select"), 7)
  }) : "friendFleet" === a.attr("id") && a.find(".ship_plane").each(function (a, c) {
    FIGHTERS.includes(Math.abs(castInt($(c)[0].dataset.type))) && setProficiency($(c).find(".prof_select"), 7)
  })
}

function btn_prof_Clicked(a) {
  var b = $("#" + $("#modal_collectively_setting").data("target")),
    c = a[0].dataset.prof;
  "landBase" === b.attr("id") ? b.find(".lb_plane").each(function (a, b) {
    setProficiency($(b).find(".prof_select"), c)
  }) : "friendFleet" === b.attr("id") && b.find(".ship_plane").each(function (a, b) {
    setProficiency($(b).find(".prof_select"), c)
  })
}

function ohuda_Changed(a, b) {
  b = void 0 === b ? !1 : b;
  var c = castInt(a.val(), -1);
  if (0 === c) isDefMode = !0, $(".ohuda_select").each(function (a, b) {
    0 < castInt($(b).val()) && $(b).val(-1)
  });
  else if (-1 === c) {
    var d = !1;
    $(".ohuda_select").each(function (a, b) {
      0 === castInt($(b).val()) && (d = !0)
    });
    isDefMode = d
  } else isDefMode = !1, $(".ohuda_select").each(function (a, b) {
    0 === castInt($(b).val()) && $(b).val(-1)
  });
  b || calculate()
}

function plane_lock_Clicked(a) {
  a.addClass("d-none");
  a.closest(".ship_plane").find(".plane_unlock").removeClass("d-none")
}

function plane_unlock_Clicked(a) {
  a.addClass("d-none");
  a.closest(".ship_plane").find(".plane_lock").removeClass("d-none")
}

function remodelSelect_Shown(a) {
  if (a.find(".dropdown-menu").html().trim()) a.find(".remodel_item_selected").removeClass("remodel_item_selected");
  else {
    for (var b = "", c = 0; 10 > c; c++) b += '<div class="remodel_item" data-remodel="' + c + '"><i class="fas fa-star"></i>+' + c + "</div>";
    b += '<div class="remodel_item" data-remodel="10"><i class="fas fa-star"></i>max</div>';
    a.find(".dropdown-menu").append(b)
  }
}

function remodelSelect_Changed(a) {
  if (a.find(".remodel_item_selected").length) {
    var b = Math.min(castInt(a.find(".remodel_item_selected").data("remodel")), 10);
    a.removeClass("remodel_item_selected");
    a.find(".remodel_value").text(b);
    calculate()
  }
}

function profSelect_Shown(a) {
  if (!a.find(".dropdown-menu").html().trim()) {
    for (var b = "", c = 7; 0 <= c; c--) b += '<a class="dropdown-item prof_item"><img class="prof_opt prof_yellow" alt="' + getProfString(c) + '" data-prof="' + c + '" src="./img/util/prof' + c + '.png"></a>';
    a.find(".dropdown-menu").append(b)
  }
}

function proficiency_Changed(a, b) {
  b = void 0 === b ? !1 : b;
  var c = a.find(".prof_opt"),
    d = a.parent().prev(),
    e = c[0].dataset.prof;
  d.attr("src", c.attr("src")).attr("alt", c.attr("alt")).removeClass("prof_yellow prof_blue prof_none");
  d[0].dataset.prof = e;
  3 < e ? d.addClass("prof_yellow") : 0 < e ? d.addClass("prof_blue") : d.addClass("prof_none");
  b || calculate()
}

function setProficiency(a, b) {
  a.attr("src", "./img/util/prof" + b + ".png").attr("alt", getProfString(b)).removeClass("prof_yellow prof_blue prof_none");
  a[0].dataset.prof = b;
  3 < b ? a.addClass("prof_yellow") : 0 < b ? a.addClass("prof_blue") : a.addClass("prof_none")
}

function init_proficiency_Changed(a) {
  proficiency_Changed(a, !0);
  var b = castInt(a.find(".prof_opt")[0].dataset.prof);
  setting.defaultProf.find(function (b) {
    return b.id === castInt(a.closest(".init_prof")[0].dataset.typeid)
  }).prof = b;
  saveLocalStorage("setting", setting)
}

function backup_enabled_Clicked() {
  setting.backUpEnabled = document.getElementById("backup_enabled").checked;
  setting.backUpCount = castInt(document.getElementById("backup_count").value);
  document.getElementById("backup_count").disabled = !setting.backUpEnabled;
  saveLocalStorage("setting", setting)
}

function slot_select_parent_Show(a) {
  a.find(".dropdown-menu").html().trim() || a.find(".dropdown-menu").append('\n\t\t<span class="dropdown-header py-1 px-1 font_size_12">���ڐ������</span>\n\t\t\t<div class="d-flex mb-2 justify-content-between">\n\t\t\t\t<div class="align-self-center flex-grow-1">\n\t\t\t\t\t<input type="number" class="form-control form-control-sm slot_input" value="0" min="0" max="99">\n\t\t\t\t</div>\n\t\t\t\t<div class="ml-1 align-self-center">\n\t\t\t\t\t<button type="button" data-ini="0" class="btn btn-sm btn-primary slot_ini">\n\t\t\t\t\t\t<span class="text-nowrap">�����l</span>\n\t\t\t\t\t</button>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<input type="range" class="custom-range slot_range" value="0" min="0" max="99">\n\t\t');
  var b = castInt(a.find(".slot").text());
  a.find(".slot_input").val(b);
  a.find(".slot_range").val(b)
}

function slot_range_Changed(a) {
  var b = a.closest(".slot_select_parent");
  b.find(".slot").text(a.val());
  b.find(".slot_input").val(a.val())
}

function slot_input_Changed(a) {
  var b = validateInputNumber(a.val(), castInt(a.attr("max")));
  a.val(b);
  a.closest(".slot_select_parent").find(".slot").text(b);
  a.next().val(b)
}

function slot_ini_Clicked(a) {
  var b = a.closest(".slot_select_parent");
  a = a.data("ini");
  b.find(".slot").text(a);
  b.find(".slot_input").val(a);
  b.find(".slot_range").val(a)
}

function slot_select_parent_Close(a) {
  var b = castInt(a.find(".slot_input").val()),
    c = castInt(a.find(".slot_input").attr("max"));
  a.find(".slot").text(b > c ? c : b);
  calculate()
}

function btn_reset_landBase_Clicked(a) {
  a.closest(".lb_tab").find(".lb_plane").each(function (a, c) {
    $(c).find(".slot").text(0);
    setLBPlaneDiv($(c))
  });
  a.blur();
  calculate()
}

function lb_plane_DragEnd(a) {
  a = a.closest(".lb_plane");
  isOut && (clearPlaneDiv(a), a.css("opacity", "0.0"), isOut = !1);
  a.animate({
    opacity: "1.0"
  }, 500);
  calculate()
}

function lb_plane_Drop(a, b) {
  var c = b.draggable,
    d = {
      id: castInt(c[0].dataset.planeid),
      remodel: castInt(c.find(".remodel_value")[0].textContent),
      prof: castInt(c.find(".prof_select")[0].dataset.prof),
      slot: castInt(c.find(".slot").text())
    },
    e = {
      id: castInt(a[0].dataset.planeid),
      remodel: castInt(a.find(".remodel_value")[0].textContent),
      prof: castInt(a.find(".prof_select")[0].dataset.prof),
      slot: castInt(a.find(".slot").text())
    };
  setLBPlaneDiv(a, d);
  isCtrlPress || $("#drag_drop_copy").prop("checked") || setLBPlaneDiv(c, e)
}

function btn_reset_ship_plane_Clicked(a) {
  a.closest(".ship_tab").find(".ship_plane").each(function (a, c) {
    clearPlaneDiv($(c))
  });
  calculate()
}

function ship_plane_DragStart(a) {
  $(a.helper).addClass("ship_plane " + getPlaneCss(castInt($(a.helper).find(".plane_img").attr("alt")))).css("width", 320);
  $(a.helper).find(".slot_select_parent").remove();
  $(a.helper).find(".btn_remove_plane").remove();
  $(a.helper).find(".plane_lock").remove();
  $(a.helper).find(".plane_unlock").remove();
  $(a.helper).find(".prof_select_parent").addClass("mr-2")
}

function ship_plane_DragEnd(a) {
  a = a.closest(".ship_plane");
  isOut && (clearPlaneDiv(a), a.css("opacity", "0.0"), isOut = !1);
  a.animate({
    opacity: "1.0"
  }, 500);
  calculate()
}

function ship_plane_DragOver(a, b) {
  var c = b.draggable.closest(".ship_plane"),
    d = castInt(a.closest(".ship_tab")[0].dataset.shipid),
    e = castInt(c[0].dataset.planeid);
  c = castInt(c[0].dataset.type);
  checkInvalidPlane(d, getPlanes(c).find(function (a) {
    return a.id === e
  })) ? (b.helper.stop().animate({
    opacity: "1.0"
  }, 100), isOut = !1) : (b.helper.stop().animate({
    opacity: "0.2"
  }, 100), a.removeClass("plane_draggable_hover"), isOut = !0)
}

function ship_plane_Drop(a, b) {
  if (b.draggable.closest(".ship_plane")[0].dataset.planeid) {
    var c = b.draggable.closest(".ship_plane"),
      d = {
        id: castInt(c[0].dataset.planeid),
        remodel: castInt(c.find(".remodel_value")[0].textContent),
        prof: castInt(c.find(".prof_select")[0].dataset.prof)
      },
      e = {
        id: castInt(a[0].dataset.planeid),
        remodel: castInt(a.find(".remodel_value")[0].textContent),
        prof: castInt(a.find(".prof_select")[0].dataset.prof)
      },
      f = castInt(a.closest(".ship_tab")[0].dataset.shipid);
    checkInvalidPlane(f, PLANE_DATA.find(function (a) {
      return a.id === d.id
    })) && (setPlaneDiv(a, d), isCtrlPress || $("#drag_drop_copy").prop("checked") || setPlaneDiv(c, e))
  }
}

function cell_type_Changed(a, b) {
  b = void 0 === b ? !0 : b;
  var c = a.closest(".battle_content"),
    d = castInt(a.val());
  c.find(".enemy_content").each(function (a, b) {
    d !== CELL_TYPE.grand && 5 < a ? $(b).addClass("d-none").removeClass("d-flex") : $(b).removeClass("d-none").addClass("d-flex")
  });
  c = c.find(".formation");
  changeFormationSelectOption(c, d);
  b && calculate()
}

function changeFormationSelectOption(a, b) {
  var c = castInt(a.val());
  a.find("option").each(function (d, e) {
    b !== CELL_TYPE.grand && (10 > $(e).val() && $(e).removeClass("d-none"), 10 < $(e).val() && $(e).addClass("d-none"), 10 < c && a.val(c - 10));
    b === CELL_TYPE.grand && (10 > $(e).val() && $(e).addClass("d-none"), 10 < $(e).val() && $(e).removeClass("d-none"), 4 === c ? a.val(11) : a.val(c + 10))
  })
}

function enemy_ap_select_parent_Show(a) {
  var b = castInt(a.closest(".enemy_content")[0].dataset.enemyid);
  a.find(".dropdown-header").text(-1 !== b ? "�G�͂Ɂu���ړ��́v���w�肵���ꍇ�ҏW�ł��܂��B" : "����l�����");
  a.find(".enemy_ap_input").prop("disabled", -1 !== b)
}

function enemy_ap_input_Changed(a) {
  var b = validateInputNumber(a.val(), castInt(a.attr("max")));
  a.val(b);
  a.closest(".enemy_ap_select_parent").find(".enemy_ap").text(b)
}

function enemy_ap_select_parent_Close(a) {
  a.find(".enemy_ap_input").prop("disabled") || (a.find(".enemy_ap").text(a.find(".enemy_ap_input").val()), calculate())
}

function plane_type_select_Changed() {
  var a = $("#plane_type_select"),
    b = castInt(a.val()),
    c = getPlanes(b),
    d = $("#plane_word").val().trim(),
    e = [];
  a.find("option").each(function () {
    e.push(castInt($(this).val()))
  });
  if ($target && $target.attr("class").includes("ship_plane") && $target.closest(".ship_tab")[0].dataset.shipid) {
    var f = SHIP_DATA.find(function (a) {
        return a.id === castInt($target.closest(".ship_tab")[0].dataset.shipid)
      }),
      g = LINK_SHIP_EQUIPMENT.find(function (a) {
        return a.type === f.type
      }),
      h = SPECIAL_LINK_SHIP_EQUIPMENT.find(function (a) {
        return a.shipId === f.id
      });
    e = g.e_type.concat();
    h && (e = e.concat(h.equipmentTypes));
    e && e.includes(b) || (b = 0, c = getPlanes(b));
    c = c.filter(function (a) {
      return 151 !== a.id
    });
    h && 0 < h.equipmentTypes.length && (e = e.concat(h.equipmentTypes));
    e = e.filter(function (a, b, c) {
      return c.indexOf(a) === b
    });
    e.sort(function (a, b) {
      return a - b
    });
    c = c.filter(function (a) {
      return e.includes(Math.abs(a.type))
    });
    if (h && 0 < h.equipmentIds.length) {
      g = {};
      h = $jscomp.makeIterator(h.equipmentIds);
      for (var k = h.next(); !k.done; g = {
          $jscomp$loop$prop$id$371: g.$jscomp$loop$prop$id$371
        }, k = h.next()) g.$jscomp$loop$prop$id$371 = k.value, k = PLANE_DATA.find(function (a) {
        return function (b) {
          return b.id === a.$jscomp$loop$prop$id$371
        }
      }(g)), e.push(k.type), c.find(function (a) {
        return function (b) {
          return b.id === a.$jscomp$loop$prop$id$371
        }
      }(g)) || 0 !== b && b !== k.type || c.push(k)
    }
    setPlaneType(document.getElementById("plane_type_select"), e);
    a.val(b)
  } else c = c.filter(function (a) {
    return e.includes(Math.abs(a.type))
  });
  d && (d = replaceKnji(d), c = c.filter(function (a) {
    return a.name.includes(d) || a.abbr.includes(d)
  }));
  var m = $("#plane_sort_select").val();
  a = $("#plane_asc").prop("checked");
  $("#plane_asc").prop("disabled", !1);
  $("#plane_desc").prop("disabled", !1);
  switch (m) {
  case "battle_anti_air":
    a ? c.sort(function (a, b) {
      return a.antiAir + 1.5 * a.interception - (b.antiAir + 1.5 * b.interception)
    }) : c.sort(function (a, b) {
      return b.antiAir + 1.5 * b.interception - (a.antiAir + 1.5 * a.interception)
    });
    break;
  case "defense_anti_air":
    a ? c.sort(function (a, b) {
      return a.antiAir + a.interception + 2 * a.antiBomber - (b.antiAir + b.interception + 2 * b.antiBomber)
    }) : c.sort(function (a, b) {
      return b.antiAir + b.interception + 2 * b.antiBomber - (a.antiAir + a.interception + 2 * a.antiBomber)
    });
    break;
  case "land_base_power":
    a ? c.sort(function (a, b) {
      return getLandBasePower(a.id, 18, 0) - getLandBasePower(b.id, 18, 0)
    }) : c.sort(function (a, b) {
      return getLandBasePower(b.id, 18, 0) - getLandBasePower(a.id, 18, 0)
    });
    break;
  case "radius":
    a ? c.sort(function (a, b) {
      return a.radius - b.radius
    }) : c.sort(function (a, b) {
      return b.radius - a.radius
    });
    break;
  case "history":
    if (setting.selectedHistory[0]) {
      var l = setting.selectedHistory[0];
      c.sort(function (a, b) {
        return l.filter(function (a) {
          return a === b.id
        }).length - l.filter(function (b) {
          return b === a.id
        }).length
      })
    }
  case "default":
    $("#plane_asc").prop("disabled", !0);
    $("#plane_desc").prop("disabled", !0);
    break;
  default:
    a ? c.sort(function (a, b) {
      return a[m] - b[m]
    }) : c.sort(function (a, b) {
      return b[m] - a[m]
    })
  }
  createPlaneTable(c)
}

function plane_word_TextChanged() {
  !1 !== timer && clearTimeout(timer);
  timer = setTimeout(function () {
    plane_type_select_Changed()
  }, 250)
}

function fav_only_Checked_Chenged() {
  setting.favoriteOnly = $("#fav_only").prop("checked");
  saveLocalStorage("setting", setting);
  plane_type_select_Changed()
}

function disp_in_stock_Checked_Chenged() {
  setting.inStockOnly = $("#disp_in_stock").prop("checked");
  saveLocalStorage("setting", setting);
  plane_type_select_Changed()
}

function disp_equipped_Checked_Chenged() {
  setting.visibleEquipped = $("#disp_equipped").prop("checked");
  saveLocalStorage("setting", setting);
  plane_type_select_Changed()
}

function btn_remove_lb_plane_Clicked(a) {
  a = a.closest(".lb_plane");
  clearPlaneDiv(a);
  a.find(".slot").text(0);
  a.find(".slot_input").attr("max", 0);
  a.find(".slot_range").attr("max", 0);
  calculate()
}

function toggle_display_type_Clicked(a) {
  var b = a.closest(".modal");
  b.find(".toggle_display_type").removeClass("selected");
  a.addClass("selected");
  setting.displayMode[b.attr("id")] = a.data("mode");
  saveLocalStorage("setting", setting);
  b.find("select").change()
}

function sort_Changed(a) {
  a = a.closest(".modal");
  var b = a.find(".sort_select").val(),
    c = a.find(".order_asc").prop("checked");
  setting.orderBy[a.attr("id")] = [b, c ? "asc" : "desc"];
  saveLocalStorage("setting", setting);
  a.find("select:first").change()
}

function plane_name_Clicked(a) {
  $target = a.closest(".lb_plane");
  $target.attr("class") || ($target = a.closest(".ship_plane"));
  a = castInt($target[0].dataset.planeid);
  castInt($target[0].dataset.type);
  var b = $("#modal_plane_select").find(".modal-body"),
    c = $("#plane_type_select").val();
  $target.attr("class").includes("ship_plane") ? (b.find(".optg_lb").remove(), 100 < c && (c = 0)) : setPlaneType(document.getElementById("plane_type_select"), PLANE_TYPE.filter(function (a) {
    return 0 < a.id
  }).map(function (a) {
    return a.id
  }));
  $("#plane_type_select").val(c).change();
  $("#modal_plane_select").find(".btn_remove").prop("disabled", 0 === a);
  $("#modal_plane_select").modal("show")
}

function modal_plane_Selected(a) {
  a = {
    id: castInt(a[0].dataset.planeid),
    remodel: castInt(a[0].dataset.remodel)
  };
  $target.attr("class").includes("lb_plane") ? (setLBPlaneDiv($target, a), $target.closest(".lb_tab").find(".ohuda_select").val(isDefMode ? 0 : 2)) : $target.attr("class").includes("ship_plane") && setPlaneDiv($target, a);
  a.id && updatePlaneSelectedHistory(a.id);
  $("#modal_plane_select").modal("hide")
}

function modal_plane_select_btn_remove_Clicked(a) {
  if (a.prop("disabled")) return !1;
  clearPlaneDiv($target);
  $("#modal_plane_select").modal("hide")
}

function btn_plane_preset_Clicked(a) {
  var b = -1;
  $target = a.closest(".lb_tab");
  $target.attr("class") || ($target = a.closest(".ship_tab"), b = castInt($target[0].dataset.shipid));
  $("#modal_plane_preset").data("parentid", b);
  loadPlanePreset();
  $("#modal_plane_preset").modal("show");
  a.blur()
}

function plane_preset_tr_Clicked(a) {
  var b = planePreset.find(function (b) {
    return b.id === castInt(a.data("presetid"))
  });
  $(".preset_tr").removeClass("preset_selected");
  a.addClass("preset_selected");
  drawPlanePresetPreview(b)
}

function preset_name_Changed(a) {
  var b = a.val().trim(),
    c = a.closest(".modal-body").find(".btn_commit_preset"),
    d = a.closest(".modal-body").find(".btn_commit_preset_header");
  40 < b.length ? (a.addClass("is-invalid"), c.prop("disabled", !0), d.prop("disabled", !0)) : 0 === b.length ? (a.addClass("is-invalid"), c.prop("disabled", !0), d.prop("disabled", !0)) : (a.removeClass("is-invalid"), a.addClass("is-valid"), c.prop("disabled", !1), d.prop("disabled", !1));
  $("#modal_main_preset").find(".btn_commit_preset_header").tooltip("hide")
}

function btn_commit_plane_preset_Clicked(a) {
  a.prop("disabled", !0);
  updatePlanePreset();
  loadPlanePreset()
}

function btn_delete_plane_preset_Clicked(a) {
  a.prop("disabled", !0);
  deletePlanePreset();
  loadPlanePreset()
}

function btn_expand_plane_preset_Clicked() {
  var a = castInt($(".preset_selected").data("presetid")),
    b = planePreset.find(function (b) {
      return b.id === a
    });
  b && ($target.attr("class").includes("lb_tab") ? ($target.find(".lb_plane").each(function (a, d) {
    var c = {};
    c.id = b.planes[a];
    setLBPlaneDiv($(d), c)
  }), $target.find(".ohuda_select").val(isDefMode ? 0 : 2)) : $target.find(".ship_plane").each(function (a, d) {
    var c = {};
    c.id = b.planes[a];
    setPlaneDiv($(d), c)
  }));
  $("#modal_plane_preset").modal("hide")
}

function display_ship_count_Changed(a, b) {
  b = void 0 === b ? !1 : b;
  var c = a.val();
  a.closest(".friendFleet_tab").find(".ship_tab").each(function (a, b) {
    a < c ? $(b).removeClass("d-none") : $(b).addClass("d-none")
  });
  b || calculate()
}

function btn_remove_ship_plane_Clicked(a) {
  clearPlaneDiv(a.closest(".ship_plane"));
  calculate()
}

function fleet_select_tab_Clicked() {
  $("#union_fleet").prop("checked") || calculate()
}

function ship_disabled_Changed(a) {
  a.prop("checked") ? a.closest(".ship_tab").addClass("opacity4") : a.closest(".ship_tab").removeClass("opacity4");
  calculate()
}

function ship_name_span_Clicked(a) {
  $target = a.closest(".ship_tab");
  castInt($target[0].dataset.shipid) ? $("#modal_ship_select").find(".btn_remove").prop("disabled", !1) : $("#modal_ship_select").find(".btn_remove").prop("disabled", !0);
  $("#ship_type_select").change();
  $("#modal_ship_select").modal("show")
}

function btn_remove_ship_Clicked(a) {
  clearShipDiv(a.closest(".ship_tab"));
  calculate()
}

function ship_word_TextChanged() {
  !1 !== timer && clearTimeout(timer);
  timer = setTimeout(function () {
    createShipTable([castInt($("#ship_type_select").val())])
  }, 250)
}

function modal_ship_Selected(a) {
  a = castFloat(a[0].dataset.shipid);
  setShipDiv($target, a);
  updateShipSelectedHistory(a);
  $("#modal_ship_select").modal("hide")
}

function modal_ship_select_btn_remove_Clicked(a) {
  if (a.prop("disabled")) return !1;
  clearShipDiv($target);
  $("#modal_ship_select").modal("hide")
}

function battle_count_Changed(a) {
  createEnemyInput(castInt(a.val()));
  calculate()
}

function enemy_fleet_display_mode_Changed() {
  var a = $("#enemy_fleet_display_image").prop("checked");
  $(".enemy_content").each(function (b, c) {
    a ? ($(c).removeClass("py-0_5").addClass("pb-0_1 min-h-31px"), $(c).find(".enemy_name_img_parent").removeClass("d-none").addClass("d-flex"), $(c).find(".enemy_name_text").addClass("d-none")) : ($(c).removeClass("pb-0_1 min-h-31px").addClass("py-0_5"), $(c).find(".enemy_name_img_parent").addClass("d-none").removeClass("d-flex"), $(c).find(".enemy_name_text").removeClass("d-none"))
  });
  setting.enemyFleetDisplayImage = a;
  saveLocalStorage("setting", setting)
}

function btn_reset_battle_Clicked(a) {
  var b = isDefMode ? $("#air_raid_enemies") : a.closest(".battle_content");
  b[0].dataset.celldata = "";
  b.find(".enemy_content").each(function (a, b) {
    return clearEnemyDiv($(b))
  });
  a.blur();
  calculate()
}

function enemy_word_TextChanged() {
  !1 !== timer && clearTimeout(timer);
  timer = setTimeout(function () {
    createEnemyTable([castInt($("#enemy_type_select").val())])
  }, 250)
}

function enemy_name_Clicked(a) {
  $target = a.closest(".enemy_content");
  a = castInt($target[0].dataset.enemyid);
  $("#enemy_type_select").change();
  0 !== a ? $("#modal_enemy_select").find(".btn_remove").prop("disabled", !1) : $("#modal_enemy_select").find(".btn_remove").prop("disabled", !0);
  $("#modal_enemy_select").modal("show")
}

function modal_enemy_Selected(a) {
  setEnemyDiv($target, castInt(a[0].dataset.enemyid));
  $("#modal_enemy_select").modal("hide")
}

function modal_enemy_select_btn_remove(a) {
  if (a.prop("disabled")) return !1;
  clearEnemyDiv($target);
  $("#modal_enemy_select").modal("hide")
}

function btn_world_expand_Clicked() {
  $target = $(".battle_content:first");
  $("#expand_target").text(1);
  $("#btn_expand_enemies").addClass("d-none");
  $("#btn_continue_expand").prop("disabled", !0);
  $("#btn_continue_expand").removeClass("d-none");
  $("#expand_target_parent").removeClass("d-none");
  $("#enemy_pattern_tbody").html("");
  $("#modal_enemy_pattern").modal("show")
}

function btn_enemy_preset_Clicked(a) {
  $target = a.closest(".battle_content");
  isDefMode && ($target = $("#air_raid_enemies"));
  $("#btn_expand_enemies").removeClass("d-none");
  $("#btn_expand_enemies").prop("disabled", !0);
  $("#btn_continue_expand").addClass("d-none");
  $("#expand_target_parent").addClass("d-none");
  $("#modal_enemy_pattern").modal("show")
}

function btn_stage2_Clicked(a) {
  var b = a.closest(".battle_content");
  a = castInt(b.find(".battle_no").text()) - 1;
  b = castInt(b.find(".formation").val());
  $("#modal_stage2_detail").data("battleno", a);
  $("#modal_stage2_detail").data("formationid", b);
  calculateStage2Detail();
  $("#modal_stage2_detail").modal("show")
}

function stage2_slot_input_Changed() {
  var a = $("#stage2_detail_slot"),
    b = validateInputNumber(a.val(), castInt(a.attr("max")));
  a.val(b);
  calculateStage2Detail()
}

function free_modify_input_Changed(a) {
  var b = validateInputNumberFloat(a.val(), castFloat(a.attr("max")));
  a.val() !== b && a.val(b);
  calculateStage2Detail()
}

function calculateStage2Detail() {
  var a = castInt($("#modal_stage2_detail").data("battleno")),
    b = castInt($("#modal_stage2_detail").data("formationid")),
    c = [];
  updateEnemyFleetInfo(c, !1);
  a = c[a];
  var d = castInt($("#stage2_detail_slot").val()),
    e = castInt($("#stage2_detail_avoid").val()),
    f = 0;
  c = "";
  var g = !1,
    h = [166, 167, 409, 410, 411, 412, 413, 414];
  $("#free_modify").find("input").prop("readonly", 5 !== e);
  5 > e && ($("#free_anti_air_weight").val(AVOID_TYPE[e].adj[0]), $("#free_anti_air_bornus").val(AVOID_TYPE[e].adj[1]));
  for (var k = 0, m = 0; m < a.enemies.length; m++) {
    var l = a.enemies[m];
    if (0 !== l.id) {
      var n = Math.floor(d * a.stage2[e][0][k]),
        u = a.stage2[e][1][k],
        p = n + u;
      h.includes(l.id) && (g = !0);
      f += l.aabo;
      c += '\n\t\t<tr class="' + (p >= d ? "stage2_table_death" : p >= d / 2 ? "stage2_table_half" : "") + '">\n\t\t\t<td class="font_size_12 text-left td_enm_name" data-toggle="tooltip" data-html="true"\n\t\t\t\tdata-title="<div><div>���d�΋�l�F' + l.aaw + "</div><div>�h��{�[�i�X�F" + l.aabo + '</div></div>">\n\t\t\t\t<span class="ml-2">\n\t\t\t\t\t' + drawEnemyGradeColor(l.name) + '\n\t\t\t\t</span>\n\t\t\t</td>\n\t\t\t<td>\n\t\t\t\t<span class="text-right">\n\t\t\t\t\t' + (100 * a.stage2[e][0][k++]).toFixed(1) + "% (" + n + "�@)</span>\n\t\t\t</td>\n\t\t\t<td>" + u + "�@</td>\n\t\t\t<td>" + p + "�@</td>\n\t\t</tr>\n\t\t"
    }
  }
  d = FORMATION.find(function (a) {
    return a.id === b
  });
  f = 2 * Math.floor((d ? d.correction : 1) * f);
  a.cellType <= CELL_TYPE.grand ? $("#is_air_raid").addClass("d-none") : $("#is_air_raid").removeClass("d-none");
  a.cellType <= CELL_TYPE.grand && g ? $("#stage2_warning").removeClass("d-none") : $("#stage2_warning").addClass("d-none");
  $("#stage2_table tbody").html(c);
  $(".td_enm_name").tooltip();
  $("#stage2_detail_formation").text(d.name);
  $("#sumfleetAntiAir").text(f)
}

function node_tr_Clicked(a) {
  $(".node_tr").removeClass("node_selected");
  a.addClass("node_selected");
  createEnemyPattern()
}

function pattern_Changed(a) {
  a = castInt(a.data("disp"), -1);
  0 > a || createEnemyPattern(a)
}

function enemy_display_mode_Changed(a) {
  setting.enemyDisplayImage = a.attr("id").includes("enemy_display_image");
  saveLocalStorage("setting", setting);
  a = castInt($("#enemy_pattern_select").find(".nav-link.active").data("disp"));
  0 < a ? createEnemyPattern(a) : createEnemyPattern()
}

function node_Clicked(a) {
  $(".node_tr").removeClass("node_selected");
  $('.node_tr[data-node="' + a.attr("title") + '"').addClass("node_selected");
  createEnemyPattern()
}

function node_DoubleClicked() {
  $(".node_tr").hasClass("node_selected") && ($("#btn_expand_enemies").hasClass("d-none") ? (btn_continue_expand_Clicked(), $(".node_tr").removeClass("node_selected")) : btn_expand_enemies())
}

function btn_expand_enemies() {
  expandEnemy();
  $("#modal_enemy_pattern").modal("hide")
}

function btn_continue_expand_Clicked() {
  var a = castInt($("#expand_target").text());
  1 === a && clearEnemyDivAll();
  createEnemyInput(a);
  $("#expand_target").text(a + 1);
  $target = $(document.getElementsByClassName("battle_content")[a - 1]);
  expandEnemy();
  $("#enemy_pattern_tbody").html("<div>" + a + " ��ڂ̓G�͑����}������܂����B</div><div>������ꍇ�͍ēx�퓬�}�X��I�����Ă��������B<div>");
  $("#enemy_pattern_select").html('<li class="nav-item"><a class="nav-link ' + ("#000000" === mainColor ? "" : "nav-link-dark") + ' active" data-toggle="tab" href="#">�Ґ�1</a></li>');
  $("#enemy_pattern_air_power").text("0");
  $("#enemy_display_mode_parent").addClass("d-none").removeClass("d-flex");
  $(".node_selected").removeClass("node_selected");
  $("#btn_continue_expand").prop("disabled", !0);
  (isDefMode || 10 === a) && $("#modal_enemy_pattern").modal("hide")
}

function shoot_down_table_tbody_MouseEnter(a) {
  a = a.closest("tr");
  var b = castInt(a[0].dataset.shipindex),
    c = a[0].dataset.css;
  a.addClass("bg-hover");
  a.find(".td_plane_name").addClass(c);
  $("#shoot_down_table_tbody").find('tr[data-shipindex="' + b + '"]:first').find(".td_name").addClass("bg-hover")
}

function shoot_down_table_tbody_MouseLeave(a) {
  a = a.closest("tr");
  var b = castInt(a[0].dataset.shipindex),
    c = a[0].dataset.css;
  a.removeClass("bg-hover");
  a.find(".td_plane_name").removeClass(c);
  $("#shoot_down_table_tbody").find('tr[data-shipindex="' + b + '"]:first').find(".td_name").removeClass("bg-hover")
}

function progress_area_MouseEnter(a) {
  a = a.find(".result_bar");
  var b = castInt(a.data("airstatus")),
    c = castInt(a.attr("id").replace("result_bar_", ""));
  a.addClass("bar_ex_status" + b);
  $("#rate_row_" + c).addClass("bg_status" + b)
}

function progress_area_MouseLeave(a) {
  a = a.find(".result_bar");
  var b = castInt(a.data("airstatus")),
    c = castInt(a.attr("id").replace("result_bar_", ""));
  a.removeClass("bar_ex_status" + b);
  $("#rate_row_" + c).removeClass("bg_status" + b)
}

function rate_table_MouseEnter(a) {
  a = castInt(a.closest("tr").attr("id").replace("rate_row_", ""));
  var b = $("#result_bar_" + a),
    c = castInt(b.data("airstatus"));
  b.addClass("bar_ex_status" + c);
  $("#rate_row_" + a).addClass("bg_status" + c)
}

function rate_table_MouseLeave(a) {
  a = castInt(a.closest("tr").attr("id").replace("rate_row_", ""));
  var b = $("#result_bar_" + a),
    c = castInt(b.data("airstatus"));
  b.removeClass("bar_ex_status" + c);
  $("#rate_row_" + a).removeClass("bg_status" + c)
}

function enemy_shoot_down_table_tbody_MouseEnter(a) {
  a = a.closest("tr");
  var b = castInt(a[0].dataset.rowindex),
    c = a[0].dataset.css;
  a.addClass("bg-hover");
  a.find(".td_plane_name").addClass(c);
  $("#enemy_shoot_down_tbody").find(".enemy_no_" + b + ":first").find(".td_name").addClass("bg-hover")
}

function enemy_shoot_down_table_tbody_MouseLeave(a) {
  a = a.closest("tr");
  var b = castInt(a[0].dataset.rowindex),
    c = a[0].dataset.css;
  a.removeClass("bg-hover");
  a.find(".td_plane_name").removeClass(c);
  $("#enemy_shoot_down_tbody").find(".enemy_no_" + b + ":first").find(".td_name").removeClass("bg-hover")
}

function display_battle_tab_Changed(a) {
  displayBattle = castInt(a.find(".nav-link").data("disp"));
  calculate()
}

function display_result_Changed() {
  if ($("#display_land_base_result").prop("checked"))
    for (var a = 1; 7 > a; a++) $("#rate_row_" + a + ":not(.disabled_tr)").removeClass("d-none"), $("#result_bar_" + a).closest(".progress_area:not(.disabled_bar)").removeClass("d-none").addClass("d-flex");
  else
    for (a = 1; 7 > a; a++) $("#rate_row_" + a).addClass("d-none"), $("#result_bar_" + a).closest(".progress_area").addClass("d-none").removeClass("d-flex");
  $("#display_fleet_result").prop("checked") ? ($("#rate_row_7:not(.disabled_tr)").removeClass("d-none"), $("#result_bar_7").closest(".progress_area:not(.disabled_bar)").removeClass("d-none").addClass("d-flex")) : ($("#rate_row_7").addClass("d-none"), $("#result_bar_7").closest(".progress_area").addClass("d-none").removeClass("d-flex"));
  $("#display_bar").prop("checked") ? $("#result_bar_parent").removeClass("d-none") : $("#result_bar_parent").addClass("d-none");
  $("#display_enemy_table").prop("checked") ? $("#enemy_shoot_down_table_parent").removeClass("d-none") : $("#enemy_shoot_down_table_parent").addClass("d-none")
}

function land_base_detail_Clicked(a) {
  landBaseDetailCalculate(castInt(a.data("base_no")), 0);
  $("#modal_result_detail").modal("show")
}

function fleet_slot_Clicked(a) {
  var b = castInt(a[0].dataset.shipid),
    c = castInt(a[0].dataset.shipindex),
    d = castInt(a[0].dataset.slotindex);
  "-" !== a.find(".td_plane_name").text() && "" !== a.find(".td_plane_name").text() && (fleetSlotDetailCalculate(c, d, b), $("#modal_result_detail").modal("show"))
}

function enemy_slot_Clicked(a) {
  var b = castInt(a.closest("tr")[0].dataset.rowindex);
  a = castInt(a.closest("tr")[0].dataset.slotindex);
  enemySlotDetailCalculate(b, a);
  $("#modal_result_detail").modal("show")
}

function innerProfSetting_Clicked(a) {
  var b = castInt(a.attr("id").replace("prof120_", ""));
  a.prop("checked") && !initialProf120Plane.includes(b) ? initialProf120Plane.push(b) : !a.prop("checked") && initialProf120Plane.includes(b) && (initialProf120Plane = initialProf120Plane.filter(function (a) {
    return a !== b
  }));
  setting.initialProf120 = initialProf120Plane.sort(function (a, b) {
    return a - b
  });
  saveLocalStorage("setting", setting);
  calculate()
}

function calculate_count_Changed(a) {
  var b = validateInputNumber(a.val(), 1E5);
  a.val(b);
  setting.simulateCount = b;
  saveLocalStorage("setting", setting)
}

function auto_save_Clicked() {
  setting.autoSave = $("#auto_save").prop("checked");
  saveLocalStorage("setting", setting);
  setting.autoSave || deleteLocalStorage("autoSaveData")
}

function clipboard_mode_Clicked() {
  "function" !== typeof ClipboardItem && ($("#clipboard_mode").prop("checked", !1), $("#cant_use_clipboard").removeClass("d-none"));
  setting.copyToClipboard = $("#clipboard_mode").prop("checked");
  saveLocalStorage("setting", setting)
}

function air_raid_max_Clicked() {
  setting.airRaidMax = $("#air_raid_max").prop("checked");
  saveLocalStorage("setting", setting)
}

function btn_reset_localStorage_Clicked() {
  var a = $("#modal_confirm");
  a.find(".modal-body").html('\n\t\t<div>�u���E�U�ɕۑ����ꂽ���́E�ݒ�f�[�^���폜���܂��B</div>\n\t\t<div class="mt-3">�o�^�E�ۑ�����Ă���Ґ��f�[�^�⑕���v���Z�b�g�A������������e��ڍאݒ�l�ȂǑS�Ẵf�[�^���폜����܂��B</div>\n\t\t<div>�폜�����f�[�^�͌��ɖ߂��܂���̂Œ��ӂ��Ă��������B</div>\n\t\t<div class="mt-3">�{�T�C�g�̗��p�𒆎~����ꍇ�A�폜��Ƀy�[�W���ēǂݍ��݂��Ă��܂��ƍēx�ݒ�f�[�^����������邽�߁A�폜��͒����ɃT�C�g����Ă��������B</div>\n\t\t<div class="mt-3">��낵����΁AOK�{�^���������Ă��������B</div>\n\t');
  confirmType = "deleteLocalStorageAll";
  a.modal("show")
}

function btn_reset_selected_plane_history_Clicked() {
  var a = $("#modal_confirm");
  a.find(".modal-body").html('\n\t\t<div>�悭�g���Ƃ��ēo�^���ꂽ�@�̏����폜���܂��B</div>\n\t\t<div class="mt-3">��낵����΁AOK�{�^���������Ă��������B</div>\n\t');
  confirmType = "deleteSelectedPlaneHistory";
  a.modal("show")
}

function btn_reset_selected_ship_history_Clicked() {
  var a = $("#modal_confirm");
  a.find(".modal-body").html('\n\t\t<div>�悭�g���Ƃ��ēo�^���ꂽ�͖������폜���܂��B</div>\n\t\t<div class="mt-3">��낵����΁AOK�{�^���������Ă��������B</div>\n\t');
  confirmType = "deleteSelectedShipHistory";
  a.modal("show")
}

function site_theme_Changed(a) {
  a = void 0 === a ? !0 : a;
  document.body.classList.remove("dark-theme");
  document.body.classList.remove("body-dark-gradient");
  document.body.classList.remove("body-deep-blue");
  if (document.getElementById("normal_theme").checked) {
    setting.themeColor = "normal";
    document.body.style.backgroundColor = "#f0ebe6";
    mainColor = "#000000";
    var b = $jscomp.makeIterator(document.getElementsByClassName("contents"));
    for (d = b.next(); !d.done; d = b.next()) d = d.value, d.style.backgroundColor = "rgba(255, 255, 255, 0.941)",
      d.classList.remove("contents-dark");
    b = $jscomp.makeIterator(document.getElementsByClassName("modal-content"));
    for (d = b.next(); !d.done; d = b.next()) d.value.classList.remove("modal-content-deep");
    b = $jscomp.makeIterator(document.getElementsByClassName("custom_table"));
    for (d = b.next(); !d.done; d = b.next()) d.value.classList.remove("custom_table_dark")
  } else {
    mainColor = "#e0e0e0";
    document.body.classList.add("dark-theme");
    document.getElementById("dark_theme").checked && (setting.themeColor = "dark", document.body.style.backgroundColor = "#20222d");
    document.getElementById("dark_gradient_theme").checked && (setting.themeColor = "dark-gradient", document.body.classList.add("body-dark-gradient"));
    if (b = document.getElementById("deep_blue_theme").checked) setting.themeColor = "deep-blue", document.body.classList.add("body-deep-blue");
    for (var c = $jscomp.makeIterator(document.getElementsByClassName("contents")), d = c.next(); !d.done; d = c.next()) d = d.value, d.style.backgroundColor = "rgba(255, 255, 255, 0.047)", d.classList.add("contents-dark");
    c = $jscomp.makeIterator(document.getElementsByClassName("modal-content"));
    for (d = c.next(); !d.done; d = c.next()) d = d.value, b ? d.classList.add("modal-content-deep") : d.classList.remove("modal-content-deep");
    b = $jscomp.makeIterator(document.getElementsByClassName("custom_table"));
    for (d = b.next(); !d.done; d = b.next()) d.value.classList.add("custom_table_dark")
  }
  document.getElementById("input_url").classList.add("form-control-dark");
  saveLocalStorage("setting", setting);
  document.body.style.color = mainColor;
  a && calculate()
}

function stock_type_select_Changed() {
  var a = Math.abs(castInt($("#stock_type_select").val())),
    b = $("#stock_word").val().trim();
  b && (b = replaceKnji(b));
  $(".stock_tr").each(function (c, d) {
    0 < a && !$(d).hasClass("type_" + a) ? $(d).addClass("d-none").removeClass("d-flex") : b && !$(d).find(".stock_td_name").text().includes(b) ? $(d).addClass("d-none").removeClass("d-flex") : $(d).addClass("d-flex").removeClass("d-none")
  })
}

function btn_load_equipment_json_Clicked() {
  var a = $("#input_equipment_json").val().trim();
  readEquipmentJson(a) ? (setPlaneStockTable(), $("#input_equipment_json").val(""), $("#input_equipment_json").removeClass("is-invalid").addClass("is-valid")) : ($("#input_equipment_json").addClass("is-invalid").removeClass("is-valid"), $("#input_equipment_json").nextAll(".invalid-feedback").text("�������̓ǂݍ��݂Ɏ��s���܂����B���͂��ꂽ�f�[�^�`�����������Ȃ��\��������܂��B"))
}

function input_equipment_json_Changed(a) {
  var b = a.val().trim(),
    c = $("#btn_load_equipment_json");
  0 === b.length ? (a.addClass("is-invalid").removeClass("is-valid"), a.nextAll(".invalid-feedback").text("�f�[�^�����͂���Ă��܂���B"), c.prop("disabled", !0)) : (a.removeClass("is-invalid"), c.prop("disabled", !1))
}

function btn_fav_clear_Clicked() {
  var a = $("#modal_confirm");
  a.find(".modal-body").html('\n\t\t<div>���C�ɓ���@�̏������Z�b�g���܂��B</div>\n\t\t<div class="mt-3">��낵����΁AOK�{�^���������Ă��������B</div>\n\t');
  confirmType = "resetFavoritePlane";
  a.modal("show")
}

function btn_stock_all_clear_Clicked() {
  var a = $("#modal_confirm");
  a.find(".modal-body").html('\n\t\t<div>�����@�̏������Z�b�g���܂��B</div>\n\t\t<div class="mt-3">���ݕۑ�����Ă��鏊��������񂪍폜����A�S�Ă̋@�̂̏�������0�ƂȂ�܂��B</div>\n\t\t<div class="mt-3">��낵����΁AOK�{�^���������Ă��������B</div>\n\t');
  confirmType = "resetStock";
  a.modal("show")
}

function stock_word_TextChanged() {
  !1 !== timer && clearTimeout(timer);
  timer = setTimeout(function () {
    stock_type_select_Changed()
  }, 250)
}

function stock_td_fav_Clicked(a) {
  var b = castInt(a.closest(".stock_tr").data("planeid"));
  a.hasClass("plane_fav") ? (setting.favoritePlane = setting.favoritePlane.filter(function (a) {
    return a !== b
  }), a.addClass("plane_unfav unfav_clicked").removeClass("plane_fav"), setTimeout(function () {
    a.removeClass("unfav_clicked")
  }, 500)) : (setting.favoritePlane.push(b), a.addClass("plane_fav fav_clicked").removeClass("plane_unfav"), setTimeout(function () {
    a.removeClass("fav_clicked")
  }, 500));
  saveLocalStorage("setting", setting)
}

function stock_tr_Clicked(a) {
  var b = $("#modal_plane_stock"),
    c = b.find(".plane_status_tr"),
    d = PLANE_DATA.find(function (b) {
      return b.id === castInt(a.data("planeid"))
    }),
    e = loadPlaneStock().find(function (a) {
      return a.id === d.id
    });
  b.find(".stock_num").each(function (a, b) {
    $(b).val(e.num[a]);
    0 < a && $(b).prop("disabled", !d.canRemodel)
  });
  c.find(".plane_status_anti_air").text(d.antiAir);
  c.find(".plane_status_torpedo").text(d.torpedo);
  c.find(".plane_status_bomber").text(d.bomber);
  c.find(".plane_status_radius").text(d.radius);
  c.find(".plane_status_interception").text(d.interception);
  c.find(".plane_status_anti_bomber").text(d.antiBomber);
  c = c.find(".plane_status_avoid");
  var f = AVOID_TYPE.find(function (a) {
    return a.id === d.avoid
  });
  f ? (c.text(f.name), c.attr("title", "�������ĕ␳�F" + f.adj[0] + ", �Œ茂�ĕ␳�F" + f.adj[1])) : (c.text("�Ȃ�"), c.attr("title", "�������ĕ␳�F1.0, �Œ茂�ĕ␳�F1.0"));
  b.find("#edit_id").text(d.id);
  b.find(".plane_status_name").text(d.name);
  b.find("#stock_sum").val(getArraySum(e.num));
  b.find(".img_plane_card").attr("src", "img/plane/" + d.id + ".png");
  b.modal("show")
}

function stock_Changed(a) {
  var b = castInt(a.val()),
    c = 0;
  $(".stock_num").each(function (a, b) {
    c += castInt($(b).val())
  });
  99 < c && (b -= c - 99, c = 99);
  a.val(validateInputNumber(b, 99));
  $("#stock_sum").val(c)
}

function btn_save_stock_Clicked() {
  var a = loadPlaneStock(),
    b = castInt($("#edit_id").text()),
    c = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  $(".stock_num").each(function (a, b) {
    c[a] = castInt($(b).val())
  });
  a.find(function (a) {
    return a.id === b
  }).num = c;
  saveLocalStorage("planeStock", a);
  $("#modal_plane_stock").modal("hide");
  setPlaneStockTable()
}

function btn_stock_reset_Clicked() {
  $("#modal_plane_stock").find(".stock_num").val("0");
  $("#modal_plane_stock").find("#stock_sum").val("0")
}

function btn_calculate_detail() {
  var a = $("#calculate_count").val();
  $("#calculate_count").val($("#detail_calculate_count").val());
  detailCalculate();
  $("#btn_calculate_detail").prop("disabled", !0);
  $("#calculate_count").val(a)
}

function detail_slot_tab_Changed(a) {
  a.find(".nav-link").hasClass("disabled") || ($("#detail_info").data("slot_no", castInt(a.data("slot_no"))), detailCalculate())
}

function btn_show_detail_Clicked(a) {
  $("#detail_info").data("slot_no", castInt(a[0].dataset.slot_no));
  detailCalculate()
}

function modal_confirm_ok_Clicked() {
  switch (confirmType) {
  case "deleteLocalStorageAll":
    window.localStorage.clear();
    break;
  case "resetStock":
    deleteLocalStorage("planeStock");
    setPlaneStockTable();
    break;
  case "resetFavoritePlane":
    setting.favoritePlane = [];
    setting.favoriteOnly = !1;
    $("#fav_only").prop("checked", !1);
    saveLocalStorage("setting", setting);
    setPlaneStockTable();
    break;
  case "deleteSelectedPlaneHistory":
    setting.selectedHistory[0] = [];
    saveLocalStorage("setting", setting);
    break;
  case "deleteSelectedShipHistory":
    setting.selectedHistory[1] = [], saveLocalStorage("setting", setting)
  }
  confirmType = null;
  $("#modal_confirm").modal("hide")
}

function btn_preset_all_Clicked() {
  loadMainPreset();
  $("#modal_main_preset").modal("show")
}

function btn_auto_expand_Clicked() {
  $("#alert_auto_expand").addClass("d-none");
  $("#modal_auto_expand").modal("show")
}

function btn_twitter_Clicked() {
  var a, b;
  return $jscomp.asyncExecutePromiseGeneratorProgram(function (c) {
    if (1 == c.nextAddress) return b = a = "https://noro6.github.io/kcTools/?d=" + encodePreset(), c.yield(postURLData(a).then(function (a) {
      a.error || !a.shortLink ? console.log(a) : b = a.shortLink
    })["catch"](function (a) {
      return console.error(a)
    }), 2);
    window.open("https://twitter.com/share?url=" + b);
    c.jumpToEnd()
  })
}

function btn_deckBuilder_Clicked() {
  window.open("http://kancolle-calc.net/deckbuilder.html?predeck=" + convertToDeckBuilder())
}

function btn_undo_Clicked() {
  var a = undoHisotry.index + 1;
  if (!(a >= undoHisotry.histories.length || document.getElementById("btn_undo").classList.contains("disabled"))) {
    var b = undoHisotry.histories.concat();
    expandMainPreset(decodePreset(undoHisotry.histories[a]));
    calculate();
    undoHisotry.index = a;
    undoHisotry.histories = b;
    a + 1 === undoHisotry.histories.length && document.getElementById("btn_undo").classList.add("disabled");
    document.getElementById("btn_redo").classList.remove("disabled")
  }
}

function btn_redo_Clicked() {
  var a = undoHisotry.index - 1;
  if (!(0 > a || document.getElementById("btn_redo").classList.contains("disabled"))) {
    var b = undoHisotry.histories.concat();
    expandMainPreset(decodePreset(undoHisotry.histories[undoHisotry.index - 1]));
    calculate();
    undoHisotry.index = a;
    undoHisotry.histories = b;
    0 > a - 1 ? document.getElementById("btn_redo").classList.add("disabled") : document.getElementById("btn_redo").classList.remove("disabled")
  }
}

function btn_url_shorten_Clicked() {
  var a, b, c, d;
  return $jscomp.asyncExecutePromiseGeneratorProgram(function (e) {
    if (1 == e.nextAddress) {
      a = document.getElementById("btn_url_shorten");
      b = document.getElementById("input_url");
      c = b.value.trim();
      if (a.classList.contains("shortening")) return e["return"]();
      a.classList.add("shortening");
      a.textContent = "�Z�k��";
      return c ? c.match(/^(https?|ftp)(:\/\/[-_.!~*'()a-zA-Z0-9;\/?:@&=+\$,%#]+)$/) ? c.match(/^(https:\/\/aircalc.page.link\/)([.!~*'()a-zA-Z0-9;\/?:@&=+\$,%#]+)$/) ? e.jumpTo(2) : e.yield(postURLData(c).then(function (a) {
        a.error || !a.shortLink ? (b.value = "", b.placeholder = "�Z�k�Ɏ��s���܂���") : (b.value = a.shortLink, b.placeholder = "")
      })["catch"](function (a) {
        b.value = "";
        b.placeholder = "�Z�k�Ɏ��s���܂���"
      }), 2) : (b.value = "", (d = readDeckBuilder(c)) ? (expandMainPreset(d, 0 < d[0][0].length, !0, !1), calculate(), b.placeholder = "�Ґ��̔��f�ɐ������܂����B") : readEquipmentJson(c) ? (setPlaneStockTable(), calculate(), b.placeholder = "���������̔��f�ɐ������܂����B") : b.placeholder = "URL���s���ł��B", e.jumpTo(2)) : (b.value = "", b.placeholder = "URL����͂��Ă��������B", e.jumpTo(2))
    }
    a.textContent = "URL�Z�k";
    a.classList.remove("shortening");
    e.jumpToEnd()
  })
}

function main_preset_tab_Changed(a) {
  "main_preset_back_up" === a.relatedTarget.id ? ($("#modal_main_preset").find(".preset_thead").addClass("d-none"), $(".back_up_text").removeClass("d-none"), loadMainPreset(!0)) : ($("#modal_main_preset").find(".preset_thead").removeClass("d-none"), $(".back_up_text").addClass("d-none"), loadMainPreset(!1))
}

function main_preset_tr_Clicked(a) {
  var b = $("#main_preset_back_up").hasClass("active");
  $(".preset_tr").removeClass("preset_selected");
  a.addClass("preset_selected");
  drawMainPreset((b ? backUpPresets : presets).find(function (b) {
    return b[0] === castInt(a.data("presetid"))
  }))
}

function preset_remarks_Changed(a) {
  var b = a.val().trim(),
    c = a.closest(".modal-body").find(".btn_commit_preset"),
    d = a.closest(".modal-body").find(".btn_commit_preset_header");
  400 < b.length ? (a.addClass("is-invalid"), c.prop("disabled", !0), d.prop("disabled", !0)) : (a.removeClass("is-invalid"), a.addClass("is-valid"), c.prop("disabled", !1), d.prop("disabled", !1))
}

function input_deck_Changed(a) {
  var b = a.val().trim(),
    c = a.closest(".modal-body").find(".btn_load_deck");
  0 === b.length ? (a.addClass("is-invalid").removeClass("is-valid"), a.nextAll(".invalid-feedback").text("�f�[�^�����͂���Ă��܂���B"), c.prop("disabled", !0)) : (a.removeClass("is-invalid"), c.prop("disabled", !1))
}

function output_data_Clicked(a) {
  a.hasClass("is-valid") && copyInputTextToClipboard(a) && a.nextAll(".valid-feedback").text("�N���b�v�{�[�h�ɃR�s�[���܂����B")
}

function output_data_Changed(a) {
  a.removeClass("is-valid")
}

function btn_commit_main_preset_Clicked() {
  updateMainPreset();
  loadMainPreset()
}

function btn_commit_preset_header_Clicked() {
  updateMainPresetName();
  loadMainPreset()
}

function btn_delete_main_preset_Clicked() {
  var a = castInt($("#modal_main_preset").find(".preset_selected").data("presetid"));
  deleteMainPreset(a)
}

function btn_load_deck_Clicked() {
  var a = $("#input_deck").val().trim();
  (a = readDeckBuilder(a)) ? (expandMainPreset(a, 0 < a[0][0].length, !0, !1), $("#input_deck").removeClass("is-invalid").addClass("is-valid")) : ($("#input_deck").addClass("is-invalid").removeClass("is-valid"), $("#input_deck").nextAll(".invalid-feedback").text("�Ґ��̓ǂݍ��݂Ɏ��s���܂����B���͂��ꂽ�f�[�^�̌`�����������Ȃ��\��������܂��B"))
}

function btn_output_url_Clicked() {
  var a, b, c;
  return $jscomp.asyncExecutePromiseGeneratorProgram(function (d) {
    if (1 == d.nextAddress) return d.setCatchFinallyBlocks(2), a = $("#output_url"), c = b = "https://noro6.github.io/kcTools/?d=" + encodePreset(), d.yield(postURLData(b).then(function (a) {
      a.error || !a.shortLink ? console.log(a) : c = a.shortLink
    })["catch"](function (a) {
      return console.error(a)
    }), 4);
    if (2 != d.nextAddress) return a.val(c), a.nextAll(".valid-feedback").text("�������܂����B��LURL���N���b�N����ƃN���b�v�{�[�h�ɃR�s�[����܂��B"),
      a.removeClass("is-invalid").addClass("is-valid"), d.leaveTryBlock(0);
    d.enterCatchBlock();
    $("#output_url").addClass("is-invalid").removeClass("is-valid");
    return d["return"]()
  })
}
var xxx = "AIzaSyC_rEnvKFFlZv54xvxP8MXPht081xYol4s";

function btn_output_deck_Clicked() {
  var a = convertToDeckBuilder(),
    b = $("#output_deck");
  $("#output_deck").val(a);
  a ? (b.nextAll(".valid-feedback").text("�������܂����B��L��������N���b�N����ƃN���b�v�{�[�h�ɃR�s�[����܂��B"), b.removeClass("is-invalid").addClass("is-valid")) : b.addClass("is-invalid").removeClass("is-valid")
}

function btn_expand_main_preset_Clicked() {
  var a = ($("#main_preset_back_up").hasClass("active") ? backUpPresets : presets).find(function (a) {
    return a[0] === castInt($("#modal_main_preset").find(".preset_selected")[0].dataset.presetid)
  });
  expandMainPreset(decodePreset(a[2]));
  $("#modal_main_preset").modal("hide")
}

function btn_start_auto_expand_Clicked() {
  $("#auto_land_base_1").prop("checked") || $("#auto_land_base_2").prop("checked") || $("#auto_land_base_3").prop("checked") || $("#auto_fleet").prop("checked") ? (autoExpand(), $("#alert_auto_expand").text("���܂����͍ڋ@�z�����������܂����B"), $("#alert_auto_expand").addClass("alert-success").removeClass("alert-danger d-none")) : ($("#alert_auto_expand").text("�z���Ώۂ�I�����Ă��������B"), $("#alert_auto_expand").removeClass("alert-success d-none").addClass("alert-danger"))
}

function battle_mode_Clicked() {
  $("#mode_1").prop("checked") ? ($("#auto_fleet").closest("div").removeClass("d-none"), $("#dest_range_parent").removeClass("d-none"), $("#details_parent").removeClass("d-none")) : ($("#auto_fleet").prop("checked", !1), $("#auto_fleet").closest("div").addClass("d-none"), $("#dest_range_parent").addClass("d-none"), $("#details_parent").addClass("d-none"))
}

function expand_target_Clicked() {
  $("#alert_auto_expand").addClass("d-none");
  $("#btn_start_auto_expand").prop("disabled", !1);
  $("#auto_land_base_1").prop("checked") || $("#auto_land_base_2").prop("checked") || $("#auto_land_base_3").prop("checked") ? $("#dest_range").prop("disabled", !1) : ($("#dest_range").prop("disabled", !0), $("#auto_fleet").prop("checked") || $("#btn_start_auto_expand").prop("disabled", !0))
}

function dest_ap_Changed(a) {
  a.val(validateInputNumber(a.val(), castInt(a.attr("max"))))
}

function simple_enemy_ap_Changed(a) {
  var b = validateInputNumber(a.val(), castInt(a.attr("max")));
  a.val(b);
  a = getAirStatusBorder(b);
  for (b = 0; b < a.length; b++) $("#border_" + b).text(a[b])
}

function menu_small_Clicked() {
  $("#modal_smart_menu").find(".modal-body").html($("#Navbar").html());
  $("#modal_smart_menu").find(".mt-5").removeClass("mt-5").addClass("mt-3");
  $("#modal_smart_menu").modal("show")
}

function smart_menu_modal_link_Clicked(a) {
  sidebar_Clicked(a);
  setTimeout(function () {
    $("#modal_smart_menu").modal("hide")
  }, 220);
  return !1
}

function varsion_Closed() {
  $("#alreadyRead").prop("checked") && (setting.version = $("#version").text(), saveLocalStorage("setting", setting))
}

function first_time_Clicked() {
  $("#site_abstract_content").collapse("show");
  setTimeout(function () {
    $("body,html").animate({
      scrollTop: $("#first_time_content").offset().top - 80
    }, 300, "swing")
  }, 200);
  return !1
}

function site_manual_Clicked() {
  $("#site_abstract_content").collapse("show");
  setTimeout(function () {
    $("body,html").animate({
      scrollTop: $("#site_manual_content").offset().top - 80
    }, 300, "swing")
  }, 200);
  return !1
}

function scrollContent(a) {
  a.collapse("show");
  setTimeout(function () {
    $("body,html").animate({
      scrollTop: a.offset().top - 80
    }, 300, "swing")
  }, 250);
  return !1
}
document.addEventListener("DOMContentLoaded", function () {
  initialize(function () {
    var a = getUrlParams();
    if (setting.autoSave) {
      var b = loadLocalStorage("autoSaveData");
      expandMainPreset(decodePreset(b))
    }
    if (a.hasOwnProperty("d")) decodePreset(a.d), expandMainPreset(decodePreset(a.d));
    else if (a.hasOwnProperty("predeck") || a.hasOwnProperty("lb"))
      if (a.hasOwnProperty("predeck") && (readDeckBuilder(a.predeck), (b = readDeckBuilder(a.predeck)) && expandMainPreset(b, 0 < b[0][0].length, !0, !1)), a.hasOwnProperty("lb")) try {
        var c = JSON.parse(decodeURIComponent(a.lb));
        2 <= c.length && expandMainPreset([c, [],
          []
        ], !0, !1, !1)
      } catch (d) {}
    calculate();
    document.getElementById("btn_undo").classList.add("disabled");
    document.getElementById("btn_redo").classList.add("disabled")
  });
  $(document).keyup(function (a) {
    isCtrlPress && 17 === a.keyCode && (isCtrlPress = !1)
  });
  $(document).keydown(function (a) {
    isCtrlPress || 17 !== a.keyCode || (isCtrlPress = !0);
    isCtrlPress && "z" === a.key ? btn_undo_Clicked() : isCtrlPress && "y" === a.key && btn_redo_Clicked()
  });
  $("#modal_version_inform").on("hide.bs.modal", varsion_Closed);
  $(".modal").on("hide.bs.modal", function () {
    modal_Closed($(this))
  });
  $(".modal").on("show.bs.modal", function () {
    $(".btn_preset").tooltip("hide")
  });
  $(".modal").on("click", ".toggle_display_type", function () {
    toggle_display_type_Clicked($(this))
  });
  $(".modal").on("input", ".preset_name", function () {
    preset_name_Changed($(this))
  });
  $(".modal").on("blur", ".preset_name", function () {
    preset_name_Changed($(this))
  });
  $(".slot_select_parent").on("show.bs.dropdown", function () {
    slot_select_parent_Show($(this))
  });
  $(".slot_select_parent").on("hide.bs.dropdown", function () {
    slot_select_parent_Close($(this))
  });
  $(".remodel_select_parent").on("hide.bs.dropdown", function () {
    remodelSelect_Changed($(this))
  });
  $(".remodel_select_parent").on("show.bs.dropdown", function () {
    remodelSelect_Shown($(this))
  });
  $(".prof_select_parent").on("show.bs.dropdown", function () {
    profSelect_Shown($(this))
  });
  $(".main_preset_select").on("hidden.bs.tab", function (a) {
    main_preset_tab_Changed(a)
  });
  $("#main").on("show.bs.dropdown", ".enemy_ap_select_parent", function () {
    enemy_ap_select_parent_Show($(this))
  });
  $("#main").on("hide.bs.dropdown", ".enemy_ap_select_parent", function () {
    enemy_ap_select_parent_Close($(this))
  });
  $("#main").on("show.bs.collapse", ".collapse", function () {
    $(this).prev().find(".fa-chevron-up").removeClass("fa-chevron-up").addClass("fa-chevron-down")
  });
  $("#main").on("hide.bs.collapse", ".collapse", function () {
    $(this).prev().find(".fa-chevron-down").removeClass("fa-chevron-down").addClass("fa-chevron-up")
  });
  $("#main").on("shown.bs.collapse", ".collapse", function () {
    $(this).removeClass("tmpHide")
  });
  $("#main").on("focus", ".slot_input", function () {
    $(this).select()
  });
  $("#main").on("input", ".slot_input", function () {
    slot_input_Changed($(this))
  });
  $("#main").on("input", ".slot_range", function () {
    slot_range_Changed($(this))
  });
  $("#main").on("click", ".remodel_item", function () {
    $(this).addClass("remodel_item_selected")
  });
  $("#main").on("click", ".plane_name", function () {
    plane_name_Clicked($(this))
  });
  $("#main").on("click", ".btn_plane_preset", function () {
    btn_plane_preset_Clicked($(this))
  });
  $("#main").on("click", ".btn_capture", function () {
    btn_capture_Clicked($(this))
  });
  $("#main").on("click", ".btn_reset_content", function () {
    btn_reset_content_Clicked($(this))
  });
  $("#main").on("click", ".btn_content_trade", function () {
    btn_content_trade_Clicked($(this))
  });
  $("#main").on("click", ".btn_commit_trade", commit_content_order);
  $("#main").on("click", ".btn_ex_setting", function () {
    btn_ex_setting_Clicked($(this))
  });
  $("#landBase").on("click", ".btn_air_raid", function () {
    btn_air_raid_Clicked($(this))
  });
  $("#landBase").on("click", ".btn_supply", function () {
    btn_supply_Clicked($(this))
  });
  $("#landBase_content").on("change", ".ohuda_select", function () {
    ohuda_Changed($(this))
  });
  $("#landBase_content").on("click", ".btn_remove_plane", function () {
    btn_remove_lb_plane_Clicked($(this))
  });
  $("#landBase_content").on("click", ".btn_reset_landBase", function () {
    btn_reset_landBase_Clicked($(this))
  });
  $("#landBase_content").on("click", ".prof_item", function () {
    proficiency_Changed($(this))
  });
  $("#friendFleet_content").on("change", ".display_ship_count", function () {
    display_ship_count_Changed($(this))
  });
  $("#friendFleet_content").on("click", ".btn_reset_ship_plane", function () {
    btn_reset_ship_plane_Clicked($(this))
  });
  $("#friendFleet_content").on("click", ".ship_name_span", function () {
    ship_name_span_Clicked($(this))
  });
  $("#friendFleet_content").on("click", ".btn_remove_ship", function () {
    btn_remove_ship_Clicked($(this))
  });
  $("#friendFleet_content").on("click", ".btn_remove_plane", function () {
    btn_remove_ship_plane_Clicked($(this))
  });
  $("#friendFleet_content").on({
    mouseenter: function () {
      $(this).closest(".ship_tab").find(".remove_line").addClass("ready")
    },
    mouseleave: function () {
      $(this).closest(".ship_tab").find(".remove_line").removeClass("ready")
    }
  }, ".btn_reset_ship_plane");
  $("#friendFleet_content").on("click", ".prof_item", function () {
    proficiency_Changed($(this))
  });
  $("#friendFleet_content").on("click", ".ship_disabled", function () {
    ship_disabled_Changed($(this))
  });
  $("#friendFleet_content").on("click", "#union_fleet", calculate);
  $('#friendFleet_content .nav-link[data-toggle="tab"]').on("shown.bs.tab", fleet_select_tab_Clicked);
  $("#friendFleet_content").on("click", ".plane_lock", function () {
    plane_lock_Clicked($(this))
  });
  $("#friendFleet_content").on("click", ".plane_unlock", function () {
    plane_unlock_Clicked($(this))
  });
  $("#friendFleet_content").on("click", ".slot_ini", function () {
    slot_ini_Clicked($(this))
  });
  $("#enemyFleet_content").on("change", ".cell_type", function () {
    cell_type_Changed($(this))
  });
  $("#enemyFleet_content").on("change", ".formation", calculate);
  $("#enemyFleet_content").on("focus", ".enemy_ap_input", function () {
    $(this).select()
  });
  $("#enemyFleet_content").on("input", ".enemy_ap_input", function () {
    enemy_ap_input_Changed($(this))
  });
  $("#enemyFleet_content").on("input", ".enemy_ap_range", function () {
    enemy_ap_range_Changed($(this))
  });
  $("#enemyFleet_content").on("click", ".enemy_name", function () {
    enemy_name_Clicked($(this))
  });
  $("#enemyFleet_content").on("click", ".btn_reset_battle", function () {
    btn_reset_battle_Clicked($(this))
  });
  $("#enemyFleet_content").on("click", "#btn_world_expand", btn_world_expand_Clicked);
  $("#enemyFleet_content").on("click", ".btn_enemy_preset", function () {
    btn_enemy_preset_Clicked($(this))
  });
  $("#enemyFleet_content").on("click", ".btn_stage2", function () {
    btn_stage2_Clicked($(this))
  });
  $("#enemyFleet_content").on("change", "#battle_count", function () {
    battle_count_Changed($(this))
  });
  $("#enemyFleet_content").on("change", "#landBase_target", calculate);
  $("#enemyFleet_content").on("click", 'input[name="enemy_fleet_display_mode"]', function () {
    enemy_fleet_display_mode_Changed($(this))
  });
  $("#result").on("click", "#btn_calculate", calculate);
  $("#result_content").on("click", "#display_battle_tab .nav-item", function () {
    display_battle_tab_Changed($(this))
  });
  $("#result_content").on("click", "#empty_slot_invisible", calculate);
  $("#result_content").on("click", "#display_setting .custom-control-input", display_result_Changed);
  $("#result_content").on("click", "#shoot_down_table_tbody tr", function () {
    fleet_slot_Clicked($(this))
  });
  $("#result_content").on("click", "#rate_table .land_base_detail", function () {
    land_base_detail_Clicked($(this))
  });
  $("#result_content").on("click", "#enemy_shoot_down_tbody .td_detail_slot", function () {
    enemy_slot_Clicked($(this))
  });
  $("#config_content").on("focus", "#calculate_count", function () {
    $(this).select()
  });
  $("#config_content").on("input", "#calculate_count", function () {
    calculate_count_Changed($(this))
  });
  $("#config_content").on("click", "#btn_reset_localStorage", btn_reset_localStorage_Clicked);
  $("#config_content").on("click", "#innerProfSetting .custom-control-input", function () {
    innerProfSetting_Clicked($(this))
  });
  $("#config_content").on("click", "#auto_save", auto_save_Clicked);
  $("#config_content").on("click", "#clipboard_mode", clipboard_mode_Clicked);
  $("#config_content").on("click", "#air_raid_max", air_raid_max_Clicked);
  $("#config_content").on("click", ".dropdown-item", function () {
    init_proficiency_Changed($(this))
  });
  $("#config_content").on("click", "#backup_enabled", backup_enabled_Clicked);
  $("#config_content").on("click", "#backup_enabled", backup_enabled_Clicked);
  $("#config_content").on("change", "#backup_count", backup_enabled_Clicked);
  $("#config_content").on("click", "#btn_reset_selected_plane_history", btn_reset_selected_plane_history_Clicked);
  $("#config_content").on("click", "#btn_reset_selected_ship_history", btn_reset_selected_ship_history_Clicked);
  $("#config_content").on("click", 'input[name="site_theme"]', function () {
    site_theme_Changed()
  });
  $("#plane_stock").on("change", "#stock_type_select", function () {
    stock_type_select_Changed($(this))
  });
  $("#plane_stock").on("click", ".stock_td_fav", function (a) {
    stock_td_fav_Clicked($(this));
    a.stopPropagation()
  });
  $("#plane_stock").on("click", ".stock_tr", function () {
    stock_tr_Clicked($(this))
  });
  $("#plane_stock").on("click", "#btn_load_equipment_json", btn_load_equipment_json_Clicked);
  $("#plane_stock").on("input", "#input_equipment_json", function () {
    input_equipment_json_Changed($(this))
  });
  $("#plane_stock").on("focus", "#input_equipment_json", function () {
    $(this).select()
  });
  $("#plane_stock").on("click", "#btn_fav_clear", btn_fav_clear_Clicked);
  $("#plane_stock").on("click", "#btn_stock_all_clear", btn_stock_all_clear_Clicked);
  $("#plane_stock").on("input", "#stock_word", stock_word_TextChanged);
  $("#modal_plane_select").on("click", ".plane", function () {
    modal_plane_Selected($(this))
  });
  $("#modal_plane_select").on("click", ".btn_remove", function () {
    modal_plane_select_btn_remove_Clicked($(this))
  });
  $("#modal_plane_select").on("change", "#plane_type_select", plane_type_select_Changed);
  $("#modal_plane_select").on("click", "#fav_only", fav_only_Checked_Chenged);
  $("#modal_plane_select").on("click", "#disp_in_stock", disp_in_stock_Checked_Chenged);
  $("#modal_plane_select").on("click", "#disp_equipped", disp_equipped_Checked_Chenged);
  $("#modal_plane_select").on("input", "#plane_word", plane_word_TextChanged);
  $("#modal_plane_select").on("change", "#plane_sort_select", function () {
    sort_Changed($(this))
  });
  $("#modal_plane_select").on("click", "#plane_asc", function () {
    sort_Changed($(this))
  });
  $("#modal_plane_select").on("click", "#plane_desc", function () {
    sort_Changed($(this))
  });
  $("#modal_plane_preset").on("click", ".preset_tr", function () {
    plane_preset_tr_Clicked($(this))
  });
  $("#modal_plane_preset").on("click", ".btn_commit_preset", function () {
    btn_commit_plane_preset_Clicked($(this))
  });
  $("#modal_plane_preset").on("click", ".btn_delete_preset", function () {
    btn_delete_plane_preset_Clicked($(this))
  });
  $("#modal_plane_preset").on("click", ".btn_expand_preset", btn_expand_plane_preset_Clicked);
  $("#modal_ship_select").on("change", "#ship_type_select", function () {
    createShipTable([castInt($(this).val())])
  });
  $("#modal_ship_select").on("click", ".ship", function () {
    modal_ship_Selected($(this))
  });
  $("#modal_ship_select").on("click", ".btn_remove", function () {
    modal_ship_select_btn_remove_Clicked($(this))
  });
  $("#modal_ship_select").on("click", "#display_final", function () {
    createShipTable([castInt($("#ship_type_select").val())])
  });
  $("#modal_ship_select").on("click", "#frequent_ship", function () {
    createShipTable([castInt($("#ship_type_select").val())])
  });
  $("#modal_ship_select").on("input", "#ship_word", ship_word_TextChanged);
  $("#modal_enemy_select").on("click", ".modal-body .enemy", function () {
    modal_enemy_Selected($(this))
  });
  $("#modal_enemy_select").on("click", ".btn_remove", function () {
    modal_enemy_select_btn_remove($(this))
  });
  $("#modal_enemy_select").on("change", "#enemy_type_select", function () {
    createEnemyTable([castInt($(this).val())])
  });
  $("#modal_enemy_select").on("input", "#enemy_word", enemy_word_TextChanged);
  $("#modal_enemy_pattern").on("click", ".node_tr", function () {
    node_tr_Clicked($(this))
  });
  $("#modal_enemy_pattern").on("change", "#map_select", createNodeSelect);
  $("#modal_enemy_pattern").on("change", "#node_select", createEnemyPattern);
  $("#modal_enemy_pattern").on("change", "#select_difficulty", createNodeSelect);
  $("#modal_enemy_pattern").on("click", "#btn_expand_enemies", btn_expand_enemies);
  $("#modal_enemy_pattern").on("click", "#btn_continue_expand", btn_continue_expand_Clicked);
  $("#modal_enemy_pattern").on("click", ".node", function () {
    node_Clicked($(this))
  });
  $("#modal_enemy_pattern").on("click", "#enemy_pattern_select .nav-link:not(.active)", function () {
    pattern_Changed($(this))
  });
  $("#modal_enemy_pattern").on("click", 'input[name="enemy_display_mode"]', function () {
    enemy_display_mode_Changed($(this))
  });
  $("#modal_enemy_pattern").on("dblclick", ".node", node_DoubleClicked);
  $("#modal_enemy_pattern").on("dblclick", ".node_tr", node_DoubleClicked);
  $("#modal_enemy_pattern").on("dblclick", "#enemy_pattern_select .nav-link.active", node_DoubleClicked);
  $("#modal_main_preset").on("click", ".preset_tr", function () {
    main_preset_tr_Clicked($(this))
  });
  $("#modal_main_preset").on("click", ".btn_commit_preset", btn_commit_main_preset_Clicked);
  $("#modal_main_preset").on("click", ".btn_commit_preset_header", btn_commit_preset_header_Clicked);
  $("#modal_main_preset").on("click", ".btn_delete_preset", btn_delete_main_preset_Clicked);
  $("#modal_main_preset").on("click", ".btn_load_deck", btn_load_deck_Clicked);
  $("#modal_main_preset").on("input", "#preset_remarks", function () {
    preset_remarks_Changed($(this))
  });
  $("#modal_main_preset").on("input", "#input_deck", function () {
    input_deck_Changed($(this))
  });
  $("#modal_main_preset").on("focus", "#input_deck", function () {
    $(this).select()
  });
  $("#modal_main_preset").on("click", ".btn_output_url", btn_output_url_Clicked);
  $("#modal_main_preset").on("click", ".btn_output_deck", btn_output_deck_Clicked);
  $("#modal_main_preset").on("focus", "#output_url", function () {
    $(this).select()
  });
  $("#modal_main_preset").on("focus", "#output_deck", function () {
    $(this).select()
  });
  $("#modal_main_preset").on("input", "#output_url", function () {
    output_data_Changed($(this))
  });
  $("#modal_main_preset").on("input", "#output_deck", function () {
    output_data_Changed($(this))
  });
  $("#modal_main_preset").on("click", "#output_url", function () {
    output_data_Clicked($(this))
  });
  $("#modal_main_preset").on("click", "#output_deck", function () {
    output_data_Clicked($(this))
  });
  $("#modal_main_preset").on("click", ".btn_expand_preset", btn_expand_main_preset_Clicked);
  $("#modal_auto_expand").on("click", "#btn_start_auto_expand", btn_start_auto_expand_Clicked);
  $("#modal_auto_expand").on("click", "#expand_target .custom-control-input", expand_target_Clicked);
  $("#modal_auto_expand").on("click", "#auto_battle_mode .custom-control-input", battle_mode_Clicked);
  $("#modal_auto_expand").on("input", "#simple_enemy_ap", function () {
    simple_enemy_ap_Changed($(this))
  });
  $("#modal_auto_expand").on("input", "#dest_ap", function () {
    dest_ap_Changed($(this))
  });
  $("#modal_auto_expand").on("input", "#dest_range", function () {
    dest_ap_Changed($(this))
  });
  $("#modal_plane_stock").on("input", ".stock_num", function () {
    stock_Changed($(this))
  });
  $("#modal_plane_stock").on("click", "#btn_save_stock", btn_save_stock_Clicked);
  $("#modal_plane_stock").on("click", "#btn_stock_reset", btn_stock_reset_Clicked);
  $("#modal_result_detail").on("click", "#btn_calculate_detail", btn_calculate_detail);
  $("#modal_result_detail").on("change", "#detail_calculate_count", function () {
    return $("#btn_calculate_detail").prop("disabled", !1)
  });
  $("#modal_result_detail").on("change", ".custom-radio", btn_calculate_detail);
  $("#modal_result_detail").on("click", "#show_detail_slot .nav-item", function () {
    detail_slot_tab_Changed($(this))
  });
  $("#modal_result_detail").on("click", ".btn_show_detail:not(.disabled)", function () {
    btn_show_detail_Clicked($(this))
  });
  $("#modal_collectively_setting").on("click", ".btn_remove_plane_all", function () {
    btn_remove_plane_all_Clicked($(this))
  });
  $("#modal_collectively_setting").on("click", ".btn_remove_ship_all", btn_remove_ship_all_Clicked);
  $("#modal_collectively_setting").on("click", ".btn_slot_max", function () {
    btn_slot_max_Clicked($(this))
  });
  $("#modal_collectively_setting").on("click", ".btn_slot_min", btn_slot_min_Clicked);
  $("#modal_collectively_setting").on("click", ".btn_slot_default", function () {
    btn_slot_default_Clicked($(this))
  });
  $("#modal_collectively_setting").on("input", ".coll_slot_range", function () {
    coll_slot_range_Changed($(this))
  });
  $("#modal_collectively_setting").on("input", ".coll_slot_input", function () {
    coll_slot_input_Changed($(this))
  });
  $("#modal_collectively_setting").on("focus", ".coll_slot_input", function () {
    $(this).select()
  });
  $("#modal_collectively_setting").on("click", ".btn_remodel", function () {
    btn_remodel_Clicked($(this))
  });
  $("#modal_collectively_setting").on("click", ".btn_fighter_prof_max", btn_fighter_prof_max_Clicked);
  $("#modal_collectively_setting").on("click", ".btn_prof", function () {
    btn_prof_Clicked($(this))
  });
  $("#modal_stage2_detail").on("input", "#stage2_detail_slot", stage2_slot_input_Changed);
  $("#modal_stage2_detail").on("change", "#stage2_detail_avoid", calculateStage2Detail);
  $("#modal_stage2_detail").on("input", "#free_anti_air_weight", function () {
    free_modify_input_Changed($(this))
  });
  $("#modal_stage2_detail").on("input", "#free_anti_air_bornus", function () {
    free_modify_input_Changed($(this))
  });
  $("#modal_confirm").on("click", ".btn_ok", modal_confirm_ok_Clicked);
  $("#btn_preset_all").click(btn_preset_all_Clicked);
  $("#btn_auto_expand").click(btn_auto_expand_Clicked);
  $("#btn_twitter").click(btn_twitter_Clicked);
  $("#btn_deckBuilder").click(btn_deckBuilder_Clicked);
  $("#btn_undo").click(btn_undo_Clicked);
  $("#btn_redo").click(btn_redo_Clicked);
  $("#smart_menu").click(menu_small_Clicked);
  $("#input_url").click(function () {
    $(this).select()
  });
  $("#btn_url_shorten").click(btn_url_shorten_Clicked);
  $("#main").on("click", ".btn_first_time", first_time_Clicked);
  $("#main").on("click", ".btn_site_manual", site_manual_Clicked);
  $("#Navbar").on("click", 'a[href^="#"]', function () {
    return sidebar_Clicked($(this))
  });
  $("#site_information").on("click", 'a[href^="#"]', function () {
    return sidebar_Clicked($(this))
  });
  $("#modal_smart_menu").on("click", 'a[href^="#"]', function () {
    return smart_menu_modal_link_Clicked($(this))
  });
  $("#result_content").on({
    mouseenter: function () {
      shoot_down_table_tbody_MouseEnter($(this))
    },
    mouseleave: function () {
      shoot_down_table_tbody_MouseLeave($(this))
    }
  }, "#shoot_down_table_tbody td");
  $("#result_content").on({
    mouseenter: function () {
      progress_area_MouseEnter($(this))
    },
    mouseleave: function () {
      progress_area_MouseLeave($(this))
    }
  }, ".progress_area");
  $("#result_content").on({
    mouseenter: function () {
      rate_table_MouseEnter($(this))
    },
    mouseleave: function () {
      rate_table_MouseLeave($(this))
    }
  }, "#rate_table tbody td");
  $("#result_content").on({
    mouseenter: function () {
      enemy_shoot_down_table_tbody_MouseEnter($(this))
    },
    mouseleave: function () {
      enemy_shoot_down_table_tbody_MouseLeave($(this))
    }
  }, "#enemy_shoot_down_tbody td");
  $(window).resize(function () {
    !1 !== timer && clearTimeout(timer);
    timer = setTimeout(function () {
      "none" === $("#lb_tab_select").css("display") || $("#lb_item1").attr("class").includes("tab-pane") ? "none" === $("#lb_tab_select").css("display") && $("#lb_item1").attr("class").includes("tab-pane") && ($(".lb_tab").removeClass("tab-pane fade").show().fadeIn(), $(".baseNo").addClass("sortable_handle cur_move")) : ($(".lb_tab").addClass("tab-pane fade"), $(".lb_tab:first").tab("show"), $(".baseNo").removeClass("sortable_handle cur_move"))
    }, 50)
  });
  Sortable.create($("#main_contents")[0], {
    handle: ".trade_enabled",
    animation: 200,
    scroll: !0,
    onEnd: main_contents_Sortable_End
  });
  Sortable.create($("#battle_result")[0], {
    handle: ".drag_handle",
    animation: 200,
    scroll: !0
  });
  Sortable.create($("#lb_tab_parent")[0], {
    handle: ".sortable_handle",
    animation: 200,
    onEnd: function () {
      $(".lb_tab").each(function (a, b) {
        $(b).attr("id", "lb_item" + (a + 1));
        $(b).find(".baseNo").text("��" + (a + 1) + "��n�q���")
      });
      calculate()
    }
  });
  $(".fleet_tab").each(function (a, b) {
    Sortable.create($(b)[0], {
      handle: ".sortable_handle",
      animation: 200,
      scroll: !0,
      onEnd: function () {
        $(".ship_tab").each(function (a, b) {
          $(b).attr("id", "shipNo_" + (a + 1))
        });
        calculate()
      }
    })
  });
  $(".lb_plane").draggable({
    delay: 100,
    helper: "clone",
    handle: ".drag_handle",
    zIndex: 1E3,
    start: function (a, b) {
      $(b.helper).css("width", 320);
      $(b.helper).find(".dropdown-menu").remove()
    },
    stop: function () {
      lb_plane_DragEnd($(this))
    }
  });
  $(".lb_plane").droppable({
    accept: ".lb_plane",
    hoverClass: "plane_draggable_hover",
    tolerance: "pointer",
    drop: function (a, b) {
      lb_plane_Drop($(this), b)
    }
  });
  $("#landBase_content_main").droppable({
    accept: ".lb_plane",
    tolerance: "pointer",
    over: function (a, b) {
      b.helper.animate({
        opacity: "1.0"
      }, 100);
      isOut = !1
    },
    out: function (a, b) {
      b.helper.animate({
        opacity: "0.2"
      }, 100);
      isOut = !0
    }
  });
  $(".ship_plane_draggable").draggable({
    delay: 100,
    helper: "clone",
    handle: ".drag_handle",
    zIndex: 1E3,
    cursorAt: {
      left: 55
    },
    start: function (a, b) {
      ship_plane_DragStart(b)
    },
    stop: function () {
      ship_plane_DragEnd($(this))
    }
  });
  $(".ship_plane").droppable({
    accept: ".ship_plane_draggable",
    hoverClass: "plane_draggable_hover",
    tolerance: "pointer",
    over: function (a, b) {
      ship_plane_DragOver($(this), b)
    },
    drop: function (a, b) {
      ship_plane_Drop($(this), b)
    }
  });
  $(".friendFleet_tab").droppable({
    accept: ".ship_plane_draggable",
    tolerance: "pointer",
    over: function (a, b) {
      isOut = !1;
      b.helper.stop().animate({
        opacity: "1.0"
      }, 100)
    },
    out: function (a, b) {
      isOut = !0;
      b.helper.stop().animate({
        opacity: "0.2"
      }, 100)
    }
  });
  Sortable.create($("#battle_container")[0], {
    handle: ".sortable_handle",
    animation: 150,
    onEnd: function () {
      $(".battle_content").each(function (a, b) {
        $(b).find(".battle_no").text(a + 1)
      });
      calculate()
    }
  });
  $(".battle_content").droppable({
    accept: ".enemy_content",
    hoverClass: "hover_enemy_content",
    tolerance: "pointer",
    drop: function (a, b) {
      var c = castInt(b.draggable[0].dataset.enemyid),
        d = castInt(b.draggable.find(".enemy_ap").text());
      setEnemyDiv($(this).find(".enemy_content:last"), c, d)
    }
  });
  $("#enemyFleet_content").droppable({
    accept: ".enemy_content",
    tolerance: "pointer",
    over: function (a, b) {
      isOut = !1;
      b.helper.stop().animate({
        opacity: "1.0"
      }, 100)
    },
    out: function (a, b) {
      isOut = !0;
      b.helper.stop().animate({
        opacity: "0.2"
      }, 100)
    }
  });
  $(".sample_plane").draggable({
    delay: 100,
    scroll: !1,
    handle: ".drag_handle",
    zIndex: 1E3,
    revert: !0,
    cursorAt: {
      top: 10
    }
  })
});