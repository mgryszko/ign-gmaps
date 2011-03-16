describe("IgnProjection", function() {
    var gm = google.maps

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

                var converter
                var projection

                beforeEach(function() {
                    converter = jasmine.createSpyObj(CoordinateConverter, ["latLngToUtm", "utmToLatLng"])
                    spyOn(coordConverterFactory, "createConverter").andReturn(converter)
                    converter.latLngToUtm.andReturn({x: 179294.18, y: 4879655.84})

                    projection = new IgnProjection({
                        tileScaleForBaseZoom: tileScaleForBaseZoom,
                        utmZone: utmZone,
                        originTileLatLng: originTileLatLng
                    })

                    expect(coordConverterFactory.createConverter).toHaveBeenCalledWith(utmZone)
                    expect(converter.latLngToUtm).toHaveBeenCalledWith(originTileLatLng)
                })

                it("maps a lan-lng east and south from the origin tile to a world point with positive coordinates", function() {
                    testLatLngToPoint(new gm.LatLng(43.0, -3.0), {x: 500000, y: 4760814.796173},
                            new gm.Point(1441.125, 603.067202))
                })

                it("negative world coordinates are possible", function() {
                    testLatLngToPoint(new gm.LatLng(44.296377, -7.624554), {x: 131071, y: 4915201},
                            new gm.Point(-0.003906, -0.003906))
                })

                function testLatLngToPoint(latLng, utm, expWorldPoint) {
                    converter.latLngToUtm.andReturn(utm)

                    var worldPoint = projection.fromLatLngToPoint(latLng)

                    expect(worldPoint).toEqualToXYWithDelta(expWorldPoint, 0.000001)
                    expect(converter.latLngToUtm).toHaveBeenCalledWith({lat: latLng.lat(), lng: latLng.lng()})
                }

                it("maps a world point with positive coordinates to lat-lng east and south from the origin tile", function() {
                    var utm = {x: 499968, y: 4760832}
                    converter.utmToLatLng.andReturn({lat: 43.000155, lng: -3.000393})

                    var latLng = projection.fromPointToLatLng(new gm.Point(1441, 603))

                    expect(latLng).toEqualToLatLngWithDelta({lat: 43.000155, lng: -3.000393}, 0.000001)
                    expect(converter.utmToLatLng).toHaveBeenCalledWith(utm)
                })

                it("1 tile pixel corresponds to 1 world point", function() {
                    var latLng = new gm.LatLng(44.296377, -7.624554)
                    var utm = {x: 131072, y: 4915200}
                    var utmOnePxAway = {x: utm.x + tileScaleForBaseZoom, y: utm.y + tileScaleForBaseZoom}

                    converter.latLngToUtm.andReturn(utm)
                    var point = projection.fromLatLngToPoint(latLng)
                    converter.latLngToUtm.andReturn(utmOnePxAway)
                    var pointOnePxAway = projection.fromLatLngToPoint(latLng)

                    var pointDelta = {x: pointOnePxAway.x - point.x, y: pointOnePxAway.y - point.y}
                    expect(pointDelta).toEqual({x: 1, y: -1})
                })
            })
        })
    })
})
