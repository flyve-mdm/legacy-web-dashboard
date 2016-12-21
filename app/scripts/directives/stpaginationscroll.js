'use strict';
/**
 * @ngdoc directive
 * @name FlyveMDM.directive:stPaginationScroll
 * @description
 * # stPaginationScroll
 */
angular.module('FlyveMDM')
  .directive('flyveTable', ['$timeout', '$q', function (timeout) {
    return {
      require: 'stTable',
      link: function (scope, element, attr, ctrl) {
        var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        var html = angular.element(document.querySelector('html'));
        var body = angular.element(document.body);
        var viewport = angular.element(document.querySelector('viewport'));
        var container = angular.element(element.parent().parent());
        var tableState = ctrl.tableState();
        var pagination = tableState.pagination;
        var lineHeight = 50;
        var viewportPaddingBottom = parseInt(viewport.css('padding-bottom').split('px')[0]);
        var baseHeight, remainingHeight, itemsByPage;
        var calibrate = function () {
          baseHeight = element[0].getBoundingClientRect().top + document.querySelector('thead').offsetHeight;
          remainingHeight = body[0].clientHeight - baseHeight;
          // 3 more in order to var space to scroll
          itemsByPage = Math.floor(remainingHeight / lineHeight) + 3;
          tableState.pagination.number = itemsByPage;
        };
        var fetchNextPage = function () {
          //call next page
          ctrl.slice(pagination.start + pagination.number, pagination.number);
        };
        var promise = null;
        var handleScroll = function () {
          var invisibleHeight;
          if (isFirefox) {
            invisibleHeight = html[0].scrollHeight - (html[0].clientHeight + html[0].scrollTop);
          } else {
            invisibleHeight = body[0].scrollHeight - (body[0].clientHeight + body[0].scrollTop);
          }
          var readingLastOne = invisibleHeight <= lineHeight + viewportPaddingBottom &&
            invisibleHeight !== 0; // protecting at initialization
          var pastEnd = pagination.start + pagination.number >= pagination.totalItemCount;
          // adding the correct class to display the table header in
          // fixed mode after the header has been scrolled-out of
          // the display
          if (body[0].scrollTop >= baseHeight - 20) {
            body.addClass('has-fixed-header');
            container.addClass('fixed-header');
          } else {
            body.removeClass('has-fixed-header');
            container.removeClass('fixed-header');
          }
          if (readingLastOne && !pastEnd) {
            // if there is already a timer running which
            // has no expired yet we have to cancel
            // it and restart the timer
            if (promise !== null) {
              timeout.cancel(promise);
            }
            promise = timeout(function () {
              fetchNextPage();
              promise = null;
            }, 400);
          }
        };
        var afterResizeTimer = null;
        angular.element(window).on('resize', function () {
          if (afterResizeTimer !== null) {
            timeout.cancel(afterResizeTimer);
          }
          afterResizeTimer = timeout(function () {
            calibrate();
            var currentNDisplayedElems = element.find('tbody tr').length;
            if (currentNDisplayedElems !== pagination.totalItemCount &&
              currentNDisplayedElems < itemsByPage) {
              pagination.start = 0;
              fetchNextPage();
            }
          }, 400);
        });
        calibrate();
        angular.element(window).on('scroll', handleScroll);
        scope.$on('$destroy', function () {
          angular.element(window).off('scroll', handleScroll);
        });
      }
    };
  }]);
