'use strict';

/**
 * @ngdoc service
 * @name FlyveMDM.ComputersFac
 * @description
 * # ComputersFac
 * Factory in the FlyveMDM.
 */
angular.module('FlyveMDM')
  .factory('ComputersFac', function (GLPI_API_URL, GlpiObjectNames, $q, $http) {
    // Service logic
    // Public API here
    return {
      getComputers: function () {
        var getUsersDefer = $q.defer();
        $http({
          method: 'GET',
          url: GLPI_API_URL + GlpiObjectNames.Computer
        }).then(function (response) {
          var computers = response.data;
          var rComputers = computers.map(function (aComputer) {
            var rComputer = {};
            rComputer.id = aComputer.id;
            rComputer.email = aComputer.name;
            rComputer.realname = aComputer.realname;
            return rComputer;
          });
          getUsersDefer.resolve(rComputers);
        }, function () {
          getUsersDefer.reject();
        });
        return getUsersDefer.promise;
      }
    };
  });
