
from datetime import datetime, timedelta
import falcon
import json
import logging
import re
import sys

logging.basicConfig(stream=sys.stdout, level=logging.DEBUG)

DEFAULT_HOST = ""
DATE_TEMPLATE = "%Y-%m-%d_%H:%M:%S"

LOGGER = logging.getLogger('[pingpong]')

TIME = {
    "now": timedelta(minutes=30),
    "6h": timedelta(hours=6),
    "12h": timedelta(hours=12),
    "today": timedelta(days=1),
    "last_week": timedelta(days=7),
    "last_month": timedelta(days=30),
    "last_year": timedelta(days=365)
}

def sanitize_data(req, resp, resource, params):
    """normalize params before parsing db"""

    try:
        params["start_date"] = TIME.get(params.get("start_date"), "now")
        params["host"] = req.get_param("host", default=DEFAULT_HOST)

    except Exception as error:
        LOGGER.error(error)
        raise falcon.HTTPError(falcon.HTTP_400, 'unexpected path')

def format_sample(arr):
    """format arr into curl sample"""

    try:
        return {
            "type": "sample",
            "date": datetime.strptime(arr[0], DATE_TEMPLATE),
            "http_code": arr[1],
            "time_namelookup": arr[2],
            "time_connect": arr[3],
            "time_appconnect": arr[4],
            "time_pretransfer": arr[5],
            "time_redirect": arr[6],
            "time_starttransfer": arr[7],
            "time_total": arr[8],
            "num_redirects": arr[9],
            "url": str(arr[10])
        }

    except Exception as error:
        LOGGER.warning('malformed sample line: {0}'.format(arr.join(' ')))
        LOGGER.error(error)
        return None

def format_error(arr):
    """format arr into failed curl"""

    try:
        return {
            "type": "error",
            "date": datetime.strptime(arr[0], DATE_TEMPLATE),
            "exit_code": arr[1],
            "url": arr[2],
            "user": arr[3] if len(arr) > 3 else ""
        }

    except Exception as error:
        LOGGER.warning('malformed error line: {0}'.format(arr.join(' ')))
        LOGGER.error(error)
        return None

def parse_line(info):
    """transform the given line into api object"""

    if not len(info):
        return None

    chunks = info.split(' ')
    size = len(chunks)

    if size == 11:
        return format_sample(chunks)

    elif size == 3 or size == 4:
        return format_error(chunks)

    else:
        LOGGER.warning('unexpected line format. size:{0} line:{1}'.format(size, info))
        return None

class PingPong(object):

        @falcon.before(sanitize_data)
        def on_get(self, req, resp, start_date, host):

            """Handles GET requests"""
            LOGGER.info('querying back {0} for host:{1}'.format(str(start_date), host))

            data = []
            min_date = datetime.now() - start_date

            try:
                with open('/var/DB', 'r') as db:

                    for line in reversed(db.readlines()):
                        line = re.sub("\n$", "", line)
                        chunk = parse_line(line)

                        if not chunk:
                            continue

                        if chunk["date"] < min_date:
                            LOGGER.info('stop searching after when hit {0}'.format(line))
                            break

                        if chunk["url"] == host or len(host) == 0:
                            chunk["date"] = unicode(chunk["date"])
                            data.append(chunk)

            except Exception as error:
                LOGGER.error(error)
                raise falcon.HTTPError(falcon.HTTP_400, 'invalid DB')

            LOGGER.info('got {0} results.'.format(len(data)))
            resp.body = json.dumps(data)

""" webserver init """
handler = PingPong()

api = falcon.API()
api.add_route('/api/', handler)
api.add_route('/api/{start_date}', handler)

