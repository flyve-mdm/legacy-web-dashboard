'use strict';
/**
 * @ngdoc function
 * @name FlyveMDM.controller:FilesadminCtrl
 * @description
 * # FilesadminCtrl
 * Controller of the FlyveMDM
 */
angular.module('FlyveMDM')
  .controller('FilesAdminCtrl', function (FilesAdminFac, Notifications, $scope,
    $mdDialog) {
    var filesControllerScope = $scope;
    $scope.displayedCollection = [];
    var EditFileController = function ($scope, $mdDialog, file) {
      $scope.lock_submit = true;
      $scope.file = angular.copy(file);
      $scope.$watch('file.name', function () {
        $scope.lock_submit = Boolean($scope.file.name.toString() === file.name.toString());
      });
      $scope.cancel = function () {
        $mdDialog.hide();
      };
      $scope.saveFile = function () {
        $scope.lock_submit = true;
        FilesAdminFac.updateFile($scope.file.id, $scope.file.name).then(function () {
          $mdDialog.hide().then(function () {
            Notifications.done("File edited");
            filesControllerScope.displayedCollection.some(function (file) {
              if (file.id === $scope.file.id) {
                file.name = $scope.file.name;
                return true;
              }
            });
          });
        });
      };
    };
    var NewFileController = function ($scope, $mdDialog) {
      $scope.lock_submit = true;
      $scope.uploadProgress = 0;
      $scope.file = {
        "name": "",
      };
      var request;
      $scope.showName = function (aFileBlob) {
        if (aFileBlob.name) {
          $scope.file.name = aFileBlob.name;
          $scope.lock_submit = false;
        }
      };
      /**
       * This is the "save" scope function which is
       * triggered when the user closes the dialog
       * by using the "save" button.
       * Is is doing special checkup to verify if
       * we're about to POST a new Application
       */
      $scope.saveFile = function (aFileBlob) {
        $scope.lock_submit = true;
        request = FilesAdminFac.uploadFile2(aFileBlob, $scope.file.name);
        request.then(function (response) {
          $mdDialog.hide().then(function () {
            Notifications.done("File uploaded");
            FilesAdminFac.getFile(response.data.id).then(function (aFile) {
              filesControllerScope.displayedCollection.push(aFile);
            });
          });
        }, function (response) {
          if (response.status === -1) {
            Notifications.error("Upload cancelled");
          } else {
            $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.body))
                .clickOutsideToClose(true)
                .title('Error when uploading file')
                .content(response.data[1])
                .ariaLabel(response.data[1])
                .ok('Accept')
            );
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
    $scope.insertIntoTable = $scope.newFile = function () {
      $mdDialog.show({
        controller: NewFileController,
        templateUrl: 'views/dialog_newfile.html',
        parent: angular.element(document.body),
        clickOutsideToClose: false
      });
    };
    $scope.editFile = function (ev, file) {
      $mdDialog.show({
        controller: EditFileController,
        targetEvent: ev,
        locals: {
          file: file
        },
        templateUrl: 'views/dialog_editfile.html',
        parent: angular.element(document.body),
        clickOutsideToClose: false
      });
    };
    $scope.deleteFile = function (ev, file) {
      $mdDialog.show(
        $mdDialog.confirm()
          .title('Are you certain')
          .content('you want to delete the file "' + file.name + '"')
          .ok('Accept')
          .cancel('Cancel')
          .targetEvent(ev)
      ).then(function () {
        FilesAdminFac.deleteFile(file.id).then(function () {
          Notifications.done("File deleted");
          $scope.displayedCollection.some(function (_file, index) {
            if (_file.id === file.id) {
              $scope.displayedCollection.splice(index, 1);
              return true;
            }
          });
        });
      });
    };
    $scope.fillTable = function (tableState) {
      FilesAdminFac.getFiles().then(function (files) {
        $scope.displayedCollection = files;
        $scope.collectionLength = files.length;
        tableState.pagination.totalItemCount = files.length;
      });
    };
  });
