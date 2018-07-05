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
 * @name FlyveMDM.GlpiObjectNames
 * @description
 * # GlpiObjectNames
 * Value in the FlyveMDM.
 */
angular.module('FlyveMDM')
  .constant('GlpiObjectNames', {
    ActiveEntities: "/getActiveEntities",
    Computer: "/Computer",
    ComputerAntivirus: "/ComputerAntivirus",
    ComputerDisk: "/ComputerDisk",
    ComputerModel: "/ComputerModel",
    ComputerType: "/ComputerType",
    ComputerVirtualMachine: "/ComputerVirtualMachine",
    Computer_SoftwareVersion: "/Computer_SoftwareVersion",
    Computer_SoftwareLicense: "/Computer_SoftwareLicense",
    Config: "/Config",
    Contract_Item: "/Contract_Item",
    DeviceCase: "/DeviceCase",
    DeviceControl: "/DeviceControl",
    DeviceDrive: "/DeviceDrive",
    DeviceGraphicCard: "/DeviceGraphicCard",
    DeviceHardDrive: "/DeviceHardDrive",
    DeviceMemory: "/DeviceMemory",
    DeviceMemoryType: "/DeviceMemoryType",
    DeviceMotherboard: "/DeviceMotherboard",
    DeviceNetworkCard: "/DeviceNetworkCard",
    DevicePci: "/DevicePci",
    DevicePowerSupplyrel: "/DevicePowerSupply",
    DeviceProcessor: "/DeviceProcessor",
    DeviceSoundCard: "/DeviceSoundCard",
    Document_Item: "/Document_Item",
    Entity: "/Entity",
    FileSystem: "/FileSystem",
    FullSession: "/getFullSession",
    ActiveProfile: "/getActiveProfile",
    GlpiUser: "/User",
    Infocom: "/Infocom",
    InitSession: "/initSession",
    IpAddress: "/IpAddress",
    Item_Project: "/Item_Project",
    Item_Ticket: "/Item_Ticket",
    KillSession: "/killSession",
    Manufacturer: "/Manufacturer",
    NetworkPort: "/NetworkPort",
    OperatingSystem: "/OperatingSystem",
    OperatingSystemVersion: "/OperatingSystemVersion",
    Profile_User: "/Profile_User",
    ReservationItem: "/ReservationItem",
    Software: "/Software",
    SoftwareCategory: "/SoftwareCategory",
    SoftwareVersion: "/SoftwareVersion",
    VirtualMachineSystem: "/VirtualMachineSystem",
    VirtualMachineType: "/VirtualMachineType"
  });
