describe("IgnMapFactory", function() {
    var mapFactory = new IgnMapFactory()

    var ImageMapType

    function ImageMapTypeSpy(options) {
        this.options = options
    }

    beforeEach(function() {
        this.addMatchers({
            toBeInstanceOf: function(expected) { return this.actual instanceof expected }
        })

        ImageMapType = google.maps.ImageMapType
        google.maps.ImageMapType = function ImageMapTypeSpy(options) {
            this.options = options
        }
    })

    afterEach(function() {
        google.maps.ImageMapType = ImageMapType
    })

    it("creates a IGN map type configured with projection", function () {
        var dummyOriginTileScale = 0
        var dummyUtmZone = 0
        var dummyOriginTileIgnCoord = {}
        var dummyMapTypesForZooms = []

        var mapType = mapFactory.createMapType(dummyOriginTileScale, dummyUtmZone, dummyOriginTileIgnCoord, dummyMapTypesForZooms)
        expect(mapType.options).toBeInstanceOf(IgnMapOptions)
        expect(mapType.projection).toBeInstanceOf(IgnProjection)
    })
})

