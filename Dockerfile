FROM node:lts-alpine 

WORKDIR /app

COPY . .

RUN npm install -g pnpm
# COPY package*.json ./
RUN pnpm install

# RUN npm install

CMD ["npm", "run", "start", "toolbox"]
