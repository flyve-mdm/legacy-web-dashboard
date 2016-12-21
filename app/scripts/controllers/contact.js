'use strict';
/**
 * @ngdoc function
 * @name FlyveMDM.controller:ContactCtrl
 * @description
 * # ContactCtrl
 * Controller of the FlyveMDM
 */
angular.module('FlyveMDM')
  .controller('ContactCtrl', function ($scope, $window, AuthProvider) {
    if (!AuthProvider.seemsLogged()) {
      return AuthProvider.showLogin(true);
    }
    $scope.links = function (aLink) {
      switch (aLink) {
        case 'tel':
          $window.open('tel:+34512702140', '_blank');
          break;
        case 'email':
          $window.open('mailto:contact@teclib.com', '_blank');
          break;
        case 'map':
          $window.open('https://her.is/2ge9vcS', '_blank');
          break;
        case 'ticket':
          $window.open('https://support.teclib.com/', '_blank');
          break;
      }
    };
  });
