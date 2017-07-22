import R from 'ramda'

/* return item.type==error from <list>*/
const filterProp = (prop) => R.filter(R.has(prop))

/* return item.type==error from <list>*/
const filterError = R.filter(R.propEq('type','error'))

/* return item.type==sample from <list>*/
const filterSample = R.filter(R.propEq('type','sample'))

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

/* return sorted list with only <prop> by <fn> */
const sortByProp = (prop, fn = (a,b) => a > b) => R.compose(R.sort(fn), filterProp(prop), R.clone)

/* return lower value from list */
const getFaster = (prop, list) => R.compose(R.take(1), sortByProp(prop), R.clone)(list)[0]

/* return higher value from list */
const getSlower = (prop, list) => R.compose(R.takeLast(1), sortByProp(prop), R.clone)(list)[0]

const pluck = (prop, list) => R.compose(R.pluck(prop), R.clone)(list)

const toDate = R.compose(
	R.filter(R.propIs(Date,'date')),
	R.map(item => {
		const t = Date.parse(item.date)
		const date = !isNaN(t) ? new Date(item.date) : null
		return {...item, date}
	}),
	R.filter(R.propIs(String, 'date')),
	filterProp('date')
)

export {
sortByProp,
getSlower,
getFaster,
getDowntime,
getUptime,
getMedian,
filterError,
filterSample,
pluck,
toDate,
}
