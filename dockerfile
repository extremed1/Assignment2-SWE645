#Using the official Nginx image as the base image
FROM nginx:alpine

# Removing the default Nginx html content
RUN rm -rf /usr/share/nginx/html/*

# Copy root-level files first (HTML)
COPY cssurvey.html ZIPCodes.json /usr/share/nginx/html/

# Copy subfolders separately (JS, styles, images)
COPY Js/ /usr/share/nginx/html/Js/
COPY Styles/ /usr/share/nginx/html/Styles/
COPY Images/ /usr/share/nginx/html/Images/




#Create a custom Nginx config to set cssurvey.html as default page
RUN echo 'server { \
  listen 80; \
  root /usr/share/nginx/html; \
  index cssurvey.html; \
  location / { \
  try_files $uri $uri/ =404; \
  } \
  }' > /etc/nginx/conf.d/default.conf

# Exposing port 80 for the HTTP server
EXPOSE 80

# Starting Nginx when the container runs
CMD ["nginx", "-g", "daemon off;"]