// index.js
/*
*/

var $ = require("jquery");
//var _ = require("underscore");
var Ractive = require("ractive/ractive.runtime");

var HalloView = Ractive.extend(require("../components/hallo.html"));


hallo = new HalloView({
    el: 'demo',
    data: {
        world: 'Chuan'
    }
});

