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

(function () {
  'use strict';
  var options = {};
  var GLPi = {
    defaults: {
      global: {
        url: null,
        user_token: null,
        app_token: null,
        max_range: '0-1000', //End of pagination
        expand_dropdowns: false, //Show dropdown name instead of id. Optional.
        get_hateoas: true, //Show item's relations in a links attribute. Optional.
        only_id: false, //Keep only id keys in returned data. Optional.
        sort: 1, //Id of the "searchoption" to sort by. Optional.
        order: 'ASC', //Ascending sort / DESC Descending sort. Optional.
        get_sha1: false, //Get a sha1 signature instead of the full answer. Optional.
        with_infocoms: false, //Retrieve financial and administrative informations. Optional.
        with_contracts: false, //Retrieve associated contracts. Optional.
        with_documents: false, //Retrieve associated external documents. Optional.
        with_tickets: false, //Retrieve associated itil tickets. Optional.
        with_problems: false, //Retrieve associated itil problems. Optional.
        with_changes: false, //Retrieve associated itil changes. Optional.
        with_notes: false, //Retrieve Notes. Optional.
        with_logs: false, //Retrieve historical. Optional.
      },
      computer: {
        with_components: false, //Retrieve the associated components. Optional.
        with_disks: false, //Retrieve the associated file-systems. Optional.
        with_softwares: false, //Only for Computer, retrieve the associated software's installations. Optional.
        with_connections: false, //Only for Computer, retrieve the associated direct connections (like peripherals and printers) .Optional.
        with_networkports: false, //Retrieve all network's connections and advanced network's informations. Optional.
      },
      error_msg: {
        invalid_url: [
          'ERROR_INVALID_URL', ''],
        invalid_item_type: [
          'ERROR_ITEM_NOT_FOUND', ''],
        invalid_range: [
          'ERROR_INVALID_RANGE', ''],
        invalid_authorization: [
          'ERROR_INVALID_AUTHORIZATION', ''],
      }
    },
    getOptions: function (type) {
      var typeOptions = type && options[type] || {};
      return angular.extend({}, options, typeOptions);
    }
  };

  function GlpiProvider() {
    /**
     * Allow to set global options during configuration
     */
    return {
      setOptions: function (itemType, customOptions) {
        // If no itemType was specified set option for the global object
        if (!customOptions) {
          customOptions = itemType;
          options = angular.merge(options, customOptions);
        } else {
          // Set options for the specific item
          options[itemType] = angular.merge(options[itemType] || {}, customOptions);
        }
        options = (function validations(options, errorMsg) {
          if (options.global.url) {
            var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
              '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
              '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
              '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
              '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
              '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
            if (pattern.test(options.global.url)) {
              var lastChar = options.global.url.substr(-1);
              if (lastChar !== '/') {
                options.global.url = options.global.url + '/';
              }
              options.global.url = options.global.url;
            } else {
              throw new Error(errorMsg.invalid_url);
            }
          }
          return options;
        })(options, GLPi.defaults.error_msg);
        angular.merge(GLPi.defaults, options);
      },
      $get: function () {
        return GlpiProvider;
      }
    };
  }
  angular.module('ngGLPi', [])
    .provider('Glpi', GlpiProvider)
    .service('GLPi', function ($q, $http) {
      var sessionToken = null;
      var errorMsg = GLPi.defaults.error_msg;
      var apiUrl = GLPi.defaults.global.url;
      var appToken = GLPi.defaults.global.app_token;
      var maxRange = GLPi.defaults.global.max_range;
      var endpoints = {
        init_session: "initSession",
        kill_session: "killSession",
        get_my_profiles: "getMyProfiles",
        get_active_profile: "getActiveProfile",
        change_active_profile: "changeActiveProfile",
        get_my_entities: "getMyEntities",
        get_active_entities: "getActiveEntities",
        change_active_entities: "changeActiveEntities",
        get_full_session: "getFullSession",
        get_multiple_items: "getMultipleItems",
        list_search_options: "listSearchOptions",
        search_items: "search"
      };
      String.prototype.toConcatSlash = function () {
        var lastChar = this.substr(-1);
        if (lastChar !== '/') {
          return this + '/';
        }
        return this;
      };
      function validRange(range) {
        var pattern = new RegExp('/^\d+-\d+|\*$/');
        return pattern.test(range);
      }
      return {
        getOptions: function (type) {
          return GLPi.getOptions(type);
        },
        initsession: function (authorization) {
          var responseDefer = $q.defer();
          var headers = {};
          headers['Content-Type'] = 'application/json';
          if (!authorization) {
            throw new Error(errorMsg.invalid_authorization);
          }
          if (authorization.basic) {
            headers.Authorization = 'Basic ' + window.btoa(authorization.login + ':' + authorization.password);
          }
          if (authorization.user_token) {
            headers.Authorization = 'user_token ' + authorization.user_token;
          }
          if (authorization.app_token) {
            headers['App-Token'] = authorization.app_token;
            appToken = authorization.app_token;
          }
          $http({
            method: 'GET',
            url: apiUrl + endpoints.initsession,
            headers: headers,
            data: {},
          }).then(function (response) {
            sessionToken = response.data.session_token;
            responseDefer.resolve(sessionToken);
          }, function (error) {
            responseDefer.reject(error);
          });
          return responseDefer.promise;
        },
        killsession: function () {
          var responseDefer = $q.defer();
          var headers = {};
          headers['Content-Type'] = 'application/json';
          headers['Session-Token'] = this.sessionToken;
          if (appToken) {
            headers['App-Token'] = this.AppToken;
          }
          $http({
            method: 'GET',
            url: apiUrl + endpoints.killsession,
            headers: headers,
            data: {},
          }).then(function () {
            responseDefer.resolve();
          }, function (error) {
            responseDefer.reject(error);
          });
          return responseDefer.promise;
        },
        getMyProfiles: function () { },
        getActiveProfile: function () { },
        changeActiveProfile: function () { },
        getMyEntities: function () { },
        getActiveEntities: function () { },
        changeActiveEntities: function () { },
        getFullSession: function () { },
        getAnItem: function () { },
        getAllItems: function (itemtype, range) {
          var responseDefer = $q.defer();
          if (range) {
            if (!validRange(range)) {
              throw new Error(errorMsg.invalid_range);
            }
          }
          $http({
            method: 'GET',
            url: apiUrl.toConcatSlash() + itemtype,
            params: {
              range: range ? range : maxRange
            },
            data: {},
          }).then(function (response) {
            responseDefer.resolve(response);
          }, function (error) {
            responseDefer.reject(error);
          });
          return responseDefer.promise;
        },
        getSubItems: function () { },
        getMultipleItems: function () { },
        listSearchOptions: function (item_type, range) {
          var responseDefer = $q.defer();
          if (range) {
            if (!validRange(range)) {
              throw new Error(errorMsg.invalid_range);
            }
          }
          var store = {};
          store[item_type.toString()] = "&id,name,table,field,datatype,available_searchtypes,uid";
          console.log(store);
          var db = new Dexie("FlyveMDM");
          db.version(1).stores({
            agent: "&id,name,table,field,datatype,available_searchtypes,uid"
          });
          //console.log(item_type.toString());

          // Populate from AJAX:
          db.on('ready', function () {
            // on('ready') event will fire when database is open but
            // before any other queued operations start executing.
            // By returning a Promise from this event,
            // the framework will wait until promise completes before
            // resuming any queued database operations.
            // Let's start by using the count() method to detect if
            // database has already been populated.
            return db.agent.count(function (count) {
              if (count > 0) {
                console.log("Already populated");
              } else {
                console.log("Database is empty. Populating from ajax call...");
                // We want framework to continue waiting, so we encapsulate
                // the ajax call in a Dexie.Promise that we return here.
                return new Dexie.Promise(function (resolve, reject) {
                  $http({
                    method: 'GET',
                    url: apiUrl.toConcatSlash() + endpoints.list_search_options + '/' + item_type,
                    params: {
                      range: range ? range : maxRange
                    },
                    data: {}
                  }, function (xhr, textStatus) {
                    // Rejecting promise to make db.open() fail.
                    reject(textStatus);
                  }).then(function (data) {
                    // Resolving Promise will launch then() below.
                    resolve(data);
                  });

                }).then(function (list_search_options) {
                  console.log("Got ajax response. We'll now add the objects.");
                  // By returning the db.transaction() promise, framework will keep
                  // waiting for this transaction to commit before resuming other
                  // db-operations.
                  return db.transaction('rw', db.agent, function () {
                    for (var search_option in list_search_options) {
                      if (Number.isInteger(parseInt(search_option))) {
                        list_search_options[search_option].id = search_option;
                        db.agent.add(list_search_options[search_option]);
                      }
                    }
                  });
                }).then(function () {
                  console.log("Transaction committed");
                });
              }
            });
          });
          db.open(); // Will resolve when data is fully populated (or fail if error)
          var list = [];
          // Following operation will be queued until we're finished populating data:
          db.agent.each(function (obj) {
            // When we come here, data is fully populated and we can log all objects.
            list.push(obj);
          }).then(function () {
            responseDefer.resolve(list);
          }).catch(function (error) {
            // In our each() callback above fails, OR db.open() fails due to any reason,
            // including our ajax call failed, this operation will fail and we will get
            // the error here!
            responseDefer.reject(error);
            console.error(error.stack || error);
            // Note that we could also have catched it on db.open() but in this sample,
            // we show it here.
          });
          return responseDefer.promise;
        },
        searchItems: function () { },
        addItems: function () { },
        updateItems: function () { },
        deleteItems: function () { }
      };
    });
})();