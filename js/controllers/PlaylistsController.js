UBeat.controller("PlaylistsController", ["$scope", "$http", "HTTPService", "AuthenticationService", "NotificationService", "$routeParams", "$rootScope",
    function ($scope, $http, HTTPService, AuthenticationService, NotificationService, $routeParams, $rootScope){

        var playlists = [];
        var owner = "owner@mail.com";

        $scope.init = function () {
            $scope.tracks = null;
            $scope.playlists = [];
            $scope.selectedPlaylist = {};
            $scope.newPlaylist = { name: "" };

            getPlaylists(function () {
                if (typeof $routeParams.playlist_id != "undefined") {
                    $scope.showTracks($routeParams.playlist_id);
                }
            });
        };

        function removePlaylist(playlistId) {
            HTTPService.removePlaylist(playlistId).then(function (result) {
                for (var index in playlists) {
                    var playlist = playlists[index];
                    if (playlist.id === playlistId) {
                        playlists.splice(index, 1);
                    }
                }
                for (var index in $scope.playlists) {
                    var playlist = $scope.playlists[index];
                    if (playlist.id === playlistId) {
                        $scope.playlists.splice(index, 1);
                    }
                }
            }, function (error) {
                NotificationService.error(error.statusText);
            });
        }

         function playlistRemoveTrack(playlistId, trackId) {
             HTTPService.playlistRemoveTrack(playlistId, trackId).then(function (result) {
                 for (var index in playlists) {
                     var playlist = playlists[index];
                     if (playlist.id === result.data.id) {
                         playlist.tracks = result.data.tracks;
                     }
                 }
                 $scope.showTracks(playlistId);
             }, function (error) {
                 NotificationService.error(error.statusText);
             });
         }

        function updatePlaylist(playlistItem) {
            HTTPService.updatePlaylist(playlistItem.id, playlistItem.name, owner).then(function (result) {
                for (var index in playlists) {
                    var playlist = playlists[index];
                    if (playlist.id === result.data.id) {
                        playlist.name = result.data.name;
                        playlistItem.name = result.data.name;
                        playlistItem.isDisabled = false;
                    }
                }
            }, function (error) {
                NotificationService.error(error.statusText);
            });
        }

        function createPlaylist(name) {
            HTTPService.createPlaylist(name, owner).then(function (result) {
                playlists.push(result.data);
                $scope.playlists.push({id: result.data.id, name: result.data.name});
                $scope.newPlaylist = { name: "" };
            }, function (error) {
                NotificationService.error(error.statusText);
            });
        }

        function getPlaylists(callback) {
            HTTPService.getPlaylists().then(function (result) {
                playlists = result.data;
                for (var index in playlists) {
                    var playlist = playlists[index];
                    if (typeof playlist.owner !== "undefined" && AuthenticationService.getUserId() == playlist.owner.id) {
                        $scope.playlists.push({id: playlist.id, name: playlist.name, isDisabled: false });
                    }
                }
                if (typeof callback !== "undefined") {
                    callback();
                }
            }, function (error) {
                NotificationService.error(error.statusText);
            });
        }

        $scope.showTracks = function (id) {
            var tracks = undefined;
            var selected = undefined;
            for (var index in playlists) {
                var playlist = playlists[index];
                if (playlist.id === id) {
                    tracks = playlist.tracks;
                }
            }
            for (var index in $scope.playlists) {
                var playlist = $scope.playlists[index];
                if (playlist.id === id) {
                    selected = playlist;
                }
            }
            if (typeof tracks !== "undefined" && typeof selected !== "undefined") {
                $scope.tracks = tracks;
                $scope.selectedPlaylist = selected;
                $("body").animate({scrollTop: 0});
            }
        };

        $scope.createPlaylist = function () {
            if ($scope.newPlaylist.name !== "") {
                createPlaylist($scope.newPlaylist.name);
            }
            else {
                NotificationService.error("The name is required");
            }
        };

        $scope.updatePlaylist = function (playlist) {
            if (typeof playlist !== "undefined" &&
                typeof playlist.id !== "undefined" &&
                playlist.name !== "") {
                updatePlaylist(playlist);
            }
            else {
                NotificationService.error("The required informmation are empty.");
            }
        };

        $scope.modifyTitlePlaylist = function (playlist) {
            playlist.isDisabled = true;
        };

        $scope.deleteTrack = function (playlistId, trackId) {
            playlistRemoveTrack(playlistId, trackId);
        };

        $scope.removePlaylist = function (playlistId) {
            removePlaylist(playlistId);
        };

        $scope.clearTracks = function () {
            $scope.tracks = null;
            $scope.selectedPlaylist = {};
        };

        $scope.playTrack = function(url) {
            $rootScope.$broadcast('player:play', url);
        }

    }
]);
