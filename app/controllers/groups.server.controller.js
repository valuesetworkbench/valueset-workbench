'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	User = mongoose.model('User'),
	Group = mongoose.model('Group'),
	_ = require('lodash');

/**
 * Create a Group
 */
exports.create = function(req, res) {
	var group = new Group(req.body);

	if (!group.owner) {
		group.owner = req.user;
	}

	if (!group.members) {
		group.members = [];
	}

	if (! _.find(group.members, function (member) { return req.user.equals(member.user) })) {
		group.members.push({user: req.user});
	}

	if (group.owner && !req.user.equals(group.owner)) {
		return res.status(403).send({
			message: "Cannot create a group with a different owner."
		});
	} else {
		group.save(function (err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(group);
			}
		});
	}
};

/**
 * Show the current Group
 */
exports.read = function(req, res) {
	res.jsonp(req.group);
};

/**
 * Update a Group
 */
exports.update = function(req, res) {
	var group = new Group(req.body);

	if (req.group.id !== group.id) {
		return res.status(409).send({
			message: "Group and ID location do not match"
		});
	}

	if (! _.find(req.body.members, function (member) {
			return group.owner.equals(member.user);
		})) {
		return res.status(400).send({
			message: "Cannot save a group where the owner is not a member"
		});
	}


	group.isNew = false;

	group.save(function(err, doc){
		if (err) {
			console.log(err);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			return res.jsonp(doc);
		}
	});
};

/**
 * Delete an Group
 */
exports.delete = function(req, res) {
	var group = req.group ;

	group.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(group);
		}
	});
};

/**
 * List of Groups
 */
exports.list = function(req, res) {
	var query = {};
	if (! _.intersection(req.user.roles, ['admin']).length) {
		query = {'members.user': req.user._id};
	}

	if(req.query) {
		query = {$and: [query, req.query]}
	}

	Group.find(query).sort('-created').populate('user', 'displayName').exec(function(err, groups) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(groups);
		}
	});
};

/**
 * Group middleware
 */
exports.groupByID = function(req, res, next, id) {
	if (!id) {
		return res.status(400).send({
			message: "An ID is required."
		});
	}

	Group.findById(id).populate('user', 'displayName').exec(function(err, group) {
		if (err) return next(err);
		if (! group) return next(new Error('Failed to load Group ' + id));
		req.group = group;
		next();
	});
};

/**
 * Group authorization middleware
 */
exports.hasEditAuthorization = function(req, res, next) {
	if (req.group.owner == req.user.id
		|| _.intersection(req.user.roles, ['admin']).length) {
		next();
	} else {
		return res.status(403).send('User is not authorized');
	}
};

exports.hasViewAuthorization = function(req, res, next) {
	if (req.group.owner == req.user.id
		|| _.intersection(req.user.roles, ['admin']).length
		|| _.find(req.group.members, function (member) {
			return member.user == req.user.id
		})) {
		next();
	} else {
		return res.status(403).send('User is not authorized');
	}
};
