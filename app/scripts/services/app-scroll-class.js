(function () {
  'use strict';
  angular.module('appShell')
    /** Directive which applies a specified class to the element when being scrolled */
    .directive('appScrollClass', function () {
      return {
        restrict: 'A',
        link: function (scope, element, attr) {
          var scrollParent = element.parent();
          var isScrolling = false;
          function updateState() {
            var newState = scrollParent[0].scrollTop !== 0;
            if (newState !== isScrolling) {
              element.toggleClass(attr.appScrollClass, newState);
            }
            isScrolling = newState;
          }
          // Initial update of the state.
          updateState();
          // Register a scroll listener, which updates the state.
          scrollParent.on('scroll', updateState);
        }
      };
    });
});