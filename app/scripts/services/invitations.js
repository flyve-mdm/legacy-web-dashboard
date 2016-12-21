'use strict';
/**
 * @ngdoc service
 * @name FlyveMDM.InvitationsFac
 * @description
 * # InvitationsFac
 * Factory in the FlyveMDM.
 */
angular.module('FlyveMDM')
  .factory('InvitationsFac', function (GLPI_API_URL, GlpiObjectNames, PluginObjectNames, $q, $http) {
    // Service logic
    // Public API here
    return {
      enrollNewDevice: function (anUserEmail) {
        var deferred = $q.defer();
        $http({
          method: 'POST',
          url: GLPI_API_URL + PluginObjectNames.Invitation,
          data: {
            input: {
              _useremails: anUserEmail
            }
          }
        }).then(function (response) {
          deferred.resolve(response.data.id);
        }, function () {
          deferred.reject();
        });
        return deferred.promise;
      },
      resendInvitation: function (aDeviceId, anUserEmail) {
        var deferred = $q.defer();
        $http({
          method: 'PUT',
          url: GLPI_API_URL + PluginObjectNames.Invitation + '/' + aDeviceId,
          data: {
            input: {
              _notify: anUserEmail
            }
          }
        }).then(function (response) {
          deferred.resolve(response.data[0]);
        }, function () {
          deferred.reject();
        });
        return deferred.promise;
      },
      deleteInvitation: function (aDeviceId) {
        var deferred = $q.defer();
        $http({
          method: 'DELETE',
          url: GLPI_API_URL + PluginObjectNames.Invitation + '/' + aDeviceId
        }).then(function () {
          deferred.resolve();
        }, function () {
          deferred.reject();
        });
        return deferred.promise;
      },
      getInvitations: function () {
        var deferred = $q.defer();
        $http({
          method: 'GET',
          url: GLPI_API_URL + PluginObjectNames.Invitation
        }).then(function (response) {
          var status = { status: 'pending' };
          var invitations = response.data.filter(function (invitation) {
            return Object.keys(status).every(function (key) {
              return invitation[key] === status[key];
            });
          });
          deferred.resolve(invitations);
        }, function () {
          deferred.reject();
        });
        var promises = {
          getInvitations: deferred.promise,
          getUsers: $http.get(GLPI_API_URL + GlpiObjectNames.GlpiUser)
        };
        return $q.all(promises);
      },
      getInvitation: function (invitationId) {
        var deferred = $q.defer();
        $http({
          method: 'GET',
          url: GLPI_API_URL + PluginObjectNames.Invitation + '/' + invitationId
        }).then(function (response) {
          var anInvitation = response.data;
          var rInvitation = {};
          rInvitation.users_id = anInvitation.users_id;
          deferred.resolve(rInvitation);
        }, function () {
          deferred.reject();
        });
        return deferred.promise;
      }
    };
  });
