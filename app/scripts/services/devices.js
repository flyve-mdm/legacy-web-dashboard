'use strict';
/**
 * @ngdoc service
 * @name FlyveMDM.DevicesFac
 * @description
 * # DevicesFac
 * Factory in the FlyveMDM.
 */
angular.module('FlyveMDM')
  .factory('DevicesFac', function (GLPI_API_URL, GlpiObjectNames, PluginObjectNames, $q, $http) {
    // Service logic
    // ...
    // Public API here
    return {
      getDevicesData: function () { //param range ToDo
        var promises = {
          getAgents: $http.get(GLPI_API_URL + PluginObjectNames.Agent),
          getUsers: $http.get(GLPI_API_URL + GlpiObjectNames.GlpiUser),
          getFleets: $http.get(GLPI_API_URL + PluginObjectNames.Fleet),
          getComputers: $http.get(GLPI_API_URL + GlpiObjectNames.Computer, { params: { expand_dropdowns: true } }),
        };
        return $q.all(promises);
      },
      deleteDevice: function (aDeviceId) {
        var deferred = $q.defer();
        $http({
          method: 'DELETE',
          url: GLPI_API_URL + PluginObjectNames.Agent + '/' + aDeviceId
        }).then(function () {
          deferred.resolve();
        }, function () {
          deferred.reject();
        });
        return deferred.promise;
      },
    };
  });
