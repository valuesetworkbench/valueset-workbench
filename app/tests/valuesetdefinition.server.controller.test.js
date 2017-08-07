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
	valueSetDefinitionService = require('../controllers/valuesetdefinitions.server.controller');


/**
 * Unit tests
 */
describe('ValueSetDefinition Controller Unit Tests:', function() {

	describe('Method Save', function() {
		
		it('should be able to save without problems', function(done) {

			nock(config.cts2.url)
				.filteringPath(function(path){
					return '/';
				})
				.post('/')
				.reply(201);

			var req = httpMocks.createRequest({
				body :{
					valueSetDefinition: {
                        changeDescription: {}
                    }
				},
				user: { }
			});
			var res = httpMocks.createResponse({
				eventEmitter: require('events').EventEmitter
			});

			valueSetDefinitionService.create(req, res);

			res.on('send', function() {
				res.statusCode.should.equal(201);
				should.exist(res._getData())
				done();
			});

		});

		it('should forward on error messages', function(done) {

			nock(config.cts2.url)
				.filteringPath(function(path){
					return '/';
				})
				.post('/')
				.reply(500, {
					error: "Something happened!!!"
				});

			var req = httpMocks.createRequest({
                body :{
                    valueSetDefinition: {
                        changeDescription: {}
                    }
                },
                user: { }
            });
			var res = httpMocks.createResponse({
				eventEmitter: require('events').EventEmitter
			});

			valueSetDefinitionService.create(req, res);

			res.on('send', function() {
				res.statusCode.should.equal(500);
				res._getData().should.equal(JSON.stringify({error: "Something happened!!!"}))
				done();
			});

		});

	});

});