'use strict';

 /**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	request = require('request'),
	SystemConfig = mongoose.model('SystemConfig'),
	_ = require('lodash');

SystemConfig.findOne(function(err, systemConfig) {

	if (!systemConfig) {
		systemConfig = new SystemConfig();

		// Then save the user
		systemConfig.save(function(err) {
			if(err) {
				console.log(err);
			}
		});
	}
});


/**
 * Show the current SystemConfig
 */
exports.read = function(req, res) {
	res.jsonp(req.systemConfig);
};

/**
 * Update a SystemConfig
 */
exports.update = function(req, res) {
	var systemConfig = req.systemConfig ;

	systemConfig = _.extend(systemConfig , req.body);

	systemConfig.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(systemConfig);
		}
	});
};

/**
 * SystemConfig authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.systemConfig.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
