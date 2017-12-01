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
        body: JSON.stringify(util.addChangeMetadata(req.user, mapVersion)),
        url: util.stripTrailingSlash(config.cts2.url) + '/mapversion?changesetcontext=foo'
    }, function(error, response, body){
        if(error) {
            res.status(500).send({
                message: errorHandler.getErrorMessage(error)
            });
        } else {
            res.send(response);
        }
    });
};

exports.export = function(req, res) {
    exports.readMapVersionEntries(
        req.mapversion.MapVersionMsg.heading.resourceRoot +
        req.mapversion.MapVersionMsg.heading.resourceURI,
        function (mapEntries) {
            res.write("from_code,from_codesystem,from_designation,to_code,to_codesystem,to_designation\n");

            _.each(mapEntries.MapEntryList.entry, function (entry) {
                entry = entry.entry;
                _.each(entry.mapSet[0].mapTarget, function (target) {
                    res.write([entry.mapFrom.name, entry.mapFrom.namespace, entry.mapFrom.designation,
                            target.mapTo.name, target.mapTo.namespace, target.mapTo.designation].join(",") + "\n");
                });
            });

            res.end();
        }
    );
};

exports.mapversionByID = function(req, res, next, id) {
    exports.readMapVersion(id, function(mapversion) {
        req.mapversion = mapversion;
        req.resource = mapversion;
        next();
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

exports.readMapVersionEntries = function(id, callback) {
    request.get({
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        url: id + '/entries?list=true'
    }, function(error, response, body){
        callback(JSON.parse(body));
    });
};