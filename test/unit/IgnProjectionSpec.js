describe("IgnProjection", function() {
    beforeEach(function() {
        this.addMatchers({
            toEqualToLatLngWithDelta: toEqualToLatLngWithDelta,
            toEqualToPointWithDelta: toEqualToPointWithDelta
        })
    })

    context("with tile scale for the base zoom level", function() {
        var tileScale = 256

        context("for a UTM zone", function() {
            var utmZone = 30

            context("the most upper left pixel of the origin tile corresponds to the Google Maps world origin", function() {
                var originTileLatLng = new gm.LatLng(44.0, -7.0)
                var projection

                beforeEach(function() {
                    var originTile = ign.Tile.spyOnCreateForLatLng()
                    var originUtm = new ign.Utm(131072, 4915200, utmZone)
                    originTile.upperLeftPixelUtm.andReturn(originUtm)

                    projection = new IgnProjection({
                        tileScaleForBaseZoom: tileScale,
                        utmZone: utmZone,
                        originTileLatLng: originTileLatLng
                    })

                    ign.Tile.expectCreateForLatLngCalledWith(originTileLatLng, tileScale, utmZone)
                })

                it("maps a lan-lng east and south from the origin tile to a world point with positive coordinates", function() {
                    testLatLngToPoint(new gm.LatLng(43.0, -3.0), new ign.Utm(500000, 4760814.8, utmZone),
                            new gm.Point(1441.125, 603.067188))
                })

                it("negative world coordinates are possible", function() {
                    testLatLngToPoint(new gm.LatLng(44.3, -7.62), new ign.Utm(131071, 4915201, utmZone),
                            new gm.Point(-0.003906, -0.003906))
                })

                function testLatLngToPoint(latLng, utm, expWorldPoint) {
                    var ignLatLng = ign.LatLng.spyOnCopy()
                    ignLatLng.toUtm.andReturn(utm)

                    var worldPoint = projection.fromLatLngToPoint(latLng)

                    expect(worldPoint).toEqualToPointWithDelta(expWorldPoint, 0.000001)
                    ign.LatLng.expectCopyCalledWith(latLng)
                    expect(ignLatLng.toUtm).toHaveBeenCalledWith(utm.zone())
                }

                it("1 tile pixel corresponds to 1 world point", function() {
                    var ignLatLng = ign.LatLng.spyOnCopy()
                    var dummyLatLng = new gm.LatLng(0, 0)
                    var utm = new ign.Utm(131072, 4915200)
                    var utmOnePxAway = new ign.Utm(utm.x() + tileScale, utm.y() + tileScale)

                    ignLatLng.toUtm.andReturn(utm)
                    var worldPoint = projection.fromLatLngToPoint(dummyLatLng)
                    ignLatLng.toUtm.andReturn(utmOnePxAway)
                    var worldPointOnePxAway = projection.fromLatLngToPoint(dummyLatLng)

                    var pointDelta = new gm.Point(worldPointOnePxAway.x - worldPoint.x, worldPointOnePxAway.y - worldPoint.y)
                    expect(pointDelta).toEqual(new gm.Point(1, -1))
                })

                it("maps a world point with positive coordinates to lat-lng east and south from the origin tile", function() {
                    var utm = ign.Utm.spyOnCreateForXYAndZone()
                    var latLng = new gm.LatLng(43.0, -3.0)
                    utm.toLatLng.andReturn(latLng)

                    expect(projection.fromPointToLatLng(new gm.Point(1441, 603))).toEqualToLatLngWithDelta(latLng, 0.000001)
                    ign.Utm.expectCreateForXYAndZoneCalledWith(499968, 4760832, utmZone)
                })
            })
        })
    })
})
