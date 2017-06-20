'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    request = require('request'),
    config = require('../../config/config'),
    util = require('../core/util'),
    lists = require('./lists'),
	errorHandler = require('./errors'),
    Group = mongoose.model('Group'),
    Service = mongoose.model('Service'),
	_ = require('lodash');

/**
 * Create a Conceptmap
 */
exports.create = function(req, res) {
    var mapVersion = req.body;

    request.post({
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        body: JSON.stringify(mapVersion),
        url: util.stripTrailingSlash(config.cts2.url) + '/mapversion?changesetcontext=foo'
    }, function(error, response, body){
        if(error) {
            console.log("HERE"+error)
            res.status(500).send({
                message: errorHandler.getErrorMessage(error)
            })
        } else {
            res.send(response)
        }
    });
};

exports.createMapEntries = function(req, res) {
    var changeSet = req.body;

    request.put({
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        body: JSON.stringify(changeSet),
        url: util.stripTrailingSlash(config.cts2.url) + '/changeset/1'
    }, function(error, response, body){
        res.send(response);
    });
};

/**
 * Show the current Conceptmap
 */
exports.read = function(req, res) {
    console.log(req.mapVersion);
	res.jsonp(req.mapVersion);
};

/**
 * Update a Conceptmap
 */
exports.update = function(req, res) {
	//
};

/**
 * Delete an Conceptmap
 */
exports.delete = function(req, res) {
	//
};

/**
 * List of Conceptmaps
 */
exports.list = function(req, res) {
    lists.getList("mapversions", "MapVersionDirectory", req, res);
};

exports.readMapVersion = function(id, callback) {
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
 * Conceptmap authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	//
	next();
};
