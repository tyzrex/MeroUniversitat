# -----------------------------
# Base
# -----------------------------
FROM node:20-alpine AS base

WORKDIR /app

# Required for Prisma
RUN apk add --no-cache openssl libc6-compat

# -----------------------------
# Dependencies
# -----------------------------
FROM base AS deps

COPY package.json ./

# Skip postinstall scripts
RUN npm install --ignore-scripts

# -----------------------------
# Builder
# -----------------------------
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Prisma generate
RUN npx prisma generate

# Build Next.js app
RUN npm run build

# -----------------------------
# Runner
# -----------------------------
FROM base AS runner

ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "run", "start"]