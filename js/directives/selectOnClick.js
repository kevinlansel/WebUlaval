UBeat.directive('selectOnClick', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on('click', function () {
                $("input", $(this).parent().parent()).select();
            });
        }
    };
});
