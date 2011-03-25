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
        var actual = {actual: new ign.Utm(1.0, 2.0)}

        it("matches an UTM coordinate within expected value plus/minus delta range", function() {
            var expected = new ign.Utm(1.001, 1.999)
            expect(toEqualToUtmWithDelta.call(actual, expected, 0.001)).toBeTruthy()
        })
        it("doesn't match an UTM coordinate outside the expected value plus/minus delta range", function() {
            var expected = new ign.Utm(0.998, 2.002)
            expect(toEqualToUtmWithDelta.call(actual, expected, 0.001)).toBeFalsy()
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

    describe("toEqualToPointWithDelta matcher", function() {
        var actual = {actual: new gm.Point(1.0, 2.0)}

        it("matches a world point within expected value plus/minus delta range", function() {
            var expected = new gm.Point(1.001, 1.999)
            expect(toEqualToPointWithDelta.call(actual, expected, 0.001)).toBeTruthy()
        })
        it("doesn't match a world point outside the expected value plus/minus delta range", function() {
            var expected = new gm.Point(0.998, 2.002)
            expect(toEqualToPointWithDelta.call(actual, expected, 0.001)).toBeFalsy()
        })
    })

    describe("toEqualToTile matcher", function() {
        var actual = {actual: new ign.Tile(1, 2, 256, 30)}

        it("matches a tile by IGN coordinates, scale and UTM zone", function() {
            var expected = new ign.Tile(1, 2, 256, 30)
            expect(toEqualToTile.call(actual, expected)).toBeTruthy()
        })
        it("doesn't match a tile due to IGN coordinate mismatch", function() {
            var expected = new ign.Tile(2, 2)
            expect(toEqualToTile.call(actual, expected)).toBeFalsy()
            expected = new ign.Tile(1, 3)
            expect(toEqualToTile.call(actual, expected)).toBeFalsy()
        })
        it("doesn't match a tile due to scale mismatch", function() {
            var expected = new ign.Tile(1, 2, 128)
            expect(toEqualToTile.call(actual, expected)).toBeFalsy()
        })
        it("doesn't match a tile due to UTM zone mismatch", function() {
            var expected = new ign.Tile(1, 2, 256, 31)
            expect(toEqualToTile.call(actual, expected)).toBeFalsy()
        })
    })
})