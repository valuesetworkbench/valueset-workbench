'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Export Schema
 */
var CommentSchema = new Schema({
	discussionId: {
		type: String,
		required: true
	},
    comment: {
        type: String,
        required: true
    },
	authorAvatarUrl: {
		type: String,
		required: true
	},
	authorName: {
		type: String,
		required: true
	},
	authorId: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		required: true,
		default: Date.now
	},
	page: {
		type: String,
		required: false
	}
});

CommentSchema.virtual('link')
	.get(function () {
		return this.page + '?comment=comment-' + this._id;
	});

CommentSchema.set('toJSON', {
	virtuals: true
});

CommentSchema.set('toObject', {
	virtuals: true
});

mongoose.model('Comment', CommentSchema);
