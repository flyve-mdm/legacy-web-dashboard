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
