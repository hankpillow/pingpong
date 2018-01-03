FROM xordiv/docker-alpine-cron

ENV PINGPONG_SOURCE=/scripts

RUN apk add --update curl \
	&& apk add jq \
	&& rm -rf /var/cache/apk/*

WORKDIR ${PINGPONG_SOURCE}

COPY ./URLS ${PINGPONG_SOURCE}
COPY ./scripts
COPY ./run.sh .

RUN echo "* * * * * /bin/sh /scripts/run.sh" > /etc/cron.d/crontabs
