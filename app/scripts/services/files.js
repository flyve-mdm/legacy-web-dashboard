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

      /**
       * Get a specific file
       * @param aFileId the id of the file
       */
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
