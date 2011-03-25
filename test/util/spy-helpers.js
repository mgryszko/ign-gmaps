CoordinateConverter.createSpyForUtmZone = function() {
    var converter = jasmine.createSpyObj(CoordinateConverter, ["latLngToUtm", "utmToLatLng"])
    spyOn(CoordinateConverter, "createForUtmZone").andReturn(converter)

    return converter
}

CoordinateConverter.expectSpyCreatedForUtmZone = function(utmZone) {
    expect(CoordinateConverter.createForUtmZone).toHaveBeenCalledWith(utmZone)
}
