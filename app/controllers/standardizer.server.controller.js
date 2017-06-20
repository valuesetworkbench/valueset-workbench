'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    request = require('request'),
    config = require('../../config/config');


exports.standardize = function(req, res) {
    var id = decodeURIComponent(req.params.id);

    request.get({
        headers: {
            'accept': 'application/json'
        },
        url: config.standardizer.url + "/standard?valueSetDefinitionHref=" + id}, function(error, response, body){
        if (error && error.code === 'ECONNREFUSED'){
            res.status(500).json({
                message: error.code});
        }
    }).pipe(res);
};

