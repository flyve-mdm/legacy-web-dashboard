'use strict';
/**
 * @ngdoc service
 * @name FlyveMDM.FleetsAdminFac
 * @description
 * # FleetsAdminFac
 * Factory in the FlyveMDM.
 */
angular.module('FlyveMDM')
  .factory('FleetsAdminFac', function (GLPI_API_URL, GlpiObjectNames, PluginObjectNames, $q, $http) {
    var fleets = [];
    return {
      createPolicy: function (anInput) {
        var createPolicyDefer = $q.defer();
        $http({
          method: 'POST',
          url: GLPI_API_URL + PluginObjectNames.FleetPolicy,
          data: {
            input: anInput
          }
        }).then(function (response) {
          createPolicyDefer.resolve(response.data.id);
        }, function () {
          createPolicyDefer.reject();
        });
        return createPolicyDefer.promise;
      },
      updatePolicy: function (aPolicyId, aValue) {
        var updatePolicyDefer = $q.defer();
        $http({
          method: 'PUT',
          url: GLPI_API_URL + PluginObjectNames.FleetPolicy,
          data: {
            input: {
              id: aPolicyId,
              value: aValue
            }
          }
        }).then(function () {
          updatePolicyDefer.resolve();
        }, function () {
          updatePolicyDefer.reject();
        });
        return updatePolicyDefer.promise;
      },
      deletePolicy: function (aPolicyId) {
        var deletePolicyDefer = $q.defer();
        $http({
          method: 'DELETE',
          url: GLPI_API_URL + PluginObjectNames.FleetPolicy + '/' + aPolicyId
        }).then(function () {
          deletePolicyDefer.resolve();
        }, function () {
          deletePolicyDefer.reject();
        });
        return deletePolicyDefer.promise;
      },
      getPolicies: function () {
        var getPoliciesDefer = $q.defer();
        $http({
          method: 'GET',
          url: GLPI_API_URL + PluginObjectNames.FleetPolicy
        }).then(function (response) {
          var policies = response.data;
          getPoliciesDefer.resolve(policies);
        }, function () {
          getPoliciesDefer.reject();
        });
        return getPoliciesDefer.promise;
      },
      createPolicies: function (policies, fleetId) {
        var promises = policies.map(function (aPolicy) {
          var deffered = $q.defer();
          var createPolicy = {
            "plugin_storkmdm_fleets_id": fleetId,
            "plugin_storkmdm_policies_id": aPolicy.id,
            "value": aPolicy.value
          };
          $http({
            method: 'POST',
            url: GLPI_API_URL + PluginObjectNames.FleetPolicy,
            data: {
              input: createPolicy
            }
          }).then(function (response) {
            deffered.resolve(response.data);
          }, function () {
            deffered.reject();
          });
          return deffered.promise;
        });
        return $q.all(promises);
      },
      deletePolicies: function (policies) {
        var promises = policies.map(function (aPolicy) {
          var deffered = $q.defer();
          $http({
            method: 'DELETE',
            url: GLPI_API_URL + PluginObjectNames.FleetPolicy + '/' + aPolicy.plugin_storkmdm_fleet_policy_id
          }).then(function () {
            deffered.resolve();
          }, function () {
            deffered.reject();
          });
          return deffered.promise;
        });
        return $q.all(promises);
      },
      updatePolicies: function (policies) {
        var promises = policies.map(function (aPolicy) {
          var deffered = $q.defer();
          var updatePolicy = {
            "id": aPolicy.plugin_storkmdm_fleet_policy_id,
            "value": aPolicy.value
          };
          $http({
            method: 'PUT',
            url: GLPI_API_URL + PluginObjectNames.FleetPolicy,
            data: {
              input: updatePolicy
            }
          }).then(function (response) {
            deffered.resolve(response.data);
          }, function () {
            deffered.reject();
          });
          return deffered.promise;
        });
        return $q.all(promises);
      },
      getFleets: function () {
        var FleetsDefer = $q.defer();
        if (fleets.length > 0) {
          FleetsDefer.resolve(fleets);
        } else {
          $http({
            method: 'GET',
            url: GLPI_API_URL + PluginObjectNames.Fleet,
            params: {
              range: '0-1000'
            }
          }).then(function (response) {
            var fleets = response.data;
            FleetsDefer.resolve(fleets);
          }, function () {
            FleetsDefer.reject();
          });
        }
        return FleetsDefer.promise;
      },
      getFleetsData: function () { //param range ToDo
        var config = {
          params: {
            range: '0-1000'
          }
        };
        var promises = {
          getPoliciesCategory: $http.get(GLPI_API_URL + PluginObjectNames.PolicyCategory, config),
          getPolicies: $http.get(GLPI_API_URL + PluginObjectNames.Policy, config),
          getFleets: $http.get(GLPI_API_URL + PluginObjectNames.Fleet, config),
          getFleetPolicy: $http.get(GLPI_API_URL + PluginObjectNames.FleetPolicy, config),
          getApplications: $http.get(GLPI_API_URL + PluginObjectNames.Application, config),
          getFiles: $http.get(GLPI_API_URL + PluginObjectNames.File, config),
          getWellknownPath: $http.get(GLPI_API_URL + PluginObjectNames.WellknownPath)
        };
        return $q.all(promises);
      },
      createFleet: function (anInput) {
        var createFleetDefer = $q.defer();
        $http({
          method: 'POST',
          url: GLPI_API_URL + PluginObjectNames.Fleet,
          data: {
            input: anInput
          }
        }).then(function (response) {
          createFleetDefer.resolve(response.data.id);
        }, function () {
          createFleetDefer.reject();
        });
        return createFleetDefer.promise;
      },
      updateFleet: function (aPolicyId, aValue) {
        var updateFleetDefer = $q.defer();
        $http({
          method: 'PUT',
          url: GLPI_API_URL + PluginObjectNames.Fleet,
          data: {
            input: {
              id: aPolicyId,
              value: aValue
            }
          }
        }).then(function () {
          updateFleetDefer.resolve();
        }, function () {
          updateFleetDefer.reject();
        });
        return updateFleetDefer.promise;
      },
      deleteFleet: function (aFleetId) {
        var deleteFleetDefer = $q.defer();
        $http({
          method: 'DELETE',
          url: GLPI_API_URL + PluginObjectNames.Fleet + '/' + aFleetId
        }).then(function () {
          deleteFleetDefer.resolve();
        }, function () {
          deleteFleetDefer.reject();
        });
        return deleteFleetDefer.promise;
      },
    };
  });
