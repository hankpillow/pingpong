#!/bin/sh

source=/scripts/URLS

if [[ ! -f  $source ]];
then

  echo "$(date +%F_%T) missing URLS file. " >> /var/log/pingpong.error.log

else

  [[ "$1" == "--follow" || "$2" == "--follow"  ]] && follow=" -L " || follow=""
  [[ "$1" == "--append" || "$2" == "--append"  ]] && target="/var/log/pingpong.sample.log" || target="/var/log/pingpong.sample.$(date +%s).log"

  while read -r site; do
    case $site in
      http*) result=$(curl $site \
        -w "@/scripts/format.txt" $follow --compressed -I --silent -o /dev/null \
        -H 'Pragma: akamai-x-cache-on, akamai-x-cache-remote-on, akamai-x-check-cacheable, akamai-x-get-cache-key, akamai-x-get-extracted-values, akamai-x-get-ssl-client-session-id, akamai-x-get-true-cache-key, akamai-x-serial-no, akamai-x-get-request-id,akamai-x-get-nonces,akamai-x-get-client-ip,akamai-x-feo-trace' \
        -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36' \
        -H 'Referer: ${url}')
        echo "$(date +%F_%T) $result" >> $target
        ;;
    esac
  done < "$source"
fi

