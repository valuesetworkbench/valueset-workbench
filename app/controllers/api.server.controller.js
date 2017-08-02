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


function stripHrefs(obj) {
    for(var prop in obj) {
        if (prop === 'href') {
            delete obj[prop];
        } else if (typeof obj[prop] === 'object') {
            stripHrefs(obj[prop]);
        }
    }
}

exports.getValueSetResolution = function(req, res, next) {
    var url =  config.cts2.url + "valueset/" + req.params.valueSetName + "/definition/" + req.params.valueSetVersion + "/resolution?complete=true";
    request.get({
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        url: url,
        qs: req.query
    }, function (error, res_, body) {

        var json = JSON.parse(body);
        stripHrefs(json);

        req.resource = json;
        next()
    });
};

exports.getMapVersion = function(req, res, next) {
    var url =  config.cts2.url + "map/" + req.params.mapName + "/version/" + req.params.mapVersion + "/entries?list=true";
    request.get({
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        url: url,
        qs: req.query
    }, function (error, res_, body) {

        var json = JSON.parse(body);
        stripHrefs(json);

        req.resource = json;
        next()
    });
};

function mapEntryListTransform(mapEntryList) {
    return _.map(mapEntryList.MapEntryList.entry, function(entry) {
        return {
            from: entry.entry.mapFrom.name,
            to: entry.entry.mapSet[0].mapTarget[0].mapTo.name
        }
    });
}

function resolvedValueSetMsgTransform(resolvedValueSetMsg) {
    return _.map(resolvedValueSetMsg.ResolvedValueSetMsg.resolvedValueSet.entry, function(entry) {
        return {
            code: entry.name
        }
    });
}

var transforms = {
    MapEntryList: mapEntryListTransform,
    ResolvedValueSetMsg: resolvedValueSetMsgTransform
}

exports.transform = function(req, res, next) {
    var cts2Object = Object.keys(req.resource)[0];

    if (transforms[cts2Object]) {
        req.resource = transforms[cts2Object](req.resource);
    }

    next();
};

exports.send = function(req, res, next) {
    res.send(req.resource)
};