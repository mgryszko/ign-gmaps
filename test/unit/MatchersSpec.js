describe("additional matchers", function() {
    describe("toEqualWithDelta", function() {
        it("matches a number within expected value minus delta", function() {
            expect(equalsWithDelta(0.999, 1.0, 0.001)).toBeTruthy()
        })
        it("matches a number within expected value plus delta", function() {
            expect(equalsWithDelta(1.001, 1.0, 0.001)).toBeTruthy()
        })
        it("matches a number equal to expected value", function() {
            expect(equalsWithDelta(1.0, 1.0, 0.001)).toBeTruthy()
        })
        it("doesn't match a number smaller that expected value minus delta", function() {
            expect(equalsWithDelta(0.998, 1.0, 0.001)).toBeFalsy()
        })
        it("doesn't match a number greater that expected value plus delta", function() {            
            expect(equalsWithDelta(1.002, 1.0, 0.001)).toBeFalsy()
        })
    })

    describe("toEqualToUtmWithDelta matcher", function() {
        var actual = {actual: {x: 1.0, y: 2.0}}

        it("matches an UTM coordinate within expected value plus/minus delta range", function() {
            var expected = {x: 1.001, y: 1.999}
            expect(toEqualToXYWithDelta.call(actual, expected, 0.001)).toBeTruthy()
        })
        it("doesn't match an UTM coordinate outside the expected value plus/minus delta range", function() {
            var expected = {x: 0.998, y: 2.002}
            expect(toEqualToXYWithDelta.call(actual, expected, 0.001)).toBeFalsy()
        })

    })

    describe("toEqualToLatLngWithDelta matcher", function() {
        var latLng = new gm.LatLng(43.0, -3.0)

        it("matches a lat-lng coordinate within expected value plus/minus delta range", function() {
            var expected = new gm.LatLng(43.001, -3.001)
            expect(toEqualToLatLngWithDelta.call({actual: latLng}, expected, 0.001)).toBeTruthy()
        })
        it("doesn't match a lat-lng coordinate outside the expected value plus/minus delta range", function() {
            var expected = new gm.LatLng(42.998, -2.999)
            expect(toEqualToLatLngWithDelta.call({actual: latLng}, expected, 0.001)).toBeFalsy()
        })
    })
})