Proj4js.defs["EPSG:4258"] = "+proj=longlat +ellps=GRS80 +no_defs" //lat/lon with ETRS89 datum
Proj4js.defs["EPSG:3039"] = "+proj=utm +zone=27 +ellps=GRS80 +units=m +no_defs" //UTM 27N with ETRS89 datum
Proj4js.defs["EPSG:3040"] = "+proj=utm +zone=28 +ellps=GRS80 +units=m +no_defs" //UTM 28N with ETRS89 datum
Proj4js.defs["EPSG:3041"] = "+proj=utm +zone=29 +ellps=GRS80 +units=m +no_defs" //UTM 29N with ETRS89 datum
Proj4js.defs["EPSG:3042"] = "+proj=utm +zone=30 +ellps=GRS80 +units=m +no_defs" //UTM 30N with ETRS89 datum
Proj4js.defs["EPSG:3043"] = "+proj=utm +zone=31 +ellps=GRS80 +units=m +no_defs" //UTM 31N with ETRS89 datum

var gm = google.maps
var ign = {}

ign.ETRS_PROJECTION = new Proj4js.Proj("EPSG:4258")
ign.UTM_PROJECTIONS = {
    27: new Proj4js.Proj("EPSG:3039"),
    28: new Proj4js.Proj("EPSG:3040"),
    29: new Proj4js.Proj("EPSG:3041"),
    30: new Proj4js.Proj("EPSG:3042"),
    31: new Proj4js.Proj("EPSG:3043")
}

ign.MAP_TYPES = {
    TOPO_1000: "mapa_millon",
    TOPO_200: "mapa_mtn200",
    TOPO_50: "mapa_mtn50",
    TOPO_25: "mapa_mtn25"
}

ign.Utm = function(x, y, zone) {
    this.x = function() { return x }
    this.y = function() { return y }
    this.zone = function() { return zone }
}

ign.Utm.prototype.toLatLng = function() {
    var point = new Proj4js.Point(this.x(), this.y())
    Proj4js.transform(ign.UTM_PROJECTIONS[this.zone()], ign.ETRS_PROJECTION, point)    
    return new gm.LatLng(point.y, point.x)
}


ign.LatLng = function(lat, lng) {
    gm.LatLng.call(this, lat, lng)
}
ign.LatLng.prototype = new gm.LatLng()
ign.LatLng.prototype.constructor = ign.LatLng

ign.LatLng.createFromLatLng = function(source) {
    return new ign.LatLng(source.lat(), source.lng())
}

ign.LatLng.prototype.toUtm = function(utmZone) {
    var point = new Proj4js.Point(this.lng(), this.lat())
    Proj4js.transform(ign.ETRS_PROJECTION, ign.UTM_PROJECTIONS[utmZone], point)

    return new ign.Utm(point.x, point.y)
}


ign.Tile = function(x, y, scale, utmZone) {
    this.x = function() { return x }
    this.y = function() { return y }
    this.scale = function() { return scale }
    this.utmZone = function() { return utmZone }
}

ign.Tile.SIZE_IN_PX = 256

ign.Tile.createForLatLng = function(latLng, scale, utmZone) {
    var utm = ign.LatLng.createFromLatLng(latLng).toUtm(utmZone)

    return new ign.Tile(
        Math.floor(utm.x() / (scale * ign.Tile.SIZE_IN_PX)),
        Math.floor(utm.y() / (scale * ign.Tile.SIZE_IN_PX)),
        scale, utmZone
    )
}

ign.Tile.prototype.upperLeftPixelUtm = function() {
    return new ign.Utm(
        this.x() * this.scale() * ign.Tile.SIZE_IN_PX,
        (this.y() + 1) * this.scale() * ign.Tile.SIZE_IN_PX
    )
}

ign.Tile.prototype.spawnTileForGMapsZoom = function(zoom) {
    function xForGMapsZoom(x, zoom) { return x << zoom }
    function yForGMapsZoom(y, zoom) {
        for (var i = 1; i <= zoom; i++) {
            y = y * 2 + 1
        }
        return y
    }
    function scaleForGMapsZoom(scale, zoom) { return scale >> zoom }

    return new ign.Tile(xForGMapsZoom(this.x(), zoom), yForGMapsZoom(this.y(), zoom),
            scaleForGMapsZoom(this.scale(), zoom), this.utmZone())
}

ign.Tile.prototype.moveBy = function(deltaX, deltaY) {
    return new ign.Tile(this.x() + deltaX, this.y() + deltaY, this.scale(), this.utmZone())
}

ign.Tile.prototype.toString = function() {
    return "(" + this.x() + ", " + this.y() + ") " + this.scale() + " m/px " + this.utmZone() + "N" 
}


function IgnProjection(config) {
    var utmZone = config.utmZone
    var originTileLatLng = config.originTileLatLng
    var tileScaleForBaseZoom = config.tileScaleForBaseZoom

    var originUtm = function() {
        var originTile = ign.Tile.createForLatLng(originTileLatLng, tileScaleForBaseZoom, utmZone)
        return originTile.upperLeftPixelUtm()
    }()

    this.fromLatLngToPoint = function(latLng) {
        var utm = ign.LatLng.createFromLatLng(latLng).toUtm(utmZone)
        return new gm.Point(
            (utm.x() - originUtm.x()) / tileScaleForBaseZoom,
            (originUtm.y() - utm.y()) / tileScaleForBaseZoom
        )
    }

    this.fromPointToLatLng = function(worldPoint) {
        var utm = new ign.Utm(
            worldPoint.x * tileScaleForBaseZoom + originUtm.x(),
            originUtm.y() - worldPoint.y * tileScaleForBaseZoom,
            utmZone
        )
        return utm.toLatLng()
    }
}

function IgnMapOptions(config) {
    var utmZone = config.utmZone
    var originTileLatLng = config.originTileLatLng
    var tileScaleForBaseZoom = config.tileScaleForBaseZoom
    var ignMapTypes = config.ignMaps
    var originTile = ign.Tile.createForLatLng(originTileLatLng, tileScaleForBaseZoom, utmZone)

    this.minZoom = 0
    this.maxZoom = ignMapTypes.length - 1
    this.tileSize = new gm.Size(ign.Tile.SIZE_IN_PX, ign.Tile.SIZE_IN_PX)
    this.isPng = false

    this.getTileUrl = function(tileCoord, zoom) {
        var tile = originTile.spawnTileForGMapsZoom(zoom).moveBy(tileCoord.x, -tileCoord.y)

        return "http://ts0.iberpix.ign.es/tileserver/" +
                "n=" + ignMapTypes[zoom] +
                ";z=" + tile.utmZone() + ";r=" + (tile.scale() * 1000) +
                ";i=" + tile.x() + ";j=" + tile.y() + ".jpg"
    }
}

function IgnMapFactory() {
    this.createMapType = function(config) {
        var mapOptions = new IgnMapOptions(config)
        var mapType = new gm.ImageMapType(mapOptions)
        mapType.projection = new IgnProjection(config)

        return mapType
    }
}
