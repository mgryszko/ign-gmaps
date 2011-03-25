describe("Utm", function() {
    beforeEach(function() {
        this.addMatchers({
            toEqualToLatLngWithDelta: toEqualToLatLngWithDelta
        })
    })

    it("can be created with planar coordinates and zone", function () {
        var utm = new ign.Utm(500000, 4300000, 30)

        expect(utm.x()).toEqual(500000)
        expect(utm.y()).toEqual(4300000)
        expect(utm.zone()).toEqual(30)
    })

    context("in an UTM zone", function () {
        var points = [
            {latLng: new gm.LatLng(39.0, -24.0), utm: new ign.Utm(240199.81, 4321059.12, 27)},
            {latLng: new gm.LatLng(40.0, -17.0), utm: new ign.Utm(329274.51, 4429672.97, 28)},
            {latLng: new gm.LatLng(41.0, -10.0), utm: new ign.Utm(415897.87, 4539238.59, 29)},
            {latLng: new gm.LatLng(42.0, -3.0), utm: new ign.Utm(500000, 4649776.22, 30)},
            {latLng: new gm.LatLng(43.0, 4.0), utm: new ign.Utm(581508.65, 4761299.93, 31)}
        ]

        points.each(function(point) {
            it("converts to lat-lng", function() {
                expect(point.utm.toLatLng()).toEqualToLatLngWithDelta(point.latLng, 0.000001)
            })
        })
    })

    context("in the UTM 30N zone", function () {
        var utmZone = 30

        context("on the geobounds of Spain", function() {
            var spainBounds30NZoneLimit = [
                {latLng: new gm.LatLng(44.0, -6.0), utm: new ign.Utm(259473.68, 4876249.13, utmZone)},
                {latLng: new gm.LatLng(44.0, 0.0), utm: new ign.Utm(740526.32, 4876249.13, utmZone)},
                {latLng: new gm.LatLng(35.0, 0.0), utm: new ign.Utm(773798.10, 3877156.69, utmZone)},
                {latLng: new gm.LatLng(35.0, -6.0), utm: new ign.Utm(226201.90, 3877156.69, utmZone)}
            ]
            var spainBoundsOutsize30NZone = [
                {latLng: new gm.LatLng(44.0, -7.0), utm: new ign.Utm(179294.18, 4879655.84, utmZone)},
                {latLng: new gm.LatLng(44.0, 1.0), utm: new ign.Utm(820705.82, 4879655.84, utmZone)},
                {latLng: new gm.LatLng(35.0, 1.0), utm: new ign.Utm(865108.81, 3880360.15, utmZone)},
                {latLng: new gm.LatLng(35.0, -7.0), utm: new ign.Utm(134891.19, 3880360.15, utmZone)}
            ]
            var points = spainBounds30NZoneLimit.concat(spainBoundsOutsize30NZone)

            points.each(function(point) {
                it("converts to lat-lng", function() {
                    expect(point.utm.toLatLng()).toEqualToLatLngWithDelta(point.latLng, 0.000001)
                })
            })
        })
    })    
})