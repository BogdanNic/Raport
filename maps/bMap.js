/**
 * Created by bogdan on 3/5/2015.
 */
var map;
var styles;
var styles3d;
var encoding;
function load()
{   styles=[ { "elementType": "labels", "stylers": [ { "visibility": "off" } ] },
    { "featureType": "road", "elementType": "geometry", "stylers": [ { "color": "#e2de7d" } ] } ];
    var mapOptions = {
        zoom: 16,
        //center: new google.maps.LatLng(44.32476, 23.813470),
        center: new google.maps.LatLng(44.31649454929054,23.80039930343628),
        mapTypeId:google.maps.MapTypeId.ROADMAP,
        //mapTypeId:google.maps.MapTypeId.HYBRID,
        disableDefaultUI: true,
        scrollwheel:true

    };
    map = new google.maps.Map(document.getElementById('map'),
        mapOptions);

    /*    google.maps.event.addListener(map, 'click', function(e) {
     var loc=new google.maps.LatLng(e.latLng.d,e.latLng.e);
     // alert(loc.lat());
     alert(map.getZoom());
     });*/
    google.maps.event.addDomListener(drawLine, 'click', function(e) {

        var text=  $("#textCoods").val();
        var decodedString=google.maps.geometry.encoding.decodePath(text);

        pathLine = new google.maps.Polyline({
            path: decodedString,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2 ,
            editable:true
        });

        pathLine.setMap(map);

    });
    google.maps.event.addDomListener(addNew, 'click', function(e) {

     //   alert("ASdsa");
        //var text=  $("#textCoods").val();
        //var decodedString=google.maps.geometry.encoding.decodePath(text);
        //
        //pathLine = new google.maps.Polyline({
        //    path: decodedString,
        //    geodesic: true,
        //    strokeColor: '#FF0000',
        //    strokeOpacity: 1.0,
        //    strokeWeight: 2 ,
        //    editable:true
        //});
        //
        //pathLine.setMap(map);
        var polyOptions = {
            strokeColor: 'blue',
            strokeOpacity: 2.0,
            strokeWeight: 3
        };
        poly = new google.maps.Polyline(polyOptions);
        poly.setMap(map);
    });
    google.maps.event.addListener(map, 'click', addLatLng);
    function addLatLng(event) {

        var path = poly.getPath();

        // Because path is an MVCArray, we can simply append a new coordinate
        // and it will automatically appear.
        path.push(event.latLng);

        // Add a new marker at the new plotted point on the polyline.
        //var marker = new google.maps.Marker({
        //    position: event.latLng,
        //    title: '#' + path.getLength(),
        //    map: map
        //});
    }
    //google.maps.event.addListener(map, 'zoom_changed', function(e) {
    //    ///  alert("ds");
    //});
}
google.maps.event.addDomListener(window, 'load', load);