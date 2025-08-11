# Dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Enable corepack for pnpm/yarn support
RUN corepack enable

# Copy package files
COPY package*.json ./
COPY yarn.lock* pnpm-lock.yaml* ./

# Skip Prisma postinstall generate during dependency install
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true

# Install dependencies based on the preferred package manager
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f pnpm-lock.yaml ]; then pnpm i --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client if schema exists
RUN if [ -f prisma/schema.prisma ]; then npx prisma generate; else echo "No prisma/schema.prisma; skipping generate"; fi

# Build the application
RUN \
  if [ -f yarn.lock ]; then yarn build; \
  elif [ -f pnpm-lock.yaml ]; then pnpm build; \
  else npm run build; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the public folder
COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma files if they exist
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma 2>/dev/null || true
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma 2>/dev/null || true

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]