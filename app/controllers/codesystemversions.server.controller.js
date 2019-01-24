'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    request = require('request'),
    config = require('../../config/config'),
	errorHandler = require('./errors'),
    util = require('../core/util'),
    lists = require('./lists'),
	_ = require('lodash'),
    users = require('./users'),
    NodeCache = require('node-cache'),
    Service = mongoose.model('Service'),
    eventEmitter = new (require('events').EventEmitter);

exports.eventEmitter = eventEmitter;

/**
 * Create a Valueset
 */
exports.create = function(req, res) {
    var codesystemversion = req.body;

    request.post({
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        body: JSON.stringify(util.addChangeMetadata(req.user, codesystemversion)),
        url: util.stripTrailingSlash(config.cts2.url) + '/codesystemversion?changesetcontext=foo'
    }, function(error, response, body){
        res.send(response)
    });
};


exports.createEntity = function(req, res) {
    var entity = req.body;

    request.post({
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        body: JSON.stringify(util.addChangeMetadata(req.user, entity)),
        url: util.stripTrailingSlash(config.cts2.url) + '/entity?changesetcontext=foo'
    }, function(error, response, body){
        res.send(response)
    });
};

/**
 * Show the current Valueset
 */
exports.read = function(req, res) {
	res.json(req.codesystemversion);
};

/**
 * Update a Valueset
 */
exports.update = function(req, res) {
    //
};

/**
 * Delete an Valueset
 */
exports.delete = function(req, res) {
	// can't do
};


/**
 * List of Valuesets
 */
exports.list = function(req, res) {
    lists.getList("codesystemversions", "CodeSystemVersionCatalogEntryDirectory", req, res);
};


/**
 * Valueset middleware
 */
 exports.codesystemversionByID = function(req, res, next, id) {
     exports.readValueSetDefinition(id, function(codesystemversion) {
         req.codesystemversion = codesystemversion;
         next();
     });
 };

exports.readCodeSystemVersion = function(id, callback) {
    request.get({
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        url: id
    }, function(error, response, body){
        callback(JSON.parse(body));
    });
};

/**
 * Valueset authorization middleware
 */
exports.hasAuthorization = users.hasAuthorization(['admin', 'sme']);
