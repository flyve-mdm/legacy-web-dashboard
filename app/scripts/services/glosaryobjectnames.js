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
 * @name FlyveMDM.GlosaryObjectNames
 * @description
 * # GlosaryObjectNames
 * Constant in the FlyveMDM.
 */
angular.module('FlyveMDM')
  .constant('GlosaryObjectNames', {
    'agent.id': null,
    'computer.id': null,
    'device.type': null,
    'device.model': null,
    'device.manufacturer': null,
    'device.serial': null,
    'date.creation': null,
    'date.modification': null,
    'date.last_report': null,
    'date.last_contact': null,
    'launch.announced': 'The time when the device was publicly announced. Sometimes it takes months or even a year for the device to reach the market.\nAgain this is the time the device was ANNOUNCED, not RELEASED.',
    'launch.status': 'Coming soon - Announced, but not yet available in stores.\nAvailable - In production, or still can be found new in stores.\nDiscontinued - Not in production, can be found only second hand.\nCancelled - Announced, then officialy cancelled. Rumored - Not officially announced or even confirmed for market release yet',
    'body.dimensions': 'The size of the device in format (H x L x W) and the volume of the device where available.\nIf the device has a flip, it is measured with the flip closed.',
    'body.weight': 'Lists the weight of the device in grams. Sometimes the manufactures don\'t list the weight before the handset becomes market available. As usual we try and update the field as frequently as needed.',
    'body.sim': null,
    'body.protection': null,
    'display.type': null,
    'display.size': 'The industry standard way of representing display sizes is publishing their length in inches. The screen-to-body ratio is a measure which relates to the size of the screen bezels. The bigger the ratio, the smaller the bezels are, meaning the display takes up a larger area on the device\'s front.',
    'display.resolution': 'The industry standard way of representing screen resolution is publishing the number of pixels that form the two sides of the display rectangle. Usually, the display side that sits at the bottom when you hold the device in your hand is cited first. For the older alphanumeric displays the screen resolution is shown in screen lines or characters per screen line instead. In this case since there will be more pixels per an inch-long line of pixels on the smaller display, the image will look subjectively clearer and more detailed. Hence the importance of the other parameter that we publish - pixel density, which is measured in pixels-per-inch (ppi).',
    'display.multitouch': null,
    'display.protection': null,
    'display.others': null,
    'platform.os': null,
    'platform.chipset': null,
    'platform.cpu': null,
    'platform.gpu': null,
    'memory.card_slot': null,
    'memory.non_volatile': null,
    'memory.volatile': null,
    'memory.partitioning': null,
    'camera.primary': null,
    'camera.features': null,
    'camera.video': null,
    'camera.secondary': null,
    'sound.alert_types': null,
    'sound.loudspeaker': null,
    'sound.connections': null,
    'network.technology': null,
    'network[\'2g_bands\']': null,
    'network[\'3g_bands\']': null,
    'network[\'4g_bands\']': null,
    'network.speed': null,
    'network.gprs': null,
    'network.edge': null,
    'comms.wlan': null,
    'comms.bluetooth': null,
    'comms.gps': null,
    'comms.nfc': null,
    'comms.radio': null,
    'comms.usb': null,
    'sensors.type': null,
    'sensors.manufacturer': null,
    'features.messaging': null,
    'features.browser': null,
    'features.java': null,
    'features.others': null,
    'battery.details': null,
    'battery.[\'stand-by\']': null,
    'battery.talk_time': null,
    'battery.music_play': null,
    'misc.colors': 'Lists all the available optional color schemes the handset is available in.',
    'misc.sar_us': null,
    'misc.sar_eu': null,
    'misc.price_group': 'Mobile device prices are dynamic and change every day. We can\'t monitor the prices of the thousands of models in our database on a daily basis. Instead, we are showing reference pricing information, which can be used for comparison purposes. If you want to know the exact price of a device, please log on to the websites listed in the Check Price list below the device image.',
    'tests.performance': null,
    'tests.display': null,
    'tests.camera': null,
    'tests.loudspeaker': null,
    'tests.audio_quality': null,
    'tests.battery_life': null
  });
