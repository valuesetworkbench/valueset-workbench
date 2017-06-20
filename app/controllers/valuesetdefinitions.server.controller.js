'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    request = require('request'),
    config = require('../../config/config'),
	errorHandler = require('./errors'),
    lists = require('./lists'),
    util = require('../core/util'),
	_ = require('lodash'),
    users = require('./users'),
    Group = mongoose.model('Group'),
    NodeCache = require('node-cache'),
    Service = mongoose.model('Service');

/**
 * Create a Valueset
 */
exports.create = function(req, res) {
	var valueset = req.body;

    request.post({
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        body: JSON.stringify(valueset),
        url: util.stripTrailingSlash(config.cts2.url) + '/valuesetdefinition?changesetcontext=foo'
    }, function(error, response, body){
        res.send(response)
    });
};

/**
 * Show the current Valueset
 */
exports.read = function(req, res) {
	res.json(req.valuesetdefinition);
};


/**
 * List of Valuesets
 */
exports.list = function(req, res) {
    lists.getList("valuesetdefinitions", "ValueSetDefinitionDirectory", req, res);
};


/**
 * Valueset middleware
 */
 exports.valuesetdefinitionByID = function(req, res, next, id) {
     exports.readValueSetDefinition(id, function(valuesetdefinition) {
         req.valuesetdefinition = valuesetdefinition;
         next();
     });
 };

exports.readValueSetDefinition = function(id, callback) {
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