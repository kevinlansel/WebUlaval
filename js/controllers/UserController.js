UBeat.controller('UserController', ['$scope', '$location', 'HTTPService', 'AuthenticationService', 'NotificationService', function ($scope, $location, HTTPService, AuthenticationService, NotificationService) {

    $scope.username = "";
    $scope.password = "";

    if (AuthenticationService.isLoggedIn()) {
        NotificationService.info("You are already logged in");
        $location.path("/");
    }

    $scope.performLogin = function () {
        AuthenticationService.login($scope.username, $scope.password, function (valid) {
            if (valid) {
                NotificationService.success("You are now logged in.");
                reset();
                $location.path('/');
            } else {
                $scope.password = "";
                NotificationService.error("Incorrect username or password.");
            }
        });
    };

    $scope.performSignup = function () {
        HTTPService.signup($scope.name, $scope.username, $scope.password).success(function (data, status) {
            NotificationService.success("Your account has been created. You can now login !");
            reset();
            $location.path('/');
        }).error(function (data, status) {
            $scope.password = "";
            NotificationService.error("An error occured during signup (This error can be generated because your email address is already in use)");
        });
    };

    function reset() {
        $scope.username = "";
        $scope.password = "";
    }

}]);
