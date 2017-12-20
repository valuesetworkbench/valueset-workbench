'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    request = require('request'),
    config = require('../../config/config'),
	errorHandler = require('./errors'),
	_ = require('lodash'),
    users = require('./users'),
    NodeCache = require('node-cache'),
    eventEmitter = new (require('events').EventEmitter);

exports.eventEmitter = eventEmitter;

exports.get = function(req, res, next) {
    var url =  config.cts2.url + "svs/" + req.param(0);
    request.get({
        headers: {
            'accept': 'application/xml',
            'content-type': 'application/xml'
        },
        url: url,
        qs: req.query
    }).pipe(res);
};
