describe("ign.LatLng", function() {
    beforeEach(function() {
        this.addMatchers({
            toEqualToLatLngWithDelta: toEqualToLatLngWithDelta,
            toEqualToUtmWithDelta: toEqualToUtmWithDelta
        })
    })

    it("can be created with spherical coordinates", function () {
        var latLng = new ign.LatLng(43.0, -3.0)

        expect(latLng.lat()).toEqual(43.0)
        expect(latLng.lng()).toEqual(-3.0)
    })

    it("can be created from GMaps lat-lng", function () {
        var gmLatLng = new gm.LatLng(43.0, -3.0)

        var ignLatLng = ign.LatLng.createFromLatLng(gmLatLng)

        expect(ignLatLng.constructor).toEqual(ign.LatLng)
        expect(ignLatLng).toEqualToLatLngWithDelta(gmLatLng, 0)
    })

    it("is interchangeable with GMaps lat-lng and vice-versa", function () {
        var gmLatLng = new gm.LatLng(43.0, -3.0)
        var ignLatLng = new ign.LatLng(43.0, -3.0)

        expect(ignLatLng.equals(gmLatLng)).toBeTruthy()
        expect(gmLatLng.equals(ignLatLng)).toBeTruthy()
    })

    context("in an UTM zone", function () {
        var points = [
            {latLng: new ign.LatLng(39.0, -24.0), utm: new ign.Utm(240199.81, 4321059.12, 27)},
            {latLng: new ign.LatLng(40.0, -17.0), utm: new ign.Utm(329274.51, 4429672.97, 28)},
            {latLng: new ign.LatLng(41.0, -10.0), utm: new ign.Utm(415897.87, 4539238.59, 29)},
            {latLng: new ign.LatLng(42.0, -3.0), utm: new ign.Utm(500000, 4649776.22, 30)},
            {latLng: new ign.LatLng(43.0, 4.0), utm: new ign.Utm(581508.65, 4761299.93, 31)}
        ]

        points.each(function(point) {
            it("converts to UTM", function() {
                expect(point.latLng.toUtm(point.utm.zone())).toEqualToUtmWithDelta(point.utm, 0.1)
            })
        })
    })

    context("in the UTM 30N zone", function () {
        var utmZone = 30

        context("on the geobounds of Spain", function() {
            var spainBounds30NZoneLimit = [
                {latLng: new ign.LatLng(44.0, -6.0), utm: new ign.Utm(259473.68, 4876249.13, utmZone)},
                {latLng: new ign.LatLng(44.0, 0.0), utm: new ign.Utm(740526.32, 4876249.13, utmZone)},
                {latLng: new ign.LatLng(35.0, 0.0), utm: new ign.Utm(773798.10, 3877156.69, utmZone)},
                {latLng: new ign.LatLng(35.0, -6.0), utm: new ign.Utm(226201.90, 3877156.69, utmZone)}
            ]
            var spainBoundsOutsize30NZone = [
                {latLng: new ign.LatLng(44.0, -7.0), utm: new ign.Utm(179294.18, 4879655.84, utmZone)},
                {latLng: new ign.LatLng(44.0, 1.0), utm: new ign.Utm(820705.82, 4879655.84, utmZone)},
                {latLng: new ign.LatLng(35.0, 1.0), utm: new ign.Utm(865108.81, 3880360.15, utmZone)},
                {latLng: new ign.LatLng(35.0, -7.0), utm: new ign.Utm(134891.19, 3880360.15, utmZone)}
            ]
            var points = spainBounds30NZoneLimit.concat(spainBoundsOutsize30NZone)

            points.each(function(point) {
                it("converts to URM", function() {
                    expect(point.latLng.toUtm(point.utm.zone())).toEqualToUtmWithDelta(point.utm, 0.1)
                })
            })
        })
    })
 })