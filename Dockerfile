FROM alpine
# FROM xordiv/docker-alpine-cron

RUN apk add --no-cache curl bash jq tzdata && \
	rm -rf /var/cache/apk/*

RUN mkdir -p /var/pingpong/logs
RUN cp /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime &&\
	echo "America/Sao_Paulo" > /etc/timezone

WORKDIR /var/pingpong

COPY ./URLS .
COPY ./curl-parse-result .
COPY ./fetch-urls .
COPY ./crontabs .

RUN crontab crontabs
CMD ["/usr/sbin/crond", "-f", "-d", "0"]

# RUN chmod 0644 /var/pingpong/fetch-urls
