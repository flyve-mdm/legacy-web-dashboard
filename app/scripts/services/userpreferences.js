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
            'searchText[context]': 'storkmdm'
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