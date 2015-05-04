UBeat.controller('HeaderController', ['$scope', '$location', 'AuthenticationService', 'NotificationService', function ($scope, $location, AuthenticationService, NotificationService) {

    $scope.loggedIn = AuthenticationService.isLoggedIn();
    $scope.userId = AuthenticationService.getUserId();
    $scope.username = AuthenticationService.getUsername();
    $scope.searchValue = { content: "" };
    $scope.displayMenu = false;

    $scope.$on('user:login', function(event, data) {
        $scope.loggedIn = true;
        $scope.userId = AuthenticationService.getUserId();
        $scope.username = AuthenticationService.getUsername();
    });

    $scope.$on('user:logout', function(event, data) {
        $scope.loggedIn = false;
        $scope.username = null;
        $scope.userId = null;
    });

    $scope.logout = function () {
        AuthenticationService.logout();
        NotificationService.success("You are now logged out !");
        $location.path('/');
    }

    $scope.menuClick = function() {
        $scope.displayMenu = !$scope.displayMenu;
    }

    $scope.searchElement = function() {
        window.location.href = "#/search?type=" + "global" + "&query=" + $scope.searchValue.content;
        $scope.displayMenu = false;
        $scope.searchValue.content = "";
    }
}]);
