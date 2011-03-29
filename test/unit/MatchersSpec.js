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
        var utm = new ign.Utm(1, 2, 30)
        var actual = {actual: utm}

        it("matches a Utm by planar coordinates plus/minus delta and UTM zone", function() {
            var expected = new ign.Utm(1.001, 1.999, utm.zone())
            expect(toEqualToUtmWithDelta.call(actual, expected, 0.001)).toBeTruthy()
        })
        it("doesn't match a Utm due to planar coordinates plus/minus delta mismatch", function() {
            var expected = new ign.Utm(0.998, utm.y(), utm.zone())
            expect(toEqualToUtmWithDelta.call(actual, expected, 0.001)).toBeFalsy()
            expected = new ign.Utm(utm.x(), 2.002, utm.zone())
            expect(toEqualToUtmWithDelta.call(actual, expected, 0.001)).toBeFalsy()
        })
        it("doesn't match a Utm due to zone mismatch", function() {
            var expected = new ign.Utm(utm.x(), utm.y(), 31)
            expect(toEqualToUtmWithDelta.call(actual, expected, 0.001)).toBeFalsy()
        })
    })

    describe("toEqualToLatLngWithDelta matcher", function() {
        var latLng = new gm.LatLng(43.0, -3.0)
        var actual = {actual: latLng}

        it("matches a lat-lng by spherical coordinates plus/minus", function() {
            var expected = new gm.LatLng(43.001, -3.001)
            expect(toEqualToLatLngWithDelta.call(actual, expected, 0.001)).toBeTruthy()
        })
        it("doesn't match a lat-lng due to spherical coordinates mismatch", function() {
            var expected = new gm.LatLng(42.998, latLng.lng())
            expect(toEqualToLatLngWithDelta.call(actual, expected, 0.001)).toBeFalsy()
            expected = new gm.LatLng(latLng.lat(), -2.998)
            expect(toEqualToLatLngWithDelta.call(actual, expected, 0.001)).toBeFalsy()
        })
    })

    describe("toEqualToPointWithDelta matcher", function() {
        var point = new gm.Point(1.0, 2.0)
        var actual = {actual: point}

        it("matches a world point by planar coordinates plus/minus delta", function() {
            var expected = new gm.Point(1.001, 1.999)
            expect(toEqualToPointWithDelta.call(actual, expected, 0.001)).toBeTruthy()
        })
        it("doesn't match a world point due to planar coordinates mismatch", function() {
            var expected = new gm.Point(0.998, point.y)
            expect(toEqualToPointWithDelta.call(actual, expected, 0.001)).toBeFalsy()
            expected = new gm.Point(point.x, 2.002)
            expect(toEqualToPointWithDelta.call(actual, expected, 0.001)).toBeFalsy()
        })
    })

    describe("toEqualToTile matcher", function() {
        var tile = new ign.Tile(1, 2, 256, 30)
        var actual = {actual: tile}

        it("matches a tile by IGN coordinates, scale and UTM zone", function() {
            var expected = new ign.Tile(tile.x(), tile.y(), tile.scale(), tile.utmZone())
            expect(toEqualToTile.call(actual, expected)).toBeTruthy()
        })
        it("doesn't match a tile due to IGN coordinate mismatch", function() {
            var expected = new ign.Tile(2, tile.y())
            expect(toEqualToTile.call(actual, expected)).toBeFalsy()
            expected = new ign.Tile(tile.x(), 3)
            expect(toEqualToTile.call(actual, expected)).toBeFalsy()
        })
        it("doesn't match a tile due to scale mismatch", function() {
            var expected = new ign.Tile(tile.x(), tile.y(), 128)
            expect(toEqualToTile.call(actual, expected)).toBeFalsy()
        })
        it("doesn't match a tile due to UTM zone mismatch", function() {
            var expected = new ign.Tile(tile.x(), tile.y(), tile.scale(), 31)
            expect(toEqualToTile.call(actual, expected)).toBeFalsy()
        })
    })
})