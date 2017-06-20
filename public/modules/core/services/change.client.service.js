'use strict';

//Menu service used for managing  menus
angular.module('core').service('Change', [

	function() {

		function ChangeHolder() {
			this.changes = [];
			this.observers = [];
			this.deleted = {};

			this.isDirty = function () {
				return this.changes.length > 0;
			}

			// type is either update, create, or delete
			this.addChange = function (uri, resource, isDelete) {
				var previousChanges = this.changes.length;

				var change = _.find(this.changes, function (change) {
					return change.uri === uri;
				});

				if(change) {
					if(change.isDelete) {
						var href = change.resource.href;
						change.resource = resource;
						change.resource.href = href;
					}

					change.resource = resource;
					change.isDelete = isDelete;
				} else {
					this.changes.push({uri: uri, resource: resource, isDelete: isDelete});
				}

				if(previousChanges === 0) {
					_.forEach(this.observers, function (fn) {
						fn(true);
					});
				}
			}

			this.reset = function() {
				this.deleted = {}
				this.changes = [];

				_.forEach(this.observers, function (fn) {
					fn(false);
				});
			}

			this.getChanges = function() {
				return this.changes;
			}

			this.observe = function (observer) {
				this.observers.push(observer)
			}
		}

		this.newChangeHolder = function () {
			return new ChangeHolder();
		}

	}
]);
