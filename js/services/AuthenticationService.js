UBeat.factory('AuthenticationService', ['$http', '$cookies', '$rootScope', 'NotificationService', function ($http, $cookies, $rootScope, NotificationService) {

    var url = 'https://ubeat.herokuapp.com';

    var loggedIn = false;
    var userId = false;
    var username = "";

    if (typeof $cookies.UBeatSession !== "undefined" && typeof $cookies.UBeatUser !== "undefined" && typeof $cookies.UBeatUsername !== "undefined") {
        $http.defaults.headers.common.Authorization = $cookies.UBeatSession;
        loggedIn = true;
        userId = $cookies.UBeatUser;
        username = $cookies.UBeatUsername;
    }

    return {
        login: function (email, password, cb) {
            $http.post(url + '/login', {
                email: email,
                password: password
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                }
            }).success(function (data, status) {
                loggedIn = true;
                $http.defaults.headers.common.Authorization = data.token;
                $cookies.UBeatSession = data.token;
                $cookies.UBeatUser = data.id;
                $cookies.UBeatUsername = data.name;
                userId = data.id;
                username = data.name;
                $rootScope.$broadcast('user:login');
                cb(true);
            }).error(function (data, status) {
                cb(false);
            })
        },
        getUserId: function () {
            return (userId);
        },
        getUsername: function () {
            return (username);
        },
        isLoggedIn: function () {
            return (loggedIn);
        },
        logout: function () {
            loggedIn = false;
            userId = false;
            delete $cookies.UBeatSession;
            delete $cookies.UBeatUser;
            delete $http.defaults.headers.common.Authorization;
            $rootScope.$broadcast('user:logout');
        }
    }
}]);
