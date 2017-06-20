'use strict';

/**
 * Module dependencies.
 */
var request = require('request'),
    config = require('../../config/config');

exports.automap = function(req, res) {
    var url = config.automap.url + "/map?mapversion=" + req.query.mapversion + "&distance=" + req.query.distance;

    request.get({
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        url: url
    }, function(error, response, body){
        if (error.code === 'ECONNREFUSED'){
            res.status(500).json({
                message: error.code});
        }
    }).pipe(res);
};
