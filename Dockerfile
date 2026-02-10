# 1. Base Image
FROM node:20-slim AS base

# Install OpenSSL (Wajib untuk Prisma)
RUN apt-get update -y && apt-get install -y openssl ca-certificates

# 2. Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# 3. Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Matikan telemetri
ENV NEXT_TELEMETRY_DISABLED 1

# --- PERBAIKAN UTAMA DISINI ---
# Terima argumen dari GitHub Actions
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY

# Set sebagai Environment Variable agar Next.js membakarnya saat build
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
# ------------------------------

# Build Next.js
RUN npm run build

# 4. Runner (Production)
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
ENV PORT 3000
ENV NEXT_TELEMETRY_DISABLED 1

# Buat user non-root (Keamanan)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy hasil build
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Copy Prisma schema/engine jika diperlukan runtime
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma 

USER nextjs

EXPOSE 3000
CMD ["node", "server.js"]