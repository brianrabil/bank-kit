FROM oven/bun:1 AS base

FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat
# Set working directory
WORKDIR /app
# Replace <your-major-version> with the major version installed in your repository. For example:
# RUN yarn global add turbo@^2
RUN bun add turbo@^2 --global
COPY . .

# Generate a partial monorepo with a pruned lockfile for a target workspace.
# Assuming "web" is the name entered in the project's package.json: { name: "web" }
RUN turbo prune @bank-kit/api --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN bun install --frozen-lockfile

# Build the project
COPY --from=builder /app/out/full/ .
ENV NODE_ENV=production
RUN bun test
RUN bun turbo run build

FROM base AS runner
WORKDIR /app

# Don't run production as root
USER bun

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
# COPY --from=installer --chown=bank-kit:bun /app/apps/api/dist ./
COPY --from=installer --chown=bun /app/apps/api/dist ./apps/api/dist
COPY --from=installer --chown=bun /app/apps/api/public ./apps/api/public

EXPOSE 8080
CMD ["apps/web/dist/server"]
