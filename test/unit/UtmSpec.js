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