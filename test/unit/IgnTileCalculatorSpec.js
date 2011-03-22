describe("IgnTileCalculator", function() {
    context("in an UTM zone", function () {
        var utmZone = 30

        var converter
        var calculator

        beforeEach(function() {
            // TODO duplicated code
            converter = jasmine.createSpyObj(CoordinateConverter, ["latLngToUtm"])
            spyOn(CoordinateConverter, "createForUtmZone").andReturn(converter)

            calculator = IgnTileCalculator.createForUtmZone(utmZone)

            expect(CoordinateConverter.createForUtmZone).toHaveBeenCalledWith(utmZone)
        })

        it("converts lat-lng to tile IGN coordinates", function () {
            converter.latLngToUtm.andReturn({x: 179294.18, y: 4879655.84})
            var tileScale = 256
            var latLng = {lat: 44.0, lng: -7.0}

            expect(calculator.latLngToTileIgnCoord(tileScale, latLng)).toEqual({x: 2, y: 74})
            expect(converter.latLngToUtm).toHaveBeenCalledWith(latLng)            
        })

        it("calculates upper left tile pixel UTM", function () {
            var tileScale = 256
            var tileIgnCoord = {x: 2, y: 74}

            expect(calculator.upperLeftPixelUtm(tileScale, tileIgnCoord)).toEqual({x: 131072, y: 4915200})
        })
    })
})
