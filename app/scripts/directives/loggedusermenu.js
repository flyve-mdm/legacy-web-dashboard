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
 * @name FlyveMDM.directive:loggedUserMenu
 * @description
 * # loggedUserMenu
 */
angular.module('FlyveMDM')
  .directive('loggedUserMenu', function () {
    return {
      templateUrl: 'views/loggedusermenu.html',
      restrict: 'E',
      link: function postLink(scope) {
        scope.opened = false;
        scope.fabModOpened = false;
        angular.element(document.querySelector('nav > ul.menu')).css({
        });
        scope.$watch('fabModOpened', function (opened) {
          if (opened) {
            angular.element(document.querySelector('nav > ul.menu')).removeClass('fab-usermenu-closed');
          } else {
            angular.element(document.querySelector('nav > ul.menu')).addClass('fab-usermenu-closed');
          }
        });
      },
      scope: {},
      controller: function ($scope, AuthProvider) {
        var handleClickOutside = function () {
          $scope.$apply(function () {
            $scope.forceClose();
          });
        };
        $scope.toggleOpened = function ($event) {
          $event.stopPropagation();
          $scope.opened = !$scope.opened;
          if ($scope.opened) {
            angular.element(document.querySelector('html')).on('click', handleClickOutside);
          }
        };
        $scope.forceClose = function () {
          $scope.opened = false;
          angular.element(document.querySelector('html')).off('click', handleClickOutside);
          return true;
        };
        $scope.disconnect = function () {
          AuthProvider.logout().then(function () {
            AuthProvider.showLogin();
          });
        };
        $scope.$on('$destroy', function () {
          angular.element(document.querySelector('html')).off('click', handleClickOutside);
        });
      }
    };
  });
