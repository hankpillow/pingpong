import R from 'ramda'

//@see https://stackoverflow.com/questions/1551382/user-friendly-time-format-in-python
//TODO allow int as args
const pretty = (time, now = new Date()) => {

	let diff = now

	try {
		if (typeof time === 'string' && isNaN(Date.parse(time)) === false) {
			diff = now - new Date(time)
		} else if (time instanceof Date) {
			diff = now - time
		} else {
			return ''
		}
	} catch (err) {return ''}

	const second_diff = parseInt(diff / 1000, 10)
	const day_diff =  parseInt(second_diff / 86400, 10)

	if (day_diff < 0)
		return ''

	if (day_diff === 0) {
		if (second_diff < 10)
			return "just now"
		if (second_diff < 60)
			return second_diff + " seconds ago"
		if (second_diff < 120)
			return "a minute ago"
		if (second_diff < 3600)
			return parseInt(second_diff / 60, 10) + " minutes ago"
		if (second_diff < 7200)
			return "an hour ago"
		if (second_diff < 86400)
			return parseInt(second_diff / 3600, 10) + " hours ago"
	}

	if (day_diff == 1)
		return "yesterday"

	if (day_diff < 7)
		return (day_diff) + " days ago"

	if (day_diff < 31)
		return parseInt(day_diff / 7, 10) + " weeks ago"

	if (day_diff < 365)
		return parseInt(day_diff / 30, 10) + " months ago"

	return parseInt(day_diff / 365, 10) + " years ago"
}

const WEEK_DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa']
const tinyDate = R.map(date =>  {
	if (!date) return ''
	return `${WEEK_DAYS[date.getDay()]}${date.getDate()} ${date.getFullYear()}`
})

//@full credits to https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php/6117889#6117889
const getWeekNumber = date => {
	let d = new Date(+date);
	d.setHours(0,0,0);
	d.setDate(d.getDate()+4-(d.getDay()||7));
	return Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);
}

export {pretty, tinyDate, getWeekNumber}
