FROM xordiv/docker-alpine-cron

RUN apk add --update curl \
    && rm -rf /var/cache/apk/*

WORKDIR /scripts

COPY ./src/crontabs /etc/cron.d/crontabs
COPY ./src/format.txt .
COPY ./src/run.sh .
