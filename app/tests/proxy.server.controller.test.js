'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	proxyService = require('../controllers/proxy.server.controller');

/**
 * Globals
 */
var user, service;

/**
 * Unit tests
 */
describe('Proxy Controller Unit Tests:', function () {

	describe('Subresource Regex', function () {
		it('should find a value set definition href from a resolution', function(done) {
			var definition = proxyService.getDelegateResource('http://test.org/valueset/foo/definition/1/resolution')

			should(definition).be.equal('http://test.org/valueset/foo/definition/1');

			done();
		});

		it('should find a map version href from map entries', function(done) {
			var mapversion = proxyService.getDelegateResource('http://test.org/map/foo/version/1/entries')

			should(mapversion).be.equal('http://test.org/map/foo/version/1');

			done();
		});

		it('should find a map version href from map entries with query', function(done) {
			var mapversion = proxyService.getDelegateResource('http://test.org/map/foo/version/1/entries?q=foo')

			should(mapversion).be.equal('http://test.org/map/foo/version/1');

			done();
		});

		it('should find nothing from a value set definition', function(done) {
			var definition = proxyService.getDelegateResource('http://test.org/valueset/foo/definition/1')

			should(definition).be.undefined;

			done();
		});

		it('should find a value set definition from value set definition entries', function(done) {
			var definition = proxyService.getDelegateResource('http://test.org/valueset/foo/definition/1/entries')

			should(definition).be.equal('http://test.org/valueset/foo/definition/1');

			done();
		});

		it('should find a value set definition from value set definition entities', function(done) {
			var definition = proxyService.getDelegateResource('http://test.org/valueset/foo/definition/1/entities')

			should(definition).be.equal('http://test.org/valueset/foo/definition/1');

			done();
		});

		it('should find a value set definition from value set definition entities with a query', function(done) {
			var definition = proxyService.getDelegateResource('http://test.org/valueset/foo/definition/1/entities?q=test')

			should(definition).be.equal('http://test.org/valueset/foo/definition/1');

			done();
		});

		it('should find nothing from a map version', function(done) {
			var definition = proxyService.getDelegateResource('http://test.org/map/foo/version/1')

			should(definition).be.undefined;

			done();
		});
	});

});