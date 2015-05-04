UBeat.controller('AlbumController', ['$scope', '$rootScope', '$routeParams', 'HTTPService', '$sce', 'NotificationService', 'AuthenticationService', '$location', function ($scope, $rootScope, $routeParams, HTTPService, $sce, notificationService,  AuthenticationService, $location) {

    $scope.id = $routeParams.album_id;
    $scope.playlists = [];
    $scope.display = false;
    $scope.isLoading = true;
    $scope.selectedItem = null;
    $scope.selectedPlaylist = { id: null };

    function getAlbum() {
        HTTPService.getAlbumTracks($scope.id).then(function (dataAlbumTracks) {
            $scope.tracks = [];
            $scope.saveTracks = [];
            dataAlbumTracks.data.results.forEach(function(entry) {
                entry.duration = moment(entry.trackTimeMillis).format('mm:ss');
                $scope.tracks.push(entry);
                $scope.saveTracks.push(entry);
            });
            $scope.isLoading = false;
        }, function (error) {
            notificationService.error("Error while fetching album tracks");
            $location.path("/");
        });


        HTTPService.getAlbum($scope.id).then(function (dataAlbum) {
            $scope.name = dataAlbum.data.results[0].collectionName;
            $scope.image = dataAlbum.data.results[0].artworkUrl100;
            $scope.genre = dataAlbum.data.results[0].primaryGenreName;
            $scope.releaseDate = moment(dataAlbum.data.results[0].releaseDate).locale('fr').format('Do MMMM YYYY');
            $scope.itunesLink =  dataAlbum.data.results[0].collectionViewUrl;
            $scope.artist = dataAlbum.data.results[0].artistName;
            $scope.artistId = dataAlbum.data.results[0].artistId;
        }, function (error) {
            notificationService.error("Error while fetching album");
            $location.path("/");
        });
    }

    function getPlaylists() {
        HTTPService.getPlaylists().then(function (result) {
            var playlists = [];
            playlists = result.data;

            var id = AuthenticationService.getUserId();
            for (var list in playlists) {
                if (typeof playlists[list].owner !== "undefined" && id == playlists[list].owner.id) {
                    $scope.playlists.push({id: playlists[list].id, name: playlists[list].name});
                }
            }


        }, function (error) {
            notificationService.error("Error while fetching playlists");
        });
    }

    $scope.addTrackToPlaylist = function(track)
    {
        $scope.display = true;
        $scope.selectedItem = {
            name : track.name,
            type : "track",
            track : track
        }
    }

    $scope.addAlbumToPlaylist = function()
    {
        $scope.display = true;
        $scope.selectedItem = {
            name : $scope.name,
            type : "album"
        }
    }

    $scope.play = function (url) {
        $rootScope.$broadcast('player:play', url);
    }

    $scope.addToPlaylist = function()
    {
        if ($scope.selectedPlaylist.id != null)
        {
            if ($scope.selectedItem.type == "track")
            {
                HTTPService.playlistAddTrack($scope.selectedPlaylist.id, $scope.selectedItem.track).then(function (dataAlbum) {
                    notificationService.success("Track added to playlist !");
                }, function (error) {
                    notificationService.error("Error while adding track");

                });
            }
            else
            {
                $scope.saveTracks.forEach(function(entry) {
                    HTTPService.playlistAddTrack($scope.selectedPlaylist.id, entry).then(function (dataAlbum) {
                        notificationService.success("Album added to playlist !");
                    }, function (error) {
                        notificationService.error("Error while adding album");
                    });
                });
            }
            $scope.display = false;
        }
        else
        {
            notificationService.error("Please select a playlist before submitting the form");
        }

    }

    getPlaylists();
    getAlbum();
}]);
