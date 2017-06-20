'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	request = require('request'),
	nock = require('nock'),
	sinon = require('sinon'),
	config = require('../../config/config'),
	httpMocks = require('node-mocks-http'),
	lists = require('../controllers/lists.server.controller');


/**
 * Unit tests
 */
describe('Lists Utility Tests:', function() {

	describe('Method getList', function() {
		
		it('should return list', function(done) {

			nock(config.cts2.url)
				.filteringPath(function(path) {
					return '/tests';
				})
				.get('/tests')
				.reply(200, {
					TestDirectory: {
						entries: []
					}
				});

			var req = httpMocks.createRequest({
				user: {
					_id: "12345"
				}
			});
			var res = httpMocks.createResponse({
				eventEmitter: require('events').EventEmitter
			});

			lists.getList("tests", "TestDirectory", req, res);

			res.on('send', function() {
				res.statusCode.should.equal(200);
				should.exist(JSON.parse(res._getData()).TestDirectory.entry)
				done();
			});

		});

	});

});