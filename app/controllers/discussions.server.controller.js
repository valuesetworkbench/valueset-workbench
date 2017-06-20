'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    User = mongoose.model('User'),
    notificationService = require('./notifications'),
    Comment = mongoose.model('Comment'),
    _ = require('lodash');

/**
 * Create a Notification
 */
exports.createComment = function(req, res) {
    var comment = new Comment(req.body);

    comment.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            var regex = /@([^\s]+)/g

            var matches = [];

            var result;
            while(result = regex.exec(comment.comment)) {
                matches.push(result[1]);
            }

            _.forEach(matches, function(user) {
                notificationService.createNotification(user, comment.comment, comment.link);
            });

            res.json(comment);
        }
    });
};

/**
 * Show the current Notification
 */
exports.read = function(req, res) {
    res.json(req.discussion);
};


/**
 * Delete an Notification
 */
exports.deleteComment = function(req, res) {
    Comment.remove({_id: req.params.commentId}, function(err){
        if(! err) {
            res.status(200).send();
        } else {
            console.err(err);
            res.status(500).send();
        }
    });
};

exports.deleteAll = function(req, res) {
    var userId = req.user._id;

    Comment.remove({user: userId}, function(err){
        if(! err) {
            res.status(200).send();
        } else {
            console.err(err);
            res.status(500).send();
        }
    });
};

/**
 * Notification middleware
 */
exports.getDiscussion = function(req, res, next, id) {
    Comment.find({discussionId: id}).exec(function(err, discussion) {
        if (err) return next(err);
        if (! discussion) return next(new Error('Failed to load discussion ' + id));
        req.discussion = discussion ;
        next();
    });
};

/**
 * Notification authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    next();
};
