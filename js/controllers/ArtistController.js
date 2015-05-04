UBeat.controller('ArtistController', ['$scope', '$routeParams', 'HTTPService', 'NotificationService', function ($scope, $routeParams, HTTPService, NotificationService) {

    var id = $routeParams.artist_id;
    var init_artist = function() {
        HTTPService.getArtist(id).then(function(result)
            {
                var data = result.data;
                if (data["resultCount"] !== 0)
                {
                    $scope.name = data["results"][0]["artistName"];
                    $scope.genre = data["results"][0]["primaryGenreName"];
                    $scope.itune_link = data["results"][0]["artistLinkUrl"];

                    HTTPService.getArtistAlbums(id).then(function(result) {
                        var data = result.data;
                        for (var i = 0; i < data["resultCount"]; i++)
                        {
                            var a = {
                                id: data["results"][i]["collectionId"],
                                name: data["results"][i]["collectionName"],
                                img: data["results"][i]["artworkUrl100"],
                                date: moment(data["results"][i]["releaseDate"]).locale("fr").format("D MMMM YYYY"),
                                country: data["results"][i]["country"],
                                copyright: data["results"][i]["copyright"]
                            };
                            $scope.albums.push(a);
                        }
                        $scope.isLoading = false;
                    });
                }
             }
        , function (error)
            {
                NotificationService.error("Cannot fetch artist :" + error.statusText);
            });
    };

    /* Default values */
    $scope.name = "Artist";
    $scope.image = "";
    $scope.genre = "Genre";
    $scope.itune_link = "#";
    $scope.bio = "Bio";
    $scope.albums = [];
    $scope.isLoading = true;

    init_artist();
}]);
