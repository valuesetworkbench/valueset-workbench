'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    request = require('request'),
    config = require('../../config/config'),
    constants = require('../core/constants'),
    util = require('../core/util'),
	errorHandler = require('./errors'),
	_ = require('lodash'),
    users = require('./users'),
    Group = mongoose.model('Group'),
    NodeCache = require('node-cache'),
    eventEmitter = new (require('events').EventEmitter);

exports.eventEmitter = eventEmitter;

exports.isAlreadyApproved = function(req, res, next) {
    var resource = req.body[_.keys(req.body)[0]];

    var hasApprovals = _.find(resource.property, function (property) {
        return property.predicate.uri === constants.approvalPredicateUri;
    });

    if (hasApprovals) {
        return res.status(403).send({
            message: errorHandler.getErrorMessage("Cannot modify already approved resource.")
        });
    } else {
        next();
    }
};

exports.resolveApprovedResource = function(req, res, next) {
    var url = req.params.approvalUrl;

    request.get({
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        url: url
    }, function (error, response, body) {
        body = JSON.parse(body);
        req.resource = util.findResource(body);
        req.resourceType = util.getResourceNameFromMsg(body);
        next();
    });
};

exports.unapprove = function(req, res, next) {
    var resource = req.resource;
    resource.changeDescription = null;

    var url = req.params.approvalUrl;
    var id = req.params.id;

    if (!resource.property) {
        resource.property = [];
    }

    Group.findById(id).exec(function(err, group) {
        if (!group || !group.owner.equals(req.user._id)) {
            res.status(403).send();
        } else {
            resource.property = _.filter(resource.property, function (property) {
                return !(property.predicate.uri === constants.approvalPredicateUri && property.value[0].entity.uri === id);
            });

            var toSaveResource = {};
            toSaveResource[req.resourceType] = resource;

            request.put({
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json'
                },
                url: url + "?changesetcontext=test",
                body: JSON.stringify(toSaveResource)
            }, function (error, response, body) {
                if (error) {
                    return res.status(500).send({
                        message: errorHandler.getErrorMessage(error)
                    });
                } else {
                    res.send(200);
                }
            });
        }

    });
};

exports.approve = function(req, res, next) {
    var approval = req.body;

    var id = approval.value[0].entity.uri;

    Group.findById(id).exec(function(err, group) {
        if (!group || !group.owner.equals(req.user._id)) {
            res.status(403).send();
        } else {
            var resource = req.resource;
            resource.changeDescription = null;

            var url = req.params.approvalUrl;


            if (!resource.property) {
                resource.property = [];
            }

            resource.property.push(approval);

            var toSaveResource = {};
            toSaveResource[req.resourceType] = resource;

            request.put({
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json'
                },
                url: url + "?changesetcontext=test",
                body: JSON.stringify(toSaveResource)
            }, function (error, response, body) {
                if (error) {
                    return res.status(500).send({
                        message: errorHandler.getErrorMessage(error)
                    });
                } else {
                    res.send(200);
                }
            });
        }
    });
};

exports.hasAuthorization = users.hasAuthorization(['admin', 'sme']);
