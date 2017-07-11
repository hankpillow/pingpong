FROM alpine

RUN apk add --update curl bash && rm -rf /var/cache/apk/*

RUN mkdir -p /var/ping-pong
WORKDIR /var/ping-pong
COPY ping-pong.sh .

COPY domains.txt .
CMD [ "sh", "ping-pong.sh"]
