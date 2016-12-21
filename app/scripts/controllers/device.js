'use strict';
/**
 * @ngdoc function
 * @name FlyveMDM.controller:DeviceCtrl
 * @description
 * # DeviceCtrl
 * Controller of the FlyveMDM
 */
angular.module('FlyveMDM')
  .controller('DeviceCtrl', function (GLPI_API_URL,
    AuthProvider, AgentFac, GeolocationFac, InventoryFac, FleetsAdminFac, GlosaryObjectNames, $scope, $state, $stateParams, $mdDialog, $mdToast, $q, Notifications) {
    if (!AuthProvider.seemsLogged()) {
      return AuthProvider.showLogin(true);
    }
    $scope.lock_save_device = false;
    $scope.lock_inventory = false;
    $scope.lock_geolocation = false;
    $scope.title = 'Loading...';
    $scope.agent = {};
    var fleet_id = null;
    var device_name = null;
    $scope.computer = {};
    $scope.no_inventory = true;
    $scope.fleets = [];
    $scope.loading = true;
    $scope.selectedTab = 0;
    var nGeolocationsPerPage;
    var nAvailableGeolocations = 0;
    $scope.currentNGeolocationPages = 0;
    $scope.currentGeolocationPages = [];
    $scope.currentOpenedPage = 1;
    $scope.geolocationsLoading = false;
    var selectedGeolocations = [];
    var geolocationMap;
    var markIcon = L.icon({
      iconUrl: 'images/favicon-32x32.png',
      iconSize: [32, 32]
    });
    $scope.latestGeolocations = [];
    /**
     * This fetches the latest known positions as of now
     * (this is not like requestCurrentGeolocation which asks
     *  the server to get a new position from the device)
     */
    var getDeviceGeolocations = function (rangeFrom, rangeTo) {
      var tmpLatestGeolocations = angular.copy($scope.latestGeolocations);
      $scope.latestGeolocations = [];
      $scope.geolocationsLoading = true;
      GeolocationFac.getDeviceGeolocations($scope.agent.computers_id, rangeFrom, rangeTo).then(function (latestGeolocations) {
        nAvailableGeolocations = latestGeolocations.totalcount;
        $scope.currentNGeolocationPages = Math.ceil(nAvailableGeolocations / nGeolocationsPerPage);
        // creating an array in order to loop with ng-repeat
        (function (n_pages) {
          var page_n = 1;
          var geolocationPages = [];
          while (page_n <= n_pages) {
            geolocationPages.push(page_n);
            page_n++;
          }
          $scope.currentGeolocationPages = geolocationPages;
        })($scope.currentNGeolocationPages);
        function defaultGeolocation() {
          if (!geolocationMap) {
            geolocationMap = L.map('mapid').setView([48.8583701, 2.2922926], 16);
            L.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              maxZoom: 18,
              attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
              id: 'mapbox.streets'
            }).addTo(geolocationMap);
          }
          navigator.geolocation.getCurrentPosition(function success(pos) {
            var crd = pos.coords;
            geolocationMap.panTo(new L.LatLng(crd.latitude, crd.longitude));
          }, function error() {
            geolocationMap.panTo(new L.LatLng(48.8583701, 2.2922926));
          }, {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0
            });
        }
        if (latestGeolocations.data.length > 0) {
          latestGeolocations.data.forEach(function (aGeolocation, index) {
            var geolocationPosition = tmpLatestGeolocations.map(function (x) { return x.id; })
              .indexOf(aGeolocation.id);
            if (geolocationPosition !== -1) {
              latestGeolocations.data[index].layer = tmpLatestGeolocations[geolocationPosition].layer;
            }
          });
          $scope.latestGeolocations = latestGeolocations.data;
          if (!geolocationMap) {
            if (!isNaN($scope.latestGeolocations[0].displayable.lat)) {
              geolocationMap = L.map('mapid').setView([$scope.latestGeolocations[0].displayable.lat, $scope.latestGeolocations[0].displayable.lng], 16);
              L.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                id: 'mapbox.streets'
              }).addTo(geolocationMap);
            } else {
              defaultGeolocation();
            }
          }
        } else {
          defaultGeolocation();
        }
        //Marking as loaded
        $scope.geolocationsLoading = false;
      }, function () {
        $scope.geolocationsLoading = false;
      });
    };
    function getInventory(toast) {
      $scope.lock_inventory = false;
      InventoryFac.getComputer($scope.agent.computers_id).then(function (aComputer) {
        $scope.title = device_name;
        $scope.computer = aComputer;
        $scope.computer.date.last_report = $scope.agent.last_report;
        $scope.computer.date.last_contact = $scope.agent.last_contact;
        $scope.computer.memory.partitioning2 = angular.copy($scope.computer.memory.partitioning.shift());
        $scope.no_inventory = false;
        if (toast) {
          Notifications.done("Completed");
        }
      }, function () {
        $scope.title = device_name;
        $scope.loading = false;
        $scope.no_inventory = true;
      });
    }
    $scope.getInventoryFromDevice = function () {
      $scope.lock_inventory = true;
      var request = AgentFac.requestCurrentInventory($scope.agent.id);
      request.promise.then(function () {
        getInventory(true);
      }, function () {
        $scope.lock_inventory = false;
      });
      Notifications.loading("Inventory in progress...", request.cancel);
    };
    AgentFac.getDevice($stateParams.id).then(function (anAgent) {
      if (anAgent.last_contact) {
        anAgent._contacted = moment.utc(anAgent.last_contact).fromNow();
      } else {
        anAgent._contacted = "Never been contacted";
      }
      $scope.agent = anAgent;
      getInventory();
      device_name = anAgent.name;
      FleetsAdminFac.getFleets().then(function (fleets) {
        $scope.fleets = fleets;
        fleet_id = anAgent.fleet_id;
        var fleetPosition = fleets.map(function (x) { return x.id; })
          .indexOf(anAgent.fleet_id);
        if (fleetPosition !== -1) {
          $scope.agent.fleet_name = fleets[fleetPosition].name;
        }
      });
      nGeolocationsPerPage = 8;
      getDeviceGeolocations(0, nGeolocationsPerPage);
    }, function () {
      $scope.title = "Not found";
    });
    $scope.fillTable = function (tableState, ctrl) {
      $scope.stCtrl = ctrl;
      $scope.loading = true;
      if ($scope.displayedApplications && $scope.computer.applications) {
        tableState.pagination.totalItemCount = $scope.computer.applications.length;
        $scope.displayedApplications = $scope.computer.applications;
        $scope.loading = false;
      }
      if (!$scope.computer.applications) {
        $scope.loading = false;
        $scope.no_inventory = true;
      }
    };
    $scope.refreshTable = function () {
      $scope.displayedApplications = [];
      $scope.stCtrl.slice(0, $scope.stCtrl.tableState().pagination.number);
    };
    $scope.sendPing = function () {
      $scope.pingSendingStatus = 'Ping sent as of ' + moment().format('dddd, MMMM Do YYYY, h:mm:ss a');
      $scope.pingReplyStatus = '';
      var request = AgentFac.sendPing($scope.agent.id);
      request.promise.then(function () {
        Notifications.done("Echo reply");
        $scope.agent._contacted = moment(Date.now()).fromNow();
        $scope.pingReplyStatus += ' Device replied at: ' + moment().format('dddd, MMMM Do YYYY, h:mm:ss a');
      }, function (rejection) {
        if (rejection.status === -1) {
          $scope.pingReplyStatus = 'Cancelled querying the device (Client replied at: ';
        } else {
          $scope.pingReplyStatus = 'Timeout querying the device (Server replied at: ';
        }
        $scope.pingReplyStatus += moment().format('dddd, MMMM Do YYYY, h:mm:ss a') + ')';
      });
      Notifications.loading("Echo request", request.cancel);
    };
    $scope.saveDevice = function () {
      $scope.lock_save_device = true;
      var aName = (device_name !== $scope.agent.name);
      var aFleetId = (fleet_id !== $scope.agent.fleet_id);
      if (aName) {
        aName = $scope.agent.name;
        device_name = $scope.agent.name;
      }
      if (aFleetId) {
        aFleetId = $scope.agent.fleet_id;
        fleet_id = $scope.agent.fleet_id;
      }
      if (aName || aFleetId) {
        var request = AgentFac.updateDevice($scope.agent.id, aName, aFleetId);
        request.promise.then(function (updated) {
          $scope.lock_save_device = false;
          if (updated) {
            Notifications.done('Device #' + $scope.agent.id + ' updated');
            device_name = aName;
            $scope.title = aName;
          } else {
            Notifications.done('Error saving the device #' + $scope.agent.id);
            console.error(updated);
          }
        });
        Notifications.loading('Saving...', request.cancel);
      } else {
        Notifications.done('Not changes to save');
        $scope.lock_save_device = false;
      }
    };
    $scope.glosary = function (ev, term) {
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.body))
          .clickOutsideToClose(true)
          .title(ev.target.textContent)
          .textContent(GlosaryObjectNames[term])
          .ariaLabel('Glosary Dialog')
          .ok('Close')
          .targetEvent(ev)
      );
    };
    $scope.wipeDevice = function () {
      $mdDialog.show(
        $mdDialog.confirm()
          .title('This is the last warning')
          .content('You\'re about to wipe the device. Are you really certain ? (the device is going to delete all its data next time it turns on)')
          .ariaLabel('this is the last warning, do you want to wipe the device?')
          .ok('Accept')
          .cancel('Cancel')
      ).then(function () {
        var request = AgentFac.wipeDevice($scope.agent.id);
        request.promise.then(function () {
          Notifications.done('Asking wipe for device ' + $scope.agent.name);
          $state.go('devices');
        });
      });
    };
    $scope.deleteDevice = function () {
      $mdDialog.show(
        $mdDialog.confirm()
          .title('Delete device #' + $scope.agent.id)
          .content('You are going to delete device ' + $scope.agent.id + '.')
          .ariaLabel('delete this device')
          .ok('Accept')
          .cancel('Cancel')
      ).then(function () {
        var request = AgentFac.deleteDevice($scope.agent.id);
        request.promise.then(function () {
          Notifications.done('Deleted the device ' + $scope.agent.name);
          $state.go('devices');
        });
      });
    };
    $scope.unenrollDevice = function () {
      $mdDialog.show(
        $mdDialog.confirm()
          .title('Unenroll device #' + $scope.agent.id)
          .content('You are going to unenroll device ' + $scope.agent.id + '.')
          .ariaLabel('Unenroll this device')
          .ok('Accept')
          .cancel('Cancel')
      ).then(function () {
        var request = AgentFac.unenrollDevice($scope.agent.id);
        request.promise.then(function () {
          Notifications.done('Unenroll request complete for ' + $scope.agent.name);
          $state.go('devices');
        });
      });
    };
    $scope.requestCurrentGeolocation = function () {
      $scope.lock_geolocation = true;
      var request = AgentFac.requestCurrentGeolocation($scope.agent.id);
      request.promise.then(function () {
        Notifications.done("Completed");
        GeolocationFac.getDeviceGeolocations($scope.agent.computers_id, 0, 1).then(function () {
          getDeviceGeolocations(0, nGeolocationsPerPage);
        });
      });
      request.promise.finally(function () {
        $scope.lock_geolocation = false;
      });
      Notifications.loading("Current geolocation in progress...", request.cancel);
    };
    $scope.displayGeolocationPage = function (n_page) {
      $scope.currentOpenedPage = n_page;
      n_page--;
      var start = (n_page * nGeolocationsPerPage);
      var stop = start + nGeolocationsPerPage;
      getDeviceGeolocations(start, stop);
    };
    $scope.toggleSelectGeolocation = function (aGeolocation) {
      var foundIndex = false;
      if ((foundIndex = $scope.isSelectedGeolocation(aGeolocation)) === false) {
        geolocationMap.setView([aGeolocation.displayable.lat, aGeolocation.displayable.lng], 16);
        aGeolocation.layer = L.marker([aGeolocation.displayable.lat, aGeolocation.displayable.lng], { icon: markIcon }).addTo(geolocationMap);
        selectedGeolocations.push(aGeolocation);
      } else {
        if (aGeolocation.layer) {
          geolocationMap.removeLayer(aGeolocation.layer);
        }
        selectedGeolocations.splice(foundIndex, 1);
      }
    };
    $scope.isNaNGeolocation = function (geolocation) {
      return isNaN(geolocation.displayable.lat);
    };
    $scope.isSelectedGeolocation = function (geolocation) {
      if (isNaN(geolocation.displayable.lat)) {
        return false;
      }
      var foundIndex = false;
      selectedGeolocations.some(function (_geolocation, index) {
        if (_geolocation.id === geolocation.id) {
          foundIndex = index;
          return true;
        }
      });
      return foundIndex;
    };
  });
