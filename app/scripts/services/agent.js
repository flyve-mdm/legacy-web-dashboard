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
            fleet_id: aDevice.plugin_storkmdm_fleets_id,
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
          input.plugin_storkmdm_fleets_id = aFleetId;
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
