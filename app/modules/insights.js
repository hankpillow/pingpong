import R from 'ramda'
import {filterProp, sortByProp} from './data'
import {getWeekNumber} from './timeformat'

/* return look at <prop> on <list> and return the median value */
const getMedian = (prop, list) => R.compose(R.median, R.pluck(prop), R.filter(R.has(prop)))(list)

/* return the mean from given regex over http_code prop */
const meanHttpCode = reg => R.compose(
	R.mean,
	R.map(val => val.toString().match(reg) ? 1 : 0),
	R.pluck('http_code'),
	R.filter(R.has('http_code'))
)

/* return the mean of http_code mathing 2XX|3XX from a <list>*/
const getUptime = meanHttpCode(/^(2|3)\d{2}$/i)

/* return the mean of http_code mathing 4xx|5xx from a <list>*/
const getDowntime = meanHttpCode(/^(4|5)\d{2}$/i)

/* return lower value from list */
const getFaster = (prop, list) => R.compose(R.take(1), sortByProp(prop))(list)[0]

/* return higher value from list */
const getSlower = (prop, list) => R.compose(R.takeLast(1), sortByProp(prop))(list)[0]

export {
	getMedian,
	getSlower, getFaster,
	getDowntime, getUptime,
}
