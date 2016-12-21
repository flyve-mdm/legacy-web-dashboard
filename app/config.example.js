angular.module('FlyveMDM')
  // url of the GLPI api
  .constant('GLPI_API_URL', 'http://api.flyve.teclib.infra')
  // this is the glpi/flyve api_key which is used to save glpi/flyve users
  .constant('USER_TOKEN', 'IMAUSERTOKEN')
  // Debugging option
  .constant('DEBUG', false)
  //The unique id of the current build that GitLab CI uses internally
  .constant('BUILD_ID', 0);
