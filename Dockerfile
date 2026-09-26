FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY app/package.json app/package.json
COPY contract/package.json contract/package.json
COPY operator/package.json operator/package.json
COPY services/duel/package.json services/duel/package.json
RUN npm ci
COPY app/ app/
RUN npm run build

FROM node:24-alpine
WORKDIR /app
ENV HOST=0.0.0.0 PORT=8787 STATIC_DIR=/app/public \
    DUEL_STATE_FILE=/app/data/duel-state.json FEEDBACK_FILE=/app/data/feedback.jsonl
COPY --from=build /app/app/dist/ public/
COPY services/duel/*.mjs services/duel/
EXPOSE 8787
CMD ["node", "services/duel/server.mjs"]
