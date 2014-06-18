/*jslint node: true*/

/**
 * This small script wraps script.js in order to allow registered widgets to have
 * their own dependencies, on demand.
 *
 * It will register itself as $we in the global namespace.
 *
 * @usage:
 *
 *    $we.register('mywidget', ['jQuery.js', 'underscore.js', 'mywidget.css'],
 *          function() {
 *            // widget logic in here with jQuery, underscore loaded and css
 *            // injected
 *            $we.loadFile(file, function(data) {
 *              // handler to load text-based files that return data, like json
 *              // and templates
 *            });
 *          });
 *
 * @examples:
 *  see the /example in widget directory
 *
 */

'use strict';

(function() {

  /**
   * Main widget engine class
   * @constructor
   */
  var WidgetEngine = function() {
    this._widgets = {};
  };

  /**
   * Function to register a widget with the engine.
   * @param {string} widgetName Name the widget for reference.
   * @param {Array} widgetDependencies An array of dependencies (full paths).
   * @param {function} widgetLogicFn Callback function - when this fires, all
   *        dependencies will have been loaded.
   */
  WidgetEngine.prototype.register = function register(widgetName, widgetDependencies, widgetLogicFn) {

    var widgets = document.querySelectorAll('[data-widget-type="' + widgetName + '"]');

    if (!widgets.length) {
      throw new Error('QS WidgetEngine: No ' + widgetName + ' Widgets found');
    }

    var i = 0,
      l = widgetDependencies.length,
      scriptDependencies = [],
      cssDependencies = [],
      engine = this;

    if (!this._widgets[widgetName]) {
      this._widgets[widgetName] = {
        dependencies: widgetDependencies
      };
    } else {
      // dependencies for this widget are already loaded/loading
      widgetLogicFn.call(engine, widgets);
    }

    for (;i<l;i++) {
      if (widgetDependencies[i].indexOf('.js') > -1) {
        scriptDependencies.push(widgetDependencies[i]);
      }
      if (widgetDependencies[i].indexOf('.css') > -1) {
        cssDependencies.push(widgetDependencies[i]);
      }
    }

    $script(scriptDependencies, function() {
      widgetLogicFn.call(engine, widgets);
    });

    if (cssDependencies.length) {
      this.injectCSS_(cssDependencies);
    }
  };

  /**
   * Utility to load files that return data from the widget.
   * @param {string} file A path to a file.
   * @param {function} fn A callback function.
   */
  WidgetEngine.prototype.loadFile = function render(file, fn)  {

    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      fn(this.responseText);
    };
    xhr.open('get', file, true);
    xhr.send();

  };

  /**
   * Will inject css files in the header element.
   * @param {Array} cssDependencies An array of paths to css files.
   */
  WidgetEngine.prototype.injectCSS_ = function injectCSS(cssDependencies) {

    var i = 0, l = cssDependencies.length;
    var head = document.getElementsByTagName('head')[0];
    var tag = null;
    var t = null;

    for (;i<l;i++) {

      t = cssDependencies[i].split('/');

      if (!document.getElementById(t[t.length])) {
        tag = document.createElement('link');
        tag.setAttribute('href', cssDependencies[i]);
        tag.setAttribute('id',t[t.length - 1]);
        tag.setAttribute('rel', 'stylesheet');
        tag.setAttribute('type', 'text/css');
        head.appendChild(tag);
      }
    }
  };

  /**
   * Constructor to add a new Spinner el into widgets
   * Start method: @param {widget DOM element}
   *
   * @usage:
   *
   *    var spinner = $we.spinner();
   *    spinner.start(widget);
   *    spinner.stop();
   *
   *
   */
  WidgetEngine.prototype.spinner = function () {

    var Spinner = function Spinner () {

      this.el = (function () {

        var el = document.createElement('div');
        el.innerHTML = '...Laddar';

        return el;

      }());

    };

    Spinner.prototype = {

      start: function (widget) {

        if (!widget) { throw new Error('QS WidgetEngine, spinner: Missig widgets @param'); }

        widget.appendChild(this.el);
        return this;
      },

      remove: function () {
        this.el.remove();
      }

    };

    return new Spinner();

  };



  /**
   * Exposes the WidgetEngine as a singleton on the global namespace.
   */
  if (window && !window.$we) {
    window.$we = new WidgetEngine();
  }

})();
