UBeat.factory('NotificationService', ['$http', function () {

    Messenger.options = {
        extraClasses: 'messenger-fixed messenger-on-bottom messenger-on-right',
        theme: 'air'
    };

    return {
        info: function (message) {
            Messenger().post({
                message: message,
                type: 'info',
                showCloseButton: true
            });

        },
        error: function (message) {
            Messenger().post({
                message: message,
                type: 'error',
                showCloseButton: true
            });

        },
        success: function (message) {
            Messenger().post({
                message: message,
                type: 'success',
                showCloseButton: true
            });

        }
    }
}]);
