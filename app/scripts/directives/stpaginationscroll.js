/**
 * ----------------------------------------------------------------------------
 * LICENSE
 *
 * This file is part of Flyve MDM Web Dashboard.
 *
 * Flyve MDM Web Dashboard is a subproject of Flyve MDM. Flyve MDM is a mobile
 * device management software.
 *
 * Flyve MDM Web Dashboard is free software: you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 3
 * of the License, or (at your option) any later version.
 *
 * Flyve MDM Web Dashboard is distributed in the hope that it will be useful
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * -----------------------------------------------------------------------------
 * @author    Alexander Salas - asalas@teclib.com
 * @copyright Copyright (c) 2017 Flyve MDM
 * @license   AGPLv3 https://www.gnu.org/licenses/agpl-3.0.html
 * @link      https://github.com/flyve-mdm/legacy-web-dashboard/
 * @link      http://www.glpi-project.org/
 * @link      https://flyve-mdm.com/
 * -----------------------------------------------------------------------------
 */

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
