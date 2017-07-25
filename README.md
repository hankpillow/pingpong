## Pingpong

	1. My personal "pingdom"

	2. This project was created help checking server uptime

	3. *It's not designed to be used on production env*

This project is fully based on [xordiv/docker-alpine-cron](https://github.com/xordiv/docker-alpine-cron) container (<8mb) that cURLs a list of urls - every minute - and save each result into a new line in a log file

----

## Setup

Out of the box it has it's own _URLS_ file pointing to [https://hub.docker.com](https://hub.docker.com).

You must define your own set urls by sharing, as volume, your _URLS_ file.

### URLS

The _URLS_ file is a text file containing one url per line. Ex:

	http://www.google.com
	#http://this.line.will.be/ignored
	https://my.projected-page.com username:password

> The user and password are sent via [cURL -u](https://curl.haxx.se/docs/manpage.html#-u)

----

## Log result

All logs will be saved (container's path) at  */var/log/pingpong.log* (container's errors on */var/log/pingpong.error.log*)

### Success

Follow the log format:

> the timestamp cames from container's clock and request's data from *[cURL -w](https://curl.haxx.se/docs/manpage.html#-w)*

```
(date +%F_%T) %{http_code} %{time_namelookup} %{time_connect} %{time_appconnect} %{time_pretransfer} %{time_redirect} %{time_starttransfer} %{time_total} %{num_redirects} %{url_effective}
```

Example:

```
2017-07-25_13:40:01 200 0.013449 0.159021 0.553087 0.553294 0.000000 0.731974 0.732055 0 https://hub.docker.com/
2017-07-25_13:41:01 200 0.014615 0.159831 0.480699 0.480813 0.000000 0.635834 0.635903 0 https://hub.docker.com/
```

###  Error

When cURL exit code is not 0 (error) the log follow this fields:

```
(date +%F_%T) !{exit code} {url} {credentials}
```

Example:

```
2017-07-13_12:31:01 !6 http://foo.bar/
```

> the list of exit codes is *[here](https://curl.haxx.se/libcurl/c/libcurl-errors.html)*

----

## Config

All config must be provided via environment variable

* `FOLLOW_LINKS` - default `1` (0|1). Define whether redirects should be followed [@see cURL -L flag](https://curl.haxx.se/docs/manpage.html#-L) (when following links you won't see redirect status code, intead the final status code + _num_redirects_ updated.

* `APPEND_LOG` - default `1` (0|1). Define whether appending into the  same log file `pingpong.log` or if every time the script is called a new file must be created (`pingpong.log-<timestamp>`)

* `MAX_TIME` - default `10` (time in sec). Define the request's timeout. [@see cURL --max-time](https://curl.haxx.se/docs/manpage.html#-m)

----

## RUN

1. Make sure you have the URLS file

```
echo "http://www.google.com/" > URLS
echo "creating local folder to keep the logs"
mkdir ./log

```

2. start the container as daemon and share the URLS and the log holder as volume

```
docker run -d \
   -v $(pwd)/URLS:/var/URLS \
   -v $(pwd)/log:/var/log:rw \
   mrboots/pingpong
```

3. check the activity

```
tails -f ./log/*
```

## ROADMAP

- Send email when server's down
- Max-size log
- Max-lines log

