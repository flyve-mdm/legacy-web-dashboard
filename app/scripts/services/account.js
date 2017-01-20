'use strict';

/**
 * @ngdoc service
 * @name FlyveMDM.AccountFac
 * @description
 * # AccountFac
 * Factory in the FlyveMDM.
 */
angular.module('FlyveMDM')
  .factory('AccountFac', function (GLPI_API_URL, PluginObjectNames, AuthProvider, $q, $http) {
    // Service logic
    // Public API here
    return {
      validateAccount: function (id, hash) {
        var defer = $q.defer();
        AuthProvider.getTempSessionToken().then(function (temp_session_token) {
          $http({
            method: 'PUT',
            url: GLPI_API_URL + PluginObjectNames.AccountValidation,
            data: {
              input: {
                id: id,
                _validate: hash
              }
            },
            headers: {
              'Session-Token': temp_session_token
            }
          }).then(function (response) {
            defer.resolve(response.data);
          }, function () {
            defer.reject();
          });
        }, function () {
          defer.reject();
        });
        return defer.promise;
      }
    };
  });
