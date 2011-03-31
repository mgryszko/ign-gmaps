How to use the library?
====

 * Include ign-maps.js and proj4js.js in your project.

 You find an uncompressed and unobfuscated Proj4js version in the GitHub repository. A compressed and obfuscated one can be downloaded from <http://trac.osgeo.org/proj4js/wiki/Download>

 * Make sure you are familiar with the Custom Map chapter of the Google Maps API Developer Guide (<http://code.google.com/apis/maps/documentation/javascript/maptypes.html#CustomMapTypes>)

 * Configure the IGN map:

      var config = {
         tileScaleForBaseZoom: 256, // in meters/pixel for the zoom 0. Must be a power of 2. Valid scale range: 1 - 2048.
         utmZone: 30, // continental Spain: 29-31, Canary Island: 27-28
         originTileLatLng: new gm.LatLng(44.0, -7.0), // upper-left pixel of the tile covering these coordinates will become (0, 0) world point. Should lie withing the UTM zone or close to its boundaries. The farther it is from the boundaries, the bigger is the projection error
         ignMaps: [
             ign.MAP_TYPES.TOPO_1000, // IGN map for Google Maps zoom 0; using tile scale of 256 m/px
             ign.MAP_TYPES.TOPO_1000, // IGN map for Google Maps zoom 1; tile scale of 128 m/px
             ign.MAP_TYPES.TOPO_200,  // IGN map for Google Maps zoom 2; tile scale of 64 m/px
             ign.MAP_TYPES.TOPO_200,  // ...
             ign.MAP_TYPES.TOPO_50,
             ign.MAP_TYPES.TOPO_50,
             ign.MAP_TYPES.TOPO_25,
             ign.MAP_TYPES.TOPO_25,
             ign.MAP_TYPES.TOPO_25   // IGN map for Google Maps zoom 8 => thus max. zoom = 8; tile scale of 1 m/px
         ]
     }

 * Use ign.IgnMapFactory to create an IGN map layer. It will provide a custom ImageMapType together with MapOptions and Projection implementation:

      var ignMapType = ign.IgnMapFactory.createMapType(config)
       var map = new google.maps.Map(document.getElementById("map_viewport"))
       map.setCenter(new google.maps.LatLng(43.0, -3.0))
       map.setZoom(0)
       map.mapTypes.set("ignMap", ignMapType)
       map.setMapTypeId("ignMap")
       map.overlayMapTypes.insertAt(0, ignMapType)

Notes
====

* IGN tile scales are not compatible with Google Maps tile scales. It means that for a given IGN tile scale (e.g. 256 m/px) there is no 1:1 mapping to a Google map scale (e.g. road map at zoom 7)

TBD
====

 * Build system producing a minified version of the library
 * Documentation about the IGN tile server
 * Support for aerial imagery
 * Automatic switching of UTM zone