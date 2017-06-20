'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
    request = require('request'),
    config = require('../../config/config'),
    cts2 = require('./mappings/cts2').cts2,
    Jsonix = require('jsonix').Jsonix,
	Export = mongoose.model('Export'),
	_ = require('lodash');

var cts2Marshaller = new Jsonix.Context([cts2], {
    namespacePrefixes: {
        "http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition": "vsd",
        "http:\/\/www.omg.org\/spec\/CTS2\/1.1\/Core": "core"
    }}).createMarshaller();

/**
 * Create a Export
 */
exports.create = function(req, res) {
	var export_ = new Export(req.body);
	export_.user = req.user;

    console.log(export_);

    valuesets.readValueSet(export_.valuesetId, function(valueset) {
        console.log(valueset);
        var cts2Xml = toCts2Xml(valueset);

        console.log(cts2Xml);

        res.status(200).send();

/*
        request.post({
            headers: {
                'accept': 'application/xml',
                'content-type': 'application/xml'
            },
            body: cts2Xml,
            url: config.cts2.url + '/resolvedvalueset'
        }, function(error, response, body){
            if (error || response.statusCode !== 201) {
                return res.status(500).send({
                    message: errorHandler.getErrorMessage(error)
                });
            } else {
                export_.location = response.headers['location']

                console.log(export_.location);
                export_.save(function(err) {
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    } else {
                        res.jsonp(export_);
                    }
                });
            }

        });
*/
    })

};

function toCts2Xml(valueset) {
    var entries = [];

    var define = valueset.define;

    if(define) {
        for(var i=0;i<define.concept.length;i++) {
            var concept = define.concept[i];

            entries.push({
                "uri": "urn:" + valueset.identifier + ":" + concept.code,
                "namespace": valueset.identifier + "-codesystem-latest",
                "name": concept.code,
                "designation": valueset.name + " - " + concept.code
            });
        }
    }

    var doc = cts2Marshaller.marshalString({
        name: {
            localPart: 'ResolvedValueSet',
            namespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition'
        },
        value: {
            entry: entries,
            resolutionInfo: {
                resolutionOf: {
                    valueSetDefinition: {
                        value: valueset.identifier + "-vsd-latest",
                        uri: "urn:uuid:vsd-" + valueset.identifier
                    },
                    valueSet: {
                        value: valueset.identifier
                    }
                },
                resolvedUsingCodeSystem: [{
                    codeSystem : {
                        value: valueset.identifier + "-codesystem"
                    },version : {
                        value: valueset.identifier + "-codesystem-latest"
                    }
                }]
            }
        }
    });

    return doc;
}


/**
 * Show the current Export
 */
exports.read = function(req, res) {
	res.jsonp(req.export);
};

/**
 * Update a Export
 */
exports.update = function(req, res) {
	var export_ = req.export ;

	export_ = _.extend(export_ , req.body);

	export_.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(export_);
		}
	});
};

/**
 * Delete an Export
 */
exports.delete = function(req, res) {
	var export_ = req.export;

	export_.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(export_);
		}
	});
};

/**
 * List of Exports
 */
exports.list = function(req, res) { Export.find().sort('-created').populate('user', 'displayName').exec(function(err, exports) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(exports);
		}
	});
};

/**
 * Export middleware
 */
exports.exportByID = function(req, res, next, id) { Export.findById(id).populate('user', 'displayName').exec(function(err, export_) {
		if (err) return next(err);
		if (! export_) return next(new Error('Failed to load Export ' + id));
		req.export = export_ ;
		next();
	});
};

/**
 * Export authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.export.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};