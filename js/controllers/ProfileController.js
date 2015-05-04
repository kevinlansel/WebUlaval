/**
 * Created by kevin_000 on 27/03/2015.
 */

UBeat.controller("ProfileController", ["$scope", '$location', 'md5', "$http", "HTTPService", "AuthenticationService", "NotificationService", "$routeParams",
    function ($scope, $location, md5, $http, HTTPService, AuthenticationService, NotificationService, $routeParams) {
        var user;
        var currentUser;
        $scope.init = function() {
            $scope.email = "";
            $scope.name = "";
            $scope.id = "";
            $scope.gravatar = "";
            $scope.following = [];
            $scope.alreadyFollow = false;
            $scope.isSameUser = false;
            $scope.playlists = [];

            getUser( (typeof $routeParams.user_id != "undefined" ?  $routeParams.user_id : AuthenticationService.getUserId()) );
        };

        function getUser(id) {
            HTTPService.getUser(id).then(function (result) {
                user = result.data;

                $scope.email = user.email;
                $scope.name = user.name;
                $scope.id = user.id;
                $scope.gravatar = md5.createHash($scope.email || '');

                for (var follower in user.following) {
                    $scope.following.push({"email" : user.following[follower].email,
                        "name" : user.following[follower].name,
                        "id" : user.following[follower].id});
                }
                getCurrentUser(AuthenticationService.getUserId());
                getUserPlaylists();
            }, function (error) {
                NotificationService.error(error.statusText);
                $location.path("/");
            });
        }

        function getCurrentUser(id) {
            HTTPService.getUser(id).then(function (result) {
                currentUser = result.data;
                if (currentUser.id == user.id) {
                    $scope.isSameUser = true;
                }

                for (var follower in currentUser.following) {
                    if ($scope.id == currentUser.following[follower].id) {
                        $scope.alreadyFollow = true;
                    }
                }
            }, function (error) {
                NotificationService.error(error.statusText);
            });
        }

        function getUserPlaylists() {
            HTTPService.getPlaylists().then(function (result) {
                var playlists = result.data;

                for (var list in playlists) {
                    if (typeof playlists[list].owner !== "undefined" && user.id == playlists[list].owner.id) {
                        $scope.playlists.push({id: playlists[list].id, name: playlists[list].name});
                    }
                }
            }, function (error) {
                NotificationService.error(error.statusText);
            });
        }

        function follow(id) {
            HTTPService.setFollow(id).then(function (result) {
                NotificationService.success("You follow him with success");
            }, function (error) {
                NotificationService.error(error.statusText);
            });
        }

        function unfollow (id) {
            HTTPService.unfollow(id).then(function (result) {
                NotificationService.success("You unfollow him with success");
            }, function (error) {
                NotificationService.error(error.statusText);
            });
        }

        $scope.follow = function () {
            follow($scope.id);
            $scope.alreadyFollow = true;
        };

        $scope.unfollow = function () {
            unfollow($scope.id);
            $scope.alreadyFollow = false;
        };

    }
]);