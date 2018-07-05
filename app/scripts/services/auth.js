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
 * @name FlyveMDM.login
 * @description
 * # login
 * Provider in the FlyveMDM.
 */
angular.module('FlyveMDM')
  // Implementation of the login provider
  .provider('AuthProvider', function (GLPI_API_URL, GlpiObjectNames, PluginObjectNames, $httpProvider, $provide,
    USER_TOKEN, DEBUG) {
    // dependencies which will be injected by $get
    // using $injector.get()
    var $http, $rootScope, $q, instance, $state, $log, Notifications;
    // Private constructor
    var AuthProvider = function () { };
    var setSessionToken = function (sessionToken) {
      if (sessionToken === null) {
        localStorage.removeItem('sessionToken');
      } else {
        localStorage.setItem('sessionToken', sessionToken);
      }
      $rootScope.sessionToken = sessionToken;
    };
    /**
     * List of all the endpoint URLs
     * that won't need any session_token,
     * never
     */
    AuthProvider.prototype.exceptedEndpoints = [
      { "url": GlpiObjectNames.initSession },
      { "url": GlpiObjectNames.KillSession },
      { "url": PluginObjectNames.User, "method": "POST" }
    ];
    AuthProvider.prototype.isExceptedEndpoint = function (url, method) {
      var excepted = false;
      this.exceptedEndpoints.some(function (excepted_endpoint) {
        if (excepted_endpoint.url === url) {
          if (excepted_endpoint.method === undefined ||
            excepted_endpoint.method === method) {
            excepted = true;
          }
          return true;
        }
      });
      return excepted;
    };
    /**
    * This method does a login attempt to the GLPi
    * API and it returns a promise which will be resolved
    * if the login attempt is successful, or be
    * rejected if the login attempt is unsucessful.
    *
    * the $rootScope.sessionToken and localStorage
    * 'sessionToken' key will always be updated
    * after the promise returned by the method
    * resolves.
    */
    AuthProvider.prototype.attemptLogin = function (email, password) {
      var deferred = $q.defer();
      var request = $http({
        method: 'GET',
        url: GLPI_API_URL + GlpiObjectNames.InitSession,
        headers: {
          'Authorization': 'Basic ' + window.btoa(email + ':' + password)
        }
      });
      request.then(function (response) {
        setSessionToken(response.data.session_token);
        deferred.resolve();
      });
      request.catch(function () {
        setSessionToken(null);
        deferred.reject();
      });
      return deferred.promise;
    };
    AuthProvider.prototype.getTempSessionToken = function () {
      var tempSessionDeferred = $q.defer();
      $http({
        url: GLPI_API_URL + GlpiObjectNames.InitSession,
        method: 'GET',
        headers: {
          'Authorization': 'user_token ' + USER_TOKEN
        }
      }).then(function (response) {
        tempSessionDeferred.resolve(response.data.session_token);
      }, function () {
        tempSessionDeferred.reject();
      });
      return tempSessionDeferred.promise;
    };
    /*
     * User registration method, which returns
     * a promise, which will resolve if the
     * account has been correctly created on
     * the server, and reject if there is any
     * error
     */
    AuthProvider.prototype.attemptRegister = function (profileInfos) {
      var registrationDeferred = $q.defer();
      // This anonymous function helps retrieve a temporary
      // session_token with the api_key in order so it is
      // possible to register an user in the flyvemdm interface.
      this.getTempSessionToken().then(function (temp_session_token) {
        var request = $http({
          method: 'POST',
          url: GLPI_API_URL + PluginObjectNames.User,
          data: {
            input: profileInfos
          },
          headers: {
            'Session-Token': temp_session_token
          }
        });
        request.then(function () {
          registrationDeferred.resolve();
          $http({
            method: 'GET',
            url: GLPI_API_URL + GlpiObjectNames.KillSession,
            headers: {
              'Session-Token': temp_session_token
            }
          });
        }, function () {
          registrationDeferred.reject();
        });
      }, function () {
        registrationDeferred.reject();
      });
      return registrationDeferred.promise;
    };
    /**
     * Returns a promise which will in
     * fact always be resolved, even
     * the session_token wasn't
     * recognized by the server
     * on /killSession attempt
     */
    AuthProvider.prototype.logout = function () {
      if (navigator.credentials) {
        navigator.credentials.requireUserMediation();
      }
      var deferred = $q.defer();
      var request = $http({
        method: 'GET',
        url: GLPI_API_URL + GlpiObjectNames.KillSession,
        headers: {
          'Session-Token': $rootScope.sessionToken
        }
      });
      var afterSessionKilled = function () {
        setSessionToken(null);
        deferred.resolve();
      };
      request.then(afterSessionKilled);
      request.catch(afterSessionKilled);
      return deferred.promise;
    };
    AuthProvider.prototype.seemsLogged = function () {
      var t = localStorage.getItem('sessionToken');
      if (t !== null) {
        return true;
      }
      return false;
    };
    AuthProvider.prototype.showLogin = function () {
      return $state.go('login');
    };
    AuthProvider.prototype.getCurrentToken = function () {
      return localStorage.getItem('sessionToken');
    };
    // Method for instantiating
    this.$get = function ($injector) {
      Notifications = $injector.get('Notifications');
      $http = $injector.get('$http');
      $rootScope = $injector.get('$rootScope');
      $q = $injector.get('$q');
      $state = $injector.get('$state');
      $log = $injector.get('$log');
      instance = new AuthProvider();
      return instance;
    };
    /**
     * This is the $http interceptor implementation,
     * added in the $httpProvider.interceptors array
     * of interceptors, by this javascript module.
     *
     * It injects session_token on all needed
     * requests, and disconnects the whole app
     * if the
     */
    $provide.factory('SessionTokenInterceptor', function ($q, $rootScope, GLPI_API_URL) {
      return {
        "request": function (config) {
          var endpoint = config.url.split(GLPI_API_URL)[1];
          var session_token = $rootScope.sessionToken;
          // if we're asking for an html template
          // (we would understand that by looking at
          //  at the given extension of requested file)
          // then it means that we don't a session_token
          // for that purpose.
          if (/\.html$/.exec(config.url)) {
            return config;
          }

          if (endpoint !== undefined &&
            !instance.isExceptedEndpoint(endpoint, config.method)) {
            (function injectingSessionToken(config) {
              if (session_token) {
                config.headers['Session-Token'] = session_token;
              }
              if (!config.data) {
                config.data = {};
              }
            })(config);
          }
          return config;
        },
        'response': function (response) {
          /**
          if (response.headers()['accept-range']) {
            var accept = response.headers()['accept-range'].split(' ');
            Notifications.update(accept[0] + ' completed');
          }
           */
          if (DEBUG) {
            console.dir(response);
            $log.debug(
              response.config.method + " " +
              response.config.url + " " +
              response.statusText + " " +
              response.status);
          }
          return response;
        },
        "responseError": function (rejection) {
          //console.log(rejection);
          //rejection.config.timeout.then(function (value) { console.log(value); });
          if (rejection.status === -1 && !rejection.config.timeout && !rejection.config.data.file) {
            Notifications.error("Internet Issue");
            if (DEBUG) {
              $log.info("Internet Issue");
            }
          }
          if (Object.prototype.toString.call(rejection.data) === '[object Array]') {
            switch (rejection.data[0]) {
              case "ERROR_SESSION_TOKEN_INVALID":
              case "ERROR_SESSION_TOKEN_MISSING":
              case "ERROR_RESOURCE_NOT_FOUND_NOR_COMMONDBTM":
                setSessionToken(null);
                instance.showLogin();
                break;
              default:
                var errorMsg = rejection.data[1];
                if (Array.isArray(errorMsg)) {
                  errorMsg.forEach(function (errorById) {
                    Notifications.error(errorById.message);
                  });
                } else {
                  var docMsg = errorMsg.toString().indexOf(';');
                  if (docMsg !== -1) {
                    errorMsg = errorMsg.split(';');
                    Notifications.error(errorMsg[0]);
                  } else {
                    Notifications.error(errorMsg);
                  }
                }
            }
          }
          return $q.reject(rejection);
        }
      };
    });
    $httpProvider.interceptors.push('SessionTokenInterceptor');
    $httpProvider.defaults.timeout = 5000;
  })

  // Run block which initializes
  // this module
  .run(function ($rootScope) {
    // if the app is loading for the first time
    // in the current browser window, this
    // .run() block will be executed,
    // and the sessionToken variable will
    // be set on rootScope according to
    // the effective presence of a sessionToken
    // in the localStorage
    $rootScope.sessionToken = localStorage.getItem('sessionToken');
    /*
        $http.get('http-status-codes.csv')
          .then(function (res) {
            var strData = res.data;
            // Check to see if the delimiter is defined. If not,
            // then default to comma.
            var strDelimiter = (",");
            // Create a regular expression to parse the CSV values.
            var objPattern = new RegExp(
              (
                // Delimiters.
                "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
                // Quoted fields.
                "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
                // Standard fields.
                "([^\"\\" + strDelimiter + "\\r\\n]*))"
              ),
              "gi"
            );

            // Create an array to hold our data. Give the array
            // a default empty first row.
            var arrData = [[]];
            // Create an array to hold our individual pattern
            // matching groups.
            var arrMatches = null;

            // Keep looping over the regular expression matches
            // until we can no longer find a match.
            while (arrMatches = objPattern.exec(strData)) {
              // Get the delimiter that was found.
              var strMatchedDelimiter = arrMatches[1];
              // Check to see if the given delimiter has a length
              // (is not the start of string) and if it matches
              // field delimiter. If id does not, then we know
              // that this delimiter is a row delimiter.
              if (
                strMatchedDelimiter.length &&
                strMatchedDelimiter !== strDelimiter
              ) {
                // Since we have reached a new row of data,
                // add an empty row to our data array.
                arrData.push([]);
              }
              var strMatchedValue;
              // Now that we have our delimiter out of the way,
              // let's check to see which kind of value we
              // captured (quoted or unquoted).
              if (arrMatches[2]) {
                // We found a quoted value. When we capture
                // this value, unescape any double quotes.
                strMatchedValue = arrMatches[2].replace(
                  new RegExp("\"\"", "g"),
                  "\""
                );
              } else {
                // We found a non-quoted value.
                strMatchedValue = arrMatches[3];
              }

              // Now that we have our value string, let's add
              // it to the data array.
              arrData[arrData.length - 1].push(strMatchedValue);
            }
            // Return the parsed data.
            $rootScope.httpStatusCode = arrData;
          });
           */
  });
