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
 * @name FlyveMDM.AppsAdminFac
 * @description
 * # AppsAdminFac
 * Factory in the FlyveMDM.
 */
angular.module('FlyveMDM')
  .factory('AppsAdminFac', function (GLPI_API_URL, PluginObjectNames, AuthProvider, Upload, $q, $http) {
    // Service logic
    function bytesToSize(bytes) {
      bytes = parseInt(bytes);
      var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      if (bytes === 0) {
        return '0 Byte';
      }
      var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
      return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }
    // Public API here
    return {
      /**
       * Get a specific application
       * @param anApplicationId the id of the application
       */
      getApplication: function (anApplicationId) {
        var getApplicationDefer = $q.defer();
        $http({
          method: 'GET',
          url: GLPI_API_URL + PluginObjectNames.Application + '/' + anApplicationId
        }).then(function (response) {
          var anApplication = response.data;
          anApplication.filesize = bytesToSize(anApplication.filesize);
          anApplication.type = anApplication.dl_filename.substring(anApplication.dl_filename.lastIndexOf(".") + 1, anApplication.dl_filename.length);
          getApplicationDefer.resolve(anApplication);
        }, function () {
          getApplicationDefer.reject();
        });
        return getApplicationDefer.promise;
      },
      getApplications: function () {
        var getApplicationsDefer = $q.defer();
        $http({
          method: 'GET',
          url: GLPI_API_URL + PluginObjectNames.Application
        }).then(function (response) {
          var applications = response.data;
          var rApplications = applications.map(function (anApplication) {
            var rApplication = {};
            rApplication.id = anApplication.id;
            rApplication.icon = anApplication.icon;
            rApplication.alias = anApplication.alias;
            rApplication.name = anApplication.name;
            rApplication.version = anApplication.version;
            rApplication.filesize = bytesToSize(anApplication.filesize);
            rApplication.type = anApplication.dl_filename.substring(anApplication.dl_filename.lastIndexOf(".") + 1, anApplication.dl_filename.length);
            return rApplication;
          });
          getApplicationsDefer.resolve(rApplications);
        }, function () {
          getApplicationsDefer.reject();
        });
        return getApplicationsDefer.promise;
      },
      updateApplication: function (anApplicationId, anApplicationAlias) {
        var updateApplicationDefer = $q.defer();
        $http({
          method: 'PUT',
          url: GLPI_API_URL + PluginObjectNames.Application,
          data: {
            input: {
              id: anApplicationId,
              alias: anApplicationAlias
            }
          }
        }).then(function () {
          updateApplicationDefer.resolve();
        }, function () {
          updateApplicationDefer.reject();
        });
        return updateApplicationDefer.promise;
      },
      deleteApplication: function (anApplicationId) {
        var deleteApplicationDefer = $q.defer();
        $http({
          method: 'DELETE',
          url: GLPI_API_URL + PluginObjectNames.Application + '/' + anApplicationId
        }).then(function () {
          deleteApplicationDefer.resolve();
        }, function () {
          deleteApplicationDefer.reject();
        });
        return deleteApplicationDefer.promise;
      },
      uploadApplication: function (aApplicationToUpload, anApplicationAlias) {
        return Upload.upload({
          url: GLPI_API_URL + PluginObjectNames.Application,
          data: {
            file: aApplicationToUpload,
            uploadManifest: JSON.stringify({
              input: {
                alias: anApplicationAlias
              }
            })
          }
        });
      }
    };
  });
