'use strict';

$we.register('Example5', ['/bower_components/jquery/dist/jquery.min.js', 'http://maps.google.com/maps/api/js?sensor=false', 'css/graph.css'], function (widgets) {

var chicago = new google.maps.LatLng (0, 0);

var myOptions = {
    zoom:1,
    center: chicago,
    mapTypeId: google.maps.MapTypeId.ROADMAP
}

map = new google.maps.Map(widget, myOptions);

  $.each(widgets, function (i, widget) {

    $we.loadFile($(widget).attr('data-widget-data-src'), function(data) {
      init(widget, data);
    });

  });


});
