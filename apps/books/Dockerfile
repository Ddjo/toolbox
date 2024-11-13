FROM docker.io/node:lts-alpine AS development

WORKDIR /app

RUN npm install -g pnpm
# COPY package*.json ./
COPY package*.json ./
# RUN npm install
RUN pnpm install

COPY . .
RUN npm run build:books

FROM docker.io/node:lts-alpine AS production
ENV NODE_ENV=production
ENV PORT=3330
EXPOSE ${PORT}

USER node
WORKDIR /app

COPY --from=development /app/dist/apps/books ./
RUN npm install --only=production

CMD ["node", "main"]
