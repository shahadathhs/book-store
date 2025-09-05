# Define Node.js version
FROM node:24-slim

# Enable corepack and activate pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy dependency files
COPY pnpm-lock.yaml package.json ./

# Install deps (with frozen lockfile)
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build app (runs "tsc && tsc-alias")
RUN pnpm build

# Expose the port the app runs on
EXPOSE 4000

# Run DB migration + start app
CMD ["sh", "-c", "pnpm db:push && pnpm start"]
