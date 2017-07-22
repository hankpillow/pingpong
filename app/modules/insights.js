import R from 'ramda'

/* return item.type==error from <list>*/
const filterError = R.filter(R.propEq('type','error'))

/* return item.type==sample from <list>*/
const filterSample = R.filter(R.propEq('type','sample'))

/* return look at <prop> on <list> and return the median value */
const getMedian = (prop, list) => R.compose(R.median, R.pluck(prop))(list)

/* return the mean from given regex over http_code prop */
const meanHttpCode = reg => R.compose(
	R.mean,
	R.map(val => val.toString().match(reg) ? 1 : 0),
	R.pluck('http_code')
)

/* return the mean of http_code mathing 2XX|3XX from a <list>*/
const getUptime = meanHttpCode(/^(2|3)\d{2}$/i)

/* return the mean of http_code mathing 4xx|5xx from a <list>*/
const getDowntime = meanHttpCode(/^(4|5)\d{2}$/i)

/* return sorted list with only <prop> */
const sortByProp = (prop) => R.compose(R.sort((a,b) => a > b), R.pluck(prop))

/* return lower value from list */
const getFaster = (prop, list) => sortByProp(prop)(list)[0]

/* return higher value from list */
const getSlower = (prop, list) => sortByProp(prop)(list)[list.length-1]

const pluckDates = R.compose(R.filter(date => Date.parse(date)),R.pluck('date'))

const toDate = R.compose(R.map(date => new Date(date)),pluckDates)

export {
sortByProp,
getSlower,
getFaster,
getDowntime,
getUptime,
getMedian,
filterError,
filterSample,
pluckDates,
toDate,
}
