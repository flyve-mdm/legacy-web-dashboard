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
      /**
       * Get all the computers
       */
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
