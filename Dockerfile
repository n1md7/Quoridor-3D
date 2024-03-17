ARG BUILD_IMAGE="node:20.10.0-alpine"

FROM $BUILD_IMAGE AS server

ARG BUILD_ENV
ARG PORT=8000

ENV PORT=${PORT}
ENV BUILD_ENV=${BUILD_ENV:-production}

WORKDIR /service

COPY .npmrc package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

ENTRYPOINT ["npm", "run", "start:prod"]
