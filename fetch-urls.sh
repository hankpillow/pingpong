#!/bin/bash

ROOT="$(pwd $0)"
URL_LIST=$ROOT/URLS
TARGET_ERROR=$ROOT/logs/pingpong-error.log
TARGET_SUCCESS=$ROOT/logs/pingpong.log

[[ $FOLLOW_LINKS == 0 ]] && FOLLOW="" || FOLLOW=" -L "
[[ $MAX_TIME -gt 0 ]] && TIMEOUT="$MAX_TIME" || TIMEOUT=10

logerror () {
	echo "{\"date\":\"$(date +%F_%T)\",\"message\":\"$1\",\"error_code\":\"$2\"}" | jq '.'
}

if [[ ! -f $URL_LIST ]]; then
	logerror 100 "missing URL file"
	exit 1
fi

if [[ ! -f $TARGET_SUCCESS ]]; then
	echo "[]" > $TARGET_SUCCESS
fi

if [[ ! -f $TARGET_ERROR ]]; then
	echo "[]" > $TARGET_ERROR
fi

while read -r site; do

	URL=$(echo "$site" | awk '{print $1}')
	USER=$(echo "$site" | awk '{print $2}')

	[[ ! -z $USER ]] && LOGIN=" -u $USER" || LOGIN=""

	# only urls starting with http(s):// will be tested.
	if [[ $URL =~ ^https?:// ]]; then

		echo -n "#fetching url $URL: "
		RESULT=$(curl $URL -w "@$ROOT/curl-parse-result" $FOLLOW $LOGIN --insecure \
			--max-time $TIMEOUT --compressed -I --silent -o /dev/null \
			-H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36')

		# check for last exit code
		if [[ $? == 0 ]]; then

			# append date into sample object
			SAMPLE=$(echo $RESULT | jq -c --arg date "$(date +%F_%T)" '.date |= . + $date' )

			EXIT_CODE=$?
			if [[ $EXIT_CODE == 0 ]]; then
				LIST=$(cat $TARGET_SUCCESS | jq -c -a --arg sample "$SAMPLE" '. |= . + [$sample]')

				if [[ ! $? == 0 ]]; then
					logerror "e1" "jq couldnt append the sample on the list"
					exit 1
				fi

				echo $LIST > $TARGET_SUCCESS

			else
				logerror "e2" "jq couldnt append date or parse the given input"
				exit 1
			fi
			echo "done"

		else
			logerror $EXIT_CODE $URL
			echo "failed $EXIT_CODE"
		fi

	fi

done < "$URL_LIST"
echo "#done"
exit 0
