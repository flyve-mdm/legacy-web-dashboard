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
 * @name FlyveMDM.controller:FleetsCtrl
 * @description
 * # FleetsCtrl
 * Controller of the FlyveMDM
 */
angular.module('FlyveMDM')
  .controller('FleetsAdminCtrl', function (AuthProvider, FilesAdminFac,
    FleetsAdminFac, Notifications, $state, $scope,
    $rootScope, $mdDialog, $q) {
    if (!AuthProvider.seemsLogged()) {
      return AuthProvider.showLogin(true);
    }
    $scope.displayedCollection = [];
    $scope.loading = true;
    var fleetsControllerScope = $scope;
    $scope.fillTable = function (tableState) {
      var range; //ToDo
      FleetsAdminFac.getFleetsData(range).then(function (responses) {
        var policyCategories = responses.getPoliciesCategory.data;
        var policies = responses.getPolicies.data;
        var fleetsPolicies = responses.getFleetPolicy.data;
        var fleets = responses.getFleets.data;
        var applications = responses.getApplications.data;
        var files = responses.getFiles.data;
        var wellKnownPaths = responses.getWellknownPath.data;
        $scope.wellknownPaths = wellKnownPaths;
        $scope.applications = applications;
        $scope.files = files;
        $scope.policies = [];
        $scope.policiesByCategory = [];
        $scope.policyCategories = [];
        for (var category in policyCategories) {
          $scope.policiesByCategory[policyCategories[category].id] = [];
        }
        policies.some(function (_policy) {
          var policiesToHide = ["deployApp", "removeApp", "deployFile", "removeFile"].indexOf(_policy.symbol);
          if (policiesToHide === -1) {
            $scope.policiesByCategory[_policy.plugin_flyvemdm_policycategories_id].push(_policy);
            _policy.value = _policy.id;
            $scope.policies.push(_policy);
          }
        });
        for (var aCategory in policyCategories) {
          if ($scope.policiesByCategory[policyCategories[aCategory].id].length > 0) {
            policyCategories[aCategory].policies = $scope.policiesByCategory[policyCategories[aCategory].id];
            $scope.policyCategories.push(policyCategories[aCategory]);
          }
        }
        $scope.displayedCollection = fleets;
        $scope.collectionLength = fleets.length;
        tableState.pagination.totalItemCount = fleets.length;
        $scope.loading = false;
        $scope.fleetPolicies = [];
        $scope.fleetFiles = [];
        $scope.fleetApps = [];
        for (var fleet in fleets) {
          $scope.fleetPolicies[fleets[fleet].id] = [];
          $scope.fleetApps[fleets[fleet].id] = [];
          $scope.fleetFiles[fleets[fleet].id] = [];
        }
        var policyToDeployAppPos = policies.map(function (x) { return x.symbol; })
          .indexOf("deployApp");
        var policyToDeployAppFound = policies[policyToDeployAppPos];
        $scope.policyToDeployAppId = policyToDeployAppFound.id;
        var policyToRemoveAppPos = policies.map(function (x) { return x.symbol; })
          .indexOf("removeApp");
        var policyToRemoveAppFound = policies[policyToRemoveAppPos];
        $scope.policyToRemoveAppId = policyToRemoveAppFound.id;
        var policyToDeployFilePos = policies.map(function (x) { return x.symbol; })
          .indexOf("deployFile");
        var policyToDeployFileFound = policies[policyToDeployFilePos];
        $scope.policyToDeployFileId = policyToDeployFileFound.id;
        var policyToRemoveFilePos = policies.map(function (x) { return x.symbol; })
          .indexOf("removeFile");
        var policyToRemoveFileFound = policies[policyToRemoveFilePos];
        $scope.policyToRemoveFileId = policyToRemoveFileFound.id;
        for (var aPolicy in fleetsPolicies) {
          switch (fleetsPolicies[aPolicy].plugin_flyvemdm_policies_id) {
            case $scope.policyToDeployAppId:
              var appPos = applications.map(function (x) { return x.id; })
                .indexOf(fleetsPolicies[aPolicy].items_id);
              var appFound = applications[appPos];
              if (appFound) {
                appFound.plugin_flyvemdm_fleet_policy_id = fleetsPolicies[aPolicy].id;
                $scope.fleetApps[fleetsPolicies[aPolicy].plugin_flyvemdm_fleets_id].push(appFound);
              }
              break;
            case $scope.policyToDeployFileId:
              var filePos = files.map(function (x) { return x.id; })
                .indexOf(fleetsPolicies[aPolicy].items_id);
              var fileFound = files[filePos];
              if (fileFound) {
                fileFound.plugin_flyvemdm_fleet_policy_id = fleetsPolicies[aPolicy].id;
                $scope.fleetFiles[fleetsPolicies[aPolicy].plugin_flyvemdm_fleets_id].push(fileFound);
              }
              break;
            default:
              var policyPos = policies.map(function (x) { return x.id; })
                .indexOf(fleetsPolicies[aPolicy].plugin_flyvemdm_policies_id);
              var policyFound = policies[policyPos];
              if (policyFound) {
                policyFound.plugin_flyvemdm_fleet_policy_id = fleetsPolicies[aPolicy].id;
                policyFound.value = fleetsPolicies[aPolicy].value;
                switch (policyFound.type) {
                  case "dropdown":
                    var type_data = JSON.parse(policyFound.type_data);
                    policyFound.value_showed = type_data[policyFound.value];
                    break;
                  case "bool":
                    if (parseInt(policyFound.value) === 1) {
                      policyFound.value_showed = "Enabled";
                    } else {
                      policyFound.value_showed = "Disabled";
                    }
                    break;
                  default:
                    policyFound.value_showed = fleetsPolicies[aPolicy].value;
                }

              }
              if ($scope.fleetPolicies[fleetsPolicies[aPolicy].plugin_flyvemdm_fleets_id]) {
                $scope.fleetPolicies[fleetsPolicies[aPolicy].plugin_flyvemdm_fleets_id].push(policyFound);
              }
          }
        }
      });
    };
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(item) {
        var lowercase = angular.lowercase(item.name);
        return (lowercase.indexOf(lowercaseQuery) >= 0);
      };
    }
    function queryPolicySearch(query) {
      return query ? $scope.policies.filter(createFilterFor(query)) : $scope.policies;
    }
    $scope.queryPolicySearch = queryPolicySearch;
    function queryPathSearch(query) {
      return query ? $scope.wellknownPaths.filter(createFilterFor(query)) : $scope.wellknownPaths;
    }
    $scope.queryPathSearch = queryPathSearch;
    var EditPolicyController = function ($mdDialog, $scope, policy) {
      $scope.types = JSON.parse(policy.type_data);
      $scope.policy = angular.copy(policy);
      if ($scope.policy.type === 'bool' && $scope.policy.value === "") {
        $scope.policy.value = 0;
      }
      $scope.hide = function () {
        $mdDialog.hide();
      };
      $scope.cancel = function () {
        $mdDialog.cancel();
      };
      $scope.save = function (policyValue) {
        $mdDialog.hide(policyValue);
      };
    };
    var EditFleetController = function ($mdDialog, $scope, fleet, selectedTabIndex, data) {
      $scope.lock_file = true;
      $scope.data = data;
      $scope.fleet = fleet;
      $scope.selectedIndex = selectedTabIndex;
      $scope.editPolicy = function (aPolicy) {
        $mdDialog.hide().then(function () {
          switch (aPolicy.type) {
            default:
              $mdDialog.show({
                controller: EditPolicyController,
                templateUrl: 'views/dialog_editpolicy.html',
                locals: { policy: aPolicy },
                clickOutsideToClose: true
              }).then(function (policyValue) {
                $scope.data.policies.virtual.some(function (_policy, index) {
                  if (_policy.id === aPolicy.id) {
                    $scope.data.policies.virtual[index].value = policyValue;
                    switch (aPolicy.type) {
                      case "dropdown":
                        var type_data = JSON.parse(aPolicy.type_data);
                        $scope.data.policies.virtual[index].value_showed = type_data[policyValue];
                        break;
                      case "bool":
                        if (parseInt(policyValue) === 1) {
                          $scope.data.policies.virtual[index].value_showed = "Enabled";
                        } else {
                          $scope.data.policies.virtual[index].value_showed = "Disabled";
                        }
                        break;
                      default:
                        $scope.data.policies.virtual[index].value_showed = policyValue;
                    }
                  }
                });
                fleetsControllerScope.editFleet($scope.fleet, 1, $scope.data);
              }, function () {
                fleetsControllerScope.editFleet($scope.fleet, 1, $scope.data);
              });
              break;
          }
        });
      };
      $scope.queryPolicySearch = fleetsControllerScope.queryPolicySearch;
      $scope.queryPathSearch = fleetsControllerScope.queryPathSearch;
      function selectedPolicyChange(_policy) {
        if (typeof _policy !== 'undefined') {
          $scope.addPolicyToFleet(_policy);
          $scope.searchText = "";
        }
      }
      $scope.selectedPolicyChange = selectedPolicyChange;
      $scope.fileUpload = {
        progress: 0,
        upload: null,
        path: null
      };
      function selectedPathChange(aPath) {
        if (typeof aPath !== 'undefined') {
          $scope.fileUpload.path = aPath.name;
          if ($scope.fileUpload.upload) {
            $scope.pathToSaveFileTo = aPath.name;
          } else {
            $scope.pathToSaveFileTo = aPath.name;
          }
        }
      }
      $scope.$watch('fileUpload.upload', function () {
        if ($scope.fileUpload.path && $scope.fileUpload.upload) {
          $scope.pathToSaveFileTo = $scope.fileUpload.path;
        }
      });
      $scope.$watch('pathToSaveFileTo', function (new_path) {
        if (new_path) {
          var split_path = new_path.split("\/");
          if (split_path[1]) {
            $scope.lock_file = false;
          } else {
            $scope.lock_file = false;
          }
        } else {
          $scope.lock_file = true;
        }
      });
      $scope.selectedPathChange = selectedPathChange;
      $scope.wellknownPaths = fleetsControllerScope.wellknownPaths;
      $scope.uploadFile = function (fileToUpload, pathToSaveFileTo) {
        if (!fileToUpload) {
          return;
        }
        FilesAdminFac.uploadFile(fileToUpload).then(function (response) {
          $scope.data.files.virtual.push({
            id: response.data.id,
            name: fileToUpload.name
          });
          $scope.data.files.deploy.push({
            id: response.data.id,
            name: fileToUpload.name,
            destination: pathToSaveFileTo
          });
          // reset the fdownload status
          // and referece to File() object.
          $scope.fileUpload = {
            progress: 0,
            upload: null
          };
          // reset the asked path (to save file to)
          $scope.pathToSaveFileTo = '';
        }, function () {
          // error
        }, function (progressPercentage) {
          $scope.fileUpload.progress = progressPercentage;
        });
      };
      $scope.deleteAssociatedFile = function (file) {
        $mdDialog.show(
          $mdDialog.confirm()
            .title('Are you certain ?')
            .content('you-re going to delete this "' + file.name + '" file, confirm ?')
            .ok('Accept')
            .cancel('Cancel')
        )
          .then(function () {
            FilesAdminFac.deleteFile(file.id).then(function () {
              $scope.data.files.virtual.some(function (_current_file, index) {
                if (file.id === _current_file.id) {
                  $scope.data.files.virtual.splice(index, 1);
                }
              });
              $scope.data.files.current.some(function (_current_file) {
                if (file.id === _current_file.id) {
                  $scope.data.files.remove.push(_current_file);
                }
              });
            });
          }, function () { })
          .finally(function () {
            fleetsControllerScope.editFleet($scope.fleet, 3, $scope.data);
          });
      };
      $scope.deletePolicyFromFleet = function (_policy) {
        var indexof;
        if ((indexof = $scope.data.policies.virtual.indexOf(_policy)) > -1) {
          $scope.data.policies.virtual.splice(indexof, 1);
          return true;
        }
      };
      $scope.addPolicyToFleet = function (aPolicy) {
        aPolicy.value = aPolicy.recommended_value;
        switch (aPolicy.type) {
          case "dropdown":
            var type_data = JSON.parse(aPolicy.type_data);
            aPolicy.value_showed = type_data[aPolicy.value];
            break;
          case "bool":
            if (parseInt(aPolicy.value) === 1) {
              aPolicy.value_showed = "Enabled";
            } else {
              aPolicy.value_showed = "Disabled";
              aPolicy.value = 0;
            }
            break;
          default:
            aPolicy.value_showed = aPolicy.value;
        }
        if (!aPolicy) {
          return;
        }
        if ($scope.data.policies.virtual.map(function (x) { return x.id; }).indexOf(aPolicy.id) === -1) {
          $scope.data.policies.virtual.push(aPolicy);
        } else {
          $mdDialog.hide().then(function () {
            $mdDialog.show(
              $mdDialog.alert()
                .title('Duplicate Policy')
                .content('The policy: ' + aPolicy.name + ' is already added.')
                .ariaLabel('Duplicate Policy')
                .ok('Accept')
            ).then(function () {
              fleetsControllerScope.editFleet($scope.fleet, 1, $scope.data);
            });
          });
        }
      };
      $scope.noMoreApplicationsAvailableToAdd = function () {
        if ($scope.data.applications.available.length > 0) {
          $scope.noMoreApplicationsAvailableToAddMsg = "You already added all the available applications to the fleet.";
        } else {
          $scope.noMoreApplicationsAvailableToAddMsg = "No available applications to the fleet.";
        }
        var n_application_available = 0;
        if ($scope.data.applications.available) {
          $scope.data.applications.available.forEach(function (_application) {
            if ($scope.data.applications.current) {
              if ($scope.data.applications.current.indexOf(_application) > -1 ||
                $scope.data.applications.deploy.indexOf(_application) > -1) {
                return;
              }
            }
            n_application_available++;
          });
        }
        return n_application_available === 0;
      };
      $scope.deleteApplicationFromFleet = function (_application) {
        var indexof;
        if ((indexof = $scope.data.applications.deploy.indexOf(_application)) > -1) {
          $scope.data.applications.deploy.splice(indexof, 1);
          return true;
        } else {
          if ((indexof = $scope.data.applications.current.indexOf(_application)) > -1) {
            $scope.data.applications.remove.push(_application);
            $scope.data.applications.current.splice(indexof, 1);
          }
          return true;
        }
      };
      $scope.addApplicationToFleet = function (_application) {
        var indexof;
        $scope.selectedApplicationToAdd = null;
        if (!_application) {
          return;
        }
        if ($scope.data.applications.current.indexOf(_application) === -1 &&
          $scope.data.applications.deploy.indexOf(_application) === -1 &&
          $scope.data.applications.remove.indexOf(_application) === -1) {
          $scope.data.applications.deploy.push(_application);
        }
        else if ((indexof = $scope.data.applications.remove.indexOf(_application)) > -1) {
          $scope.data.applications.remove.splice(indexof, 1);
          $scope.data.applications.current.push(_application);
        }
      };
      var syncRemotePolicies = function () {
        var installedOnSavePolicies = [];
        var deletedOnSavePolicies = [];
        var updateOnSavePolicies = [];
        $scope.data.policies.virtual.forEach(function (aPolicy) {
          var policyPos = $scope.data.policies.current.map(function (x) { return x.id; })
            .indexOf(aPolicy.id);
          if (policyPos === -1) {
            installedOnSavePolicies.push(aPolicy);
          }
        });
        $scope.data.policies.current.forEach(function (aPolicy) {
          var policyPos = $scope.data.policies.virtual.map(function (x) { return x.id; })
            .indexOf(aPolicy.id);
          if (policyPos === -1) {
            deletedOnSavePolicies.push(aPolicy);
          } else {
            if ($scope.data.policies.virtual[policyPos].value !== aPolicy.value) {
              updateOnSavePolicies.push($scope.data.policies.virtual[policyPos]);
            }
          }
        });
        var promises = {
          fleetPoliciesIds: FleetsAdminFac.createPolicies(installedOnSavePolicies, $scope.fleet.id),
          deletionCompleted: FleetsAdminFac.deletePolicies(deletedOnSavePolicies),
          updateCompleted: FleetsAdminFac.updatePolicies(updateOnSavePolicies)
        };
        $q.all(promises).then(function (results) {
          installedOnSavePolicies.forEach(function (aPolicy, index) {
            var policyPos = $scope.data.policies.virtual.map(function (x) { return x.id; })
              .indexOf(aPolicy.id);
            var policyFound = $scope.data.policies.virtual[policyPos];
            policyFound.plugin_flyvemdm_fleet_policy_id = results.fleetPoliciesIds[index].id;
          });
          angular.copy($scope.data.policies.virtual, $scope.data.policies.current);
          if (!angular.equals($scope.data.policies.current, fleetsControllerScope.fleetPolicies[$scope.fleet.id])) {
            angular.copy($scope.data.policies.current, fleetsControllerScope.fleetPolicies[$scope.fleet.id]);
          }
        });
      };
      var syncRemoteApplications = function () {
        $scope.data.applications.deploy.forEach(function (anApp) {
          var deployApp = {
            "plugin_flyvemdm_fleets_id": $scope.fleet.id,
            "plugin_flyvemdm_policies_id": fleetsControllerScope.policyToDeployAppId,
            "value": {
              "remove_on_delete": 1
            },
            "itemtype": "PluginFlyvemdmPackage",
            "items_id": anApp.id
          };
          FleetsAdminFac.createPolicy(deployApp).then(function (aPolicyId) {
            anApp.plugin_flyvemdm_fleet_policy_id = aPolicyId;
            $scope.data.applications.current.push(anApp);
            if (!angular.equals($scope.data.applications.current, fleetsControllerScope.fleetApps[$scope.fleet.id])) {
              angular.copy($scope.data.applications.current, fleetsControllerScope.fleetApps[$scope.fleet.id]);
            }
          });
        });
        $scope.data.applications.remove.forEach(function (anApp) {
          FleetsAdminFac.deletePolicy(anApp.plugin_flyvemdm_fleet_policy_id).then(function () {
            if (!angular.equals($scope.data.applications.current, fleetsControllerScope.fleetApps[$scope.fleet.id])) {
              angular.copy($scope.data.applications.current, fleetsControllerScope.fleetApps[$scope.fleet.id]);
            }
          });
        });
      };
      var syncRemoteFiles = function () {
        $scope.data.files.deploy.forEach(function (aFile) {
          var deployFile = {
            "plugin_flyvemdm_fleets_id": $scope.fleet.id,
            "plugin_flyvemdm_policies_id": fleetsControllerScope.policyToDeployFileId,
            "value": {
              "destination": aFile.destination,
              "remove_on_delete": 1
            },
            "itemtype": "PluginFlyvemdmFile",
            "items_id": aFile.id
          };
          FleetsAdminFac.createPolicy(deployFile).then(function (aPolicyId) {
            aFile.plugin_flyvemdm_fleet_policy_id = aPolicyId;
            $scope.data.files.current.push(aFile);
            if (!angular.equals($scope.data.files.current, fleetsControllerScope.fleetFiles[$scope.fleet.id])) {
              angular.copy($scope.data.files.current, fleetsControllerScope.fleetFiles[$scope.fleet.id]);
            }
          });
        });
        $scope.data.files.remove.forEach(function () {
          if (!angular.equals($scope.data.files.virtual, fleetsControllerScope.fleetFiles[$scope.fleet.id])) {
            angular.copy($scope.data.files.virtual, fleetsControllerScope.fleetFiles[$scope.fleet.id]);
          }
        });
      };
      $scope.cancel = function () {
        $mdDialog.hide();
      };
      $scope.saveFleet = function () {
        // Edit mode
        if ($scope.fleet.id) {
          if (fleet.name !== $scope.fleet.name) {
            $mdDialog.hide().then(function () {
              FleetsAdminFac.updateFleet($scope.fleet.id, $scope.fleet.name).then(function () {
                fleet.name = $scope.fleet.name;
                if (!angular.equals($scope.data.policies.virtual, $scope.data.policies.current)) {
                  syncRemotePolicies();
                }
                syncRemoteApplications();
                syncRemoteFiles();
              });
            });
          }
          $mdDialog.hide().then(function () {
            if (!angular.equals($scope.data.policies.virtual, $scope.data.policies.current)) {
              syncRemotePolicies();
            }
            syncRemoteApplications();
            syncRemoteFiles();
          });
        }
        // Creation mode
        else {
          var input2 = {
            "name": $scope.fleet.name
          };
          $mdDialog.hide().then(function () {
            FleetsAdminFac.createFleet(input2).then(function (aFleetId) {
              fleetsControllerScope.displayedCollection.push({
                id: aFleetId,
                name: input2.name
              });
              $scope.fleet.id = aFleetId;
              for (var aPolicy in $scope.data.policies.virtual) {
                $scope.data.policies.virtual[aPolicy].plugin_flyvemdm_fleets_id = $scope.fleet.id;
              }
              fleetsControllerScope.fleetPolicies[$scope.fleet.id] = [];
              fleetsControllerScope.fleetApps[$scope.fleet.id] = [];
              fleetsControllerScope.fleetFiles[$scope.fleet.id] = [];
              $scope.data.policies.current = angular.copy(fleetsControllerScope.fleetPolicies[$scope.fleet.id]);
              $scope.data.applications.current = angular.copy(fleetsControllerScope.fleetApps[$scope.fleet.id]);
              $scope.data.files.current = angular.copy(fleetsControllerScope.fleetFiles[$scope.fleet.id]);
              syncRemoteApplications();
              syncRemoteFiles();
              syncRemotePolicies();
            });
          });
        }
      };
    };
    $scope.deleteFleet = function (fleet) {
      $mdDialog.show(
        $mdDialog.confirm()
          .title('Please confirm deletion')
          .content('Are you certain you want to delete ' + fleet.name)
          .ok('Accept')
          .cancel('Cancel')
      ).then(function () {
        FleetsAdminFac.deleteFleet(fleet.id).then(function () {
          Notifications.done("Fleet deleted");
          fleetsControllerScope.displayedCollection.some(function (_displayedFleet, index) {
            if (_displayedFleet.id === fleet.id) {
              fleetsControllerScope.displayedCollection.splice(index, 1);
              return true;
            }
          });
        });
      });
    };
    $scope.editFleet = function (fleet, selectedIndex, data) {
      if (!data) {
        data = {
          policies: {
            categories: $scope.policyCategories,
            available: $scope.policies,
            virtual: angular.copy($scope.fleetPolicies[fleet.id]),
            current: angular.copy($scope.fleetPolicies[fleet.id]),
            deploy: [],
            remove: []
          },
          applications: {
            available: $scope.applications,
            virtual: angular.copy($scope.fleetApps[fleet.id]),
            current: angular.copy($scope.fleetApps[fleet.id]),
            deploy: [],
            remove: []
          },
          files: {
            available: $scope.files,
            virtual: angular.copy($scope.fleetFiles[fleet.id]),
            current: angular.copy($scope.fleetFiles[fleet.id]),
            deploy: [],
            remove: []
          }
        };
      }
      $mdDialog.show({
        controller: EditFleetController,
        templateUrl: 'views/dialog_editfleet.html',
        parent: angular.element(document.body),
        clickOutsideToClose: false,
        locals: {
          fleet: {
            id: fleet.id,
            name: fleet.name
          },
          selectedTabIndex: selectedIndex,
          data: data
        }
      });
    };
    $scope.insertIntoTable = $scope.newFleet = function () {
      var data = {
        policies: {
          categories: $scope.policyCategories,
          available: $scope.policies,
          virtual: [],
          current: [],
          deploy: [],
          remove: []
        },
        applications: {
          available: $scope.applications,
          virtual: [],
          current: [],
          deploy: [],
          remove: []
        },
        files: {
          available: $scope.files,
          virtual: [],
          current: [],
          deploy: [],
          remove: []
        }
      };
      $mdDialog.show({
        controller: EditFleetController,
        templateUrl: 'views/dialog_editfleet.html',
        parent: angular.element(document.body),
        clickOutsideToClose: false,
        locals: {
          fleet: {
            id: null,
            name: ""
          },
          selectedTabIndex: 0,
          data: data
        }
      });
    };
  });