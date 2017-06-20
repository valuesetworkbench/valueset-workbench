'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('../errors'),
	User = mongoose.model('User'),
	_ = require('lodash');

/**
 * List of Users
 */
exports.list = function(req, res) { User.find(req.query).sort('-created').exec(function(err, users) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(users);
		}
	});
};

exports.roles = function(req, res) {
        res.jsonp([
            { id: 'admin', name: 'Administrator' },
            { id: 'sme', name: 'Subject Matter Expert' },
            { id: 'user', name: 'User' },
            { id: 'guest', name: 'Guest' }
        ]);
};