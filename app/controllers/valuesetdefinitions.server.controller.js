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
        body: JSON.stringify(util.addChangeMetadata(req.user, valueset)),
        url: util.stripTrailingSlash(config.cts2.url) + '/valuesetdefinition?changesetcontext=foo'
    }, function(error, response, body){
        res.send(response)
    });
};

exports.export = function(req, res) {
    exports.readValueSetDefinitionResolution(
        req.valuesetdefinition.ValueSetDefinitionMsg.heading.resourceRoot +
        req.valuesetdefinition.ValueSetDefinitionMsg.heading.resourceURI,
        function (valueSetDefinitionResolution) {
            res.write("code,codesystem,designation\n");

            _.each(valueSetDefinitionResolution.ResolvedValueSetMsg.resolvedValueSet.entry, function (entry) {
                res.write([entry.name, entry.namespace, entry.designation].join(",") + "\n");
            });

            res.end();
        }
    );
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
         req.resource = valuesetdefinition;
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

exports.readValueSetDefinitionResolution = function(id, callback) {
    request.get({
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        url: id + "/resolution?complete=true"
    }, function(error, response, body){
        callback(JSON.parse(body));
    });
};