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
    var url =  config.cts2.url + "fhir/" + req.param(0);
    request.get({
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        url: url,
        qs: req.query
    }, function (error, res_, body) {
        var json = JSON.parse(body);

        req.resource = json;
        next();
    });
};


exports.send = function(req, res, next) {
    res.send(req.resource);
};