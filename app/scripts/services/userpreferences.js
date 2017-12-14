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
 * @name FlyveMDM.UserPreferencesFac
 * @description
 * # UserPreferencesFac
 * Factory in the FlyveMDM.
 */
angular.module('FlyveMDM')
  .factory('UserPreferencesFac', function (GLPI_API_URL, GlpiObjectNames, $q, $http) {
    return {
      updateMyPassword: function (userId, password, password2) {
        var deffered = $q.defer();
        $http.put(
          GLPI_API_URL + GlpiObjectNames.GlpiUser + '/' + userId,
          { input: { password: password, password2: password2 } }

        ).then(function (response) {
          deffered.resolve(response);
        }, function () {
          deffered.reject();
        });
        return deffered.promise;
      },

      /**
       * Change language of the dashboard
       * @param aUserId the id of the user
       * @param aCode the new language
       */
      changeLanguage: function (aUserId, aCode) {
        var deffered = $q.defer();
        $http.put(
          GLPI_API_URL + GlpiObjectNames.GlpiUser + '/' + aUserId,
          { input: { language: aCode } }
        ).then(function (response) {
          deffered.resolve(response.data);
        }, function () {
          deffered.reject();
        });
        return deffered.promise;
      },
      updateUserInformation: function (anInput) {
        var deffered = $q.defer();
        var user = {
          name: anInput.name,
          phone: anInput.phone,
          phone2: anInput.phone2,
          mobile: anInput.mobile,
          realname: anInput.realname,
          firstname: anInput.firstname,
          registration_number: anInput.registration_number,
        };
        $http.put(
          GLPI_API_URL + GlpiObjectNames.GlpiUser + '/' + anInput.id,
          { input: user }
        ).then(function (response) {
          deffered.resolve(response.data);
        }, function () {
          deffered.reject();
        });
        return deffered.promise;
      },
      getUserInformation: function (aUserId) {
        var deffered = $q.defer();
        $http({
          method: 'GET',
          url: GLPI_API_URL + GlpiObjectNames.GlpiUser + '/' + aUserId,
        }).then(function (response) {
          var user = response.data;
          var rUser = {
            name: user.name,
            phone: user.phone,
            phone2: user.phone2,
            mobile: user.mobile,
            realname: user.realname,
            firstname: user.firstname,
            language: user.language,
            last_login: user.last_login,
            date_mod: user.date_mod,
            date_creation: user.date_creation,
            registration_number: user.registration_number,
            picture: user.picture
          };
          deffered.resolve(rUser);
        }, function () {
          deffered.reject();
        });
        return deffered.promise;
      },
      getPluginVersion: function () {
        var deffered = $q.defer();
        $http({
          method: 'GET',
          url: GLPI_API_URL + GlpiObjectNames.Config,
          params: {
            'searchText[name]': 'version',
            'searchText[context]': 'flyvemdm'
          }
        }).then(function (response) {
          var config = response.data;
          var version = config[0].value;
          deffered.resolve(version);
        }, function () {
          deffered.reject();
        });
        return deffered.promise;
      },
      getGLPiVersion: function () {
        var deffered = $q.defer();
        $http({
          method: 'GET',
          url: GLPI_API_URL + GlpiObjectNames.Config,
          params: {
            'searchText[name]': 'version',
            'searchText[context]': 'core'
          }
        }).then(function (response) {
          var config = response.data;
          var version = config[0].value;
          deffered.resolve(version);
        }, function () {
          deffered.reject();
        });
        return deffered.promise;
      },
      getPluginList: function () {
        var deffered = $q.defer();
        $http({
          method: 'GET',
          url: GLPI_API_URL + GlpiObjectNames.FullSession
        }).then(function (response) {
          var glpi_plugins = [];
          for (var plugin in response.data.session.glpi_plugins) {
            glpi_plugins.push(response.data.session.glpi_plugins[plugin]);
          }
          deffered.resolve(glpi_plugins);
        }, function () {
          deffered.reject();
        });
        return deffered.promise;
      }
    };
  });