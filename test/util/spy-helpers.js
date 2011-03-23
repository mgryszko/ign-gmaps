CoordinateConverter.createSpyForUtmZone = function() {
    var converter = jasmine.createSpyObj(CoordinateConverter, ["latLngToUtm", "utmToLatLng"])
    spyOn(CoordinateConverter, "createForUtmZone").andReturn(converter)

    return converter
}

CoordinateConverter.expectSpyCreatedForUtmZone = function(utmZone) {
    expect(CoordinateConverter.createForUtmZone).toHaveBeenCalledWith(utmZone)
}

IgnTileCalculator.createSpyForUtmZone = function() {
    var calculator = jasmine.createSpyObj(IgnTileCalculator, ["latLngToTileIgnCoord", "upperLeftPixelUtm"])
    spyOn(IgnTileCalculator, "createForUtmZone").andReturn(calculator)

    return calculator
}

IgnTileCalculator.expectSpyCreatedForUtmZone = function(utmZone) {
    expect(IgnTileCalculator.createForUtmZone).toHaveBeenCalledWith(utmZone)
}

