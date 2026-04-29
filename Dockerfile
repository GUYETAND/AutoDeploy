# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app
COPY app/package.json app/package-lock.json* ./
RUN npm ci --only=production

# ---- Runtime stage ----
FROM node:20-alpine
WORKDIR /app

# Copy only the installed production dependencies from build stage
COPY --from=build /app/node_modules ./node_modules
COPY app/ .

# Run as non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000

CMD ["node", "index.js"]
