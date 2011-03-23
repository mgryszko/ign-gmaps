describe("IgnProjection", function() {
    var gm = google.maps

    beforeEach(function() {
        this.addMatchers({
            toEqualToXYWithDelta: toEqualToXYWithDelta,
            toEqualToLatLngWithDelta: toEqualToLatLngWithDelta
        })
    })

    context("with tile scale for the base zoom level", function() {
        var tileScale = 256

        context("for an UTM zone", function() {
            var utmZone = 30

            context("the most upper left pixel of the origin tile corresponds to the Google Maps world origin", function() {
                var originTileLatLng = new gm.LatLng(44.0, -7.0)

                var coordConverter
                var projection

                beforeEach(function() {
                    coordConverter = CoordinateConverter.createSpyForUtmZone()
                    var ignTileCalculator = IgnTileCalculator.createSpyForUtmZone()
                    var originTileIgnCoord = {x: 2, y: 74}
                    var originTileUpperLeftPixelUtm = new ign.Utm(131072, 4915200)
                    ignTileCalculator.latLngToTileIgnCoord.andReturn(originTileIgnCoord)
                    ignTileCalculator.upperLeftPixelUtm.andReturn(originTileUpperLeftPixelUtm)

                    projection = new IgnProjection({
                        tileScaleForBaseZoom: tileScale,
                        utmZone: utmZone,
                        originTileLatLng: originTileLatLng
                    })

                    CoordinateConverter.expectSpyCreatedForUtmZone(utmZone)
                    IgnTileCalculator.expectSpyCreatedForUtmZone(utmZone)
                    expect(ignTileCalculator.latLngToTileIgnCoord).toHaveBeenCalledWith(tileScale, originTileLatLng)
                    expect(ignTileCalculator.upperLeftPixelUtm).toHaveBeenCalledWith(tileScale, originTileIgnCoord)
                })

                it("maps a lan-lng east and south from the origin tile to a world point with positive coordinates", function() {
                    testLatLngToPoint(new gm.LatLng(43.0, -3.0), new ign.Utm(500000, 4760814.796173),
                            new gm.Point(1441.125, 603.067202))
                })

                it("negative world coordinates are possible", function() {
                    testLatLngToPoint(new gm.LatLng(44.296377, -7.624554), new ign.Utm(131071, 4915201),
                            new gm.Point(-0.003906, -0.003906))
                })

                function testLatLngToPoint(latLng, utm, expWorldPoint) {
                    coordConverter.latLngToUtm.andReturn(utm)

                    var worldPoint = projection.fromLatLngToPoint(latLng)

                    expect(worldPoint).toEqualToXYWithDelta(expWorldPoint, 0.000001)
                    expect(coordConverter.latLngToUtm).toHaveBeenCalledWith(latLng)
                }

                it("maps a world point with positive coordinates to lat-lng east and south from the origin tile", function() {
                    coordConverter.utmToLatLng.andReturn(new gm.LatLng(43.000155, -3.000393))

                    var latLng = projection.fromPointToLatLng(new gm.Point(1441, 603))

                    expect(latLng).toEqualToLatLngWithDelta(new gm.LatLng(43.000155, -3.000393), 0.000001)
                    expect(coordConverter.utmToLatLng).toHaveBeenCalledWith(new ign.Utm(499968, 4760832))
                })

                it("1 tile pixel corresponds to 1 world point", function() {
                    var latLng = new gm.LatLng(44.296377, -7.624554)
                    var utm = new ign.Utm(131072, 4915200)
                    var utmOnePxAway = new ign.Utm(utm.x + tileScale, utm.y + tileScale)

                    coordConverter.latLngToUtm.andReturn(utm)
                    var worldPoint = projection.fromLatLngToPoint(latLng)
                    coordConverter.latLngToUtm.andReturn(utmOnePxAway)
                    var worldPointOnePxAway = projection.fromLatLngToPoint(latLng)

                    var pointDelta = new gm.Point(worldPointOnePxAway.x - worldPoint.x, worldPointOnePxAway.y - worldPoint.y)
                    expect(pointDelta).toEqual(new gm.Point(1, -1))
                })
            })
        })
    })
})
