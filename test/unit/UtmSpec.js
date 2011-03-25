describe("Utm", function() {
    it("can be created with planar coordinates and zone", function () {
        var utm = new ign.Utm(500000, 4300000, 30)

        expect(utm.x()).toEqual(500000)
        expect(utm.y()).toEqual(4300000)
        expect(utm.zone()).toEqual(30)
    })
})
