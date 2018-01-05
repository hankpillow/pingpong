## Pingpong

THIS IS A PERSONAL PROJECT!

It is designed to cURL [information](https://curl.haxx.se/docs/manpage.html#-w) from a file with urls in it.

The idea is to have a lightweight container using `crontab` and `jq` to fetch data and save them on JSON file.

----

## Setup

You must create a list of urls and share it (via shared volumes) with the container.

i.e: `echo http://reddit.com > URLS`

The `URLS` file is a text file containing one url per line.

	http://www.google.com
	# lines starting with sharp (#) will be ignored
	# http://this.line.will.be/ignored
	https://my-protected-page.com username:password

> The user and password are sent via [cURL -u](https://curl.haxx.se/docs/manpage.html#-u)

----

## Log Success

All logs will be saved at `/var/pingpong/logs/samples.json` (container's path)

> the information collected came from [cURL -w](https://curl.haxx.se/docs/manpage.html#-w) command. Check there for more info.

When cURL finishes with `exit 0` a new sample will be pushed into `/var/pingpong/logs/samples.json` file.

All samples follow the format:

```json
{
  "date": "2018-01-03_17:39:49",
  "http_code": "200",
  "http_connect": "000",
  "http_version": "1.1",
  "num_connects": "2",
  "num_redirects": "1",
  "proxy_ssl_verify_result": "0",
  "redirect_url": "",
  "remote_ip": "52.72.116.221",
  "remote_port": "443",
  "scheme": "HTTPS",
  "size_download": "0",
  "size_header": "312",
  "size_request": "442",
  "size_upload": "0",
  "speed_download": "0.000",
  "speed_upload": "0.000",
  "ssl_verify_result": "0",
  "time_appconnect": "0.478933",
  "time_connect": "0.153941",
  "time_namelookup": "0.004277",
  "time_pretransfer": "0.478985",
  "time_redirect": "0.350364",
  "time_starttransfer": "0.674499",
  "time_total": "1.024888",
  "url_effective": "https://hub.docker.com/"
}
```

> This sample has ~= 635b.

## Log Error

All logs will be saved at `/var/pingpong/logs/errors.json` (container's path)

When cURL exit code is *not 0* a new error will be pushed into `/var/pingpong/logs/errors.json` file.

All errors follow the format:

```json
{
  "date": "2018-01-03_17:39:54",
  "url": "http://reddddit.com",
  "error_code": "56"
}

```

> This sample has ~= 85b.

----

## Getting started

1. Make sure you have the URLS file and a logs folder (`mkdir ./logs`)

2. start the container as daemon and share the URLS and the log folder  as volume

```
docker run -d \
   -v $(pwd)/URLS:/var/URLS \
   -v $(pwd)/logs:/var/logs:rw \
   mrboots/pingpong
```

Now you can check the activity via `tail -f ./log/*`

> by default the container will run every minute, so wait for a minute at least to see the results

----

## Container Config

All config must be provided via environment variable

* `FOLLOW_LINKS` - default `1` (0|1). Define whether redirects should be followed [@see cURL -L flag](https://curl.haxx.se/docs/manpage.html#-L) (when following links you won't see redirect status code, intead the final status code + _num_redirects_ updated.

* `MAX_TIME` - default `10` (time in sec). Define the request's timeout. [@see cURL --max-time](https://curl.haxx.se/docs/manpage.html#-m)

* `CRON_MINUTE` - defautl `*`

* `CRON_HOUR` - defautl `*`

* `CRON_DAY_MONTH` - defautl `*`

* `CRON_MONTH` - defautl `*`

* `CRON_DAY_WEEK` - defautl `*`

> check the [wiki](https://en.wikipedia.org/wiki/Cron) for more details or use the [crontab generator](https://crontab-generator.org/) to help you feeding these values.

Accordingly to the frequency and the amount of urls you have on your list the logs can increase size very fast.

Check above the approx size a sample/error log can have and limit the amount of itens the log can keep.

* `MAX_SAMPLES` - default `100000` - the amount of itens inside the samples.log

* `MAX_ERRORS` - default `100000` - the amount of itens inside the errors.log

