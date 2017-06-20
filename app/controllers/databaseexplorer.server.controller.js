'use strict';

/**
 * Module dependencies.
 */
var request = require('request'),
    config = require('../../config/config');

exports.tables = function(req, res) {
    var connectionInfo = req.body;

    var url = config.databaseExplorer.url + "/tables";

    request.post({
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        url: url,
        body: JSON.stringify(connectionInfo)
    }).pipe(res);
};

exports.columns = function(req, res) {
    var connectionInfo = req.body;

    var url = config.databaseExplorer.url + "/tables/" + req.params.table + "/columns";

    request.post({
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        url: url,
        body: JSON.stringify(connectionInfo)
    }).pipe(res);;
};

exports.query = function(req, res) {
    var connectionInfo = req.body.connection;
    var columns = req.body.columns;

    columns = columns.map(function(el) {
        return 'column=' + el;
    });

    var queryString = "?" + columns.join("&");

    var url = config.databaseExplorer.url + "/tables/" + req.params.table + queryString;

    request.post({
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        url: url,
        body: JSON.stringify(connectionInfo)
    }).pipe(res);
};