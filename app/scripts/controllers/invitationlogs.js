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
 * @ngdoc function
 * @name FlyveMDM.controller:InvitationLogsCtrl
 * @description
 * # InvitationLogsCtrl
 * Controller of the FlyveMDM
 */
angular.module('FlyveMDM')
  .controller('InvitationLogsCtrl', function (GLPI_API_URL,
    AuthProvider, InvitationsFac, InvitationLogsFac, UsersAdminFac, $stateParams, $scope) {
    if (!AuthProvider.seemsLogged()) {
      return AuthProvider.showLogin(true);
    }
    $scope.displayedInvitationLogs = [];
    $scope.invitation_email = "Loading...";
    $scope.loading = false;
    InvitationsFac.getInvitation($stateParams.id).then(function (anInvitation) {
      UsersAdminFac.getUser(anInvitation.users_id).then(function (aUser) {
        $scope.invitation_email = aUser.username;
      });
    });
    /**
     * -- DEVICE-LISTING/PAGINATION RELATED
     */
    var smartTableTableState = null;
    $scope.fillTable = function (tableState) {
      // saving reference of the tableState
      if (smartTableTableState === null) {
        smartTableTableState = tableState;
      }
      $scope.loading = true;
      InvitationLogsFac.getLogs($stateParams.id).then(function (logs) {
        $scope.loading = false;
        $scope.displayedInvitationLogs = logs;

        tableState.pagination.totalItemCount = logs.length;
      });
    };
  });
