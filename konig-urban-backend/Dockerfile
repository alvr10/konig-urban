# --- STAGE 1: Build ---
FROM node:20-alpine AS builder

# Alpine needs python3 + build tools for native modules, openssl for Prisma
RUN apk add --no-cache openssl python3 make g++

WORKDIR /app

# Copy source (node_modules/dist excluded via .dockerignore)
COPY . .

# Install all dependencies
RUN npm install

# Build shared package first
RUN npm run build -w @konig/shared

# Build the target service
ARG SERVICE_NAME
RUN npm run build -w @konig/${SERVICE_NAME}

# Prune devDependencies in-place — no re-install needed in the runner
RUN npm prune --omit=dev && npm cache clean --force

# --- STAGE 2: Runner ---
FROM node:20-alpine AS runner

RUN apk add --no-cache openssl

WORKDIR /app

ARG SERVICE_NAME

# Copy pruned production node_modules from builder (includes workspace symlinks)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# @konig/shared: symlink in node_modules points to /app/packages/shared,
# so both package.json (for "main" resolution) and dist must exist there
COPY --from=builder /app/packages/shared/package.json ./packages/shared/package.json
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist

COPY --from=builder /app/services/${SERVICE_NAME}/dist ./services/${SERVICE_NAME}/dist

# OpenAPI specs for all services — needed by api-gateway to serve /docs/yaml/* routes
COPY --from=builder /app/services/catalog-service/openapi.yaml ./services/catalog-service/openapi.yaml
COPY --from=builder /app/services/customers-service/openapi.yaml ./services/customers-service/openapi.yaml
COPY --from=builder /app/services/finance-service/openapi.yaml ./services/finance-service/openapi.yaml
COPY --from=builder /app/services/hr-service/openapi.yaml ./services/hr-service/openapi.yaml
COPY --from=builder /app/services/marketing-service/openapi.yaml ./services/marketing-service/openapi.yaml
COPY --from=builder /app/services/orders-service/openapi.yaml ./services/orders-service/openapi.yaml
COPY --from=builder /app/services/production-service/openapi.yaml ./services/production-service/openapi.yaml

ENV SERVICE_NAME=${SERVICE_NAME}
ENV NODE_ENV=production

ARG PORT=3000
EXPOSE ${PORT}

CMD ["sh", "-c", "node services/${SERVICE_NAME}/dist/main.js"]
