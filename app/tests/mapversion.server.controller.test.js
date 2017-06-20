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
	StrategyMock = require('./strategy-mock'),
	Group = mongoose.model('Group'),
	User = mongoose.model('User'),
	passport = require('passport'),
	httpMocks = require('node-mocks-http'),
	mapVersionService = require('../controllers/mapversions.server.controller');


/**
 * Unit tests
 */
describe('MapVersion Controller Unit Tests:', function() {

	describe('Method Save', function() {

		it('should be able to save without problems', function(done) {

			nock(config.cts2.url)
				.filteringPath(function(path){
					return '/';
				})
				.post('/')
				.reply(201, {
					MapVersion: {}
				});

			var req = httpMocks.createRequest();
			var res = httpMocks.createResponse({
				eventEmitter: require('events').EventEmitter
			});

			mapVersionService.create(req, res);

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

			var req = httpMocks.createRequest();
			var res = httpMocks.createResponse({
				eventEmitter: require('events').EventEmitter
			});

			mapVersionService.create(req, res);

			res.on('send', function() {
				res.statusCode.should.equal(500);
				res._getData().should.equal(JSON.stringify({error: "Something happened!!!"}))
				done();
			});

		});

	});

	describe('Permission Tests:', function() {
		var adminCookie, testUser1Cookie, testUser2Cookie, adminUser, testUser1, testUser2;

		beforeEach(function(done) {
			passport.use(new StrategyMock());
			done();
		});

		beforeEach(function(done) {
			new User({
				username: "testUser1",
				provider: "mock",
				firstName: "test",
				lastName: "test",
				email: "test@test.org",
				roles: []
			}).save(function (err, user) {
					testUser1 = user;
					done()
				});

		});

		beforeEach(function(done) {
			new User({
				username: "testUser2",
				provider: "mock",
				firstName: "test",
				lastName: "test",
				email: "test@test.org",
				roles: []
			}).save(function (err, user) {
					testUser2 = user;
					done()
				});

		});

		beforeEach(function(done) {
			new User({
				username: "testAdminUser",
				provider: "mock",
				firstName: "test",
				lastName: "test",
				email: "test@test.org",
				roles: ['admin'],
			}).save(function (err, user) {
					adminUser = user
					done()
				});

		});

		beforeEach(function(done) {
			request.post({
				headers: {
					'accept': 'application/json',
					'content-type': 'application/json'
				},
				url: 'http://localhost:' + config.port + '/auth/signin',
				body: JSON.stringify({username:'testAdminUser', password:'admin'})
			}, function (err, res) {
				adminCookie = res.headers['set-cookie']
				done();
			});
		})

		beforeEach(function(done) {
			request.post({
				headers: {
					'accept': 'application/json',
					'content-type': 'application/json'
				},
				url: 'http://localhost:' + config.port + '/auth/signin',
				body: JSON.stringify({username:'testUser1', password:'admin'})
			}, function (err, res) {
				testUser1Cookie = res.headers['set-cookie']
				done();
			});
		});

		beforeEach(function(done) {
			request.post({
				headers: {
					'accept': 'application/json',
					'content-type': 'application/json'
				},
				url: 'http://localhost:' + config.port + '/auth/signin',
				body: JSON.stringify({username:'testUser2', password:'admin'})
			}, function (err, res) {
				testUser2Cookie = res.headers['set-cookie']
				done();
			});
		});

		afterEach(function(done) {
			User.remove().exec();
			Group.remove().exec();

			done();
		});

		describe('Permissions', function() {

			it('should be able to view without problems to group I belong to with read privileges', function(done) {
				var mapVersion = {
					mapVersion: {
						"mapVersionName": "test-version",
						"versionOf": {
							"content": "test"
						},
						"sourceAndRole": [
							{
								"content": "",
								"source": {
									"content": "test"
								},
								"role": {
									"content": "owner"
								}
							}
						]
					}
				};

				nock(config.cts2.url)
					.filteringPath(function(path){
						return '/mapversion';
					})
					.post('/mapversion')
					.reply(201);

				nock(config.cts2.url)
					.filteringPath(function(path){
						return '/mapversion/test-version';
					})
					.get('/mapversion/test-version')
					.reply(200, {
						MapVersionMsg : mapVersion
					});

				request.post({
					headers: {
						'accept': 'application/json',
						'content-type': 'application/json',
						"Cookie": adminCookie
					},
					url: 'http://localhost:' + config.port + '/groups',
					body: JSON.stringify({
						name: "test",
						owner: adminUser.id,
						members: [
							{user: adminUser.id, permissions: ['View']}
						]
					})
				}, function (err, res) {
					should(res.statusCode).be.equal(200);

					request.post({
						headers: {
							'accept': 'application/json',
							'content-type': 'application/json',
							"Cookie": adminCookie
						},
						url: 'http://localhost:' + config.port + '/mapversions',
						body: JSON.stringify(mapVersion)
					}, function (err, res) {
						should(res.statusCode).be.equal(200);
						request.get({
							headers: {
								'accept': 'application/json',
								'content-type': 'application/json',
								"Cookie": adminCookie
							},
							url: 'http://localhost:' + config.port + '/proxy/' + encodeURIComponent(config.cts2.url + '/mapversion/test-version')},
							function (err, res) {
								should(res.statusCode).be.equal(200);
								should(JSON.parse(res.body).MapVersionMsg).be.eql(mapVersion);

								done();
							}
						);
					});
				});
			});

			it('should be able to delete using group I belong to with delete privileges', function(done) {
				var mapVersion = {
					mapVersion: {
						"mapVersionName": "test-version",
						"versionOf": {
							"content": "test"
						},
						"sourceAndRole": [
							{
								"content": "",
								"source": {
									"content": "test"
								},
								"role": {
									"content": "owner"
								}
							}
						]
					}
				};

				nock(config.cts2.url)
					.filteringPath(function(path){
						return '/mapversion';
					})
					.post('/mapversion')
					.reply(201);

				nock(config.cts2.url)
					.filteringPath(function(path){
						return '/mapversion/test-version';
					})
					.get('/mapversion/test-version')
					.reply(200, {
						MapVersionMsg : mapVersion
					});

				nock(config.cts2.url)
					.filteringPath(function(path){
						return '/mapversion/test-version';
					})
					.delete('/mapversion/test-version')
					.reply(204);

				request.post({
					headers: {
						'accept': 'application/json',
						'content-type': 'application/json',
						"Cookie": testUser1Cookie
					},
					url: 'http://localhost:' + config.port + '/groups',
					body: JSON.stringify({
						name: "test",
						owner: testUser1.id,
						members: [
							{user: testUser1.id, permissions: ['View', 'Delete']}
						]
					})
				}, function (err, res) {
					should(res.statusCode).be.equal(200);

					request.post({
						headers: {
							'accept': 'application/json',
							'content-type': 'application/json',
							"Cookie": testUser1Cookie
						},
						url: 'http://localhost:' + config.port + '/mapversions',
						body: JSON.stringify(mapVersion)
					}, function (err, res) {
						should(res.statusCode).be.equal(200);
						request.del({
								headers: {
									'accept': 'application/json',
									'content-type': 'application/json',
									"Cookie": testUser1Cookie
								},
								url: 'http://localhost:' + config.port + '/proxy/' + encodeURIComponent(config.cts2.url + '/mapversion/test-version')},
							function (err, res) {
								should(res.statusCode).be.equal(204);

								done();
							}
						);
					});
				});
			});

			it('should not be able to delete using group I belong to without delete privileges', function(done) {
				var mapVersion = {
					mapVersion: {
						"mapVersionName": "test-version",
						"versionOf": {
							"content": "test"
						},
						"sourceAndRole": [
							{
								"content": "",
								"source": {
									"content": "test"
								},
								"role": {
									"content": "owner"
								}
							}
						]
					}
				};

				nock(config.cts2.url)
					.filteringPath(function(path){
						return '/mapversion';
					})
					.post('/mapversion')
					.reply(201);

				nock(config.cts2.url)
					.filteringPath(function(path){
						return '/mapversion/test-version';
					})
					.get('/mapversion/test-version')
					.reply(200, {
						MapVersionMsg : mapVersion
					});

				nock(config.cts2.url)
					.filteringPath(function(path){
						return '/mapversion/test-version';
					})
					.delete('/mapversion/test-version')
					.reply(204);

				request.post({
					headers: {
						'accept': 'application/json',
						'content-type': 'application/json',
						"Cookie": testUser1Cookie
					},
					url: 'http://localhost:' + config.port + '/groups',
					body: JSON.stringify({
						name: "test",
						owner: testUser1.id,
						members: [
							{user: testUser1.id, permissions: []}
						]
					})
				}, function (err, res) {
					should(res.statusCode).be.equal(200);

					request.post({
						headers: {
							'accept': 'application/json',
							'content-type': 'application/json',
							"Cookie": testUser1Cookie
						},
						url: 'http://localhost:' + config.port + '/mapversions',
						body: JSON.stringify(mapVersion)
					}, function (err, res) {
						should(res.statusCode).be.equal(200);
						request.del({
								headers: {
									'accept': 'application/json',
									'content-type': 'application/json',
									"Cookie": testUser1Cookie
								},
								url: 'http://localhost:' + config.port + '/proxy/' + encodeURIComponent(config.cts2.url + '/mapversion/test-version')},
							function (err, res) {
								should(res.statusCode).be.equal(403);

								done();
							}
						);
					});
				});
			});

		});

	});
});