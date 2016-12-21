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
