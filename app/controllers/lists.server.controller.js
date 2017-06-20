'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    request = require('request'),
    config = require('../../config/config'),
    util = require('../core/util'),
    Group = mongoose.model('Group'),
    Service = mongoose.model('Service'),
	_ = require('lodash');

exports.read = function(req, res) {
    console.log(req.mapVersion);
	res.jsonp(req.mapVersion);
};

/**
 * List of Conceptmaps
 */
exports.getList = function(types, directory, req, res) {
    Group.find({'members.user': req.user._id}).exec(function(err, groups) {
        var query = req.query;

        if (req.query.q) {
            req.query.matchvalue_search = req.query.q;
            delete req.query.q;
        }

        if (!_.intersection(req.user.roles, ['admin']).length) {
            var q = {};
            var userGroups = _.map(groups, function (group) {
                return group.name;
            });

            userGroups.push(req.user.email);
            var value = userGroups.join('|');

            q["matchvalue_owner"] = value;
            q["filtercomponent_owner"] = "owner";
            query = Object.assign(query, q);
        }

        var entries = [];

        var services = [config.cts2];

        var count = services.length;

        _.times(count, function (n) {
            request.get({
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json'
                },
                url: util.stripTrailingSlash(services[n].url) + '/' + types,
                qs: query
            }, function (error, response, body) {
                count--;

                entries = _.union(entries, JSON.parse(body)[directory].entry);

                if (!count) {
                    var directoryResponse = {};
                    directoryResponse[directory] = {entry: entries};
                    res.json(directoryResponse);
                }
            });
        });
    });


};