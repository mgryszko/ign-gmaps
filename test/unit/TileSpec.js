describe("Tile", function() {
    beforeEach(function() {
        this.addMatchers({
            toEqualToUtmWithDelta: toEqualToUtmWithDelta,
            toEqualToTile: toEqualToTile
        })
    })

    var scale = 256
    var utmZone = 30
    var tile = new ign.Tile(2, 74, scale, utmZone)

    it("can be created directly with scale and IGN coordinates", function () {
        expect(tile.x()).toEqual(2)
        expect(tile.y()).toEqual(74)
        expect(tile.scale()).toEqual(scale)
        expect(tile.utmZone()).toEqual(utmZone)
    })

    it("can be created with scale and UTM zone from lat-lng", function () {
        var ignLatLng = ign.LatLng.spyOnCopy()
        ignLatLng.toUtm.andReturn(new ign.Utm(179294.18, 4879655.84, utmZone))

        var latLng = new gm.LatLng(44.0, -7.0)

        expect(ign.Tile.createForLatLng(latLng, scale, utmZone)).toEqualToTile(new ign.Tile(2, 74, scale, utmZone))

        ign.LatLng.expectCopyCalledWith(latLng)
        expect(ignLatLng.toUtm).toHaveBeenCalledWith(utmZone)
    })

    it("describes itself", function () {
        expect(tile.toString()).toEqual("(2, 74) 256 m/px 30N")
    })

    it("calculates UTM of the upper left pixel", function () {
        expect(tile.upperLeftPixelUtm()).toEqualToUtmWithDelta(new ign.Utm(131072, 4915200, utmZone), 0)
    })

    context("for a GMaps zoom", function () {
        var expTilesForZoom = {
            0: tile,
            1: new ign.Tile(4, 149, 128, utmZone),
            2: new ign.Tile(8, 299, 64, utmZone),
            8: new ign.Tile(512, 19199, 1, utmZone)
        }

        $H(expTilesForZoom).keys().each(function(zoom) {
            it("spawns a tile having same upper pixel UTM", function () {
                expect(tile.spawnTileForGMapsZoom(zoom)).toEqualToTile(expTilesForZoom[zoom])
            })
        })
    })

    it("can be moved by delta coordinates yielding a new tile that maintains the scale and UTM zone", function () {
        expect(tile.moveBy(1, -1)).toEqualToTile(new ign.Tile(3, 73, scale, utmZone))
    })
})
