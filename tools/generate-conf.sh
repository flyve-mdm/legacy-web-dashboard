#!/bin/sh

CONFFILE=config.js
APPDIR=/var/www/html

if [ -z "$GLPI_API_URL" ]; then
	echo "GLPI API Url Env Not Set. Exit"
	exit 1
fi
if [ -z "$GLPI_API_TOKEN" ]; then
	echo "GLPI API TOKEN Url Env Not Set. Exit"
	exit 1
fi
echo "Generating Flyve MDM Front Configuration File config.js"


#j8lth8dqvgky79f0dyf4jc59p353u34eao9rwlis3
rm ${APPDIR}/$CONFFILE
echo "angular.module('FlyveMDM')" >> $APPDIR/$CONFFILE
echo ".constant('GLPI_API_URL', '${GLPI_API_URL}')" >> $APPDIR/$CONFFILE
echo ".constant('USER_TOKEN', '${GLPI_API_TOKEN}')" >> $APPDIR/$CONFFILE
echo ".constant('DEBUG', false);" >> $APPDIR/$CONFFILE
echo ".constant('BUILD_ID', 0);" >> $APPDIR/$CONFFILE
