FROM mhart/alpine-node:4.4.0
MAINTAINER spartakiade2016

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install

COPY . /usr/src/app

RUN npm run build

ENV PORT=3000
ENV SHUTDOWN_TIMEOUT=10000
ENV SERVICE_NAME=example-web
ENV SERVICE_CHECK_HTTP=/healthcheck
ENV SERVICE_CHECK_INTERVAL=10s
ENV SERVICE_CHECK_TIMEOUT=2s
ENV SERVICE_ENDPOINTS=/endpoints

EXPOSE 3000

CMD ["node", "index.js"]
