'use strict';
/**
 * @ngdoc service
 * @name FlyveMDM.InvitationLogsFac
 * @description
 * # InvitationLogsFac
 * Factory in the FlyveMDM.
 */
angular.module('FlyveMDM')
  .factory('InvitationLogsFac', function (GLPI_API_URL, PluginObjectNames, $q, $http) {
    // Service logic
    // Public API here
    return {
      getLogs: function (logId) {
        var deferred = $q.defer();
        $http({
          method: 'GET',
          url: GLPI_API_URL + PluginObjectNames.Invitation + '/' + logId + '/' + PluginObjectNames.InvitationLog
        }).then(function (response) {
          var logs = response.data;
          var rLogs = logs.map(function (aLog) {
            var rLog = {};
            rLog.id = aLog.id,
              rLog.date_creation = aLog.date_creation;
            rLog.event = aLog.event;
            return rLog;
          });
          deferred.resolve(rLogs);
        }, function () {
          deferred.reject();
        });
        return deferred.promise;
      }
    };
  });
