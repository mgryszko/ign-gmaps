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
                var originTileLatLng = {lat: 44.0, lng: -7.0}

                var projection = new IgnProjection({
                    tileScaleForBaseZoom: tileScaleForBaseZoom,
                    utmZone: utmZone,
                    originTileLatLng: originTileLatLng
                })

                it("maps a lan-lng east and south from the origin tile to a world point with positive coordinates", function() {
                    var point = projection.fromLatLngToPoint(new google.maps.LatLng(43.0, -3.0))

                    expect(point).toEqualToXYWithDelta({x: 1441.125, y: 603.067}, 0.001)
                })

                it("maps a world point with positive coordinates to lat-lng east and south from the origin tile", function() {
                    var latLng = projection.fromPointToLatLng(new google.maps.Point(1441.125, 603.067))

                    expect(latLng).toEqualToLatLngWithDelta({lat: 43.0, lng: -3.0}, 0.001)
                })
            })
        })
    })
})
