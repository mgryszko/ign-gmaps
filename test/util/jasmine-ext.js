var context = describe

function equalsWithDelta(actual, expected, delta) {
    return (actual >= expected - delta) && (actual <= expected + delta)
}

function toEqualToUtmWithDelta(expected, delta) {
    return equalsWithDelta(this.actual.x(), expected.x(), delta) &&
            equalsWithDelta(this.actual.y(), expected.y(), delta)
}

function toEqualToLatLngWithDelta(expected, delta) {
    return equalsWithDelta(this.actual.lat(), expected.lat(), delta) &&
            equalsWithDelta(this.actual.lng(), expected.lng(), delta)
}

function toEqualToPointWithDelta(expected, delta) {
    this.message = function () {
        return "Expected a Point (" + expected.x + ", " + expected.y + ") " +
                "to equal to Point (" + this.actual.x + ", " + this.actual.y + ") " +
                "with delta " + delta
    }

    return equalsWithDelta(this.actual.x, expected.x, delta) &&
        equalsWithDelta(this.actual.y, expected.y, delta)    
}

function toEqualToTile(expected) {
    this.message = function () {
        return "Expected a Tile " + expected.toString() + " to equal to Tile " + this.actual.toString()
    }

    return (this.actual.x() == expected.x()) &&
            (this.actual.y() == expected.y()) &&
            (this.actual.scale() == expected.scale()) &&
            (this.actual.utmZone() == expected.utmZone())
}

