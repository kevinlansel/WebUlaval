
UBeat.controller("PlayerController", ["$scope", "$rootScope", "$http", "HTTPService", "AuthenticationService", "NotificationService", function ($scope, $rootScope, $http, HTTPService, AuthenticationService, NotificationService) {

    var activeUrl = null;

    $scope.loaded = false;

    $scope.paused = true;
    $scope.muted = false;

    $scope.time = 0;
    $scope.timeFormated = "00:00/00:00";

    function n(n){
        return n > 9 ? "" + n: "0" + n;
    }

    function updateTime() {
        var val = Math.round($scope.wavesurfer.getCurrentTime(), 0);
        if (val != $scope.time) {
            $scope.time = val;
            var duration = Math.round($scope.wavesurfer.getDuration(), 0);
            var currentMinutes = Math.floor(val / 60);
            var currentSeconds = val - currentMinutes * 60;
            var totalMinutes = Math.floor(duration / 60);
            var totalSeconds = duration - totalMinutes * 60;
            $scope.timeFormated = n(currentMinutes) + ":" + n(currentSeconds) + "/" + n(totalMinutes) + ":" + n(totalSeconds);
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }
        }
    }

    $scope.$on('player:play', function(event, data) {
        $scope.loaded = false;
        data = "http://crossorigin.me/" + data;
        $scope.play(data)
    });

    $scope.muteToggle = function () {
        $scope.muted = !$scope.muted;
        $scope.wavesurfer.toggleMute();
    }


    $scope.$on('wavesurferInit', function (e, wavesurfer) {
        $scope.wavesurfer = wavesurfer;

        $scope.wavesurfer.on('play', function () {
            $scope.paused = false;
        });

        $scope.wavesurfer.on('pause', function () {
            $scope.paused = true;
        });

        $scope.wavesurfer.on('finish', function () {
            $scope.paused = true;
            $scope.wavesurfer.seekTo(0);
            $scope.$apply();
        });

        $scope.wavesurfer.on('audioprocess', updateTime);
        $scope.wavesurfer.on('seek', updateTime);
        $scope.wavesurfer.on('ready', function () {
            $scope.loaded = true;
            updateTime();
            $scope.wavesurfer.play();
        });

    });

    $scope.play = function (url) {
        if (!$scope.wavesurfer) {
            return;
        }
        activeUrl = url;

        $scope.wavesurfer.load(activeUrl);
    };

    $scope.isPlaying = function (url) {
        return url == activeUrl;
    };

}]);