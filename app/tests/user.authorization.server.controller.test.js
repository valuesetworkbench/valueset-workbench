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
	Group = mongoose.model('Group'),
	User = mongoose.model('User'),
	authenticationService = require('../controllers/users/users.authentication.server.controller'),
	passport = require('passport');


/**
 * Unit tests
 */
describe('Users Authentication Controller Unit Tests:', function() {

    afterEach(function(done) {
        User.remove().exec();
        Group.remove().exec();

        done();
    });

	describe('Authorization', function () {

		it('should not be allowed if there is no resource.', function (done) {

			var req = httpMocks.createRequest({
				user: {username: 'test', roles: []}
			});
            var res = httpMocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });

            res.on('end', function() {
                should(res.statusCode).be.equal(500);
                done();
            });

			authenticationService.isGroupAuthorized(req, res, function() {
				fail("Should not have been authorized for a null resource")
                done();
			});

		});

		it('should not be allowed if the user is not in any groups.', function (done) {

            var res = httpMocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });

			var resource = {
				ValueSetDefinitionMsg: {
					valueSetDefinition: {
						sourceAndRole: [
                            {
                                source: {
                                    content: 'mygroup'
                                }
                            }
						]
					}
				}
			}

            var req = httpMocks.createRequest({
                user: {username: 'test', roles: []},
                resource: resource
            });

            res.on('end', function() {
                should(res.statusCode).be.equal(403);
                done();
            });

			authenticationService.isGroupAuthorized(req, res, function() {
				fail("Should not have been authorized for a null resource")
                done();
			});

		});

        it('should be allowed if the user is in a group of the sub-resource.', function (done) {

            new User({
                username: "tesUser",
                provider: "mock",
                firstName: "test",
                lastName: "test",
                email: "test@test.org",
                roles: [],
            }).save(function (err, user) {
                    new Group({
                        name: "test",
                        owner: user,
                        members: [
                            {
                                user: user,
                                permissions: []
                            }
                        ]
                    }).save(function (err, group) {
                            var res = httpMocks.createResponse({
                                eventEmitter: require('events').EventEmitter
                            });

                            var resource = {
                                ValueSetDefinitionMsg: {
                                    valueSetDefinition: {
                                        sourceAndRole: [
                                            {
                                                source: {
                                                    content: 'test'
                                                }
                                            }
                                        ]
                                    }
                                }
                            }

                            var subresource = {
                                IteratableResolvedValueSet: {
                                    entry: []
                                }
                            }

                            var req = httpMocks.createRequest({
                                user: user,
                                resource: subresource,
                                delegate: resource
                            });

                            authenticationService.isGroupAuthorized(req, res, function () {
                                done();
                            });
                        });
                });
        });

        it('should be allowed if the user is in the group.', function (done) {

            new User({
                username: "tesUser",
                provider: "mock",
                firstName: "test",
                lastName: "test",
                email: "test@test.org",
                roles: [],
            }).save(function (err, user) {
                    new Group({
                        name: "test",
                        owner: user,
                        members: [
                            {
                                user: user,
                                permissions: []
                            }
                        ]
                    }).save(function (err, group) {
                            var resource = {
                                ValueSetDefinitionMsg: {
                                    valueSetDefinition: {
                                        sourceAndRole: [
                                            {
                                                source: {
                                                    content: 'test'
                                                }
                                            }
                                        ]
                                    }
                                }
                            };

                            var req = httpMocks.createRequest({
                                resource: resource,
                                user: user
                            });
                            var res = httpMocks.createResponse();

                            authenticationService.isGroupAuthorized(req, res, function() {
                                done()
                            });
                    });
            });
        });

        it('should not be allowed if the user is in the wrong group.', function (done) {

            new User({
                username: "tesUser",
                provider: "mock",
                firstName: "test",
                lastName: "test",
                email: "test@test.org",
                roles: [],
            }).save(function (err, user) {
                    new Group({
                        name: "wrong",
                        owner: user,
                        members: [
                            {
                                user: user,
                                permissions: []
                            }
                        ]
                    }).save(function (err, group) {
                            var resource = {
                                ValueSetDefinitionMsg: {
                                    valueSetDefinition: {
                                        sourceAndRole: [
                                            {
                                                source: {
                                                    content: 'right'
                                                }
                                            }
                                        ]
                                    }
                                }
                            };

                            var req = httpMocks.createRequest({
                                resource: resource,
                                user: user
                            });

                            var res = httpMocks.createResponse({
                                eventEmitter: require('events').EventEmitter
                            });

                            res.on('end', function() {
                                should(res.statusCode).be.equal(403);
                                done();
                            });

                            authenticationService.isGroupAuthorized(req, res, function() {
                                fail("Should not have been authorized")
                                done();
                            });

                        });
            });

        });

        it('should be allowed if the group is the same as the user email.', function (done) {

            new User({
                username: "tesUser",
                provider: "mock",
                firstName: "test",
                lastName: "test",
                email: "test@test.org",
                roles: [],
            }).save(function (err, user) {
                    new Group({
                        name: "wrong",
                        owner: user,
                        members: [
                            {
                                user: user,
                                permissions: []
                            }
                        ]
                    }).save(function (err, group) {
                            var resource = {
                                ValueSetDefinitionMsg: {
                                    valueSetDefinition: {
                                        sourceAndRole: [
                                            {
                                                source: {
                                                    content: user.email
                                                }
                                            }
                                        ]
                                    }
                                }
                            };

                            var req = httpMocks.createRequest({
                                resource: resource,
                                user: user
                            });

                            var res = httpMocks.createResponse({
                                eventEmitter: require('events').EventEmitter
                            });

                            authenticationService.isGroupAuthorized(req, res, function() {
                                done();
                            });

                        });
                });
        });

    });

});