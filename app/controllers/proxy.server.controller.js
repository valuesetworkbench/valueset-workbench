'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    request = require('request'),
    config = require('../../config/config'),
	errorHandler = require('./errors'),
    util = require('../core/util'),
	_ = require('lodash'),
    users = require('./users'),
    NodeCache = require('node-cache'),
    eventEmitter = new (require('events').EventEmitter);

exports.eventEmitter = eventEmitter;

var _this = this;

exports.fulfill = function(req, res) {
    req.fulfill(req, res);
}

exports.proxyGet = function(req, res, next) {
    req.fulfill = function (req, res) {
        req.resource.permissions = req.permissions;
        res.json(req.resource);
    }
    next();
};

exports.proxyPost = function(req, res) {
    var url = req.params.url;

    request.post({
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        url: url,
        body: JSON.stringify(util.addChangeMetadata(req.user, req.body))
    }).pipe(res);
};

exports.proxyPut = function(req, res, next) {
    req.fulfill = function (req, res) {
        var url = req.params.url;
        request.put({
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json'
            },
            url: url,
            body: JSON.stringify(util.addChangeMetadata(req.user, req.body))
        }, function (error, response, body) {
            res.send(req.permissions);
        });
    };
    next();
};

exports.proxyDelete = function(req, res, next) {
    req.fulfill = function (req, res) {
        var url = req.params.url;

        request.del({
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json'
            },
            url: url
        }, function(error, response, body){
            res.send(204)
        });
    };
    next();
};

var subResourceRegex = /(.*)\/(resolution|entries|entities|entity\/(?:.*)|entry\/(?:.*))(?:\?*.*)$/

exports.getDelegateResource = function (url) {
    var match = subResourceRegex.exec(url);

    if (match && match.length >= 2) {
        return match[1];
    }
};

exports.resolveResource = function(req, res, next, url) {
    if (req.method == 'POST') {
        req.resource = req.body;
        next()
    } else {
        var delegate = _this.getDelegateResource(url);

        request.get({
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json'
            },
            url: url
        }, function (error, response, body) {
            req.resource = JSON.parse(body);

            if (delegate) {
                request.get({
                    headers: {
                        'accept': 'application/json',
                        'content-type': 'application/json'
                    },
                    url: delegate
                }, function (error, response, body) {
                    req.delegate = JSON.parse(body);
                    next();
                });
            } else {
                next();
            }
        });
    }
};

exports.hasAuthorization = users.hasAuthorization(['admin', 'sme']);
