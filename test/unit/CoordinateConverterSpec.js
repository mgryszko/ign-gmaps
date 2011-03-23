describe("CoordinateConverter", function() {
    beforeEach(function() {
        this.addMatchers({
            toEqualToXYWithDelta: toEqualToXYWithDelta,
            toEqualToLatLngWithDelta: toEqualToLatLngWithDelta
        })
    })

    context("in an UTM zone", function () {
        var utmZones = $R(27, 31)

        var points = {
            27: {latLng: new gm.LatLng(39.0, -24.0), utm: {x: 240199.81, y: 4321059.12}},
            28: {latLng: new gm.LatLng(40.0, -17.0), utm: {x: 329274.51, y: 4429672.97}},
            29: {latLng: new gm.LatLng(41.0, -10.0), utm: {x: 415897.87, y: 4539238.59}},
            30: {latLng: new gm.LatLng(42.0, -3.0), utm: {x: 500000, y: 4649776.22}},
            31: {latLng: new gm.LatLng(43.0, 4.0), utm: {x: 581508.65, y: 4761299.93}}
        }

        utmZones.each(function(utmZone) {
            var converter = new CoordinateConverter(utmZone)

            var point = points[utmZone]

            it("converts lat-lng to UTM", function() {
                expect(converter.latLngToUtm(point.latLng)).toEqualToXYWithDelta(point.utm, 0.1)
            })
            it("converts UTM to lat-lng", function() {
                expect(converter.utmToLatLng(point.utm)).toEqualToLatLngWithDelta(point.latLng, 0.000001)
            })
        })
    })

    context("in the UTM 30N zone", function () {
        var converter = new CoordinateConverter(30)

        context("on the geobounds of Spain", function() {
            var spainBounds30NZoneLimit = [
                {latLng: new gm.LatLng(44.0, -6.0), utm: {x: 259473.68, y: 4876249.13}},
                {latLng: new gm.LatLng(44.0, 0.0), utm: {x: 740526.32, y: 4876249.13}},
                {latLng: new gm.LatLng(35.0, 0.0), utm: {x: 773798.10, y: 3877156.69}},
                {latLng: new gm.LatLng(35.0, -6.0), utm: {x: 226201.90, y: 3877156.69}}
            ]
            var spainBoundsOutsize30NZone = [
                {latLng: new gm.LatLng(44.0, -7.0), utm: {x: 179294.18, y: 4879655.84}},
                {latLng: new gm.LatLng(44.0, 1.0), utm: {x: 820705.82, y: 4879655.84}},
                {latLng: new gm.LatLng(35.0, 1.0), utm: {x: 865108.81, y: 3880360.15}},
                {latLng: new gm.LatLng(35.0, -7.0), utm: {x: 134891.19, y: 3880360.15}}
            ]
            var points = spainBounds30NZoneLimit.concat(spainBoundsOutsize30NZone)

            points.each(function(point) {
                it("converts lat-lng to UTM", function() {
                    expect(converter.latLngToUtm(point.latLng)).toEqualToXYWithDelta(point.utm, 0.1)
                })
                it("converts UTM to lat-lng", function() {
                    expect(converter.utmToLatLng(point.utm)).toEqualToLatLngWithDelta(point.latLng, 0.000001)
                })
            })
        })
    })
})