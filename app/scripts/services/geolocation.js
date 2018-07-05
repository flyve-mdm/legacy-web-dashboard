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
 * @name FlyveMDM.GeolocationFac
 * @description
 * # GeolocationFac
 * Factory in the FlyveMDM.
 */
angular.module('FlyveMDM')
  .factory('GeolocationFac', function (GLPI_API_URL, GlpiObjectNames, PluginObjectNames, $q, $http) {
    // Service logic
    // Public API here
    return {

      /**
       * Get the device geolocations
       * provides search options like latitude and longitude and a datetime
       */
      getDeviceGeolocations: function (aComputerId, from, to) {
        //  the searchOption IDs for geolocation
        var deviceGeolocationsDefer = $q.defer();
        var searchOptionsIds = {
          "id": 2,
          "name": 1,
          "computer_id": 3,
          "latitude": 4,
          "longitude": 5,
          "date": 6
        };
        var getSearchOptionIdFromPredicateName = function (predicateName) {
          return searchOptionsIds[predicateName];
        };
        $http({
          method: 'GET',
          url: GLPI_API_URL + '/search' + PluginObjectNames.Geolocation,
          params: {
            order: 'DESC',
            sort: getSearchOptionIdFromPredicateName('date'),
            "forcedisplay[0]": getSearchOptionIdFromPredicateName('latitude'),
            "forcedisplay[1]": getSearchOptionIdFromPredicateName('longitude'),
            "forcedisplay[2]": getSearchOptionIdFromPredicateName('date'),
            "forcedisplay[3]": getSearchOptionIdFromPredicateName('id'),
            "criteria[0][field]": getSearchOptionIdFromPredicateName('computer_id'),
            "criteria[0][type]": "equals",
            "criteria[0][value]": aComputerId,
            range: '' + from + '-' + to
          },
          //timeout: geolocationPageFetchRequestCanceller.promise
        }).then(function (response) {
          response.data = response.data.data;
          var latestGeolocations = [];
          if (response.data) {
            response.data.forEach(function (_geolocation) {
              latestGeolocations.push({
                id: parseInt(_geolocation[getSearchOptionIdFromPredicateName('id')]),
                displayable: {
                  lat: parseFloat(_geolocation[getSearchOptionIdFromPredicateName('latitude')]),
                  lng: parseFloat(_geolocation[getSearchOptionIdFromPredicateName('longitude')]),
                },
                date: _geolocation[getSearchOptionIdFromPredicateName('date')],
                timeAgo: moment.utc(_geolocation[getSearchOptionIdFromPredicateName('date')]).fromNow(),
                displayed: 'timeAgo'
              });
            });
          }
          response.data = latestGeolocations.sort(function (a, b) {
            var dateA = -moment(a.date).unix();
            var dateB = -moment(b.date).unix();
            if (dateA < dateB) {
              return -1;
            }
            if (dateA > dateB) {
              return 1;
            }
            // date must be equal
            return 0;
          });
          deviceGeolocationsDefer.resolve(response);
        }, function () {
          deviceGeolocationsDefer.reject();
        });
        return deviceGeolocationsDefer.promise;
      },

      /**
       * Request the current Geolocation of the device
       * @param aDeviceId the id of the device
       */
      requestCurrentGeolocation: function (aDeviceId) {
        var currentGeolocationDefer = $q.defer();
        $http({
          method: 'PUT',
          url: GLPI_API_URL + PluginObjectNames.Agent + '/' + aDeviceId,
          data: {
            input: {
              _geolocate: ""
            }
          }
        }).then(function () {
          currentGeolocationDefer.resolve();
        }, function () {
          currentGeolocationDefer.reject();
        });
        return currentGeolocationDefer.promise;
      }
    };
  });
