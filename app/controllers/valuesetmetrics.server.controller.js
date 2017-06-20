'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    request = require('request'),
    Service = mongoose.model('Service'),
    _ = require('lodash'),
    dnsLookup = require('../core/dns'),
    config = require('../../config/config');


exports.metrics = function(req, res) {
    var id = decodeURIComponent(req.params.id);

    request.get({
        headers: {
            'accept': 'application/json'
        },
        url: config.valueSetMetrics.url + "/vsmetrics?valueSetDefinitionHref=" + id},
        function(error, response, body){
            if (error && error.code === 'ECONNREFUSED'){
                res.status(500).json({
                    message: error.code});
            }
        }).pipe(res);
};

exports.similarity = function(req, res) {
    var uri = decodeURIComponent(req.query.uri);
    var forceRefresh = req.query.forceRefresh === true;

    var services = [config.cts2];

    // Normalize the service urls to ip addresses. This is needed because they may be interanl dns names (for Docker, for instance).
    dnsLookup.replaceHostNames(_.map(services, function(service) {return service.url}), function(updatedServices) {
        var serviceHrefs = _.map(updatedServices, function(service){ return 'valueSetDefinitionsHref=' + service + "/valuesetdefinitions"; });

        request.get({
            headers: {
                'accept': 'application/json'
            },
            url: config.valueSetMetrics.url + "/similarity?" + serviceHrefs.join("&") + "&uri=" + uri + '&forceRefresh=' + forceRefresh},
            function(error, response, body){
                if (error && error.code === 'ECONNREFUSED'){
                    res.status(500).json({
                        message: error.code});
                }
            }).pipe(res);
    });

};
