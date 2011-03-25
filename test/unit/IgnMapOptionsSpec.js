describe("IgnMapOptions", function() {
    beforeEach(function() {
        this.addMatchers({
            toStartWith: function(expected) { return this.actual.startsWith(expected) },
            toEndWith: function(expected) { return this.actual.endsWith(expected) }
        })
    })

    context("each configuration", function () {
        var dummyConfig = {
            tileScaleForBaseZoom: 0, utmZone: 0, originTileLatLng: new gm.LatLng(0, 0), ignMaps: []
        }
        var mapOptions

        beforeEach(function() {
            var dummyOriginTile = new ign.Tile(2, 74)
            spyOn(ign.Tile, "createForLatLng").andReturn(dummyOriginTile)

            mapOptions = new IgnMapOptions(dummyConfig)
        })

        it("has a minimum zoom level equal to the base zoom level", function() {
            expect(mapOptions.minZoom).toEqual(0)
        })

        it("has the same tile size", function() {
            expect(mapOptions.tileSize.width).toEqual(ign.Tile.SIZE_IN_PX)
            expect(mapOptions.tileSize.height).toEqual(ign.Tile.SIZE_IN_PX)
        })
        
        it("flags tiles as not PNG", function() {
            expect(mapOptions.isPng).toBeFalsy()
        })
    })

    context("with tile scale for the base zoom level", function() {
        var tileScaleForBaseZoom = 256

        context("for an UTM zone", function() {
            var utmZone = 30

            context("the most upper left pixel of the origin tile corresponds to the Google Maps world origin", function() {
                var originTileLatLng = new gm.LatLng(44.0, -7.0)

                context("is configured with an IGN map type for every zoom level", function () {
                    var ignMaps = [ign.MAP_TYPES.TOPO_1000, ign.MAP_TYPES.TOPO_200,
                        ign.MAP_TYPES.TOPO_50, ign.MAP_TYPES.TOPO_25]
                    var originTile
                    var mapOptions

                    beforeEach(function() {
                        originTile = new ign.Tile(2, 74, tileScaleForBaseZoom, utmZone)
                        spyOn(ign.Tile, "createForLatLng").andReturn(originTile)

                        mapOptions = new IgnMapOptions({
                            tileScaleForBaseZoom: tileScaleForBaseZoom,
                            utmZone: utmZone,
                            originTileLatLng: originTileLatLng,
                            ignMaps: ignMaps
                        })

                        expect(ign.Tile.createForLatLng).toHaveBeenCalledWith(originTileLatLng, tileScaleForBaseZoom, utmZone)
                    })

                    it("has a maximum zoom level", function() {
                        expect(mapOptions.maxZoom).toEqual(ignMaps.length - 1)
                    })

                    context("on a zoom level", function() {
                        var tiles = [
                            new ign.Tile(2, 74, 256, utmZone),
                            new ign.Tile(4, 149, 128, utmZone),
                            new ign.Tile(8, 299, 64, utmZone),
                            new ign.Tile(16, 597, 32, utmZone)
                        ]
                        var maxZoom = ignMaps.length - 1

                        $R(0, maxZoom).each(function(zoom) {
                            it("creates the tile URL for the Google Maps world origin", function() {
                                var originTileForGMapsZoom = new ign.Tile()
                                spyOn(originTile, "spawnTileForGMapsZoom").andReturn(originTileForGMapsZoom)
                                spyOn(originTileForGMapsZoom, "moveBy").andReturn(tiles[zoom])
                                var tileCoord = new gm.Point(0, 0)

                                var url = mapOptions.getTileUrl(tileCoord, zoom)

                                expect(url).toStartWith("http://ts0.iberpix.ign.es/tileserver/")
                                expect(url).toContain("n=" + ignMaps[zoom])
                                expect(url).toContain("z=" + tiles[zoom].utmZone())
                                expect(url).toContain("r=" + (tiles[zoom].scale() * 1000))
                                expect(url).toContain("i=" + tiles[zoom].x())
                                expect(url).toContain("j=" + tiles[zoom].y())
                                expect(url).toEndWith(".jpg")
                                expect(originTile.spawnTileForGMapsZoom).toHaveBeenCalledWith(zoom)
                                expect(originTileForGMapsZoom.moveBy).toHaveBeenCalledWith(tileCoord.x, -tileCoord.y)
                            })
                        })
                    })
                })
            })
        })
    })
})
