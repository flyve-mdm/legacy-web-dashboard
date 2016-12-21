'use strict';
/**
 * @ngdoc function
 * @name FlyveMDM.controller:DevicesCtrl
 * @description
 * # DevicesCtrl
 * Controller of the FlyveMDM
 */
angular.module('FlyveMDM')
  .controller('DevicesCtrl', function (GLPI_API_URL,
    AuthProvider, DevicesFac, InvitationsFac, Notifications, $state, $scope, $mdDialog) {
    if (!AuthProvider.seemsLogged()) {
      return AuthProvider.showLogin(true);
    }
    $scope.fleets = [];
    $scope.selectedFleets = [];
    $scope.displayedDevices = [];
    $scope.selectedFleetToFilterWith = null;
    $scope.loading = true;
    var smartTableTableState = null;
    /**
     * -- GET all devices data
     */
    $scope.fillTable = function (tableState) {
      $scope.displayedDevices = [];
      // saving reference of the tableState
      if (smartTableTableState === null) {
        smartTableTableState = tableState;
      }
      DevicesFac.getDevicesData().then(function (response) {
        $scope.fleets = response.getFleets.data;
        var fleetArrayIds = response.getFleets.data.map(function (x) { return x.id; });
        var computerArrayIds = response.getComputers.data.map(function (x) { return x.id; });
        var selectedFleetsArrayIds = $scope.selectedFleets.map(function (x) { return x.id; });
        response.getAgents.data.forEach(function (aDevice) {
          var fleetPos = fleetArrayIds.indexOf(aDevice.plugin_storkmdm_fleets_id);
          if (fleetPos !== -1) {
            aDevice.fleet = response.getFleets.data[fleetPos];
          }
          var computerPos = computerArrayIds.indexOf(aDevice.computers_id);
          if (computerPos !== -1) {
            var computer = response.getComputers.data[computerPos];
            aDevice.serial = computer.serial;
            aDevice.realname = aDevice.name;
            aDevice.user_email = computer.name;
            aDevice.manufacturer_model = '';
            if (computer.manufacturers_id !== 0) {
              aDevice.manufacturer_model = computer.manufacturers_id + ' ' + computer.computermodels_id;
            }

          }
          if (aDevice.last_contact) {
            aDevice._contacted = moment.utc(aDevice.last_contact).fromNow();
          } else {
            aDevice._contacted = "Never been contacted";
          }
          var selectedFleetPos = selectedFleetsArrayIds.indexOf(aDevice.plugin_storkmdm_fleets_id);
          if (selectedFleetsArrayIds.length === 0 || selectedFleetPos !== -1) {
            $scope.displayedDevices.push(aDevice);
          }
        });
        $scope.collectionLength = $scope.displayedDevices.length;
        tableState.pagination.totalItemCount = $scope.displayedDevices.length;
        $scope.loading = false;
      });
    };
    /**
     * -- Filter by fleets method
     */
    $scope.$watch('selectedFleetToFilterWith', function (fleet) {
      $scope.selectedFleetToFilterWith = null;
      if (!fleet) {
        return;
      }
      $scope.selectedFleets.push(fleet);
      $scope.refreshTable();
    });
    $scope.refreshTable = function () {
      $scope.displayedDevices = [];
      smartTableTableState.pagination.start = 0;
      if (smartTableTableState !== null) {
        $scope.fillTable(smartTableTableState);
      }
    };
    /**
     * -- Edit device method
     */
    $scope.editDevice = function (deviceId) {
      $state.go('device', { id: deviceId });
    };
    /**
     * -- Delete device method
     */
    $scope.deleteDevice = function (deviceId) {
      $mdDialog.show(
        $mdDialog.confirm()
          .title('Delete device #' + deviceId)
          .content('You are going to delete device ' + deviceId + '.')
          .ariaLabel('delete this device')
          .ok('Accept')
          .cancel('Cancel')
      ).then(function () {
        DevicesFac.deleteDevice(deviceId).then(function () {
          Notifications.done("Device deleted");
          $scope.displayedDevices.some(function (_device, index) {
            if (_device.id === deviceId) {
              $scope.displayedDevices.splice(index, 1);
              return true;
            }
          });
        });
      });
    };
    /**
     * -- Add new device method
     */
    var EnrollNewDeviceController = function ($scope, $mdDialog) {
      $scope.lock_submit = false;
      $scope.user_email = "";
      $scope.cancel = function () {
        $mdDialog.cancel();
      };
      $scope.enrollDevice = function () {
        $scope.lock_submit = true;
        InvitationsFac.enrollNewDevice($scope.user_email)
          .then(function () {
            $mdDialog.hide().then(function () {
              Notifications.done("Invitation requested");
            });
          }, function () {
            $scope.lock_submit = false;
          });
      };
    };
    $scope.insertIntoTable = $scope.enrollNewDevice = function () {
      $mdDialog.show({
        controller: EnrollNewDeviceController,
        templateUrl: 'views/dialog_enrollnewdevice.html',
        parent: angular.element(document.body),
        clickOutsideToClose: false,
      });
    };
  });
