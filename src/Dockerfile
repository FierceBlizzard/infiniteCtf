FROM php:apache
COPY index.php /var/www/html
EXPOSE 80
RUN echo "ServerName $(hostname -I | cut -d' ' -f1)" >> /etc/apache2/apache2.conf
CMD echo "PHP website is accessible at: http://$(hostname -I | cut -d' ' -f1):80" && apache2-foreground