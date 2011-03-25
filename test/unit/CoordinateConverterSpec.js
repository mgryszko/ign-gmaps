describe("CoordinateConverter", function() {
    beforeEach(function() {
        this.addMatchers({
            toEqualToUtmWithDelta: toEqualToUtmWithDelta,
            toEqualToLatLngWithDelta: toEqualToLatLngWithDelta
        })
    })

    context("in an UTM zone", function () {
        var utmZones = $R(27, 31)

        var points = {
            27: {latLng: new gm.LatLng(39.0, -24.0), utm: new ign.Utm(240199.81, 4321059.12)},
            28: {latLng: new gm.LatLng(40.0, -17.0), utm: new ign.Utm(329274.51, 4429672.97)},
            29: {latLng: new gm.LatLng(41.0, -10.0), utm: new ign.Utm(415897.87, 4539238.59)},
            30: {latLng: new gm.LatLng(42.0, -3.0), utm: new ign.Utm(500000, 4649776.22)},
            31: {latLng: new gm.LatLng(43.0, 4.0), utm: new ign.Utm(581508.65, 4761299.93)}
        }

        utmZones.each(function(utmZone) {
            var converter = new CoordinateConverter(utmZone)

            var point = points[utmZone]

            it("converts lat-lng to UTM", function() {
                expect(converter.latLngToUtm(point.latLng)).toEqualToUtmWithDelta(point.utm, 0.1)
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
                {latLng: new gm.LatLng(44.0, -6.0), utm: new ign.Utm(259473.68, 4876249.13)},
                {latLng: new gm.LatLng(44.0, 0.0), utm: new ign.Utm(740526.32, 4876249.13)},
                {latLng: new gm.LatLng(35.0, 0.0), utm: new ign.Utm(773798.10, 3877156.69)},
                {latLng: new gm.LatLng(35.0, -6.0), utm: new ign.Utm(226201.90, 3877156.69)}
            ]
            var spainBoundsOutsize30NZone = [
                {latLng: new gm.LatLng(44.0, -7.0), utm: new ign.Utm(179294.18, 4879655.84)},
                {latLng: new gm.LatLng(44.0, 1.0), utm: new ign.Utm(820705.82, 4879655.84)},
                {latLng: new gm.LatLng(35.0, 1.0), utm: new ign.Utm(865108.81, 3880360.15)},
                {latLng: new gm.LatLng(35.0, -7.0), utm: new ign.Utm(134891.19, 3880360.15)}
            ]
            var points = spainBounds30NZoneLimit.concat(spainBoundsOutsize30NZone)

            points.each(function(point) {
                it("converts lat-lng to UTM", function() {
                    expect(converter.latLngToUtm(point.latLng)).toEqualToUtmWithDelta(point.utm, 0.1)
                })
                it("converts UTM to lat-lng", function() {
                    expect(converter.utmToLatLng(point.utm)).toEqualToLatLngWithDelta(point.latLng, 0.000001)
                })
            })
        })
    })
})