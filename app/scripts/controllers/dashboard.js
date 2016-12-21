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
    //GLPi.listSearchOptions('PluginStorkmdmAgent');

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
            backgroundColor: ['#8BC34A', '#03A9F4'],
            hoverBackgroundColor: ['#8BC34A', '#03A9F4'],
            hoverBorderColor: ['#8BC34A', '#03A9F4']
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
              backgroundColor: '#8BC34A',
              borderColor: '#8BC34A',
              hoverBackgroundColor: '#8BC34A',
              hoverBorderColor: '#8BC34A'
            },
            {
              backgroundColor: '#03A9F4',
              borderColor: '#03A9F4',
              hoverBackgroundColor: '#03A9F4',
              hoverBorderColor: '#03A9F4'
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
