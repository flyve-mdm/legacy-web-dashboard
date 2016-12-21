'use strict';

/**
 * @ngdoc service
 * @name FlyveMDM.InventoryFac
 * @description
 * # InventoryFac
 * Factory in the FlyveMDM.
 */
angular.module('FlyveMDM')
  .factory('InventoryFac', function (GLPI_API_URL, GlpiObjectNames, $q, $http) {
    // Service logic
    var computer = Object.freeze({
      device: {
        'id': null,
        'type': null,
        'model': null,
        'manufacturer': null,
        'serial': null,
        'name': null
      },
      network: {
        'technology': null,
        '2g_bands': null,
        '3g_bands': null,
        '4g_bands': null,
        'speed': null,
        'gprs': null,
        'edge': null
      },
      date: {
        'creation': null,
        'modification': null,
        'last_report': null,
        'last_contact': null
      },
      launch: {
        'announced': null,
        'status': null
      },
      body: {
        'dimensions': null,
        'weight': null,
        'sim': null,
        'protection': null
      },
      display: {
        'type': null,
        'size': null,
        'resolution': null,
        'multitouch': null,
        'protection': null,
        'others': null
      },
      platform: {
        'os': null,
        'chipset': null,
        'cpu': null,
        'gpu': null
      },
      applications: [{
        'id': null,
        'application_id': null,
        'category': null,
        'version_name': null
      }],
      memory: {
        'card_slot': null,
        'non_volatile': null,
        'volatile': null,
        'partitioning': [{
          'name': null,
          'free_size': null,
          'global_size': null,
          'free_percentage': null,
          'description': null
        }]
      },
      camera: {
        'primary': null,
        'features': null,
        'video': null,
        'secondary': null
      },
      sound: {
        'alert_types': null,
        'loudspeaker': null,
        'connections': null
      },
      comms: {
        'wlan': {
          'functionality': null,
          'mac': null,
          'speed': null,
          'ip': null,
          'description': null
        },
        'bluetooth': null,
        'gps': null,
        'nfc': null,
        'radio': null,
        'usb': null
      },
      sensors: [{
        'name': null,
        'manufacturer': null,
        'type': null,
        'power': null,
        'version': null
      }],
      features: {
        'messaging': null,
        'browser': null,
        'java': null,
        'others': null
      },
      battery: {
        'details': null,
        'stand-by': null,
        'talk_time': null,
        'music_play': null
      },
      misc: {
        'colors': null,
        'sar_us': null,
        'sar_eu': null,
        'price_group': null
      },
      tests: {
        'performance': null,
        'display': null,
        'camera': null,
        'loudspeaker': null,
        'audio_quality': null,
        'battery_life': null
      }
    });
    var software = [];
    var softwareVersion = [];
    var softwareCategory = [];
    var deviceMemoryType = [];
    var fileSystem = [];
    //var linksToFilter = ['Computer_SoftwareVersion', 'ComputerDisk', 'DeviceProcessor', 'NetworkPort', 'DeviceMemory', 'OperatingSystemVersion', 'ComputerType', 'ComputerModel'];
    var linksToFilter = [];
    //var linksToInclude = ['Computer_SoftwareVersion', 'ComputerDisk'];
    var linksToInclude = [];
    //success(function (data, status, headers) {
    //console.log(parseContentRange(headers()['content-range']));
    //console.log(headers()['accept-range']);
    function bytesToSize(bytes) {
      bytes = parseInt(bytes);
      var sizes = ['MB', 'GB', 'TB'];
      if (bytes === 0) {
        return '0 Byte';
      }
      var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
      return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }
    String.prototype.toTitleCase = function () {
      return this.replace(/\b(\w+)/g, function (m, p) { return p[0].toUpperCase() + p.substr(1).toLowerCase(); });
    };
    /*
    function parseContentRange(contentRange) {
      var rangeFields = contentRange.split(/\s|-|\//);
      var pagination = {
        paginationFrom: parseInt(rangeFields[0]) + 1,
        paginationTo: parseInt(rangeFields[1]) + 1,
        paginationTotal: parseInt(rangeFields[2])
      };
      pagination.paginationSubTotal = parseInt(pagination.paginationTo - pagination.paginationFrom);
      return pagination;
    }
    */
    var getSoftware = function () {
      var softwareDefer = $q.defer();
      var softwareVersionDefer = $q.defer();
      var softwareCategoryDefer = $q.defer();
      if (software.length > 0) {
        softwareDefer.resolve(software);
        softwareVersionDefer.resolve(softwareVersion);
        softwareCategoryDefer.resolve(softwareCategory);
      } else {
        $http({
          method: 'GET',
          url: GLPI_API_URL + GlpiObjectNames.Software,
          params: {
            range: '0-1000'
          }
        }).then(function (response) {
          var software = response.data;
          softwareDefer.resolve(software);
        }, function () {
          softwareDefer.reject();
        });
        $http({
          method: 'GET',
          url: GLPI_API_URL + GlpiObjectNames.SoftwareVersion,
          params: {
            range: '0-1000'
          }
        }).then(function (response) {
          softwareVersion = response.data;
          softwareVersionDefer.resolve(softwareVersion);
        }, function () {
          softwareVersionDefer.reject();
        });
        $http({
          method: 'GET',
          url: GLPI_API_URL + GlpiObjectNames.SoftwareCategory,
          params: {
            range: '0-1000'
          }
        }).then(function (response) {
          softwareCategory = response.data;
          softwareCategoryDefer.resolve(softwareCategory);
        }, function () {
          softwareCategoryDefer.reject();
        });
      }
      var promises = {
        getSoftware: softwareDefer.promise,
        getSoftwareVersion: softwareVersionDefer.promise,
        getSoftwareCategory: softwareCategoryDefer.promise
      };
      return $q.all(promises);
    };
    // Public API here
    return {
      getComputer: function (aComputerId) {
        var computerDefer = $q.defer();
        computerDefer.notify('Computer');
        $http({
          method: 'GET',
          url: GLPI_API_URL + GlpiObjectNames.Computer + '/' + aComputerId,
          params: {
            get_hateoas: true,
            expand_dropdowns: true,
            with_networkports: true,
            with_disks: true,
            with_softwares: true
            //with_connections: true,
            //with_components: true,
            //with_infocoms: true,
            //with_contracts: true,
            //with_documents: true,
            //with_tickets: true,
            //with_problems: true,
            //with_changes: true,
            //with_logs: true
          }
        }).then(function (response) {
          var computerData = response.data;
          var promises = {};
          linksToInclude.forEach(function (linkToInclude) {
            var link = {
              rel: linkToInclude,
              href: GLPI_API_URL + GlpiObjectNames.Computer + '/' + aComputerId + GlpiObjectNames[linkToInclude],
            };
            computerData.links.push(link);
          }, this);
          computerData.links.forEach(function (link) {
            if (linksToFilter.indexOf(link.rel) !== -1) {
              var defer = $q.defer();
              $http({
                method: 'GET',
                url: link.href,
                params: {
                  range: '0-1000'
                }
              }).then(function (response) {
                computerDefer.notify(link.rel);
                computerData["_" + link.rel.toLowerCase()] = response.data;
                defer.resolve();
              }, function () {
                defer.reject();
              });
              promises[link.rel] = defer.promise;
            }
          }, this);
          promises.software = getSoftware();
          $q.all(promises).then(function (results) {
            var softwareExpandDropdowns = [];
            var softwareVersionExpandDropdowns = [];
            var softwareCategoryExpandDropdowns = [];
            results.software.getSoftware.forEach(function (aSoftware) {
              softwareExpandDropdowns[aSoftware.id] = aSoftware.name;
            });
            results.software.getSoftwareVersion.forEach(function (aSoftwareVersion) {
              softwareVersionExpandDropdowns[aSoftwareVersion.id] = aSoftwareVersion.name;
            });
            results.software.getSoftwareCategory.forEach(function (aSoftwareCategory) {
              softwareCategoryExpandDropdowns[aSoftwareCategory.id] = aSoftwareCategory.name;
            });
            computer.device.name = computerData.name;
            if (computerData.manufacturers_id) {
              computer.device.manufacturer = computerData.manufacturers_id.toTitleCase();
            }
            computer.device.id = computerData.id;
            computer.device.model = computerData.computermodels_id;
            computer.device.serial = computerData.serial;
            computer.device.type = computerData.computertypes_id;
            computer.platform.os = computerData.operatingsystems_id + " " + computerData.operatingsystemversions_id;
            computer.date.creation = computerData.date_creation;
            computer.date.modification = computerData.date_mod;
            if (computerData._deviceprocessor) {
              if (computerData._deviceprocessor.length > 0) {
                computer.platform.cpu = computerData._deviceprocessor[0].designation;
              }
            }
            if (computerData._networkports.NetworkPortEthernet) {
              computer.comms.wlan.mac = computerData._networkports.NetworkPortEthernet[0].mac;
              computer.comms.wlan.speed = computerData._networkports.NetworkPortEthernet[0].speed;
              computer.comms.wlan.description =
                'MAC: ' + computer.comms.wlan.mac + ', Speed: ' + computer.comms.wlan.speed + ' Mb/s';
              if (computerData._networkports.NetworkPortEthernet[0].NetworkName) {
                if (computerData._networkports.NetworkPortEthernet[0].NetworkName.IPAddress) {
                  computer.comms.wlan.ip =
                    computerData._networkports.NetworkPortEthernet[0].NetworkName.IPAddress[0].name;
                  computer.comms.wlan.description =
                    computer.comms.wlan.description + ', IP: ' + computer.comms.wlan.ip;
                }
              }
            }
            computer.applications.shift();
            computerData._softwares.forEach(function (aSoftware, index) {
              if (softwareExpandDropdowns[aSoftware.softwares_id].indexOf('.') !== -1) {
                var anApplication = {
                  'id': index,
                  'application_id': softwareExpandDropdowns[aSoftware.softwares_id],
                  'version_name': softwareVersionExpandDropdowns[aSoftware.softwareversions_id],
                  'category': null
                };
                computer.applications.push(anApplication);
              }
            }, this);
            computer.memory.partitioning = [];
            computerData._disks.forEach(function (aPartition) {
              var percent = Math.floor((aPartition.name.freesize / aPartition.name.totalsize) * 100);
              var partition = {
                'name': aPartition.name.device,
                'free_size': aPartition.name.freesize,
                'global_size': aPartition.name.totalsize,
                'free_percentage': percent,
                'description': aPartition.name.device + ', size ' + bytesToSize(aPartition.name.totalsize) + ', free ' + bytesToSize(aPartition.name.freesize) + ' (' + percent + '%)'
              };
              computer.memory.partitioning.push(partition);
            }, this);
            computerDefer.resolve(computer);
          }, function () {
            computerDefer.reject();
          });
        }, function () {
          computerDefer.reject();
        });
        return computerDefer.promise;
      },
      getSoftware: getSoftware,
      getDeviceMemoryType: function () {
        var deviceMemoryTypeDefer = $q.defer();
        if (deviceMemoryType.length > 0) {
          deviceMemoryTypeDefer.resolve(deviceMemoryType);
        } else {
          $http({
            method: 'GET',
            url: GLPI_API_URL + GlpiObjectNames.DeviceMemoryType,
            params: {
              range: '0-1000'
            }
          }).then(function (response) {
            deviceMemoryType = response.data;
            deviceMemoryTypeDefer.resolve(deviceMemoryType);
          }, function () {
            deviceMemoryTypeDefer.reject();
          });
        }
        return deviceMemoryTypeDefer.promise;
      },
      getFileSystem: function () {
        var fileSystemDefer = $q.defer();
        if (fileSystem.length > 0) {
          fileSystemDefer.resolve(fileSystem);
        } else {
          $http({
            method: 'GET',
            url: GLPI_API_URL + GlpiObjectNames.FileSystem,
            params: {
              range: '0-1000'
            }
          }).then(function (response) {
            fileSystem = response.data;
            fileSystemDefer.resolve(fileSystem);
          }, function () {
            fileSystemDefer.reject();
          });
        }
        return fileSystemDefer.promise;
      }
    };
  });
