'use strict';

var URL = require('url-parse'),
dns = require('dns');

function resolveDns(url) {
    return new Promise(function (resolve, reject) {

        var parsed = new URL(url);
        var hostname = parsed.hostname

        dns.lookup(hostname, function(err, result) {
            if(err) {
                reject(err);
            } else {
                parsed.set('hostname', result)
                resolve(parsed.toString());
            }
        });
    })
}

exports.replaceHostNames = function(services, callback) {
    Promise.all(services.map(resolveDns)).then(function (result) {
        callback(result)
    });
}
