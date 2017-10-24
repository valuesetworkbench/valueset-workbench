'use strict';

angular.module('core')
    .directive('disq',['$http', 'Authentication', 'Users', '$location', '$document', function() {
        return {
            templateUrl:'modules/core/directives/disq.client.view.html',
            restrict: 'E',
            replace: true,
            scope: {
                topic: '@topic',
                hideCount: '@hideCount'
            },
            controller: "DisqController"
        }
    }]).controller("DisqController",
        ['$scope', '$http', 'Authentication', 'Users', '$document', '$location', '$timeout',
            function($scope, $http, Authentication, Users, $document, $location, $timeout){
        var goTocommentId = $location.search().comment;

        $scope.people = [];

        Users.query(function(result) {
            angular.forEach(result, function(person) {
                if(person.username !== 'admin') {
                    person.label = person.displayName;
                    person.avatarUrl = person.photoUrl;
                    $scope.people.push(person);
                }
            });
        });

        $scope.$watch('topic', function() {
            var discussionId = $scope.topic;

            if(! discussionId) {
                return;
            }

            $http.get("/discussions/" + encodeURIComponent(discussionId)).then(function(response) {
                var discussion = response.data;

                if(goTocommentId) {
                    angular.forEach(discussion, function (comment) {
                        if ('comment-' + comment._id === goTocommentId) {
                            comment.alert = true;
                        }
                    });
                }

                $scope.discussion = discussion;

                if(goTocommentId) {
                    $timeout(function() {
                        $scope.hideCommentPrompt = false;

                        var someElement = $('#' + goTocommentId);
                        $document.scrollToElementAnimated(someElement);

                        $location.search('comment', null);

                        $timeout(function() {
                            $scope.hideCommentPrompt = true;
                        }, 5);

                    }, 0);
                }
            });

            $scope.postComment = function() {
                var currentUser = {
                    id: Authentication.user.username,
                    avatarUrl: Authentication.user.photoUrl,
                    name: Authentication.user.displayName
                };

                var comment = {
                    discussionId: discussionId,
                    comment: $scope.newComment,
                    authorAvatarUrl: currentUser.avatarUrl,
                    authorName: currentUser.name,
                    authorId: currentUser.id,
                    page: escape($location.path())
                };

                $http.post("/discussions/" + encodeURIComponent(discussionId), comment).then(function(response) {
                    $scope.discussion.push(response.data);
                    $scope.newComment = "";
                });
            };
        });

        $scope.getUsername = function(person) {
            return "@" + person.username;
        }

}]).config(['$provide', function($provide) {
    $provide.decorator('mentioMenuDirective', mentionMenuDecorator);
}]);

mentionMenuDecorator.$inject = ['$delegate'];

function mentionMenuDecorator($delegate) {
    var directive = $delegate[0];
    var link = directive.link;

    directive.compile = function() {
        return function($scope, $element) {
            var modal = $element.closest('.modal');

            link.apply(this, arguments);

            if (modal.length) {
                modal.append($element);
            }
        };
    };

    return $delegate;
}
