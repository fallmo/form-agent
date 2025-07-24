FROM node AS build

WORKDIR /build

COPY package*.json tsconfig.json ./

RUN npm i 

COPY src src

RUN npm run build

FROM node

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY --from=build /build/dist .

CMD ["node", "/app/index.js"]


