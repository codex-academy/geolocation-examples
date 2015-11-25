var geolib = require('geolib');
var assert = require('assert');

describe("Geolib", function() {

    it("should work", function() {
        // body...
        var distance = geolib.getDistance({
            latitude: -33.906946,
            longitude: 18.4189704
        }, {
            latitude: -33.894520899999996,
            longitude: 18.5897665
        });

        assert.equal(1, distance / 1000);
    });

    it('should find distance', function() {

        // coords object
        var l = geolib.orderByDistance({latitude: 51.515, longitude: 7.453619}, {
            a: {latitude: 52.516272, longitude: 13.377722},
            b: {latitude: 51.518, longitude: 7.45425},
            c: {latitude: 51.503333, longitude: -0.119722}
        });

        console.log(l);

        //assert.equal(l, 1);

    });



});
