'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
    User = mongoose.model('User'),
	config = require('../../config/config'),
	jade = require("jade"),
	Notification = mongoose.model('Notification'),
	_ = require('lodash'),
	email = require('../core/email');

exports.createNotification = function(username, message, link) {
    User.findOne({
        username: username
    }).exec(function(err, loggedInUser) {
        if (err) {
            console.err(err);
            return;
        }

        User.find({ $and : [{enableAlerts : true}, {username : username}] }).exec(function(err, users) {
            for(var i = 0; i<users.length; i++) {
                var user = users[i];

                var notification = new Notification();
                notification.user = user._id;
                notification.content = message;
                notification.source = loggedInUser.displayName;
				notification.link = link;

                notification.save(function(err) {
                    if(err) {
                        console.error(err);
                    }
                });

				if(config.email.enabled) {
					notification.link = config.externalUrl + link;

					var html = jade.renderFile('app/templates/notification.jade', {notification: notification});

					email.send({
						text: notification.link,
						from: config.email.returnAddress,
						to: user.email,
						subject: "New Value Set Workbench Message",
						attachment:
							[
								{data: html, alternative:true}
							]
					});
				}
            }

        });

    });

}


/**
 * Create a Notification
 */
exports.create = function(req, res) {
	var notification = new Notification(req.body);
	notification.user = req.user;

	notification.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(notification);

			/* TODO: Enable email alerts
			email.send({
				text:    "...",
				from:    "...",
				to:      "...",
				subject: "..."
			})
			*/
		}
	});
};

/**
 * Show the current Notification
 */
exports.read = function(req, res) {
	res.jsonp(req.notification);
};

/**
 * Update a Notification
 */
exports.update = function(req, res) {
	var notification = req.notification ;

	notification = _.extend(notification , req.body);

	notification.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(notification);
		}
	});
};

/**
 * Delete an Notification
 */
exports.delete = function(req, res) {
	var notification = req.notification;

	notification.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(notification);
		}
	});
};

exports.deleteAll = function(req, res) {
    var userId = req.user._id;

    Notification.remove({user: userId}, function(err){
        if(! err) {
            res.status(200).send();
        } else {
            console.err(err);
            res.status(500).send();
        }
    });
};

exports.markAllAsRead = function(req, res) {
	var userId = req.user._id;

	Notification.update({user: userId}, {unread: false}, {multi: true}, function(err){
		if(! err) {
			res.status(200).send();
		} else {
			console.err(err);
			res.status(500).send();
		}
	});
};

/**
 * List of Notifications
 */
exports.list = function(req, res) {
    Notification.find(req.query).sort('-created').populate('user', 'displayName').exec(function(err, notifications) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(notifications);
		}
	});
};

/**
 * Notification middleware
 */
exports.notificationByID = function(req, res, next, id) { Notification.findById(id).populate('user', 'displayName').exec(function(err, notification) {
		if (err) return next(err);
		if (! notification) return next(new Error('Failed to load Notification ' + id));
		req.notification = notification ;
		next();
	});
};

/**
 * Notification authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.notification.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
