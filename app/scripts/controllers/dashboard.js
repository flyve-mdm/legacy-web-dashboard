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
 * @name FlyveMDM.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the FlyveMDM
 */
angular.module('FlyveMDM')
  .controller('DashboardCtrl', function ($scope, $state, $q, AuthProvider, DashboardFac, Notifications) {
    if (!AuthProvider.seemsLogged()) {
      return AuthProvider.showLogin(true);
    }
    $scope.lock_refresh = false;
    //console.log(GLPi.getOptions('defaults').global.appToken);
    //console.log();
    //GLPi.listSearchOptions('PluginFlyvemdmAgent');

    //console.log(GLPi.getOptions('defaults').global.user_token);
    $scope.links = function (aLink) {
      $state.go(aLink);
    };
    $scope.editDevice = function (deviceId) {
      $state.go('device', { id: deviceId });
    };
    DashboardFac.getMacAddress().then(function (macAddress) {
      $scope.devicesByMacAddress = macAddress;
    });
    $scope.refreshDashboard = function (toast) {
      $scope.lock_refresh = true;
      if (toast) {
        Notifications.loading("Refresh in progress...");
      }
      var promises = {
        invitations: DashboardFac.getInvitations(),
        users: DashboardFac.getNumberOfUsers(),
        devices: DashboardFac.getNumberOfDevices(),
        applications: DashboardFac.getNumberOfApplications(),
        fleets: DashboardFac.getNumberOfFleets(),
        files: DashboardFac.getNumberOfFiles(),
        devices_os: DashboardFac.getAndroidVersions(),
        devicesByMacAddress: DashboardFac.getMacAddress(),
        devicesByRealName: DashboardFac.getDevicesByRealName()
      };
      $q.all(promises).then(function (data) {
        $scope.users = data.users;
        $scope.devices = data.devices;
        $scope.applications = data.applications;
        $scope.fleets = data.fleets;
        $scope.files = data.files;
        $scope.devicesByMacAddress = data.devicesByMacAddress;
        $scope.devicesByRealName = data.devicesByRealName;
        $scope.invitations = {
          labels: ['Done', 'Pending'],
          data: [data.invitations.done, data.invitations.pending],
          dataset: {
            backgroundColor: ['#6cc2bc', '#158784'],
            hoverBackgroundColor: ['#6cc2bc', '#158784'],
            hoverBorderColor: ['#6cc2bc', '#158784']
          }
        };
        $scope.devices_os = {
          series: ['Android', 'iOS'],
          labels: data.devices_os.android_version,
          data: [data.devices_os.android_version_quantity],
          dataset: {
          },
          colors: [
            {
              backgroundColor: '#6cc2bc',
              borderColor: '#6cc2bc',
              hoverBackgroundColor: '#6cc2bc',
              hoverBorderColor: '#6cc2bc'
            },
            {
              backgroundColor: '#158784',
              borderColor: '#158784',
              hoverBackgroundColor: '#158784',
              hoverBorderColor: '#158784'
            }
          ]
        };
        if (toast) {
          Notifications.done("Dashboard refreshed");
        }
        $scope.lock_refresh = false;
      });
    };
    $scope.refreshDashboard();
  });
