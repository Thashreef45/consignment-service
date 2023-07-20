FROM node:slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . /app


# Build the TypeScript code
RUN npm run build


EXPOSE 3000


CMD ["node", "server.js"]