/*!
  * =============================================================
  * Ender: open module JavaScript framework (https://ender.no.de)
  * Build: ender build scriptjs
  * Packages: ender-js@0.4.4-1 scriptjs@2.2.6
  * =============================================================
  */

/*!
  * Ender: open module JavaScript framework (client-lib)
  * copyright Dustin Diaz & Jacob Thornton 2011-2012 (@ded @fat)
  * http://ender.jit.su
  * License MIT
  */
(function (context) {

  // a global object for node.js module compatiblity
  // ============================================

  context['global'] = context

  // Implements simple module system
  // losely based on CommonJS Modules spec v1.1.1
  // ============================================

  var modules = {}
    , old = context['$']
    , oldEnder = context['ender']
    , oldRequire = context['require']
    , oldProvide = context['provide']

  function require (identifier) {
    // modules can be required from ender's build system, or found on the window
    var module = modules['$' + identifier] || window[identifier]
    if (!module) throw new Error("Ender Error: Requested module '" + identifier + "' has not been defined.")
    return module
  }

  function provide (name, what) {
    return (modules['$' + name] = what)
  }

  context['provide'] = provide
  context['require'] = require

  function aug(o, o2) {
    for (var k in o2) k != 'noConflict' && k != '_VERSION' && (o[k] = o2[k])
    return o
  }

  /**
   * main Ender return object
   * @constructor
   * @param {Array|Node|string} s a CSS selector or DOM node(s)
   * @param {Array.|Node} r a root node(s)
   */
  function Ender(s, r) {
    var elements
      , i

    this.selector = s
    // string || node || nodelist || window
    if (typeof s == 'undefined') {
      elements = []
      this.selector = ''
    } else if (typeof s == 'string' || s.nodeName || (s.length && 'item' in s) || s == window) {
      elements = ender._select(s, r)
    } else {
      elements = isFinite(s.length) ? s : [s]
    }
    this.length = elements.length
    for (i = this.length; i--;) this[i] = elements[i]
  }

  /**
   * @param {function(el, i, inst)} fn
   * @param {Object} opt_scope
   * @returns {Ender}
   */
  Ender.prototype['forEach'] = function (fn, opt_scope) {
    var i, l
    // opt out of native forEach so we can intentionally call our own scope
    // defaulting to the current item and be able to return self
    for (i = 0, l = this.length; i < l; ++i) i in this && fn.call(opt_scope || this[i], this[i], i, this)
    // return self for chaining
    return this
  }

  Ender.prototype.$ = ender // handy reference to self


  function ender(s, r) {
    return new Ender(s, r)
  }

  ender['_VERSION'] = '0.4.3-dev'

  ender.fn = Ender.prototype // for easy compat to jQuery plugins

  ender.ender = function (o, chain) {
    aug(chain ? Ender.prototype : ender, o)
  }

  ender._select = function (s, r) {
    if (typeof s == 'string') return (r || document).querySelectorAll(s)
    if (s.nodeName) return [s]
    return s
  }


  // use callback to receive Ender's require & provide and remove them from global
  ender.noConflict = function (callback) {
    context['$'] = old
    if (callback) {
      context['provide'] = oldProvide
      context['require'] = oldRequire
      context['ender'] = oldEnder
      if (typeof callback == 'function') callback(require, provide, this)
    }
    return this
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = ender
  // use subscript notation as extern for Closure compilation
  context['ender'] = context['$'] = ender

}(this));

(function () {

  var module = { exports: {} }, exports = module.exports;

  /*!
    * $script.js Async loader & dependency manager
    * https://github.com/ded/script.js
    * (c) Dustin Diaz, Jacob Thornton 2011
    * License: MIT
    */
  (function (name, definition, context) {
    if (typeof context['module'] != 'undefined' && context['module']['exports']) context['module']['exports'] = definition()
    else if (typeof context['define'] != 'undefined' && context['define'] == 'function' && context['define']['amd']) define(name, definition)
    else context[name] = definition()
  })('$script', function () {
    var doc = document
      , head = doc.getElementsByTagName('head')[0]
      , validBase = /^https?:\/\//
      , list = {}, ids = {}, delay = {}, scriptpath
      , scripts = {}, s = 'string', f = false
      , push = 'push', domContentLoaded = 'DOMContentLoaded', readyState = 'readyState'
      , addEventListener = 'addEventListener', onreadystatechange = 'onreadystatechange'

    function every(ar, fn) {
      for (var i = 0, j = ar.length; i < j; ++i) if (!fn(ar[i])) return f
      return 1
    }
    function each(ar, fn) {
      every(ar, function(el) {
        return !fn(el)
      })
    }

    if (!doc[readyState] && doc[addEventListener]) {
      doc[addEventListener](domContentLoaded, function fn() {
        doc.removeEventListener(domContentLoaded, fn, f)
        doc[readyState] = 'complete'
      }, f)
      doc[readyState] = 'loading'
    }

    function $script(paths, idOrDone, optDone) {
      paths = paths[push] ? paths : [paths]
      var idOrDoneIsDone = idOrDone && idOrDone.call
        , done = idOrDoneIsDone ? idOrDone : optDone
        , id = idOrDoneIsDone ? paths.join('') : idOrDone
        , queue = paths.length
      function loopFn(item) {
        return item.call ? item() : list[item]
      }
      function callback() {
        if (!--queue) {
          list[id] = 1
          done && done()
          for (var dset in delay) {
            every(dset.split('|'), loopFn) && !each(delay[dset], loopFn) && (delay[dset] = [])
          }
        }
      }
      setTimeout(function () {
        each(paths, function (path) {
          if (scripts[path]) {
            id && (ids[id] = 1)
            return scripts[path] == 2 && callback()
          }
          scripts[path] = 1
          id && (ids[id] = 1)
          create(!validBase.test(path) && scriptpath ? scriptpath + path + '.js' : path, callback)
        })
      }, 0)
      return $script
    }

    function create(path, fn) {
      var el = doc.createElement('script')
        , loaded = f
      el.onload = el.onerror = el[onreadystatechange] = function () {
        if ((el[readyState] && !(/^c|loade/.test(el[readyState]))) || loaded) return;
        el.onload = el[onreadystatechange] = null
        loaded = 1
        scripts[path] = 2
        fn()
      }
      el.async = 1
      el.src = path
      head.insertBefore(el, head.firstChild)
    }

    $script.get = create

    $script.order = function (scripts, id, done) {
      (function callback(s) {
        s = scripts.shift()
        if (!scripts.length) $script(s, id, done)
        else $script(s, callback)
      }())
    }

    $script.path = function (p) {
      scriptpath = p
    }
    $script.ready = function (deps, ready, req) {
      deps = deps[push] ? deps : [deps]
      var missing = [];
      !each(deps, function (dep) {
        list[dep] || missing[push](dep);
      }) && every(deps, function (dep) {return list[dep]}) ?
        ready() : !function (key) {
        delay[key] = delay[key] || []
        delay[key][push](ready)
        req && req(missing)
      }(deps.join('|'))
      return $script
    }
    return $script
  }, this);
  if (typeof provide == "function") provide("scriptjs", module.exports);

  var s = require('scriptjs')
  ender.ender({
      script: s
    , require: s
    , ready: s.ready
    , getScript: s.get
  });
}());