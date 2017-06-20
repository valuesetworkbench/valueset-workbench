'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Notification Schema
 */
var NotificationSchema = new Schema({
    content: {
        type: String,
        default: ''
    },
    source: {
        type: String,
        default: ''
    },
    link: {
        type: String,
        default: ''
    },
    unread: {
        type: Boolean,
        default: true,
        trim: true
    },
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User',
        required: true
	}
});

mongoose.model('Notification', NotificationSchema);
