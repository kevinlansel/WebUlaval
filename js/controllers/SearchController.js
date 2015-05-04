/**
 * Created by grizet_j on 3/27/2015.
 */
UBeat.controller('SearchController', ['$scope', 'md5', '$location', '$rootScope', '$routeParams','HTTPService', "NotificationService", "AuthenticationService",
    function ($scope, md5, $location, $rootScope, $routeParams, HTTPService, NotificationService, AuthenticationService) {

    var init_search = function (query) {
        HTTPService.searchGlobal(query).success(function (res) {
            $scope.result = {artist: [], track: [], collection: [], user: []};
            $scope.search_type = "";
            $scope.result_count = res.resultCount;
            for (var i = 0; i < res.resultCount; i++) {
                var r = res.results[i];
                var row = {};
                switch (r.wrapperType) {
                    case "artist":
                        row.name = r.artistName;
                        row.link = "#/artists/" + r.artistId;
                        row.ico = "img/artist_ico.png";
                        row.hasButton = false;
                        $scope.result["artist"].push(row);
                        break;
                    case "track":
                        row.object = r;
                        row.name = r.trackName;
                        row.link = "#/albums/" + r.collectionId;
                        row.ico = r.artworkUrl100;
                        row.hasButton = true;
                        row.typeButton = "track";
                        row.btn_text = "Play";
                        row.url = r.previewUrl;
                        $scope.result["track"].push(row);
                        break;
                    case "collection":
                        row.name = r.collectionName;
                        row.link = "#/albums/" + r.collectionId;
                        row.ico = r.artworkUrl100;
                        row.hasButton = false;
                        $scope.result["collection"].push(row);
                        break;
                    case "user":
                        row.name = r.userName;
                        row.link = "#/users/" + r.userId;
                        row.ico = "http://www.gravatar.com/avatar/" + md5.createHash(r.email || '');
                        row.hasButton = true;
                        row.typeButton = "user";
                        row.btn_text = "Follow";
                        row.id = r.userId;
                        $scope.result["user"].push(row);
                        break;
                    default :
                        break;
                }
            }
            loadPlaylists();
        }).error(function (err) {
            NotificationService.error("Search error. Error code :" + err.errorCode);
        });
    };


    var init_artist = function(query) {
        HTTPService.searchArtist(query).then(function(res) {
            $scope.display_type = "Artists";
            $scope.search_type = "artist";
            $scope.result_count = res.data.resultCount;
            $scope.result = {artist: []};
            for (var i = 0; i < res.data.resultCount; i++)
            {
                var artist = res.data.results[i];
                var row = {};
                row.name = artist.artistName;
                row.link = "#/artists/" + artist.artistId;
                row.ico = "img/artist_ico.png";
                row.hasButton = false;
                $scope.result["artist"].push(row);
            }
            $scope.isLoading = false;
        }, function (error) {
            NotificationService.error(error.statusText);
        });
    };

    var init_album = function(query) {
        HTTPService.searchAlbum(query).then(function(res) {
            $scope.display_type = "Albums";
            $scope.search_type = "album";
            $scope.result_count = res.data.resultCount;
            $scope.result = {collection: []};
            for (var i = 0; i < res.data.resultCount; i++)
            {
                var r = res.data.results[i];
                var row = {};
                row.name = r.collectionName;
                row.link = "#/albums/" + r.collectionId;
                row.ico = r.artworkUrl100;
                row.hasButton = false;
                $scope.result["collection"].push(row);
            }
            $scope.isLoading = false;
        }, function (error) {
            NotificationService.error(error.statusText);
        });
    };

        $scope.play = function(url)
        {
            $rootScope.$broadcast('player:play', url);
        };

        var init_track = function(query) {
            HTTPService.searchTrack(query).then(function(res) {
                $scope.display_type = "Tracks";
                $scope.search_type = "track";
                $scope.result_count = res.data.resultCount;
                $scope.result = {track: []};
                for (var i = 0; i < res.data.resultCount; i++)
                {
                    var r = res.data.results[i];
                    var row = {};
                    row.object = r;
                    row.name = r.trackName;
                    row.link = "#/albums/" + r.collectionId;
                    row.ico = r.artworkUrl100;
                    row.hasButton = true;
                    row.typeButton = "track";
                    row.btn_text = "Play";
                    row.url = r.previewUrl;
                    $scope.result["track"].push(row);
                }
                loadPlaylists();
            }, function (error) {
                NotificationService.error(error.statusText);
            });
        };

        $scope.follow = function (r) {
            HTTPService.setFollow(r.id).then(function (result) {
                NotificationService.success("You follow him with success");
                r.btn_text = "Unfollow";
                r.btn_callback = $scope.unfollow;
                r.btn_class = "unfollow";
                r.alreadyFollow = true;
                $scope.apply();
            }, function (error) {
                NotificationService.error(error.statusText);
            });
        };

        $scope.unfollow = function (r) {
            HTTPService.unfollow(r.id).then(function (result) {
                NotificationService.success("You unfollow him with success");
                r.btn_text = "Follow";
                r.btn_callback = $scope.follow;
                r.btn_class = "follow";
                r.alreadyFollow = false;
                $scope.apply();
            }, function (error) {
                NotificationService.error(error.statusText);
            });
        };

        var userID = AuthenticationService.getUserId();
        var following = [];
        HTTPService.getUser(userID).then(function (result) {
            var user = result.data;
            following = user.following;
        });
        var isFollowing = function(id) {
            for (var f in following)
            {
                if (following[f].hasOwnProperty("id") && following[f].id == id) {
                    return true;
                }
            }
            return false;
        };

        var init_user = function(query) {
        HTTPService.searchUser(query).then(function(res) {
            $scope.display_type = "Users";
            $scope.search_type = "user";
            $scope.result_count = res.data.length;
            $scope.result = {user: []};
            for (var i = 0; i < res.data.length; i++)
            {
                var r = res.data[i];
                var row = {};
                row.name = r.name;
                row.link = "#/users/" + r.id;
                row.ico = "http://www.gravatar.com/avatar/" + md5.createHash(r.email || '');
                row.hasButton = true;
                row.typeButton = "user";
                if (isFollowing(r.id) === true) {
                    row.btn_text = "Unfollow";
                    row.btn_class = "unfollow";
                    row.alreadyFollow = true;
                }
                else {
                    row.btn_text = "Follow";
                    row.btn_class = "follow";
                    row.alreadyFollow = false;
                }
                row.id = r.id;
                $scope.result["user"].push(row);
            }
            $scope.isLoading = false;
        }, function (error) {
            NotificationService.error(error.statusText);
        });
    };


    $scope.onSearch = function() {
        window.location.href = "#/search?type=" + $scope.search_type + "&query=" + $scope.search_query;
    };

    function loadPlaylists() {
        HTTPService.getUser(AuthenticationService.getUserId()).then(function (result) {
            var currentUser = result.data;

            HTTPService.getPlaylists().then(function (result) {
                var playlists = result.data;

                for (var list in playlists) {
                    if (typeof playlists[list].owner !== "undefined" && currentUser.id == playlists[list].owner.id) {
                        $scope.playlists.push({id: playlists[list].id, name: playlists[list].name});
                    }
                }
                $scope.isLoading = false;
            }, function (error) {
                NotificationService.error(error.statusText);
            });
        }, function (error) {
            NotificationService.error(error.statusText);
        });
    }

    $scope.addToPlaylist = function(objectMusic) {
        if ($("#playlistSelect" + objectMusic.trackId).val() != "") {
            HTTPService.playlistAddTrack($("#playlistSelect" + objectMusic.trackId).val(), objectMusic).then(function (dataAlbum) {
                NotificationService.success("Track added to playlist");
            }, function (error) {
                NotificationService.error("Cannot add track to playlist");
            });
        }
        else
        {
            NotificationService.error("Please select a playlist before submitting the form");
        }
    }

    var search = $location.search();
    $scope.result = [];
    $scope.playlists = [];
    $scope.search_query = search.query;
    $scope.display_query = search.query;
    $scope.isLoading = true;
    $scope.currentUserId = AuthenticationService.getUserId();
    if (typeof search === "undefined" || typeof search.query === "undefined")
    {
        $scope.search_query = "Type here";
        $scope.display_query = "";
        $scope.display_type = "";
        $scope.search_type = "";
        return;
    }
    if (search.type === "artist")
        init_artist(search.query);
    else if (search.type === "album")
        init_album(search.query);
    else if (search.type === "track")
        init_track(search.query);
    else if (search.type === "user")
        init_user(search.query);
    else
        init_search(search.query);

}]);