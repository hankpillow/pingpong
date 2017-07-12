#!/bin/sh

# SOURCE=URLS
# TARGET_ERROR=./log/pingpong.error.log
# TARGET_SUCCESS=./log/pingpong.log

#PATHS
SOURCE=/var/URLS
TARGET_ERROR=/var/log/pingpong.error.log
TARGET_SUCCESS=/var/log/pingpong.log

#ENV FLAGS
LOGIN=""
FOLLOW=" -L "
TIMEOUT=10

#log timestamp
TS=$(date +%F_%T)

if [[ ! -f $SOURCE ]]; then

  echo "$TS -1 missing /var/URLS file. " >> $TARGET_ERROR

else

  if [[ $FOLLOW_LINKS == 0 ]]; then FOLLOW=""; fi
  if [[ $APPEND_LOG == 0 ]]; then TARGET_SUCCESS="$TARGET_SUCCESS-$(date +%s)"; fi
  if [[ $MAX_TIME -gt 0 ]]; then TIMEOUT=$MAX_TIME; fi

  while read -r site; do

    URL=$(echo "$site" | awk '{print $1}')
    USER=$(echo "$site" | awk '{print $2}')

    if [[ ! -z $USER ]]; then LOGIN=" -u $USER"; fi

    case "$URL" in

      http*)  result=$(curl $URL \
        -w "@/scripts/format.txt" $FOLLOW $LOGIN --insecure \
        --max-time $TIMEOUT --compressed -I --silent -o /dev/null \
        -H 'Pragma: akamai-x-cache-on, akamai-x-cache-remote-on, akamai-x-check-cacheable, akamai-x-get-cache-key, akamai-x-get-extracted-values, akamai-x-get-ssl-client-session-id, akamai-x-get-true-cache-key, akamai-x-serial-no, akamai-x-get-request-id,akamai-x-get-nonces,akamai-x-get-client-ip,akamai-x-feo-trace' \
        -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36' \
        -H 'Referer: ${url}')

        EXIT_CODE=$?

        if [[ $EXIT_CODE == 0 ]]; then
          echo "$TS $result" >> $TARGET_SUCCESS
        else
          echo "$TS $EXIT_CODE $site" >> $TARGET_ERROR
        fi

        ;;
    esac
  done < "$SOURCE"
fi

