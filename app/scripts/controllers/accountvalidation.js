'use strict';
/**
 * @ngdoc function
 * @name FlyveMDM.controller:AccountValidationCtrl
 * @description
 * # AccountValidationCtrl
 * Controller of the FlyveMDM
 */
angular.module('FlyveMDM')
  .controller('AccountValidationCtrl', function ($scope, AuthProvider, AccountFac, Notifications, $state, $stateParams) {
    $scope.lock_submit = false;
    $scope.show_login = false;
    $scope.validateAccount = function () {
      $scope.lock_submit = true;
      AccountFac.validateAccount($stateParams.id, $stateParams.hash)
        .then(function () {
          Notifications.done("Account validated");
          $scope.show_login = true;
        }, function () {
          $scope.lock_submit = false;
        });
    };
    $scope.goToLogin = function () {
      $state.go('login');
    };
  });
