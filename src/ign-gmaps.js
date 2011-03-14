var TILE_SIZE_PX = 256

Proj4js.defs["EPSG:4258"] = "+proj=longlat +ellps=GRS80 +no_defs" //lat/lon with ETRS89 datum
Proj4js.defs["EPSG:3039"] = "+proj=utm +zone=27 +ellps=GRS80 +units=m +no_defs" //UTM 27N with ETRS89 datum
Proj4js.defs["EPSG:3040"] = "+proj=utm +zone=28 +ellps=GRS80 +units=m +no_defs" //UTM 28N with ETRS89 datum
Proj4js.defs["EPSG:3041"] = "+proj=utm +zone=29 +ellps=GRS80 +units=m +no_defs" //UTM 29N with ETRS89 datum
Proj4js.defs["EPSG:3042"] = "+proj=utm +zone=30 +ellps=GRS80 +units=m +no_defs" //UTM 30N with ETRS89 datum
Proj4js.defs["EPSG:3043"] = "+proj=utm +zone=31 +ellps=GRS80 +units=m +no_defs" //UTM 31N with ETRS89 datum

function CoordinateConverter(utmZone) {
    var etrsProjection = new Proj4js.Proj("EPSG:4258")
    var utmProjections = {
        27: new Proj4js.Proj("EPSG:3039"),
        28: new Proj4js.Proj("EPSG:3040"),
        29: new Proj4js.Proj("EPSG:3041"),
        30: new Proj4js.Proj("EPSG:3042"),
        31: new Proj4js.Proj("EPSG:3043")
    }

    this.latLngToUtm = function(latLng) {
        var point = new Proj4js.Point(latLng.lng, latLng.lat)
        Proj4js.transform(etrsProjection, utmProjections[utmZone], point)

        return {x: point.x, y: point.y}
    }

    this.utmToLatLng = function(utm) {
        var point = new Proj4js.Point(utm.x, utm.y)
        Proj4js.transform(utmProjections[utmZone], etrsProjection, point)

        return {lat: point.y, lng: point.x}
    }
}

var coordConverterFactory = function() {
    return {
        createConverter: function(utmZone) {
            return new CoordinateConverter(utmZone)
        }
    }
}()

function IgnProjection(config) {
    var coordConverter = coordConverterFactory.createConverter(config.utmZone)

    var originUtm = {
        x: config.originTileIgnCoord.x * config.originTileScale * TILE_SIZE_PX,
        y: (config.originTileIgnCoord.y + 1) * config.originTileScale * TILE_SIZE_PX
    }

    this.fromLatLngToPoint = function(latLng) {
        var utm = coordConverter.latLngToUtm({lat: latLng.lat(), lng: latLng.lng()})
        var worldPoint = {
            x: (utm.x - originUtm.x) / config.originTileScale,
            y: (originUtm.y - utm.y) / config.originTileScale
        }
        return new google.maps.Point(worldPoint.x, worldPoint.y)
    }

    this.fromPointToLatLng = function(point) {
        var utm = {
            x: point.x * config.originTileScale + originUtm.x,
            y: originUtm.y - point.y * config.originTileScale
        }
        var latLng = coordConverter.utmToLatLng(utm)
        return new google.maps.LatLng(latLng.lat, latLng.lng);
    }
}

var IGN_MAPS = {
    TOPO_1000: "mapa_millon",
    TOPO_200: "mapa_mtn200",
    TOPO_50: "mapa_mtn50",
    TOPO_25: "mapa_mtn25"
}

function IgnMapOptions(config) {
    this.minZoom = 0
    this.maxZoom = config.ignMaps.length - 1

    this.tileSize = new google.maps.Size(TILE_SIZE_PX, TILE_SIZE_PX)
    this.isPng = false

    function originTileIgnXCoordForZoom(zoom) {
        return config.originTileIgnCoord.x << zoom
    }
    function originTileIgnYCoordForZoom(zoom) {
        var y = config.originTileIgnCoord.y
        for (var i = 1; i <= zoom; i++) {
            y = y * 2 + 1
        }
        return y
    }
    
    this.getTileUrl = function(tileCoord, zoom) {
        var mapType = config.ignMaps[zoom]
        var scale = config.originTileScale * 1000 >> zoom
        var tileIgnCoord = {
            x: originTileIgnXCoordForZoom(zoom) + tileCoord.x,
            y: originTileIgnYCoordForZoom(zoom) - tileCoord.y
        }

        return "http://ts0.iberpix.ign.es/tileserver/" +
                "n=" + mapType +
                ";z=" + config.utmZone +
                ";r=" + scale +
                ";i=" + tileIgnCoord.x +
                ";j=" + tileIgnCoord.y +
                ".jpg"
    }
}

function IgnMapFactory() {
    this.createMapType = function(config) {
        var mapOptions = new IgnMapOptions(config)
        var mapType = new google.maps.ImageMapType(mapOptions)
        mapType.projection = new IgnProjection(config)
        
        return mapType
    }
}
