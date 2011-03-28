describe("Utm", function() {
    beforeEach(function() {
        this.addMatchers({
            toEqualToLatLngWithDelta: toEqualToLatLngWithDelta,
            toEqualToUtmWithDelta: toEqualToUtmWithDelta
        })
    })

    context("given planar coordinates and a UTM zone", function () {
        var x = 500000
        var y = 4300000
        var zone = 30

        it("can be created directly", function () {
            var utm = new ign.Utm(x, y, zone)

            expectUtmToHaveGivenCoordAndZone(utm)
        })

        it("can be created via factory", function () {
            var utm = ign.Utm.createForXYAndZone(x, y, zone)

            expectUtmToHaveGivenCoordAndZone(utm)
        })

        function expectUtmToHaveGivenCoordAndZone(utm) {
            expect(utm.x()).toEqual(x)
            expect(utm.y()).toEqual(y)
            expect(utm.zone()).toEqual(zone)
        }
    })

    it("describes itself", function () {
        var utm = ign.Utm.createForXYAndZone(1, 2, 30)

        expect(utm.toString()).toEqual("(1, 2) 30N")
    })

    context("in a UTM zone", function () {
        ign.spec.pointsWithinSpainUtmZones.each(function(point) {
            it("converts to lat-lng", function() {
                expect(point.utm.toLatLng()).toEqualToLatLngWithDelta(point.latLng, 0.000001)
            })
        })
    })

    context("in the UTM 30N zone", function () {
        context("on the geobounds of Spain", function() {
            ign.spec.pointsOnSpainBounds.each(function(point) {
                it("converts to lat-lng", function() {
                    expect(point.utm.toLatLng()).toEqualToLatLngWithDelta(point.latLng, 0.000001)
                })
            })
        })
    })    
})