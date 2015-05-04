var UBeat = angular.module('UBeat', [
    'ngCookies',
    'ngRoute',
    'mm.foundation',
    "angular-md5"
]);

UBeat.config(['$routeProvider', '$sceDelegateProvider', '$httpProvider',
    function($routeProvider, $sceDelegateProvider, $httpProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'js/views/index.html',
                controller: 'HomeController'
            }).
            when('/login', {
                templateUrl: 'js/views/login.html',
                controller: 'UserController'
            }).
            when('/signup', {
                templateUrl: 'js/views/signup.html',
                controller: 'UserController'
            }).
            when('/artists/:artist_id', {
                templateUrl: 'js/views/artist_details.html',
                controller: 'ArtistController'
            }).
            when('/users/:user_id', {
                templateUrl: 'js/views/profile.html',
                controller: 'ProfileController'
            }).
            when('/albums/:album_id', {
                templateUrl: 'js/views/album_details.html',
                controller: 'AlbumController'
            }).
            when('/search', {
                templateUrl: 'js/views/search.html',
                controller: 'SearchController'
            }).
            when('/playlists', {
                templateUrl: 'js/views/playlists.html',
                controller: 'PlaylistsController'
            }).
            when('/playlists/:playlist_id', {
                templateUrl: 'js/views/playlist.html',
                controller: 'PlaylistController'
            }).
            otherwise({
                redirectTo: '/'
            });

        $sceDelegateProvider.resourceUrlWhitelist([
            // Allow same origin resource loads.
            'self',
            'http://**.**.apple.com/**',
            '**',
            '*'
        ]);

        $httpProvider.interceptors.push(['$q', '$location', function($q, $location) {
            return {
                'responseError': function(rejection) {
                    // do something on error
                    if (rejection.status == 401 && $location.path() !== "/login" && $location.path() !== "/signup") {
                        Messenger().post({
                            message: "You need to be connected to access to this page.",
                            type: 'error',
                            showCloseButton: true
                        });
                        $location.path('/login');
                    }
                    return $q.reject(rejection);
                }
            };
        }]);

    }]);
