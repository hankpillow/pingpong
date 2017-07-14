#pingpong

my personal "pingdom"

## setup

### URLS

This container expect a file called **URLS** at **/var** path (container's path)

The URLS file is a text file containing one url per line. Ex:

```
http://www.google.com
#http://this.line.will.be/ignored
https://my.projected-page.com username:password
```

> The user and password is sent to [cURL -u](https://curl.haxx.se/docs/manpage.html#-u)

### LOGS

Pingpong will log cURL activity on **/var/log/pingpong.log** and errors on **/var/log/pingpong.error.log**

* Success

When cURL exit code 0 (success) the log follow this fields:

```
(date +%F_%T) %{http_code} %{time_namelookup} %{time_connect} %{time_appconnect} %{time_pretransfer} %{time_redirect} %{time_starttransfer} %{time_total} %{num_redirects} %{url_effective}
```

Example:

```
2017-07-14_13:27:01 200 0.002943 0.006507 0.026852 0.026948 0.173054 0.313259 0.486344 1 https://www.facebook.com/
```

> the timestamp cames from container's clock and request's data from [cURL -w](https://curl.haxx.se/docs/manpage.html#-w)

* Error

When cURL exit code is not 0 (error) the log follow this fields:
```
(date +%F_%T) {exit code} {url} {credentials}
```

Example:

```
2017-07-13_12:31:01 !6 http://foo.bar/
```

> the list of exit codes is [here](https://curl.haxx.se/libcurl/c/libcurl-errors.html)!

## config

All config must be provided via environment variable

* `FOLLOW_LINKS` - default `1` (0|1). Define whether redirects should be followed [@see cURL -L flag](https://curl.haxx.se/docs/manpage.html#-L)

* `APPEND_LOG` - default `1` (0|1). Define whether appending into the  same log file `pingpong.log` or if every time the script is called a new file must be created (`pingpong.log-<timestamp>`)

* `MAX_TIME` - default `10`. Define the request's timeout. [@see cURL --max-time](https://curl.haxx.se/docs/manpage.html#-m)

## run

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

### TODO

* allow setting cron frequency via param
