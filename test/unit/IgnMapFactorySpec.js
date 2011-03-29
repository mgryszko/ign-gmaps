describe("IgnMapFactory", function() {
    var ImageMapType

    function ImageMapTypeSpy(options) {
        this.options = options
    }

    beforeEach(function() {
        this.addMatchers({
            toBeInstanceOf: function(expected) { return this.actual instanceof expected }
        })

        ImageMapType = gm.ImageMapType
        gm.ImageMapType = function ImageMapTypeSpy(options) { this.options = options }
    })

    afterEach(function() {
        gm.ImageMapType = ImageMapType
    })

    it("creates a IGN map type configured with projection", function () {
        var config = {
            tileScaleForBaseZoom: 256,
            utmZone: 30,
            originTileLatLng: new gm.LatLng(44.0, -7.0),
            ignMaps: [ign.MAP_TYPES.TOPO_1000]
        }

        var mapType = ign.IgnMapFactory.createMapType(config)
        
        expect(mapType.options).toBeInstanceOf(ign.IgnMapOptions)
        expect(mapType.projection).toBeInstanceOf(ign.IgnProjection)
    })
})

