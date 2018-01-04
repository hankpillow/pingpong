FROM alpine

# install containers libs
RUN apk add --no-cache curl bash jq tzdata && \
	rm -rf /var/cache/apk/*

# copy host's zoneinfo to container's
RUN cp /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime &&\
	echo "America/Sao_Paulo" > /etc/timezone

# setup the project inside the container
RUN mkdir -p /var/pingpong/logs
WORKDIR /var/pingpong

COPY ./URLS .
COPY ./curl-parse-result .
COPY ./fetch-urls .
COPY ./start .

# define the standard values for CRONTAB
ENV CRON_MINUTE=*
ENV CRON_HOUR=*
ENV CRON_DAY_MONTH=*
ENV CRON_MONTH=*
ENV CRON_DAY_WEEK=*

# CMD ["/usr/sbin/crond", "-f", "-d", "0"]
CMD ["/bin/bash", "/var/pingpong/start"]

