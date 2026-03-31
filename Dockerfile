# Build Stage 1

FROM node:22-alpine AS build
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package.json and your lockfile
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the entire project
COPY . ./

# Build the project
RUN pnpm build

# Build Stage 2

FROM node:22-alpine
WORKDIR /app

# Install pnpm for running migrations
RUN corepack enable

# Copy .output from build stage
COPY --from=build /app/.output/ ./

# Copy package.json and node_modules from build stage (includes tsx for migrations)
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules

# Copy knex config and migrations
COPY --from=build /app/knexfile.ts ./
COPY --from=build /app/database ./database
COPY --from=build /app/server ./server

# Copy entrypoint script
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

# Change the port and host
ENV PORT=3000
ENV HOST=0.0.0.0
ENV NITRO_PORT=${PORT}

EXPOSE 3000

ENTRYPOINT ["/app/docker-entrypoint.sh"]
