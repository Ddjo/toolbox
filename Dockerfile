FROM docker.io/node:lts-alpine AS development

WORKDIR /app

COPY . .

RUN npm install -g pnpm
# COPY package*.json ./
RUN pnpm install

# RUN npm install

CMD ["npm", "run", "start", "toolbox"]
