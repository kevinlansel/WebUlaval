/**
 * Created by kevin_000 on 12/04/2015.
 */

UBeat.controller("PlaylistController", ["$scope", "$location", "HTTPService", "AuthenticationService", "NotificationService", "$routeParams",
    function ($scope, $location, HTTPService, AuthenticationService, NotificationService, $routeParams){

        $scope.init = function () {
            $scope.tracks = null;
            $scope.playlist = {};
            $scope.playlistId = $routeParams.playlist_id;

            getPlaylist();
        };

        function getPlaylist() {
            HTTPService.getPlaylist($scope.playlistId).then(function (result) {
                $scope.playlist = result.data;
                $scope.tracks = $scope.playlist.tracks;
            }, function (error) {
                NotificationService.error(error.statusText);
                $location.path("/");
            });
        }
    }
]);
