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

      $.when( loadSettings($mapContainer), loadStyles($mapContainer), loadMarkerInfo($mapContainer) ).done(function (settings, styles, marker) {

        spinner.remove();

        var settings = settings[0];
        var styles = (styles && styles.length) ? styles[0] : null;
        var marker = marker[0];

        render($mapContainer[0], settings, styles, marker);

      });

    }

    function loadSettings ($mapContainer) {

      var settingsSrc = $mapContainer.attr('data-widget-data-src');

      if (!settingsSrc) {
        throw new Error('QS Map Widget: Map settings required');
      }

      return $.ajax(settingsSrc);
    }

    function loadMarkerInfo ($mapContainer) {

      var markerInfoSrc = $mapContainer.attr('data-widget-marker-info');

      if (!markerInfoSrc) {
        throw new Error('QS Map Widget: Map marker required');
      }

      return $.ajax(markerInfoSrc);
    }

    function loadStyles ($mapContainer) {

      var styleSrc = $mapContainer.attr('data-map-style-src');

      if (styleSrc) {
        return $.ajax(styleSrc);
      }

    }

    function setMarkers(map, locations) {

      var infowindow = new google.maps.InfoWindow({
          content: "holding..."
      });
      for (var i = 0; i < locations.length; i++) {
          var pins = locations[i];
          console.log(pins.imgsrc);
          var mapIkon = {
              url: pins.imgsrc,
              // This marker is 20 pixels wide by 32 pixels tall.
              size: new google.maps.Size(23,31),
              // The origin for this image is 0,0.
              origin: new google.maps.Point(0,0),
              // The anchor for this image is the base of the flagpole at 0,32.
              anchor: new google.maps.Point(0, 30)
          };
          var myLatLng = new google.maps.LatLng(pins.cords[0], pins.cords[1]);
          var marker = new google.maps.Marker({
              position: myLatLng,
              map: map,
              icon: mapIkon,
              title: pins.header,
              text: pins.info
          });
          google.maps.event.addListener(marker, 'click', function () {
              infowindow.setContent(
                  '<div class="info_content">' +
                  '<h3>' + this.title + '</h3>' +
                  '' + this.text + '' +
                  '</div>'
              );
              infowindow.open(map, this);
          });
      }

    //AutoCenter();
    }

    function render(mapContainer, settings, style, marker) {
      var mapSettings = settings;
      var mapStyle = style;
      var markerInfo = marker.markers;

      var mapOptions = {
        zoom: mapSettings.zoom,
        center: new google.maps.LatLng(mapSettings.centerX, mapSettings.centerY),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      if (mapStyle) {
        mapOptions.styles = mapStyle;
      }

      var map = new google.maps.Map(mapContainer, mapOptions);
      if (markerInfo) {
        setMarkers(map, markerInfo);
      }
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

