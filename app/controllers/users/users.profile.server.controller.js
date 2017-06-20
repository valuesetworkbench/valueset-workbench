'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors'),
	mongoose = require('mongoose'),
	uuid = require('node-uuid'),
	passport = require('passport'),
	User = mongoose.model('User');

/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	var user = req.body;

	if (user) {
		if (req.user._id != user._id) {
			return res.status(403).send({
				message: errorHandler.getErrorMessage("Cannot update a user other than yourself.")
			});
		} else {
			// Merge existing user
			//user = _.extend(user, req.body);
			user.updated = Date.now();

			var query = {"_id": user._id};

			var update = _.omit(user, '_id');
			User.findOneAndUpdate(query, update, function (err) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					res.status(200).send();
				}
			});
		}
	} else {
		res.status(400).send({
			message: 'User not sent'
		});
	}

};

exports.resetApiKey = function(req, res) {
	if (req.body) {
		var apiKey = uuid.v1();

		User.update({ _id: req.user._id }, { $set: { apiKey: apiKey }}, function(err, raw) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.status(200).send({apiKey: apiKey});
			}
		});

	} else {
		res.status(400).send({
			message: 'User not sent'
		});
	}
};

/**
 * Send User
 */
exports.me = function(req, res) {
	res.jsonp(req.user || null);
};

exports.readPublicUserInfo = function(req, res) {
	res.jsonp(req.profile);
};