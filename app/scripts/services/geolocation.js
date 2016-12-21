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
