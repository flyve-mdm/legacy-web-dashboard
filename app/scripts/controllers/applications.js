'use strict';
/**
 * @ngdoc function
 * @name FlyveMDM.controller:ApplicationsCtrl
 * @description
 * # ApplicationsCtrl
 * Controller of the FlyveMDM
 */
angular.module('FlyveMDM')
  .controller('AppsAdminCtrl', function (AppsAdminFac, PoliciesAdminFac, FleetsAdminFac,
    Notifications, AuthProvider, $q, $state, $scope, $mdDialog) {
    // keeps a reference on the scope of this controller
    // which will be used in the controller of the dialog
    // created by this controller (using $mdDialog)
    var applicationsControllerScope = $scope;
    // making use of the login Provider(Angular)
    // created for this project to represent the
    // "connection" to the Flyve/GLPi API
    if (!AuthProvider.seemsLogged()) {
      return AuthProvider.showLogin(true);
    }
    // simply saying important keys of the
    // controller are initialised with empty
    // arrays in order to make empty collections
    // in the scope for angular not to worry
    // about some ng-repeat declared on unexisting
    // scope variables
    $scope.applications = [];
    $scope.displayedCollection = [];
    $scope.itemsByPage = 5;
    /**
     * Constructor for the Application Eition dialog's controller
     */
    var NewApplicationController = function ($scope, $mdDialog) {
      $scope.lock_submit = true;
      $scope.uploadProgress = 0;
      $scope.application = {
        "alias": "",
      };
      var request;
      $scope.validateFile = function (aFileBlob) {
        $scope.lock_submit = true;
        $scope.application.alias = "";
        var valid_ext = false;
        $scope.errors = {
          show: false,
          message: null
        };
        if (aFileBlob) {
          var regex = /^.*(.apk|.upk)$/g;
          var m;
          while ((m = regex.exec(aFileBlob.name.toLowerCase())) !== null) {
            if (m.index === regex.lastIndex) {
              regex.lastIndex++;
            }
            valid_ext = true;
          }
          if (valid_ext) {
            $scope.application.alias = aFileBlob.name;
            $scope.lock_submit = false;
            setTimeout(function () { document.querySelector('button[type="submit"]').focus(); }, 100);
          } else {
            $scope.errors.show = true;
            $scope.errors.message = 'Invalid file extension (accept only UPK or APK)';
          }
        }
      };
      /**
       * This is the "save" scope function which is
       * triggered when the user closes the dialog
       * by using the "save" button.
       * Is is doing special checkup to verify if
       * we're about to POST a new Application
       */
      $scope.saveApplication = function (applicationFile) {
        $scope.lock_submit = true;
        request = AppsAdminFac.uploadApplication(applicationFile, $scope.application.alias);
        request.then(function (response) {
          $mdDialog.hide().then(function () {
            Notifications.done("Application uploaded");
            AppsAdminFac.getApplication(response.data.id).then(function (anApplication) {
              applicationsControllerScope.displayedCollection.push(anApplication);
            });
          });
        }, function (response) {
          if (response.status === -1) {
            Notifications.error("Upload cancelled");
          } else {
            $scope.application = {
              alias: ""
            };
            $scope.uploadProgress = 0;
          }
        }, function (evt) {
          $scope.uploadProgress = parseInt(100.0 * evt.loaded / evt.total);
        });
      };
      $scope.cancel = function () {
        $mdDialog.cancel();
        if (request) {
          request.abort();
        }
      };
    };
    var editApplicationController = function ($scope, $mdDialog, _application) {
      $scope.lock_submit = false;
      $scope.application = angular.copy(_application);
      $scope.$watch('application.alias', function () {
        $scope.lock_submit = Boolean($scope.application.alias.toString() === _application.alias.toString());
      });
      $scope.cancel = function () {
        $mdDialog.hide();
      };
      $scope.saveApplication = function () {
        $scope.lock_submit = true;
        var input = {};
        input.id = $scope.application.id;
        AppsAdminFac.updateApplication($scope.application.id, $scope.application.alias).then(function () {
          $mdDialog.hide().then(function () {
            Notifications.done("Application edited");
            applicationsControllerScope.displayedCollection.some(function (__application) {
              if (__application.id === _application.id) {
                __application.alias = $scope.application.alias;
                return true;
              }
            });
          });
        });
      };
    };
    $scope.editApplication = function (ev, _application) {
      $mdDialog.show({
        controller: editApplicationController,
        targetEvent: ev,
        locals: {
          _application: _application
        },
        templateUrl: 'views/dialog_editapplication.html',
        parent: angular.element(document.body),
        clickOutsideToClose: false
      });
    };
    /**
     * Scope method called when the end-user
     * chooses "Application > Create new application"
     * in the menubar
     */
    $scope.insertIntoTable = $scope.newApplication = function () {
      $mdDialog.show({
        controller: NewApplicationController,
        templateUrl: 'views/dialog_newapplication.html',
        parent: angular.element(document.body),
        clickOutsideToClose: false
      });
    };
    /**
     * Scope method called when the end-user
     * chooses to click on the delete-icon
     * of a specific application line in the view
     */
    $scope.deleteApplication = function (ev, anApplication) {
      $mdDialog.show(
        $mdDialog.confirm()
          .title('Delete application #' + anApplication.id)
          .content('You are going to delete application ' + anApplication.id + '.')
          .ariaLabel('delete this application')
          .targetEvent(ev)
          .ok('Accept')
          .cancel('Cancel')
      ).then(function () {
        $mdDialog.show(
          $mdDialog.confirm()
            .title('Please confirm deletion from the device')
            .content('Do you want to create a policy to remove the application ' + anApplication.id + '?')
            .ariaLabel('policy remove on delete application')
            .ok('Yes')
            .cancel('No')
        ).then(function () {
          for (var aPolicy in $scope.fleetPolicies) {
            if (aPolicy.plugin_storkmdm_policies_id === $scope.policyToDeployAppId && aPolicy.items_id === anApplication.id) {
              var input = {
                remove_on_delete: 1
              };
              FleetsAdminFac.updatePolicy(aPolicy.id, input);
            }
          }
        }).finally(function () {
          AppsAdminFac.deleteApplication(anApplication.id).then(function () {
            Notifications.done("Application deleted");
            applicationsControllerScope.displayedCollection.some(function (_application, index) {
              if (_application.id === anApplication.id) {
                applicationsControllerScope.displayedCollection.splice(index, 1);
                return true;
              }
            });
          });
        });
      });
    };
    $scope.loading = false;
    var smartTableTableState = null;
    /**
     * Scope function associated with the st-pipe
     * angular directive, which is calling it the
     * first time to know the backend collection size
     * and get the first page.
     * That function is also called by the st-pipe
     * directive each time the user will try to
     * change the current page.
     */
    $scope.fillTable = function (tableState) {
      // saving reference of the tableState to hack
      // for the itemsByPage selector
      if (smartTableTableState === null) {
        smartTableTableState = tableState;
      }
      var startIndex = tableState.pagination.start;
      var requestedRange = '' + startIndex + '-' + (startIndex + tableState.pagination.number);
      // in case of specific pre-function error due
      // to non-int given to parseInt
      if (requestedRange.indexOf('NaN') > -1) {
        return;
      }
      $scope.loading = true;
      var getApplications = AppsAdminFac.getApplications();
      var getPolicies = PoliciesAdminFac.getPolicyToDeployApp();
      var getFleetPolicy = FleetsAdminFac.getPolicies();
      $q.all([getApplications, getPolicies, getFleetPolicy])
        .then(function (responses) {
          var applications = responses[0];
          $scope.fleetPolicies = responses[2];
          $scope.loading = false;
          $scope.displayedCollection = applications;
          $scope.collectionLength = applications.length,
            tableState.pagination.totalItemCount = applications.length;
          $scope.policyToDeployAppId = responses[1];
        });
    };
    $scope.refreshPaginatedPage = function () {
      if (smartTableTableState !== null) {
        $scope.updatePaginatedPage(smartTableTableState);
      }
    };
  });
