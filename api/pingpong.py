#TODO- parar loop quando a data estiver antiga
#TODO- array reverse
#TODO- formato de tempo mais flexivel

from datetime import datetime, timedelta
import json
import falcon
import logging
import sys

logging.basicConfig(stream=sys.stdout, level=logging.DEBUG)

DEFAULT_HOST = "*"
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
        params["start_date"] = TIME.get(params.get("start_date"), "all")
        params["host"] = req.get_param("host", default=DEFAULT_HOST)

    except Exception as error:
        LOGGER.error(error)
        raise falcon.HTTPError(falcon.HTTP_400, 'cant sanitize params')

def format_sample(arr):
    """format arr into curl sample"""

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
        "url": str(arr[10]).replace("\n", "")
    }

def format_error(arr):
    """format arr into failed curl"""

    return {
        "type": "error",
        "date": datetime.strptime(arr[0], DATE_TEMPLATE),
        "exit_code": arr[1],
        "url": arr[2]
    }

def parse_line(info):
    """transform the given line into api object"""

    if not len(info):
        return None

    else:
        try:
            chunks = info.split(' ')
            type = len(chunks)

            if type == 11:
                return format_sample(chunks)

            elif type == 3 or type == 4:
                return format_error(chunks)

            else:
                LOGGER.warning('got malformed line {0}'.format(info))
                return None

        except Exception as error:
            LOGGER.error('Error parsing chunk: {0}. error:{1}'.format(info, error))
            return None

class PingPong(object):

        @falcon.before(sanitize_data)
        def on_get(self, req, resp, start_date, host):
            """Handles GET requests"""
            LOGGER.info('querying {0} for host:{1}'.format(str(start_date), host))

            data = []
            now = datetime.now() - start_date
            try:
                with open('/var/DB', 'r') as db:
                    for line in db:
                        chunk = parse_line(line)
                        if chunk and chunk["date"] and chunk["date"] > now:
                            chunk["date"] = unicode(chunk["date"])
                            data.append(chunk)

            except Exception as error:
                LOGGER.error(error)
                raise falcon.HTTPError(falcon.HTTP_400, 'cant parse DB')

            resp.body = json.dumps(data)

""" webserver init """
api = falcon.API()
handler = PingPong()
api.add_route('/', handler)
api.add_route('/{start_date}', handler)
