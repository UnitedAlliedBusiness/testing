# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node:13.12.0-alpine	FROM tiangolo/node-frontend:10 as build-stage
WORKDIR /app	WORKDIR /app
COPY package*.json /app/	COPY package*.json /app/
RUN npm install	RUN npm install
@@ -9,4 +9,4 @@ RUN npm run build
FROM nginx:1.15	FROM nginx:1.15
COPY --from=build-stage /app/build/ /usr/share/nginx/html/build	COPY --from=build-stage /app/build/ /usr/share/nginx/html/build
# Copy the default nginx.conf provided by tiangolo/node-frontend	# Copy the default nginx.conf provided by tiangolo/node-frontend
COPY --from=build-stage /nginx.conf /etc/nginx/conf.d/default.conf	
