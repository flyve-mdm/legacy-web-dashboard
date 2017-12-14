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

      /**
       * Sends an invitation to enroll a new device
       * @param anUserEmail the email of the user whose device will be enrolled
       */
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

      /**
       * Re - sends an invitation
       * @param aDeviceId the id of the device
       * @param anUserEmail the email of the user
       */
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
