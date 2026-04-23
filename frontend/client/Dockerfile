FROM node:20-bookworm-slim AS deps
WORKDIR /workspace/frontend/client
COPY frontend/client/package.json frontend/client/package-lock.json ./
RUN npm ci

FROM node:20-bookworm-slim AS builder
WORKDIR /workspace
COPY frontend ./frontend
WORKDIR /workspace/frontend/client
COPY --from=deps /workspace/frontend/client/node_modules ./node_modules
ARG BACKEND_URL=http://backend:5000
ENV BACKEND_URL=$BACKEND_URL
RUN npm run build

FROM node:20-bookworm-slim AS runner
WORKDIR /workspace/frontend/client
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=builder /workspace/frontend/client/package.json ./
COPY --from=builder /workspace/frontend/client/package-lock.json ./
RUN npm ci --omit=dev
COPY --from=builder /workspace/frontend/client/.next ./.next
COPY --from=builder /workspace/frontend/client/public ./public
EXPOSE 3000
CMD ["npm", "run", "start"]
