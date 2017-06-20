'use strict';

var passport = require('passport'),
	User = require('mongoose').model('User'),
	path = require('path'),
    OAuth2Strategy = require('passport-oauth2'),
	users = require('../app/controllers/users'),
	config = require('./config');

module.exports = function() {
	// Serialize sessions
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	// Deserialize sessions
	passport.deserializeUser(function(id, done) {
		User.findOne({
			_id: id
		}, '-salt -password', function(err, user) {
			done(err, user);
		});
	});

    passport.register = function(config) {
        users.registerCustomOauth(config);
    }

	// Initialize strategies
	config.getGlobbedFiles('./config/strategies/**/*.js').forEach(function(strategy) {
		require(path.resolve(strategy))();
	});
};