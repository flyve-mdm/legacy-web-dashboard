(function () {
    'use strict';
    angular.module('appShell')
        .constant('pluginEndPoints', {
            AGENT: "/PluginStorkmdmAgent/",
            ENTITY_CONFIG: "/PluginStorkmdmEntityconfig/",
            FILE: "/PluginStorkmdmFile/",
            FLEET: "/PluginStorkmdmFleet/",
            FLEET_POLICY: "/PluginStorkmdmFleet_Policy/",
            GEOLOCATION: "/PluginStorkmdmGeolocation/",
            INVITATION: "/PluginStorkmdmInvitation/",
            INVITATION_LOG: "/PluginStorkmdmInvitationLog/",
            APPLICATION: "/PluginStorkmdmPackage/",
            POLICY: "/PluginStorkmdmPolicy/",
            POLICY_CATEGORY: "/PluginStorkmdmPolicyCategory/",
            USER: "/PluginStorkmdmUser/",
            WELL_KNOWN_PATH: "/PluginStorkmdmWellknownPath"
        });
})();