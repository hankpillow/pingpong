#!/bin/sh

#follow redirects?
#ouput place

now=$(date +%s)

mkdir -p /var/log/ping-pong
target="/var/log/ping-pong/sample.log"

while read -r site; do

  if [[  ! -z "$site" && ! $site =~ ^#  ]];
  then

    result=$(curl $site \
      -w "@format.txt" --compressed -I --silent -o /dev/null \
      -H 'Pragma: akamai-x-cache-on, akamai-x-cache-remote-on, akamai-x-check-cacheable, akamai-x-get-cache-key, akamai-x-get-extracted-values, akamai-x-get-ssl-client-session-id, akamai-x-get-true-cache-key, akamai-x-serial-no, akamai-x-get-request-id,akamai-x-get-nonces,akamai-x-get-client-ip,akamai-x-feo-trace' \
      -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36' \
      -H 'Referer: ${url}')

		echo "$(date +%F_%T) $result" >> $target

  fi
done <<< "$(echo $@ | tr " " "\n")"
