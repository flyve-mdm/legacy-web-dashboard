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

      /**
       * Updates the value of a policy
       * @param aPolicyId the id of the policy to update
       * @param aValue the new value of the policy
       */
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

      /**
       * Deletes a policy from the fleet
       * @param aPolicyId the policy to be deleted
       */
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
            "plugin_flyvemdm_fleets_id": fleetId,
            "plugin_flyvemdm_policies_id": aPolicy.id,
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
            url: GLPI_API_URL + PluginObjectNames.FleetPolicy + '/' + aPolicy.plugin_flyvemdm_fleet_policy_id
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
            "id": aPolicy.plugin_flyvemdm_fleet_policy_id,
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

      /**
       * Get all the fleets in the dashboard
       */
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

      /**
       * Get the data of the fleet
       */
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

      /**
       * Creates a new fleet
       * @param anInput the information of the fleet
       */
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

      /**
       * Updates the fleet
       * @param aPolicyId  the id of the policy updated
       * @param aValue the new value of the policy updated
       */
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

      /**
       * Deletes a fleet
       * @param aFleetId the id of the fleet to be deleted
       */
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
