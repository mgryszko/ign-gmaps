describe("IgnProjection with the default lat-lng to UTM converter", function() {
    beforeEach(function() {
        this.addMatchers({
            toEqualToXYWithDelta: toEqualToXYWithDelta,
            toEqualToLatLngWithDelta: toEqualToLatLngWithDelta
        })
    })

    context("with tile scale for the base zoom level", function() {
        var tileScaleForBaseZoom = 256

        context("for an UTM zone", function() {
            var utmZone = 30

            context("the most upper left pixel of the origin tile corresponds to the Google Maps world origin", function() {
                var originTileLatLng = new gm.LatLng(44.0, -7.0)

                var projection = new IgnProjection({
                    tileScaleForBaseZoom: tileScaleForBaseZoom,
                    utmZone: utmZone,
                    originTileLatLng: originTileLatLng
                })

                it("maps a lan-lng east and south from the origin tile to a world point with positive coordinates", function() {
                    var point = projection.fromLatLngToPoint(new gm.LatLng(43.0, -3.0))

                    expect(point).toEqualToXYWithDelta(new gm.Point(1441.125, 603.067), 0.001)
                })

                it("maps a world point with positive coordinates to lat-lng east and south from the origin tile", function() {
                    var latLng = projection.fromPointToLatLng(new gm.Point(1441.125, 603.067))

                    expect(latLng).toEqualToLatLngWithDelta(new gm.LatLng(43.0, -3.0), 0.001)
                })
            })
        })
    })
})
