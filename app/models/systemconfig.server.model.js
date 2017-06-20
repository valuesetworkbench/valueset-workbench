'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Service Schema
 */
var SystemConfigSchema = new Schema({

});

mongoose.model('SystemConfig', SystemConfigSchema);
