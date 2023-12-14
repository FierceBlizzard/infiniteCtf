FROM php:apache

# Copy the PHP file to the web server directory
COPY * /var/www/html/

# Set the working directory to the web server directory
WORKDIR /var/www/html

# Expose port 80 for Apache
EXPOSE 80

CMD ["apache2-foreground"]