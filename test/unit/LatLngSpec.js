describe("ign.LatLng", function() {
    beforeEach(function() {
        this.addMatchers({
            toEqualToLatLngWithDelta: toEqualToLatLngWithDelta,
            toEqualToUtmWithDelta: toEqualToUtmWithDelta
        })
    })

    context("given spherical coordinates", function () {
        var lat = 43.0
        var lng = -3.0

        it("can be created directly", function () {
            var latLng = new ign.LatLng(lat, lng)

            expectLatLngToHaveGivenCoord(latLng)
        })

        it("can be created via factory", function () {
            var latLng = new ign.LatLng.createForLatLng(lat, lng)

            expectLatLngToHaveGivenCoord(latLng)
        })

        function expectLatLngToHaveGivenCoord(latLng) {
            expect(latLng.lat()).toEqual(lat)
            expect(latLng.lng()).toEqual(lng)
        }

        it("can be created as a copy of GMaps lat-lng", function () {
            var gmLatLng = new gm.LatLng(lat, lng)

            var ignLatLng = ign.LatLng.copy(gmLatLng)

            expect(ignLatLng.constructor).toEqual(ign.LatLng)
            expect(ignLatLng).toEqualToLatLngWithDelta(gmLatLng, 0)
        })

        it("is interchangeable with GMaps lat-lng and vice-versa", function () {
            var gmLatLng = new gm.LatLng(lat, lng)
            var ignLatLng = new ign.LatLng(lat, lng)

            expect(ignLatLng.equals(gmLatLng)).toBeTruthy()
            expect(gmLatLng.equals(ignLatLng)).toBeTruthy()
        })
    })

    context("in a UTM zone", function () {
        ign.spec.pointsWithinSpainUtmZones.each(function(point) {
            it("converts to UTM", function() {
                expect(point.latLng.toUtm(point.utm.zone())).toEqualToUtmWithDelta(point.utm, 0.1)
            })
        })
    })

    context("in the UTM 30N zone", function () {
        var utmZone = 30

        context("on the geobounds of Spain", function() {
            ign.spec.pointsOnSpainBounds.each(function(point) {
                it("converts to URM", function() {
                    expect(point.latLng.toUtm(point.utm.zone())).toEqualToUtmWithDelta(point.utm, 0.1)
                })
            })
        })
    })
 })