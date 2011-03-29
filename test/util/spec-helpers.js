ign.spec = {}

ign.spec.pointsWithinSpainUtmZones = [
    {latLng: new ign.LatLng(39.0, -24.0), utm: new ign.Utm(240199.81, 4321059.12, 27)},
    {latLng: new ign.LatLng(40.0, -17.0), utm: new ign.Utm(329274.51, 4429672.97, 28)},
    {latLng: new ign.LatLng(41.0, -10.0), utm: new ign.Utm(415897.87, 4539238.59, 29)},
    {latLng: new ign.LatLng(42.0, -3.0), utm: new ign.Utm(500000, 4649776.22, 30)},
    {latLng: new ign.LatLng(43.0, 4.0), utm: new ign.Utm(581508.65, 4761299.93, 31)}
]

ign.spec.pointsOnSpainBounds30NZoneLimit = [
    {latLng: new ign.LatLng(44.0, -6.0), utm: new ign.Utm(259473.68, 4876249.13, 30)},
    {latLng: new ign.LatLng(44.0, 0.0), utm: new ign.Utm(740526.32, 4876249.13, 30)},
    {latLng: new ign.LatLng(35.0, 0.0), utm: new ign.Utm(773798.10, 3877156.69, 30)},
    {latLng: new ign.LatLng(35.0, -6.0), utm: new ign.Utm(226201.90, 3877156.69, 30)}
]

ign.spec.pointsOnSpainBoundsOutsize30NZone = [
    {latLng: new ign.LatLng(44.0, -7.0), utm: new ign.Utm(179294.18, 4879655.84, 30)},
    {latLng: new ign.LatLng(44.0, 1.0), utm: new ign.Utm(820705.82, 4879655.84, 30)},
    {latLng: new ign.LatLng(35.0, 1.0), utm: new ign.Utm(865108.81, 3880360.15, 30)},
    {latLng: new ign.LatLng(35.0, -7.0), utm: new ign.Utm(134891.19, 3880360.15, 30)}
]

ign.spec.pointsOnSpainBounds = ign.spec.pointsOnSpainBounds30NZoneLimit.concat(ign.spec.pointsOnSpainBoundsOutsize30NZone)

ign.LatLng.spyOnCopy = function() {
    var copy = jasmine.createSpyObj(ign.LatLng, ["toUtm"])
    spyOn(ign.LatLng, "copy").andReturn(copy)

    return copy
}

ign.LatLng.expectCopyCalledWith = function(original) {
    expect(ign.LatLng.copy).toHaveBeenCalledWith(original)
}

ign.Utm.spyOnCreateForXYAndZone = function() {
    var utm = jasmine.createSpyObj(ign.Utm, ["toLatLng"])
    spyOn(ign.Utm, "createForXYAndZone").andReturn(utm)

    return utm
}

ign.Utm.expectCreateForXYAndZoneCalledWith = function(x, y, zone) {
    expect(ign.Utm.createForXYAndZone).toHaveBeenCalledWith(x, y, zone)
}

ign.Tile.spyOnCreateForLatLng = function() {
    var tile = jasmine.createSpyObj(ign.Tile, ["upperLeftPixelUtm", "spawnTileForGMapsZoom"])
    spyOn(ign.Tile, "createForLatLng").andReturn(tile)

    return tile
}

ign.Tile.expectCreateForLatLngCalledWith = function(latLng, scale, utmZone) {
    expect(ign.Tile.createForLatLng).toHaveBeenCalledWith(latLng, scale, utmZone)
}
