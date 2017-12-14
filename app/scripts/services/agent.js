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
 * @name FlyveMDM.AgentFac
 * @description
 * # AgentFac
 * Factory in the FlyveMDM.
 */
angular.module('FlyveMDM')
  .factory('AgentFac', function (GLPI_API_URL, GlpiObjectNames, PluginObjectNames, $q, $http) {
    // Service logic
    // Public API here
    return {
      getDevice: function (aDeviceId) {
        var agentDefer = $q.defer();
        $http({
          method: 'GET',
          url: GLPI_API_URL + PluginObjectNames.Agent + "/" + aDeviceId
        }).then(function (response) {
          var aDevice = response.data;
          var device = {
            id: aDevice.id,
            name: aDevice.name,
            version: aDevice.version,
            computers_id: aDevice.computers_id,
            wipe: aDevice.wipe,
            lock: aDevice.lock,
            fleet_id: aDevice.plugin_flyvemdm_fleets_id,
            last_report: aDevice.last_report,
            last_contact: aDevice.last_contact,
            certificate: aDevice.certificate
          };
          if (aDevice.last_contact) {
            device._contacted = moment.utc(aDevice.last_contact).fromNow();
          } else {
            device._contacted = "Never been contacted";
          }
          agentDefer.resolve(device);
        }, function () {
          agentDefer.reject();
        });
        return agentDefer.promise;
      },
      getDevices: function () {
        var deferred = $q.defer();
        $http({
          method: 'GET',
          url: GLPI_API_URL + PluginObjectNames.Agent
        }).then(function (response) {
          var devices = response.data.map(function (aDevice) {
            var rDevice = {
              id: aDevice.id,
              name: aDevice.name,
              computers_id: aDevice.computers_id
            };
            return rDevice;
          });
          deferred.resolve(devices);
        }, function () {
          deferred.reject();
        });
        return deferred.promise;
      },

      /**
       * Sends a ping to the device to check connectivity
       * @param aDeviceId the id of the device
       */
      sendPing: function (aDeviceId) {
        var canceller = $q.defer();
        var cancel = function (reason) {
          canceller.resolve(reason);
        };
        var promise = $http({
          method: 'PUT',
          url: GLPI_API_URL + PluginObjectNames.Agent + "/" + aDeviceId,
          timeout: canceller.promise,
          data: {
            input: {
              _ping: ''
            }
          }
        });
        return {
          promise: promise,
          cancel: cancel
        };
      },
      /**
       * Request the current geolocation of the device
       * @param aDeviceId the id of the device
       */
      requestCurrentGeolocation: function (aDeviceId) {
        var canceller = $q.defer();
        var cancel = function (reason) {
          canceller.resolve(reason);
        };
        var promise = $http({
          method: 'PUT',
          url: GLPI_API_URL + PluginObjectNames.Agent + "/" + aDeviceId,
          timeout: canceller.promise,
          data: {
            input: {
              _geolocate: ''
            }
          }
        });
        return {
          promise: promise,
          cancel: cancel
        };
      },

      /**
       * Request the current inventory of the device
       * @param aDeviceId the id of the device
       */
      requestCurrentInventory: function (aDeviceId) {
        var canceller = $q.defer();
        var cancel = function (reason) {
          canceller.resolve(reason);
        };
        var promise = $http({
          method: 'PUT',
          url: GLPI_API_URL + PluginObjectNames.Agent + "/" + aDeviceId,
          timeout: canceller.promise,
          data: {
            input: {
              _inventory: ''
            }
          }
        });
        return {
          promise: promise,
          cancel: cancel
        };
      },

      /**
       * Update the device information
       * @param aDeviceId the id of the device
       * @param aName the name given to the device
       * @param aFleetId the id of the fleet assigned
       */
      updateDevice: function (aDeviceId, aName, aFleetId) {
        var canceller = $q.defer();
        var cancel = function (reason) {
          canceller.resolve(reason);
        };
        var input = {};
        if (aName) {
          input.name = aName;
        }
        if (aFleetId) {
          input.plugin_flyvemdm_fleets_id = aFleetId;
        }
        var promise = $http({
          method: 'PUT',
          url: GLPI_API_URL + PluginObjectNames.Agent + "/" + aDeviceId,
          timeout: canceller.promise,
          data: {
            input: input
          }
        }).then(function (response) {
          return response.data[0][aDeviceId];
        });
        return {
          promise: promise,
          cancel: cancel
        };
      },

      /**
       * Erase the data storaged in the device
       * @param aDeviceId the id of the device
       */
      wipeDevice: function (aDeviceId) {
        var canceller = $q.defer();
        var cancel = function (reason) {
          canceller.resolve(reason);
        };
        var promise = $http({
          method: 'PUT',
          url: GLPI_API_URL + PluginObjectNames.Agent + "/" + aDeviceId,
          timeout: canceller.promise,
          data: {
            input: {
              wipe: 1
            }
          }
        });
        return {
          promise: promise,
          cancel: cancel
        };
      },

      /**
       * Delete the device
       * @param aDeviceId the id of the device
       */
      deleteDevice: function (aDeviceId) {
        var canceller = $q.defer();
        var cancel = function (reason) {
          canceller.resolve(reason);
        };
        var promise = $http({
          method: 'DELETE',
          url: GLPI_API_URL + PluginObjectNames.Agent + '/' + aDeviceId
        });
        return {
          promise: promise,
          cancel: cancel
        };
      },

      /**
       * Unenrolls the device
       * @param aDeviceId the id of the device
       */
      unenrollDevice: function (aDeviceId) {
        var canceller = $q.defer();
        var cancel = function (reason) {
          canceller.resolve(reason);
        };
        var promise = $http({
          method: 'PUT',
          url: GLPI_API_URL + PluginObjectNames.Agent + "/" + aDeviceId,
          timeout: canceller.promise,
          data: {
            input: {
              _unenroll: 1
            }
          }
        });
        return {
          promise: promise,
          cancel: cancel
        };
      },
      evaluateDeviceNames: function (userCollection) {
        var userCollectionDefer = $q.defer();
        // getter for search option ids only scopped
        // in this function (means it's FlyvemdmAgent
        // searchOptions).
        var searchOptionsIds = {
          "id": 2,
          "user_id": 6,
          "name": 1
        };
        var getSearchOptionIdFromPredicateName = function (predicateName) {
          return searchOptionsIds[predicateName];
        };
        // aggregating user ids user
        var ids = userCollection.map(function (aUser) {
          return aUser.id;
        });
        var requestParams = {};
        requestParams['forcedisplay[0]'] = getSearchOptionIdFromPredicateName('id');
        requestParams['forcedisplay[1]'] = getSearchOptionIdFromPredicateName('user_id');
        requestParams['forcedisplay[2]'] = getSearchOptionIdFromPredicateName('name');
        requestParams['forcedisplay[0]'] = 6;
        ids.forEach(function (id, index) {
          if (index > 0) {
            requestParams['criteria[' + index + '][link]'] = 'OR';
          }
          requestParams['criteria[' + index + '][field]'] = getSearchOptionIdFromPredicateName('user_id');
          requestParams['criteria[' + index + '][searchtype]'] = 'equals';
          requestParams['criteria[' + index + '][value]'] = id;
        });
        $http({
          method: 'GET',
          url: GLPI_API_URL + '/search' + PluginObjectNames.Agent,
          params: requestParams
        }).then(function (response) {
          var data = response.data.data;
          for (var i in data) {
            var user_id = data[i][getSearchOptionIdFromPredicateName('user_id')];
            var device_name = data[i][getSearchOptionIdFromPredicateName('name')];
            userCollection.some(function (user) {
              if (user.id === user_id) {
                user.device_name = device_name;
                return true;
              }
            });
          }
          userCollectionDefer.resolve(userCollection);
        }, function () {
          userCollectionDefer.reject();
        });
        return userCollectionDefer.promise;
      }
    };
  });
