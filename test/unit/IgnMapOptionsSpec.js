describe("IgnMapOptions", function() {
    beforeEach(function() {
        this.addMatchers({
            toStartWith: function(expected) { return this.actual.startsWith(expected) },
            toEndWith: function(expected) { return this.actual.endsWith(expected) }
        })
    })

    context("for each configuration", function () {
        var dummyConfig = {
            originTileScale: 0, utmZone: 0, originTileIgnCoord: {}, ignMapsForZooms: []
        }
        var mapType = new IgnMapOptions(dummyConfig)

        it("has a minimum zoom level equal to the base zoom level", function() {
            expect(mapType.minZoom).toEqual(0)
        })

        it("has the same tile size", function() {
            expect(mapType.tileSize.width).toEqual(256)
            expect(mapType.tileSize.height).toEqual(256)
        })
        it("flags tiles as not PNG", function() {
            expect(mapType.isPng).toBeFalsy()
        })
    })

    context("with tile scale for the base zoom level", function() {
        var originTileScale = 256

        context("for an UTM zone", function() {
            var utmZone = 30

            context("the most upper left pixel of the origin tile corresponds to the Google Maps world origin", function() {
                var originTileIgnCoord = {x: 2, y: 74}

                context("is configured with map types for every zoom level", function () {
                    var ignMapsForZooms = [ignMaps.TOPO_1000, ignMaps.TOPO_1000,
                        ignMaps.TOPO_200, ignMaps.TOPO_200,
                        ignMaps.TOPO_50, ignMaps.TOPO_50,
                        ignMaps.TOPO_25, ignMaps.TOPO_25, ignMaps.TOPO_25]
                    var mapOptions = new IgnMapOptions({
                        originTileScale: originTileScale,
                        utmZone: utmZone,
                        originTileIgnCoord: originTileIgnCoord,
                        ignMapsForZooms: ignMapsForZooms
                    })

                    it("has a maximum zoom level", function() {
                        var expMaxZoom = ignMapsForZooms.length - 1
                        
                        expect(mapOptions.maxZoom).toEqual(expMaxZoom)
                    })

                    context("on that zoom level", function() {
                        var tileScales = [256, 128, 64, 32, 16, 8, 4, 2, 1]

                        $R(0, ignMapsForZooms.length - 1).each(function(zoom) {
                            it("creates the tile URL for the Google Maps world origin", function() {
                                var tileIgnCoord = [{i: 2, j: 74}, {i: 4, j: 149}, {i: 8, j: 299}, {i: 16, j: 599},
                                    {i: 32, j: 1199}, {i: 64, j: 2399}, {i: 128, j: 4799}, {i: 256, j: 9599},
                                    {i: 512, j: 19199}]
                                var tileCoord = new google.maps.Point(0, 0)

                                var url = mapOptions.getTileUrl(tileCoord, zoom)

                                expect(url).toStartWith("http://ts0.iberpix.ign.es/tileserver/")
                                expect(url).toContain("n=" + ignMapsForZooms[zoom])
                                expect(url).toContain("z=" + utmZone)
                                expect(url).toContain("r=" + (tileScales[zoom] * 1000))
                                expect(url).toContain("i=" + tileIgnCoord[zoom].i)
                                expect(url).toContain("j=" + tileIgnCoord[zoom].j)
                                expect(url).toEndWith(".jpg")
                            })
                        })
                    })
                })
            })
        })
    })
})
