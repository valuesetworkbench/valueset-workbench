'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	mongoose = require('mongoose'),
	errorHandler = require('../errors'),
	util = require('../../core/util'),
	Group = mongoose.model('Group'),
	User = mongoose.model('User');

/**
 * User middleware
 */
exports.userByID = function(req, res, next, id) {
	User.findOne({
		_id: id
	}).exec(function(err, user) {
		if (err) return next(err);
		if (!user) return next(new Error('Failed to load User ' + id));
		req.profile = user;
		next();
	});
};

/**
 * Require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {

	if (!req.isAuthenticated()) {
		return res.status(401).send({
			message: 'User is not logged in'
		});
	}

	next();
};

/**
 * User authorizations routing middleware
 */
exports.hasAuthorization = function(roles) {
	var _this = this;

	return function(req, res, next) {
		_this.requiresLogin(req, res, function() {
			if (_.intersection(req.user.roles, roles).length) {
				return next();
			} else {
				return res.status(403).send({
					message: 'User is not authorized'
				});
			}
		});
	};
};

function findResource(body) {
	return util.findResource(body);
}

function findOwner(body) {
	var resource = findResource(body);

	if (resource) {
		if (resource.sourceAndRole && resource.sourceAndRole[0]) {
			return [resource.sourceAndRole[0].source.content];
		} else {
			return [];
		}
	}
}

var methodToPrivilegeMap = {
	DELETE: "Delete",
	PUT: "Edit"
}

function checkPriveleges(method, priveleges) {
	return method == 'GET' || priveleges.indexOf(methodToPrivilegeMap[method]) != -1;
}

exports.isGroupAuthorized = function(req, res, next) {
	var resource = req.delegate || req.resource;

	if (! resource) {
		//this really should have be caught upstream.
		return res.status(500).send({
			message: errorHandler.getErrorMessage("Error - No resource was found.")
		});
	} else if(_.intersection(req.user.roles, ['admin']).length) {
		req.permissions = Group.permissions;
		next();
	} else {
		var resourceOwner = findOwner(resource);

		if (resourceOwner && req.user.email == resourceOwner[0]) {
			req.permissions = Group.permissions;
			next();
		} else {
			Group.find({'members.user': req.user._id}).exec(function (err, groups) {
				var groupNames = _.map(groups, function (group) {
					return group.name
				});

				if (!_.intersection(groupNames, resourceOwner).length) {
					return res.status(403).send({
						message: errorHandler.getErrorMessage("Unauthorized")
					});
				} else {
					var permissions = _.find(_.find(groups, function (group) {
						return group.name === resourceOwner[0]
					}).members, function (member) {
						return member.user.equals(req.user._id)
					}).permissions;

					if (!checkPriveleges(req.method, permissions)) {
						return res.status(403).send({
							message: errorHandler.getErrorMessage("Unauthorized!")
						});
					} else {
						var newResource;

						if (_.keys(req.body).length) {
							newResource = req.body;
						}

						if (newResource) {
							var owner = findOwner(newResource);

							var permissions = _.find(_.find(groups, function (group) {
								return group.name === owner[0]
							}).members, function (member) {
								return member.user.equals(req.user._id)
							}).permissions;

							req.permissions = permissions;
						} else {
							req.permissions = permissions;
						}

						next();
					}
				}
			});
		}
	}
};