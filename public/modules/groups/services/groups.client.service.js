'use strict';

//Groups service used to communicate Groups REST endpoints
angular.module('groups').factory('Groups', ['$resource', 'Authentication',
	function($resource, Authentication) {
		var resourceApi = $resource('groups/:groupId', { groupId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});

		resourceApi.hasCreatePermission = function(group) {
			return _.flatten(_.map(_.filter(group.members, function (member) {
					return member.user == Authentication.user._id;
				}), function (group) {
					return group.permissions;
				})).indexOf('Create') != -1;
		}

		resourceApi.hasAnyCreatePermission = function (groups) {
			return !!_.find(groups, resourceApi.hasCreatePermission);
		}

		return resourceApi;
	}
]);