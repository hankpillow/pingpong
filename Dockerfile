FROM xordiv/docker-alpine-cron

RUN apk add --update curl \
    && rm -rf /var/cache/apk/*

COPY ./URLS /var/URLS

WORKDIR /scripts
COPY ./curl-parse.txt .
COPY ./run.sh .

RUN echo "* * * * * /bin/sh /scripts/run.sh" > /etc/cron.d/crontabs
