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
 * @name FlyveMDM.UsersAdminFac
 * @description
 * # UsersAdminFac
 * Factory in the FlyveMDM.
 */
angular.module('FlyveMDM')
  .factory('UsersAdminFac', function (GLPI_API_URL, GlpiObjectNames, $q, $http) {
    // Service logic
    var active_profile = false;
    var current_entity = false;
    // Public API here
    return {

      /**
       * Get a specific user
       * @param aUserId the id of the user
       */
      getUser: function (aUserId) {
        var getUserDefer = $q.defer();
        $http({
          method: 'GET',
          url: GLPI_API_URL + GlpiObjectNames.GlpiUser + '/' + aUserId
        }).then(function (response) {
          var aUser = response.data;
          var rUser = {};
          rUser.id = aUser.id;
          rUser.username = aUser.name;
          rUser.fullname = aUser.realname;
          getUserDefer.resolve(rUser);
        }, function () {
          getUserDefer.reject();
        });
        return getUserDefer.promise;
      },

      /**
       * Get all the users
       */
      getUsers: function () {
        var getUsersDefer = $q.defer();
        $http({
          method: 'GET',
          url: GLPI_API_URL + GlpiObjectNames.GlpiUser,
          params: {
            range: '0-1000'
          }
        }).then(function (response) {
          var rUsers = response.data.map(function (aUser) {
            var rUser = {};
            rUser.id = aUser.id;
            rUser.username = aUser.name;
            rUser.firstname = aUser.firstname;
            rUser.lastname = aUser.realname;
            if (aUser.firstname && aUser.realname) {
              rUser.fullname = aUser.firstname + ' ' + aUser.realname;
            } else {
              if (aUser.firstname) {
                rUser.fullname = aUser.firstname;
              } else {
                rUser.fullname = aUser.realname;
              }
            }
            return rUser;
          });
          getUsersDefer.resolve(rUsers);
        }, function () {
          getUsersDefer.reject();
        });
        return getUsersDefer.promise;
      },

      /**
       * Update user information
       * @param aUser the user to update
       */
      updateUser: function (aUser) {
        var preRequestDefer = $q.defer();
        var updateUserDefer = $q.defer();
        var profileInfos = {
          id: aUser.id,
          name: aUser.username,
          firstname: aUser.firstname,
          realname: aUser.lastname
        };
        if (aUser.password) {
          var fullSessionDefer = $q.defer();
          $http.get(GLPI_API_URL + GlpiObjectNames.FullSession).then(function (data) {
            current_entity = data.session.glpiactive_entity;
            active_profile = data.session.glpiactiveprofile.id;
            fullSessionDefer.resolve();
          }, function () {
            fullSessionDefer.reject();
            preRequestDefer.reject();
            updateUserDefer.reject();
          });
          fullSessionDefer.promise.then(function () {
            $http({
              method: 'POST',
              url: GLPI_API_URL + GlpiObjectNames.Profile_User,
              data: {
                input: {
                  users_id: aUser.id,
                  profiles_id: active_profile,
                  entities_id: current_entity,
                  is_recursive: 0
                }
              }
            }).then(function () {
              preRequestDefer.resolve();
            }, function () {
              preRequestDefer.reject();
              updateUserDefer.reject();
            });
          });
          profileInfos.password = aUser.password;
          profileInfos.password2 = aUser.password2;

        } else {
          preRequestDefer.resolve();
        }
        //ToDo: {"input": {"users_id": "1", "profiles_id": "9", "entities_id": "5", "is_recursive": "0"}}
        preRequestDefer.promise.then(function () {
          $http({
            method: 'PUT',
            url: GLPI_API_URL + GlpiObjectNames.GlpiUser,
            data: {
              input: profileInfos
            }
          }).then(function () {
            updateUserDefer.resolve();
          }, function () {
            updateUserDefer.reject();
          });
        });
        return updateUserDefer.promise;
      },

      /**
       * Deletes the user from the dashboard
       * @param aUserId the user ID
       */
      deleteUser: function (aUserId) {
        var deleteUserDefer = $q.defer();
        $http({
          method: 'DELETE',
          url: GLPI_API_URL + GlpiObjectNames.GlpiUser + '/' + aUserId,
          data: {
            force_purge: true
          }
        }).then(function () {
          deleteUserDefer.resolve();
        }, function () {
          $http.get(GLPI_API_URL + GlpiObjectNames.Profile_User, { params: { 'searchText[users_id]': aUserId } }).then(function (data) {
            var profileId = data[0].id;
            $http({
              method: 'DELETE',
              url: GLPI_API_URL + GlpiObjectNames.Profile_User + '/' + profileId,
              data: {
                force_purge: true
              }
            }).then(function () {
              deleteUserDefer.resolve();
            }, function () {
              deleteUserDefer.reject();
            });
          }, function () {
            deleteUserDefer.reject();
          });
        });
        return deleteUserDefer.promise;
      },
      attemptRegister: function (profileInfos) {
        var activeProfileDefer = $q.defer();
        var createUserDefer = $q.defer();
        $http.get(GLPI_API_URL + GlpiObjectNames.ActiveProfile).then(function (data) {
          active_profile = data.active_profile.id;
          activeProfileDefer.resolve();
        }, function () {
          activeProfileDefer.reject();
          createUserDefer.reject();
        });
        activeProfileDefer.promise.then(function () {
          $http({
            method: 'POST',
            url: GLPI_API_URL + GlpiObjectNames.GlpiUser,
            data: {
              input: {
                name: profileInfos.username,
                _profiles_id: active_profile,
                _useremails: [profileInfos.username],
                firstname: profileInfos.firstname,
                realname: profileInfos.lastname,
                password: profileInfos.password,
                password2: profileInfos.password2,
              }
            }
          }).then(function (response) {
            createUserDefer.resolve(response.data.id);
          }, function () {
            createUserDefer.reject();
          });
        });
        return createUserDefer.promise;
      }
    };
  });
