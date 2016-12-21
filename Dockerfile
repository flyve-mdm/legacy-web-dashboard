FROM debian:8
# Install Nginx.
RUN \
  apt-get update && \
  apt-get install -y nginx && \
  rm -rf /var/lib/apt/lists/* && \
  echo "\ndaemon off;" >> /etc/nginx/nginx.conf && \
  chown -R www-data:www-data /var/lib/nginx && \
  mkdir -p /var/cache/nginx && \
  chmod -R 777 /var/cache/nginx 
  
# Define mountable directories.
VOLUME ["/etc/nginx/sites-enabled", "/etc/nginx/certs", "/etc/nginx/conf.d", "/var/log/nginx", "/var/www/html"]

### COPY DIST STUFF TO var/www/html
ADD dist /var/www/html

ADD tools /tools
RUN chmod +x /tools/*.sh && \
   chmod -R 777 /var/www/html && \
   chmod -R 777 /var/log/nginx && \
   chown -R www-data:www-data /var/www/

# Define working directory.
WORKDIR /etc/nginx

ENV GLPI_API_URL http://flyve-glpi:8090/api
ENV GLPI_API_TOKEN j8lth8dqvgky79f0dyf4jc59p353u34eao9rwlis3
# Define default command.
CMD ["/tools/run-nginx.sh"]

# Expose ports.
EXPOSE 80
EXPOSE 443
