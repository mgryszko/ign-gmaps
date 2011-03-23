var context = describe

function equalsWithDelta(actual, expected, delta) {
    return (actual >= expected - delta) && (actual <= expected + delta)
}

function toEqualToXYWithDelta(expected, delta) {
    return equalsWithDelta(this.actual.x, expected.x, delta) &&
            equalsWithDelta(this.actual.y, expected.y, delta)
}

function toEqualToLatLngWithDelta(expected, delta) {
    var lat = Object.isFunction(this.actual.lat) ? this.actual.lat() : this.actual.lat
    var lng = Object.isFunction(this.actual.lng) ? this.actual.lng() : this.actual.lng

    return equalsWithDelta(lat, expected.lat, delta) && equalsWithDelta(lng, expected.lng, delta)
}

