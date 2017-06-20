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
describe('Users Profile Controller Unit Tests:', function() {

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

	describe('Users', function() {

		it('should be able to update their own profile.', function (done) {
			request.put({
				headers: {
					'accept': 'application/json',
					'content-type': 'application/json',
					"Cookie": testUser1Cookie
				},
				url: 'http://localhost:' + config.port + '/users',
				body: JSON.stringify(testUser1)
			}, function (err, res) {
				should(res.statusCode).be.equal(200);
				done();
			});
		});

		it('should not be able to update their someone elses profile.', function (done) {
			request.put({
				headers: {
					'accept': 'application/json',
					'content-type': 'application/json',
					"Cookie": testUser1Cookie
				},
				url: 'http://localhost:' + config.port + '/users',
				body: JSON.stringify(testUser2)
			}, function (err, res) {
				should(res.statusCode).be.equal(403);
				done();
			});
		});

	});

});