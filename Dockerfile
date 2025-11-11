FROM node:22-bullseye-slim

# Set working directory
WORKDIR /app

# Ensure local node_modules binaries are available on PATH
ENV PATH /app/node_modules/.bin:$PATH

# Install dependencies first (cache-able)
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci --silent; else npm install --silent; fi

# Copy app sources
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start dev server and bind to 0.0.0.0 so it's reachable from host
CMD ["npm","run","dev","--","--host","0.0.0.0","--port","5173"]
