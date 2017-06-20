'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function(app) {
	// User Routes
	var users = require('../../app/controllers/users');

	// Setting up the users profile api
	app.route('/users/me').get(users.requiresLogin, users.me);
    app.route('/users').get(users.requiresLogin, users.list);
	app.route('/users/:userId').get(users.requiresLogin, users.readPublicUserInfo);
    app.route('/userroles').get(users.requiresLogin, users.hasAuthorization(['admin']), users.roles);
	app.route('/users').put(users.requiresLogin, users.update);
	//app.route('/users/accounts').delete(users.requiresLogin, users.hasAuthorization(['admin']), users.removeOAuthProvider);
	app.route('/users/me/agreed').put(users.requiresLogin, users.agreeToTermsAndPrivacyPolicy);
	app.route('/users/me/apikey').delete(users.requiresLogin, users.resetApiKey);

	app.route('/terms').get(users.requiresLogin, users.getTerms);
	app.route('/privacy').get(users.requiresLogin, users.getPrivacyPolicy);

	// Setting up the users authentication api
	app.route('/auth/signin').post(users.adminSignin);
	app.route('/auth/signout').get(users.signout);

	// Setting the facebook oauth routes
	app.route('/auth/facebook').get(passport.authenticate('facebook', {
		scope: ['email']
	}));
	app.route('/auth/facebook/callback').get(users.oauthCallback('facebook'));

	// Setting the twitter oauth routes
	app.route('/auth/twitter').get(passport.authenticate('twitter'));
	app.route('/auth/twitter/callback').get(users.oauthCallback('twitter'));

	// Setting the google oauth routes
	app.route('/auth/google').get(passport.authenticate('google', {
		scope: [
			'https://www.googleapis.com/auth/userinfo.profile',
			'https://www.googleapis.com/auth/userinfo.email'
		]
	}));
	app.route('/auth/google/callback').get(users.oauthCallback('google'));

	// Setting the linkedin oauth routes
	app.route('/auth/linkedin').get(passport.authenticate('linkedin'));
	app.route('/auth/linkedin/callback').get(users.oauthCallback('linkedin'));

	// Setting the github oauth routes
	app.route('/auth/github').get(passport.authenticate('github'));
	app.route('/auth/github/callback').get(users.oauthCallback('github'));

    app.get('/auth/:strategy', function(req, res, next) {
        var strategy = req.params.strategy;
        passport.authenticate(strategy)(req, res, next)
    });

    app.get('/auth/:strategy/callback', function(req, res, next) {
        var strategy = req.params.strategy;
        users.oauthCallback(strategy)(req, res, next)
    });

    app.get('/vsw/auth/:strategy/callback', function(req, res, next) {
        var strategy = req.params.strategy;
        users.oauthCallback(strategy)(req, res, next)
    });

    app.route('/auth_providers').get(users.getCustomOauth);

	// Finish by binding the user middleware
	app.param('userId', users.userByID);
};
