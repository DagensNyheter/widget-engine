'use strict';

$we.register('mapWidget', ['/bower_components/jquery/dist/jquery.min.js', 'css/qs-maps.css'], function (widgets) {

  var googleMapsSrc = 'http://maps.googleapis.com/maps/api/js?v=3&sensor=false&callback=qsGMInitialize';

  var loadGoolgeMapsScript = function (src, errorCallback) {

    var script = document.createElement("script");

    script.type = 'text/javascript';
    script.src = src;
    script.onerror = errorCallback;
    document.getElementsByTagName('head')[0].appendChild(script);

  };

  var renderMap = function (mapContainer) {

    // fetch map settings and/or style-settings
    // to the jQuery wrapped widget container
    // the second @param is a new Spinner instace
    // for the same widget container
    fetchMapSettings($(mapContainer), $we.spinner().start(mapContainer));



    function fetchMapSettings ($mapContainer, spinner) {

      $.when( loadSettings($mapContainer), loadStyles($mapContainer) ).done(function (settings, styles) {

        spinner.remove();

        var settings = settings[0];
        var styles = (styles && styles.length) ? styles[0] : null;

        render($mapContainer[0], settings, styles);

      });

    }

    function loadSettings ($mapContainer) {

      var settingsSrc = $mapContainer.attr('data-widget-data-src');

      if (!settingsSrc) {
        throw new Error('QS Map Widget: Map settings required');
      }

      return $.ajax(settingsSrc);
    }

    function loadStyles ($mapContainer) {

      var styleSrc = $mapContainer.attr('data-map-style-src');

      if (styleSrc) {
        return $.ajax(styleSrc);
      }

    }

    function render(mapContainer, settings, style) {

      var mapSettings = settings;
      var mapStyle = style;

      var mapOptions = {
        zoom: mapSettings.zoom,
        center: new google.maps.LatLng(mapSettings.centerX, mapSettings.centerY),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      if (mapStyle) {
        mapOptions.styles = mapStyle;
      }

      var map = new google.maps.Map(mapContainer, mapOptions);

    }

  };

  var loadScriptError = function () {

    throw new Error('QS Map Widget: couldn\'t load script from google maps');

  };


  // google maps script loader callback initialized in window scope
  window.qsGMInitialize = window.qsGMInitialize || function initialize() {

    $.each(widgets, function (i, mapContainer) {
      renderMap(mapContainer);
    });

  };


  // custom google map script loader
  // why? because, google maps script calls another
  // script that is using documentWrite(?)
  // so we have to do it this way
  // make use of their initialize callback
  loadGoolgeMapsScript(googleMapsSrc, loadScriptError);

});

