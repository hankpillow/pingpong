import R from 'ramda'
import {getWeekNumber} from './timeformat'

const BY_HOUR = date => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`
const BY_DAY = date => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
const BY_WEEK = date => `${date.getFullYear()}-W${getWeekNumber(date)}`
const BY_MONTH = date => `${date.getFullYear()}-${date.getMonth()}`
const BY_YEAR = date => `${date.getFullYear()}`
const addGroup = (groupReducer) => R.map(item => { return {...item, groupBy: groupReducer(item.date)} })

const groupByHour = R.compose(R.groupWith(R.eqProps('groupBy')), addGroup(BY_HOUR))
const groupByDay = R.compose(R.groupWith(R.eqProps('groupBy')), addGroup(BY_DAY))
const groupByWeek = R.compose(R.groupWith(R.eqProps('groupBy')), addGroup(BY_WEEK))
const groupByMonth = R.compose(R.groupWith(R.eqProps('groupBy')), addGroup(BY_MONTH))
const groupByYear = R.compose(R.groupWith(R.eqProps('groupBy')), addGroup(BY_YEAR))

/* return item.type==error from <list>*/
const filterError = R.filter(R.propEq('type','error'))

/* return item.type==sample from <list>*/
const filterSample = R.filter(R.propEq('type','sample'))

/* return list of values from <prop> */
const pluck = (prop, list) => R.pluck(prop)(list)

/* return item.type==error from <list>*/
const filterProp = (prop) => R.filter(R.has(prop))

/* convert 'date' prop value into Date instance */
const toDate = R.compose(
	R.map(item => {return {...item, date:new Date(item.date)}}),
	R.filter(item => !isNaN(Date.parse(item.date))),
	R.filter(R.propIs(String, 'date')),
	filterProp('date')
)

/* return sorted list with only <prop> by <fn> */
const sortByProp = (prop, fn = (a,b) => a > b) => R.compose(R.sort(fn), filterProp(prop))

export {
	filterError, filterSample, filterProp,
	sortByProp,
	toDate,
	pluck,
	groupByMonth,
	groupByWeek,
	groupByDay,
	groupByYear,
	groupByHour
}
