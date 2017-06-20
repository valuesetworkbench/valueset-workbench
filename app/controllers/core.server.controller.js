'use strict';

var config = require('../../config/config');
var constants = require('../core/constants');

/**
 * Module dependencies.
 */
exports.index = function(req, res) {
	res.render('index', {
		user: req.user || null,
		config: {
			resourceUriBase: config.resourceUriBase,
			cts2ServiceRoot: config.cts2.url,
			approvalPredicateUri: constants.approvalPredicateUri
		}
	});
};