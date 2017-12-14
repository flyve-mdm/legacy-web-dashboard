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
 * @ngdoc function
 * @name FlyveMDM.controller:ConnectionCtrl
 * @description
 * # ConnectionCtrl
 * Controller of the FlyveMDM
 */
angular.module('FlyveMDM')
  .directive('registrationPasswordConfirmationField', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, element, attrs, ctrl) {
        scope.$watch('input.password', function () {
          ctrl.$validate();
        });
        var passwordAndConfirmationAreTheSame = function () {
          return scope.input.password === ctrl.$viewValue;
        };
        ctrl.$validators.passwordAndConfirmationAreTheSame = passwordAndConfirmationAreTheSame;
      }
    };
  })
  .controller('LoginCtrl', function ($scope, AuthProvider, GlpiObjectNames, GLPI_API_URL, $state, $mdDialog) {
    var loginControllerScope = $scope;
    $scope.loginCredentials = {
      email: '',
      password: ''
    };
    if (navigator.credentials) {
      navigator.credentials.get({
        password: true,
        unmediated: false
      }).then(function (credential) {
        if (credential) {
          $scope.$apply(function () {
            $scope.loginCredentials.username = credential.id;
          });
        }
      });
    }
    $scope.storeCredentials = function (profileInfos) {
      if (navigator.credentials) {
        //ToDo: iconURL: iconUrl in PasswordCredential
        var credentials = new PasswordCredential({
          id: profileInfos.name,
          password: profileInfos.password,
          name: profileInfos.firstname ? profileInfos.firstname + ' ' + profileInfos.realname : ''
        });
        return navigator.credentials.store(credentials);
      }
    };
    $scope.attemptLogin = function () {
      AuthProvider.attemptLogin($scope.loginCredentials.username,
        $scope.loginCredentials.password)
        .then(function () {
          $scope.storeCredentials({
            name: $scope.loginCredentials.username,
            password: $scope.loginCredentials.password
          });
          $state.go('dashboard');
        }, function () {
          $mdDialog.show(
            $mdDialog.alert()
              .parent(angular.element(document.body))
              .clickOutsideToClose(true)
              .title('Wrong credentials')
              .content('Wrong credentials were supplied.')
              .ariaLabel('wrong crendentials on login attempt')
              .ok('Accept')
          );
        });
    };
    var RegistrationDialogCtrl = function ($scope, $mdDialog) {
      $scope.lock_submit = false;
      $scope.input = {
        name: '',
        password: '',
        password2: '',
        firstname: '',
        realname: ''
      };
      $scope.attemptRegister = function () {
        $scope.lock_submit = true;
        $scope.input.name = $scope.input.username;
        AuthProvider.attemptRegister($scope.input)
          .then(function () {
            loginControllerScope.storeCredentials($scope.input);
            $scope.lock_submit = false;
            $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.body))
                .clickOutsideToClose(false)
                .title('Welcome!')
                .content('You account has been created! Go and try to login now')
                .ariaLabel('your account has been created')
                .ok('Accept')
            ).then(function () {
              $state.go('login');
            });
          }, function () {
            $scope.lock_submit = false;
          });
      };
      $scope.cancel = function () {
        $mdDialog.hide();
      };
    };
    $scope.openRegistrationDialog = function (ev) {
      $mdDialog.show({
        controller: RegistrationDialogCtrl,
        templateUrl: 'views/dialog_register.html',
        targetEvent: ev,
        clickOutsideToClose: false
      });
    };
  });
