'use strict';
/**
 * @ngdoc service
 * @name FlyveMDM.FullSessionFac
 * @description
 * # FullSessionFac
 * Factory in the FlyveMDM.
 */
angular.module('FlyveMDM')
  .factory('FullSessionFac', function (GLPI_API_URL, GlpiObjectNames, $q, $http) {
    return {
      getSession: function () {
        var promises = {
            getFullSession: $http.get(GLPI_API_URL + GlpiObjectNames.FullSession)
        };
        return $q.all(promises);
      }
    };
  });
