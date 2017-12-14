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
      /**
       * Get the data of the devices
       */
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
