'use strict';

/**
 * @ngdoc service
 * @name FlyveMDM.FilesAdminFac
 * @description
 * # FilesAdminFac
 * Factory in the FlyveMDM.
 */
angular.module('FlyveMDM')
  .factory('FilesAdminFac', function (GLPI_API_URL, PluginObjectNames, AuthProvider, Upload, $q, $http) {
    // Service logic
    // Public API here
    return {
      getFile: function (aFileId) {
        var getFileDefer = $q.defer();
        $http({
          method: 'GET',
          url: GLPI_API_URL + PluginObjectNames.File + '/' + aFileId
        }).then(function (response) {
          var aFile = response.data;
          var rFile = {};
          rFile.id = aFile.id;
          rFile.name = aFile.name;
          rFile.source = aFile.source;
          getFileDefer.resolve(rFile);
        }, function () {
          getFileDefer.reject();
        });
        return getFileDefer.promise;
      },
      getFiles: function () {
        var getFilesDefer = $q.defer();
        $http({
          method: 'GET',
          url: GLPI_API_URL + PluginObjectNames.File
        }).then(function (response) {
          var files = response.data;
          var rFiles = files.map(function (aFile) {
            var rFile = {};
            rFile.id = aFile.id;
            rFile.name = aFile.name;
            rFile.source = aFile.source;
            return rFile;
          });
          getFilesDefer.resolve(rFiles);
        }, function () {
          getFilesDefer.reject();
        });
        return getFilesDefer.promise;
      },
      updateFile: function (aFileId, aFileName) {
        var updateFileDefer = $q.defer();
        $http({
          method: 'PUT',
          url: GLPI_API_URL + PluginObjectNames.File,
          data: {
            input: {
              id: aFileId,
              name: aFileName
            }
          }
        }).then(function () {
          updateFileDefer.resolve();
        }, function () {
          updateFileDefer.reject();
        });
        return updateFileDefer.promise;
      },
      deleteFile: function (aFileId) {
        var deleteFileDefer = $q.defer();
        $http({
          method: 'DELETE',
          url: GLPI_API_URL + PluginObjectNames.File + '/' + aFileId
        }).then(function () {
          deleteFileDefer.resolve();
        }, function () {
          deleteFileDefer.reject();
        });
        return deleteFileDefer.promise;
      },
      uploadFile: function (aFileToUpload) {
        var uploadFileDefer = $q.defer();
        Upload.upload({
          url: GLPI_API_URL + '/' + PluginObjectNames.File,
          data: {
            file: aFileToUpload,
            uploadManifest: JSON.stringify({
              session_token: AuthProvider.getCurrentToken(),
              input: {
                name: aFileToUpload.name
              }
            })
          }
        }).then(function (resp) {
          uploadFileDefer.resolve(resp);
        }, function (resp) {
          uploadFileDefer.resolve(resp.status);
        }, function (evt) {
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          uploadFileDefer.notify(progressPercentage);
        });
        return uploadFileDefer.promise;
      },
      uploadFile2: function (aFile, aFileName) {
        return Upload.upload({
          url: GLPI_API_URL + '/' + PluginObjectNames.File,
          data: {
            file: aFile,
            uploadManifest: JSON.stringify({
              input: {
                name: aFileName
              }
            })
          }
        });
      }
    };
  });
