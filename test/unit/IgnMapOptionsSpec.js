describe("IgnMapOptions", function() {
    beforeEach(function() {
        this.addMatchers({
            toStartWith: function(expected) { return this.actual.startsWith(expected) },
            toEndWith: function(expected) { return this.actual.endsWith(expected) }
        })
    })

    context("for each configuration", function () {
        var dummyUtmZone = 0
        var dummyOriginTileLatLng = {lat: 0, lng: 0}
        var dummyConfig = {
            tileScaleForBaseZoom: 0, utmZone: dummyUtmZone, originTileLatLng: dummyOriginTileLatLng, ignMaps: []
        }
        var mapOptions

        beforeEach(function() {
            var ignTileCalculator = IgnTileCalculator.createSpyForUtmZone()
            ignTileCalculator.latLngToTileIgnCoord.andReturn({x: 2, y: 74})

            mapOptions = new IgnMapOptions(dummyConfig)
        })

        it("has a minimum zoom level equal to the base zoom level", function() {
            expect(mapOptions.minZoom).toEqual(0)
        })

        it("has the same tile size", function() {
            expect(mapOptions.tileSize.width).toEqual(256)
            expect(mapOptions.tileSize.height).toEqual(256)
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
                    var ignMaps = [IGN_MAPS.TOPO_1000, IGN_MAPS.TOPO_1000,
                        IGN_MAPS.TOPO_200, IGN_MAPS.TOPO_200,
                        IGN_MAPS.TOPO_50, IGN_MAPS.TOPO_50,
                        IGN_MAPS.TOPO_25, IGN_MAPS.TOPO_25, IGN_MAPS.TOPO_25]
                    var mapOptions

                    beforeEach(function() {
                        var ignTileCalculator = IgnTileCalculator.createSpyForUtmZone()
                        ignTileCalculator.latLngToTileIgnCoord.andReturn({x: 2, y: 74})

                        mapOptions = new IgnMapOptions({
                            tileScaleForBaseZoom: tileScaleForBaseZoom,
                            utmZone: utmZone,
                            originTileLatLng: originTileLatLng,
                            ignMaps: ignMaps
                        })
                        
                        IgnTileCalculator.expectSpyCreatedForUtmZone(utmZone)
                        expect(ignTileCalculator.latLngToTileIgnCoord).toHaveBeenCalledWith(tileScaleForBaseZoom, originTileLatLng)
                    })

                    it("has a maximum zoom level", function() {
                        var expMaxZoom = ignMaps.length - 1
                        
                        expect(mapOptions.maxZoom).toEqual(expMaxZoom)
                    })

                    context("on that zoom level", function() {
                        var tileScales = [256, 128, 64, 32, 16, 8, 4, 2, 1]
                        var maxZoom = ignMaps.length - 1

                        $R(0, maxZoom).each(function(zoom) {
                            it("creates the tile URL for the Google Maps world origin", function() {
                                var tileIgnCoord = [{i: 2, j: 74}, {i: 4, j: 149}, {i: 8, j: 299}, {i: 16, j: 599},
                                    {i: 32, j: 1199}, {i: 64, j: 2399}, {i: 128, j: 4799}, {i: 256, j: 9599},
                                    {i: 512, j: 19199}]
                                var worldPoint = new google.maps.Point(0, 0)

                                var url = mapOptions.getTileUrl(worldPoint, zoom)

                                expect(url).toStartWith("http://ts0.iberpix.ign.es/tileserver/")
                                expect(url).toContain("n=" + ignMaps[zoom])
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
