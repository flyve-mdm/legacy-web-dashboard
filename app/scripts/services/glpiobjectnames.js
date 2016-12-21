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
