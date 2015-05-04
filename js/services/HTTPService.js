UBeat.factory('HTTPService', ['$http', '$location', 'AuthenticationService', function ($http, $location, AuthenticationService) {

    var url = 'https://ubeat.herokuapp.com';

    return {
        getAlbum: function (album_id) {
            return $http.get(url + '/albums/' + album_id);
        },
        getAlbumTracks: function (album_id) {
            return $http.get(url + '/albums/' + album_id + '/tracks')
        },
        getArtist: function (artist_id) {
            return $http.get(url + '/artists/' + artist_id)
        },
        getArtistAlbums: function (artist_id) {
            return $http.get(url + '/artists/' + artist_id + '/albums')
        },
        getPlaylists: function () {
            return $http.get(url + '/playlists/')
        },
        getPlaylist: function (playlist_id) {
            return $http.get(url + '/playlists/' + playlist_id)
        },
        createPlaylist: function (name, owner) {
            return $http.post(url + '/playlists', {
                name: name,
                owner: owner
            });
        },
        updatePlaylist: function (playlist_id, name, owner) {
            return $http.put(url + '/playlists/' + playlist_id, {
                name: name,
                owner: owner
            })
        },
        removePlaylist: function (playlist_id) {
            return $http.delete(url + '/playlists/' + playlist_id)
        },
        playlistAddTrack: function (playlist_id, track) {
            return $http.post(url + '/playlists/' + playlist_id + '/tracks', track);
        },
        playlistRemoveTrack: function (playlist_id, track_id) {
            return $http.delete(url + '/playlists/' + playlist_id + '/tracks/' + track_id);
        },
        signup: function (name, email, password) {
            return $http.post(url + '/signup', {
                name: name,
                email: email,
                password: password
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                }
            })
        },
        searchGlobal: function (query) {
            return $http.get(url + '/search?q=' + query);
        },
        getUser: function(id) {
            return $http.get(url + '/users/' + id);
        },
        setFollow: function (id_follow) {
            return $http.post(url + '/follow', {id: id_follow});
        },
        unfollow: function (id) {
          return $http.delete(url + '/follow/' + id);
        },
        searchAlbum: function (query) {
            return $http.get(url + '/search/albums?q=' + query);
        },
        searchArtist: function (query) {
            return $http.get(url + '/search/artists?q=' + query);
        },
        searchTrack: function (query) {
            return $http.get(url + '/search/tracks?q=' + query);
        },
        searchUser: function (query) {
            return $http.get(url + '/search/users?q=' + query);
        }
    }
}]);
