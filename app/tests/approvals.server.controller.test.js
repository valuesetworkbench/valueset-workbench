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
	passport = require('passport');

var adminCookie, testUser1Cookie, testUser2Cookie, adminUser, testUser1, testUser2;

/**
 * Unit tests
 */
describe('Approvals Controller Unit Tests:', function() {

	beforeEach(function(done) {
		nock.cleanAll();
		done();
	});

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

	describe('Approvals', function() {

		it('should not be able to save Value Set Definition with existing approval', function (done) {
			nock(config.cts2.url)
				.filteringPath(function (path) {
					return '/valueset/test/definition/1';
				})
				.get('/valueset/test/definition/1')
				.reply(200, {
					ValueSetDefinitionMsg: {
						valueSetDefinition: {
							property: []
						}
					}
				});

			request.put({
				headers: {
					'accept': 'application/json',
					'content-type': 'application/json',
					"Cookie": adminCookie
				},
				url: 'http://localhost:' + config.port + '/proxy/' + encodeURIComponent(config.cts2.url + '/valueset/test/definition/1'),
				body: JSON.stringify({ValueSetDefinition: {
					property: [{
						predicate: {
							uri: "urn:approval",
							name: "approval"
						},
						value: [
							{
								entity: {
									uri: "xxxx",
									namespace: "VSW",
									name: "asdf"
								}
							}
						]
					}]
				}})
			}, function (err, res) {
				should(res.statusCode).be.equal(403);
				done();
			});
		});

		it('should be able to save Value Set Definition without existing approval', function (done) {
			nock(config.cts2.url)
				.filteringPath(function (path) {
					return '/valueset/test/definition/1';
				})
				.get('/valueset/test/definition/1')
				.reply(200, {
					ValueSetDefinitionMsg: {
						valueSetDefinition: {
							property: []
						}
					}
				});

			request.put({
				headers: {
					'accept': 'application/json',
					'content-type': 'application/json',
					"Cookie": adminCookie
				},
				url: 'http://localhost:' + config.port + '/proxy/' + encodeURIComponent(config.cts2.url + '/valueset/test/definition/1'),
				body: JSON.stringify({
					ValueSetDefinition: {
						property: []
					}
				})
			}, function (err, res) {
				should(res.statusCode).be.equal(200);
				done();
			});
		});

		it('should be able to remove existing approval if a group owner', function (done) {
			new Group({
				name: "test",
				owner: adminUser,
				members: [
					{
						user: adminUser,
						permissions: []
					}
				]
			}).save(function (err, group) {

				nock(config.cts2.url)
					.filteringPath(function (path) {
						return '/valueset/test/definition/1';
					})
					.get('/valueset/test/definition/1')
					.reply(200, {
						ValueSetDefinitionMsg: {
							valueSetDefinition: {
								property: [{
									predicate: {
										uri: "urn:approval",
										name: "approval"
									},
									value: [
										{
											entity: {
												uri: group._id,
												namespace: "VSW",
												name: group.name
											}
										}
									]
								}]
							}
						}
					});

					nock(config.cts2.url)
						.filteringPath(function (path) {
							return '/valueset/test/definition/1';
						})
						.put('/valueset/test/definition/1')
						.reply(200);

					request.del({
						headers: {
							'accept': 'application/json',
							'content-type': 'application/json',
							"Cookie": adminCookie
						},
						url: 'http://localhost:' + config.port + '/approvals/' + encodeURIComponent(config.cts2.url + '/valueset/test/definition/1') + "/" + group._id
					}, function (err, res) {
						should(res.statusCode).be.equal(200);
						done();
					});
			});
		});

		it('should be able to remove existing approval if a group owner', function (done) {
			new Group({
				name: "test",
				owner: adminUser,
				members: [
					{
						user: adminUser,
						permissions: []
					}
				]
			}).save(function (err, group) {

					nock(config.cts2.url)
						.filteringPath(function (path) {
							return '/valueset/test/definition/1';
						})
						.get('/valueset/test/definition/1')
						.reply(200, {
							ValueSetDefinitionMsg: {
								valueSetDefinition: {
									property: [{
										predicate: {
											uri: "urn:approval",
											name: "approval"
										},
										value: [
											{
												entity: {
													uri: "1234",
													namespace: "VSW",
													name: "INVALID_GROUP"
												}
											}
										]
									}]
								}
							}
						});

					nock(config.cts2.url)
						.filteringPath(function (path) {
							return '/valueset/test/definition/1';
						})
						.put('/valueset/test/definition/1')
						.reply(200);

					request.del({
						headers: {
							'accept': 'application/json',
							'content-type': 'application/json',
							"Cookie": adminCookie
						},
						url: 'http://localhost:' + config.port + '/approvals/' + encodeURIComponent(config.cts2.url + '/valueset/test/definition/1') + "/1234"
					}, function (err, res) {
						should(res.statusCode).be.equal(403);
						done();
					});
				});
		});

		it('should add the approval to the resource', function (done) {
			nock(config.cts2.url)
				.filteringPath(function (path) {
					return '/valueset/test/definition/1';
				})
				.get('/valueset/test/definition/1')
				.reply(200, {
					ValueSetDefinitionMsg: {
						valueSetDefinition: {
							property: []
						}
					}
				});

			var postedBody;

			nock(config.cts2.url)
				.filteringPath(function (path) {
					return '/valueset/test/definition/1';
				})
				.put('/valueset/test/definition/1')
				.reply(201, function(uri, requestBody) {
					postedBody = requestBody;
					return "";
				});

			new Group({
				name: "test",
				owner: adminUser,
				members: [
					{
						user: adminUser,
						permissions: []
					}
				]
			}).save(function (err, group) {
					request.post({
						headers: {
							'accept': 'application/json',
							'content-type': 'application/json',
							"Cookie": adminCookie
						},
						url: 'http://localhost:' + config.port + '/approvals/' + encodeURIComponent(config.cts2.url + '/valueset/test/definition/1'),
						body: JSON.stringify({
							predicate: {
								uri: "urn:approval",
								name: "approval"
							},
							value: [
								{
									entity: {
										uri: group._id,
										namespace: "VSW",
										name: group.name
									}
								}
							]
						})
					}, function (err, res) {
						should(res.statusCode).be.equal(200);
						should(postedBody.ValueSetDefinition.property.length).be.equal(1);
						postedBody
						done();
					});
				});
		});

		it('should not be able to add the approval to the resource if not in the group', function (done) {
			nock(config.cts2.url)
				.filteringPath(function (path) {
					return '/valueset/test/definition/1';
				})
				.get('/valueset/test/definition/1')
				.reply(200, {
					ValueSetDefinitionMsg: {
						valueSetDefinition: {
							property: []
						}
					}
				});

			nock(config.cts2.url)
				.filteringPath(function (path) {
					return '/valueset/test/definition/1';
				})
				.put('/valueset/test/definition/1')
				.reply(201, function(uri, requestBody) {
					return "";
				});

			new Group({
				name: "test",
				owner: adminUser,
				members: [
					{
						user: adminUser,
						permissions: []
					}
				]
			}).save(function (err, group) {
					request.post({
						headers: {
							'accept': 'application/json',
							'content-type': 'application/json',
							"Cookie": adminCookie
						},
						url: 'http://localhost:' + config.port + '/approvals/' + encodeURIComponent(config.cts2.url + '/valueset/test/definition/1'),
						body: JSON.stringify({
							predicate: {
								uri: "urn:approval",
								name: "approval"
							},
							value: [
								{
									entity: {
										uri: "INVALID",
										namespace: "VSW",
										name: "INVALID"
									}
								}
							]
						})
					}, function (err, res) {
						should(res.statusCode).be.equal(403);
						done();
					});
				});
		});
	});


});