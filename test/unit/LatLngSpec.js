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