'use strict';
/**
 * @ngdoc service
 * @name FlyveMDM.EntityConfigFac
 * @description
 * # EntityConfigFac
 * Factory in the FlyveMDM.
 */
angular.module('FlyveMDM')
  .factory('EntityConfigFac', function (GLPI_API_URL, PluginObjectNames, $q, $http) {
    // Service logic
    // Public API here
    return {
      editConfiguration: function (aEntityId, anInput) {
        var deferred = $q.defer();
        $http({
          method: 'PUT',
          url: GLPI_API_URL + PluginObjectNames.Entityconfig + '/' + aEntityId,
          data: {
            input: anInput
          }
        }).then(function (response) {
          deferred.resolve(response.data.data[0]);
        }, function () {
          deferred.reject();
        });
        return deferred.promise;
      },
      getConfiguration: function (aEntityId) {
        var deferred = $q.defer();
        $http({
          method: 'GET',
          url: GLPI_API_URL + PluginObjectNames.Entityconfig + '/' + aEntityId,
        }).then(function (response) {
          deferred.resolve(response.data);
        }, function () {
          deferred.reject();
        });
        return deferred.promise;
      },
      getConfigurations: function () {
        var deferred = $q.defer();
        $http({
          method: 'GET',
          url: GLPI_API_URL + PluginObjectNames.Entityconfig
        }).then(function (response) {
          deferred.resolve(response.data);
        }, function () {
          deferred.reject();
        });
        return $q.all(deferred.promise);
      }
    };
  });
