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
describe('Groups Controller Unit Tests:', function() {

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

		it('should be able to save without problems', function(done) {
			request.post({
				headers: {
					'accept': 'application/json',
					'content-type': 'application/json',
					"Cookie": adminCookie
				},
				url: 'http://localhost:' + config.port + '/groups',
				body: JSON.stringify({
					name: "test",
					owner: adminUser.id
				})
			}, function (err, res) {
				should(res.statusCode).be.equal(200);
				done();
			});
		});

		it('should be able to save without owner or members', function(done) {
			request.post({
				headers: {
					'accept': 'application/json',
					'content-type': 'application/json',
					"Cookie": testUser1Cookie
				},
				url: 'http://localhost:' + config.port + '/groups',
				body: JSON.stringify({
					name: "test"
				})
			}, function (err, res) {
				should(res.statusCode).be.equal(200);
				var group = JSON.parse(res.body);

				should(group.members.length).be.equal(1);
				should(group.members[0].user.username).be.equal(testUser1.username);
				should(group.owner.username).be.equal(testUser1.username);

				done();
			});
		});

		it('should not be able to save with someone else as an owner', function(done) {
			request.post({
				headers: {
					'accept': 'application/json',
					'content-type': 'application/json',
					"Cookie": testUser1Cookie
				},
				url: 'http://localhost:' + config.port + '/groups',
				body: JSON.stringify({
					name: "test",
					owner: adminUser.id
				})
			}, function (err, res) {
				should(res.statusCode).be.equal(403);
				done();
			});
		});

		it('should be able to update as owner without problems', function(done) {
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
						{user: adminUser.id}
					]
				})
			}, function (err, res) {
				should(res.statusCode).be.equal(200);
				var group = JSON.parse(res.body);
				should(group.members.length).be.equal(1);

				request.put({
					headers: {
						'accept': 'application/json',
						'content-type': 'application/json',
						"Cookie": adminCookie
					},
					url: 'http://localhost:' + config.port + '/groups/' + group._id,
					body: JSON.stringify(group)
				}, function (err, res) {
					should(res.statusCode).be.equal(200);
					done();
				});
			});

		});

		it('should not be able to update with owner not in members', function(done) {
			request.post({
				headers: {
					'accept': 'application/json',
					'content-type': 'application/json',
					"Cookie": testUser1Cookie
				},
				url: 'http://localhost:' + config.port + '/groups',
				body: JSON.stringify({
					name: "test",
					owner: testUser1.id
				})
			}, function (err, res) {
				var group = JSON.parse(res.body);
				group.members = [];
				request.put({
					headers: {
						'accept': 'application/json',
						'content-type': 'application/json',
						"Cookie": testUser1Cookie
					},
					url: 'http://localhost:' + config.port + '/groups/' + group._id,
					body: JSON.stringify(group)
				}, function (err, res) {
					should(res.statusCode).be.equal(400);
					done();
				});
			});

		});

		it('should be able to update to different owner', function(done) {
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
						{user: adminUser.id},
						{user: testUser1.id}
					]
				})
			}, function (err, res) {
				var group = JSON.parse(res.body);
				group.owner = testUser1.id;
				request.put({
					headers: {
						'accept': 'application/json',
						'content-type': 'application/json',
						"Cookie": adminCookie
					},
					url: 'http://localhost:' + config.port + '/groups/' + group._id,
					body: JSON.stringify(group)
				}, function (err, res) {
					should(res.statusCode).be.equal(200);
					done();
				});
			});

		});

		it('should not be able to update to using different owner', function(done) {
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
						{user: adminUser.id},
						{user: testUser1.id}
					]
				})
			}, function (err, res) {
				var group = JSON.parse(res.body);
				group.owner = testUser1.id;
				request.put({
					headers: {
						'accept': 'application/json',
						'content-type': 'application/json',
						"Cookie": adminCookie
					},
					url: 'http://localhost:' + config.port + '/groups/' + group._id,
					body: JSON.stringify(group)
				}, function (err, res) {
					var group = JSON.parse(res.body);
					request.put({
						headers: {
							'accept': 'application/json',
							'content-type': 'application/json',
							"Cookie": testUser2Cookie
						},
						url: 'http://localhost:' + config.port + '/groups/' + group._id,
						body: JSON.stringify(group)
					}, function (err, res) {
						should(res.statusCode).be.equal(403);
						done();
					});
				});
			});

		});


		it('should be able to update as admin', function(done) {
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
						{user: testUser1.id}
					]
				})
			}, function (err, res) {
				var group = JSON.parse(res.body);
				request.put({
					headers: {
						'accept': 'application/json',
						'content-type': 'application/json',
						"Cookie": adminCookie
					},
					url: 'http://localhost:' + config.port + '/groups/' + group._id,
					body: JSON.stringify(group)
				}, function (err, res) {
					should(res.statusCode).be.equal(200);
					done();
				});
			});

		});

		it('should not be able to update different from ID', function(done) {
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
						{user: testUser1.id}
					]
				})
			}, function (err, res) {
				var group1 = JSON.parse(res.body);

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
							{user: testUser1.id}
						]
					})
				}, function (err, res) {
					var group2 = JSON.parse(res.body);

					request.put({
						headers: {
							'accept': 'application/json',
							'content-type': 'application/json',
							"Cookie": adminCookie
						},
						url: 'http://localhost:' + config.port + '/groups/' + group2._id,
						body: JSON.stringify(group1)
					}, function (err, res) {
						should(res.statusCode).be.equal(409);
						done();
					});
				});
			});

		});

		it('should add the group owner as a member if not there', function(done) {
			request.post({
				headers: {
					'accept': 'application/json',
					'content-type': 'application/json',
					"Cookie": testUser1Cookie
				},
				url: 'http://localhost:' + config.port + '/groups',
				body: JSON.stringify({
					name: "test",
					owner: testUser1.id
				})
			}, function (err, res) {
				should(res.statusCode).be.equal(200);

				var group = JSON.parse(res.body);

				should(group.members.length).be.equal(1);
				should(group.members[0].user.username).be.equal(testUser1.username);

				done();
			});

		});

		it('should add the group owner as a member if not there on retrieve', function(done) {
			request.post({
				headers: {
					'accept': 'application/json',
					'content-type': 'application/json',
					"Cookie": testUser1Cookie
				},
				url: 'http://localhost:' + config.port + '/groups',
				body: JSON.stringify({
					name: "test",
					owner: testUser1.id
				})
			}, function (err, res) {
				should(res.statusCode).be.equal(200);

				var group = JSON.parse(res.body);

				should(group.members.length).be.equal(1);
				should(group.members[0].user.username).be.equal(testUser1.username);

				request.get({
					headers: {
						'accept': 'application/json',
						'content-type': 'application/json',
						"Cookie": adminCookie
					},
					url: 'http://localhost:' + config.port + '/groups/' + group._id,
					body: JSON.stringify(group)
				}, function (err, res) {
					should(res.statusCode).be.equal(200);
					should(group.members.length).be.equal(1);
					should(group.members[0].user.username).be.equal(testUser1.username);

					done();
				});
			});

		});

		it('should only see a group in which I am a member', function(done) {
			request.post({
				headers: {
					'accept': 'application/json',
					'content-type': 'application/json',
					"Cookie": testUser1Cookie
				},
				url: 'http://localhost:' + config.port + '/groups',
				body: JSON.stringify({
					name: "test",
					owner: testUser1.id
				})
			}, function (err, res) {
				var group = JSON.parse(res.body);
				request.get({
					headers: {
						'accept': 'application/json',
						'content-type': 'application/json',
						"Cookie": testUser2Cookie
					},
					url: 'http://localhost:' + config.port + '/groups/' + group._id,
					body: JSON.stringify(group)
				}, function (err, res) {
					should(res.statusCode).be.equal(403);
					done();
				});
			});

		});

		it('should see a group in which I am not a member but am admin', function(done) {
			request.post({
				headers: {
					'accept': 'application/json',
					'content-type': 'application/json',
					"Cookie": testUser1Cookie
				},
				url: 'http://localhost:' + config.port + '/groups',
				body: JSON.stringify({
					name: "test",
					owner: testUser1.id
				})
			}, function (err, res) {
				var group = JSON.parse(res.body);
				request.get({
					headers: {
						'accept': 'application/json',
						'content-type': 'application/json',
						"Cookie": adminCookie
					},
					url: 'http://localhost:' + config.port + '/groups/' + group._id,
					body: JSON.stringify(group)
				}, function (err, res) {
					should(res.statusCode).be.equal(200);
					done();
				});
			});

		});

		it('should only see a groups in which I am a member', function(done) {
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
						{user: testUser1.id},
						{user: testUser2.id}
					]
				})
			}, function (err, res) {
				var group = JSON.parse(res.body);
				request.get({
					headers: {
						'accept': 'application/json',
						'content-type': 'application/json',
						"Cookie": testUser2Cookie
					},
					url: 'http://localhost:' + config.port + '/groups',
					body: JSON.stringify(group)
				}, function (err, res) {
					should(res.statusCode).be.equal(200);
					should(JSON.parse(res.body).length).be.equal(1);
					done();
				});
			});

		});

		it('should only all groups if I am admin', function(done) {
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
						{user: testUser1.id},
						{user: testUser2.id}
					]
				})
			}, function (err, res) {
				var group = JSON.parse(res.body);
				request.get({
					headers: {
						'accept': 'application/json',
						'content-type': 'application/json',
						"Cookie": adminCookie
					},
					url: 'http://localhost:' + config.port + '/groups',
					body: JSON.stringify(group)
				}, function (err, res) {
					should(res.statusCode).be.equal(200);
					should(JSON.parse(res.body).length).be.equal(1);
					done();
				});
			});
		});

		it('should only see a groups in which I am a member (not a member)', function(done) {
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
						{user: testUser1.id}
					]
				})
			}, function (err, res) {
				var group = JSON.parse(res.body);
				request.get({
					headers: {
						'accept': 'application/json',
						'content-type': 'application/json',
						"Cookie": testUser2Cookie
					},
					url: 'http://localhost:' + config.port + '/groups',
					body: JSON.stringify(group)
				}, function (err, res) {
					should(res.statusCode).be.equal(200);
					should(JSON.parse(res.body).length).be.equal(0);
					done();
				});
			});
		});

	});

});