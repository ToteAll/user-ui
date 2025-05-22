# Stage 1: Build the React app
FROM node:18-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve using NGINX
FROM nginx:stable-alpine

# Remove default NGINX config
RUN rm /etc/nginx/conf.d/default.conf

# Add custom NGINX config
COPY nginx.conf /etc/nginx/conf.d

# Copy build output
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
