var context = describe

function equalsWithDelta(actual, expected, delta) {
    return (actual >= expected - delta) && (actual <= expected + delta)
}

function toEqualToXYWithDelta(expected, delta) {
    return equalsWithDelta(this.actual.x, expected.x, delta) &&
            equalsWithDelta(this.actual.y, expected.y, delta)
}

function toEqualToLatLngWithDelta(expected, delta) {
    return equalsWithDelta(this.actual.lat(), expected.lat(), delta) && 
            equalsWithDelta(this.actual.lng(), expected.lng(), delta)
}

