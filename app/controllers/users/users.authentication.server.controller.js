'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	fs = require('fs'),
	_ = require('lodash'),
    request = require('request'),
	config = require('../../../config/config'),
	User = mongoose.model('User');

var adminUsername = 'admin'

var adminUser = {
	username: adminUsername,
	email: config.admin.email,
	firstName: 'admin',
	lastName: 'admin',
	displayName: 'Administrator',
	provider: 'admin',
	roles: ['admin']
};

User.findOne({
	username: adminUsername
}, function (err, foundUser) {
	if (!foundUser) {
		new User(adminUser).save(function (err) {
			if (err) {
				console.log(err);
			}
		});
	}
});


function login(user, req, res) {
	req.login(user, function(err) {
		if (err) {
			console.log("ERR: " + err)
			res.status(400).send(err);

		} else {
			if (config.forceAgreeToTerms && !(user.hasAgreedToTerms && user.hasAgreedToPrivacyPolicy)) {
				return res.redirect('/#!/agree');
			} else {
				return res.redirect('/');
			}
		}
	});
}

exports.getTerms = function(req, res, next) {
	fs.readFile(config.termsOfUseFile, 'utf8', function (err, data) {
		res.jsonp(data);
	});
};

exports.getPrivacyPolicy = function(req, res, next) {
	fs.readFile(config.privacyPolicyFile, 'utf8', function (err, data) {
		res.jsonp(data);
	});
};

exports.agreeToTermsAndPrivacyPolicy = function(req, res, next) {

	User.findOne({username: req.user.username},
		function (err, foundUser) {
			foundUser.hasAgreedToTerms = req.body.hasAgreedToTerms;
			foundUser.hasAgreedToPrivacyPolicy = req.body.hasAgreedToPrivacyPolicy;

			foundUser.save(function(err) {
				if(err) {
					res.status(500).send({message: err});
				} else {
					res.status(200).send();
				}
			});
		});
};

exports.checkToken = function(req, res, next) {
	var apiKey = req.header('Apikey');

	if (!apiKey) {
		res.status(400).send({message: "All CTS2 requests must include an `Apikey` entry in the header."});
	} else {
		User.findOne({
			apiKey: apiKey
		}, function (err, foundUser) {
			if (foundUser) {
				req.user = foundUser;
				next();
			} else {
				if (err) {
					res.status(500).send({message: err});
				} else {
					res.status(403).send();
				}
			}
		});
	}
};

/**
 * Signin after passport authentication
 */
exports.adminSignin = function(req, res, next) {
	User.findOne({
		username: req.body.username
	}, function (err, foundUser) {
		if (err || !foundUser) {
			res.status(401).send({message: "Unknown User"});
		} else {
			passport.authenticate(foundUser.provider, function (err, user, info) {
				if (err || !user) {
					res.status(400).send(info);
				} else {
					User.findOne({
						username: user.username
					}, function (err, foundUser) {
						if (!foundUser) {
							foundUser = new User(user);
							foundUser.save(function (err) {
								if (err) {
									console.log(err);
								} else {
									login(foundUser, req, res);
								}
							});
						} else {
							login(foundUser, req, res);
						}
					});
				}
			})(req, res, next);
		}
	});
};

/**
 * Signout
 */
exports.signout = function(req, res) {
	req.logout();
	res.redirect('/');
};

exports.configs = [];
exports.registerCustomOauth = function(config) {
    this.configs.push(config)
}

exports.getCustomOauth = function(req, res) {
    res.send(exports.configs);
}

exports.getOauthEnabled = function(req, res) {
    res.send({
        github: config.github.enabled,
        google: config.google.enabled
	});
};

/**
 * OAuth callback
 */
exports.oauthCallback = function(strategy) {
	return function(req, res, next) {
		passport.authenticate(strategy, function(err, user, redirectURL) {
			if (err || !user) {
				return res.redirect('/#!/signin');
			}

			User.findOne({
				username: user.username
			}, function (err, foundUser) {
				if (!foundUser) {
					foundUser = new User(user);
					foundUser.save(function (err) {
						if (err) {
							console.log(err);
						} else {
							login(foundUser, req, res);
						}
					});
				} else {
					login(foundUser, req, res);
				}
			});
		})(req, res, next);
	};
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function(req, providerUserProfile, done) {
	if (!req.user) {
		// Define a search query fields
		var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
		var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

		// Define main provider search query
		var mainProviderSearchQuery = {};
		mainProviderSearchQuery.provider = providerUserProfile.provider;
		mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

		// Define additional provider search query
		var additionalProviderSearchQuery = {};
		additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

		// Define a search query to find existing user with current provider profile
		var searchQuery = {
			$or: [mainProviderSearchQuery, additionalProviderSearchQuery]
		};

		User.findOne(searchQuery, function(err, user) {
			if (err) {
				return done(err);
			} else {
				if (!user) {
					var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

					User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
						user = new User({
							firstName: providerUserProfile.firstName,
							lastName: providerUserProfile.lastName,
							username: availableUsername,
							displayName: providerUserProfile.displayName,
							email: providerUserProfile.email,
							provider: providerUserProfile.provider,
							providerData: providerUserProfile.providerData,
							photo: providerUserProfile.photo,
						});

						// And save the user
						user.save(function(err) {
							return done(err, user);
						});
					});
				} else {
					return done(err, user);
				}
			}
		});
	} else {
		// User is already logged in, join the provider data to the existing user
		var user = req.user;

		// Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
		if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
			// Add the provider data to the additional provider data field
			if (!user.additionalProvidersData) user.additionalProvidersData = {};
			user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

			// Then tell mongoose that we've updated the additionalProvidersData field
			user.markModified('additionalProvidersData');

			// And save the user
			user.save(function(err) {
				return done(err, user, '/#!/settings/accounts');
			});
		} else {
			return done(new Error('User is already connected using this provider'), user);
		}
	}
};