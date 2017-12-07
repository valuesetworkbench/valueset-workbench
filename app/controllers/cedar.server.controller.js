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


exports.searchTemplates = function(req, res, next) {
    var url =  config.cedar.url + "/search?resource_types=template&sort=name&limit=100";
    request.get({
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'Authorization': 'apiKey ' + req.user.cedarKey
        },
        url: url
    }).pipe(res);
};

exports.getTemplate = function(req, res, next) {
    var url =  config.cedar.url + "/templates/" + encodeURIComponent(req.params.id);
    request.get({
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'Authorization': 'apiKey ' + req.user.cedarKey
        },
        url: url
    }).pipe(res);
};