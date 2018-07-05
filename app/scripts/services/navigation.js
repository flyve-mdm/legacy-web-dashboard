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
 * @ngdoc service
 * @name FlyveMDM.navigation
 * @description
 * # navigation
 * Provider in the FlyveMDM.
 */
angular.module('FlyveMDM')
  .directive('flyveNavigation', function (AuthProvider) {
    var disabled_routes = ['login'];
    return {
      restrict: 'A',
      templateUrl: 'views/navigation.html',
      link: function (scope, element, attr, ctrl) {
        scope.visible = false;
        scope.smallForced = false;
        var body = angular.element(document.body);
        // $watch'ing $scope.visible now in order to
        // maintain the correct classes applied on
        // the directive's element
        scope.$watch('visible', function (visible_boolean) {
          if (visible_boolean) {
            body.removeClass('nav-invisible');
          } else {
            body.addClass('nav-invisible');
          }
        });
        scope.$watch('smallForced', function (small_boolean) {
          if (small_boolean) {
            body.addClass('nav-forced-small');
          } else {
            body.removeClass('nav-forced-small');
          }
        });
        // enabling display only on non disabled routes using the controller method
        scope.$on('$stateChangeSuccess', function (ev, toState) {
          if (disabled_routes.indexOf(toState.name) > -1 || !AuthProvider.seemsLogged()) {
            ctrl.setVisible(false);
          } else {
            ctrl.setVisible(true);
          }
        });
      },
      controller: function ($scope) {
        this.toggleSmall = function () {
          $scope.smallForced = !$scope.smallForced;
        };
        this.setVisible = function (visible_boolean) {
          $scope.visible = visible_boolean;
        };
      },
      controllerAs: 'nav',
      scope: {}
    };
  })
  .directive('navbarSubmenu', function () {
    return {
      restrict: 'E',
      link: function (scope, element, attr, ctrl, transcludeFn) {
        scope.visible = false;
        var button = element.parent()[0].firstElementChild;
        button.addEventListener("click", function () {
          ctrl.toggleMenu();
        }, false);
        scope.$watch('visible', function (visible) {
          if (visible) {
            element.attr('class', 'visible');
          } else {
            element.attr('class', '');
          }
        });
        // Applying active class when one of the state is triggered (hardcoded but it's up the be changed in a commit)
        scope.$on('$stateChangeSuccess', function (ev, toState) {
          if (['admin_fleets', 'admin_files', 'admin_applications', 'admin_users'].indexOf(toState.name) > -1) {
            button.setAttribute('class', 'active');
          } else {
            button.setAttribute('class', '');
          }
        });
        element.append(transcludeFn());
      },
      controller: function ($scope) {
        this.toggleMenu = function () {
          $scope.$apply(function () {
            $scope.visible = !$scope.visible;
          });
        };
      },
      transclude: true,
      scope: {}
    };
  })
  .run(function () {
    angular.element(document.body)
      .prepend('<nav flyve-navigation></nav>');
  });
