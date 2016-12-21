'use strict';
/**
 * @ngdoc function
 * @name FlyveMDM.controller:NavbarCtrl
 * @description
 * # NavbarCtrl
 * Controller of the FlyveMDM
 */
angular.module('FlyveMDM')
  .run(function ($rootScope) {
    $rootScope.currentViewMenu = [];
  })
  .controller('NavbarCtrl', function ($scope, $rootScope) {
    $scope.menu = [];
    $scope.$on('$stateChangeStart', function () {
      $rootScope.currentViewMenu = [];
    });
  });
