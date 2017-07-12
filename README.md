#pingpong

my personal "pingdom"

## setup

* URLS

This containerexpect a file called **URLS** file at **/var** folder.

The URLS file is a text file containing one url per line. Ex:

```
http://www.google.com
#http://this.line.will.be/ignored
https://my.projected-page.com username:password
```

* LOGS

Pingpong will log cURL activity on **/var/log/pingpong.log** and errors on **/var/log/pingpong.error.log**

## config

All config must be provided via environment variable

* `FOLLOW_LINKS` - default `1` (0|1). Define whether redirects should be followed (@see cURL -L flag)

* `APPEND_LOG` - default `1` (0|1). Define whether appending into the  same log file `pingpong.log` or if every time the script is called a new file must be created (`pingpong.log-<timestamp>`)

* `MAX_TIME` - default `10`. Define the request's timeout. (@see cURL --max-time)

## run

1- Make sure you have the URLS file

```
echo "http://www.google.com/" > URLS
echo "creating local folder to keep the logs"
mkdir ./log

```

2- start the container as daemon and share the URLS and the log holder as volume

```
docker run -d \
   -v $(pwd)/URLS:/var/ \
   -v $(pwd)/log:/var/log:rw \
   mrboots/pingpong
```

3- check the activity

```
tails -f ./log/*
```


