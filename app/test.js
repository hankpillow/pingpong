import test from 'ava';
import * as timeformat from './modules/timeformat'
import * as insights from './modules/insights'

const zero = new Date('2017-07-20 15:30:00')

test('timeformat.pretty should handle invalid params', t => {
	const msg =  'should return empty string for invalid args'
	t.is(timeformat.pretty(1),'', msg)
	t.is(timeformat.pretty('foo'), '', msg)
	t.is(timeformat.pretty(false), '', msg)
})

test('timeformat.pretty "just now"', t => {
	const msg = 'when time diff < 10s'
	t.is(timeformat.pretty(zero, zero),'just now', msg)
	t.is(timeformat.pretty(new Date('2017-07-20 15:29:59'), zero), 'just now', msg)
})

test('timeformat.pretty "N seconds ago"', t => {
	const msg = 'when time diff <60s'
	t.is(timeformat.pretty(new Date('2017-07-20 15:29:50'), zero), '10 seconds ago', msg)
	t.is(timeformat.pretty(new Date('2017-07-20 15:29:01'), zero), '59 seconds ago', msg)
})

test('timeformat.pretty "a minute ago"', t => {
	const msg = 'when time diff <120s'
	t.is(timeformat.pretty(new Date('2017-07-20 15:29:00'), zero), 'a minute ago', msg)
	t.is(timeformat.pretty(new Date('2017-07-20 15:28:59'), zero), 'a minute ago', msg)
})

test('timeformat.pretty "N minutes ago"', t => {
	const msg = 'when time diff <3600s'
	t.is(timeformat.pretty(new Date('2017-07-20 15:28:00'), zero), '2 minutes ago', msg)
	t.is(timeformat.pretty(new Date('2017-07-20 14:30:01'), zero), '59 minutes ago', msg)
})

test('timeformat.pretty "a hour ago"', t => {
	const msg = 'when time diff <7200s'
	t.is(timeformat.pretty(new Date('2017-07-20 14:30:00'), zero), 'an hour ago', msg)
	t.is(timeformat.pretty(new Date('2017-07-20 13:30:01'), zero), 'an hour ago', msg)
})

test('timeformat.pretty "N hours ago"', t => {
	const msg = 'when time diff <86400s'
	t.is(timeformat.pretty(new Date('2017-07-20 13:29:59'), zero), '2 hours ago', msg)
	t.is(timeformat.pretty(new Date('2017-07-19 15:30:01'), zero), '23 hours ago', msg)
})

test('timeformat.pretty "yesterday"', t => {
	const msg = 'when time diff <2d'
	t.is(timeformat.pretty(new Date('2017-07-19 15:30:00'), zero), 'yesterday', msg)
	t.is(timeformat.pretty(new Date('2017-07-18 15:30:01'), zero), 'yesterday', msg)
})

test('timeformat.pretty "N days ago"', t => {
	const msg = 'when time diff <7d'
	t.is(timeformat.pretty(new Date('2017-07-18 15:30:00'), zero), '2 days ago', msg)
	t.is(timeformat.pretty(new Date('2017-07-13 15:30:01'), zero), '6 days ago', msg)
})

test('timeformat.pretty "N weeks ago"', t => {
	const msg = 'when time diff <31d'
	t.is(timeformat.pretty(new Date('2017-07-13 15:30:00'), zero), '1 weeks ago', msg)
	t.is(timeformat.pretty(new Date('2017-06-19 15:30:01'), zero), '4 weeks ago', msg)
})

test('timeformat.pretty "N months ago"', t => {
	const msg = 'when time diff <365d'
	t.is(timeformat.pretty(new Date('2017-06-19 15:30:00'), zero), '1 months ago', msg)
	t.is(timeformat.pretty(new Date('2016-07-20 15:30:01'), zero), '12 months ago', msg)
})

test('timeformat.pretty "N years ago"', t => {
	const msg = 'when time diff >365d'
	t.is(timeformat.pretty(new Date('2016-07-20 15:30:00'), zero), '1 years ago', msg)
	t.is(timeformat.pretty(new Date('2015-07-20 15:30:00'), zero), '2 years ago', msg)
})

test('tiny date', t => {
	const data = [
		new Date('2017-07-20 13:30:01'),
		new Date('2017-07-21 13:30:01'),
		new Date('2017-07-22 13:30:01'),
		new Date('2017-07-23 13:30:01'),
		new Date('2017-07-24 13:30:01'),
		new Date('2017-07-25 13:30:01'),
		new Date('2017-07-26 13:30:01'),
		new Date('2017-07-27 13:30:01'),
	]
	const expected = [
		'Th20 2017',
		'Fr21 2017',
		'Sa22 2017',
		'Su23 2017',
		'Mo24 2017',
		'Tu25 2017',
		'We26 2017',
		'Th27 2017'
	]
	t.deepEqual(timeformat.tinyDate(data), expected , 'must parse all dates')
})

test('insight sample type', t => {
	const data = [{type:'sample',url:'j'},{type:'sample',url:'a'},{type:'error',url:'b'}]
	t.is(insights.filterError(data).length, 1, 'should handle error')
	t.is(insights.filterSample(data).length, 2, 'should handle sample')
})

test('insight median values', t => {
	const data = [
		{type:'sample',url:'j', a:10, b:-10},
		{type:'sample',url:'a', a:20, b:10},
		{type:'error',url:'b'}
	]
	t.is(insights.getMedian('a', insights.filterSample(data)), 15, 'handle avg values from given prop name')
	t.is(insights.getMedian('b', insights.filterSample(data)), 0, 'handle avg values from given prop name')
})

test('insight uptime and downtime', t => {
	const data = [
		{type:'sample',url:'j', http_code:200},
		{type:'sample',url:'a', http_code:300},
		{type:'sample',url:'a', http_code:302},
		{type:'sample',url:'c', http_code:400},
		{type:'sample',url:'d', http_code:500},
		{type:'error',url:'b'}
	]
	t.is(insights.getUptime(insights.filterSample(data)), 0.6, 'handle http_code 2xx and 3xx and return the mean')
	t.is(insights.getDowntime(insights.filterSample(data)), 0.4, 'handle http_code 4xx and 5xx and return the mean')
})

test('insight faster and slower', t => {
	const data = [
		{type:'sample',url:'j', b:200},
		{type:'sample',url:'a', b:300},
		{type:'sample',url:'a', b:302},
		{type:'sample',url:'c', b:400},
		{type:'sample',url:'d', b:500},
		{type:'error',url:'b'}
	]
	t.is(insights.getFaster('b', insights.filterSample(data)), 200, 'handle returning the lower value from list')
	t.is(insights.getSlower('b', insights.filterSample(data)), 500, 'handle returning the higher value from list')
})

test('insights date utils', t => {
	const data = [
		{date:'2017-07-22 13:30:01'},
		{date:'"2017-07-22 13:30:01"'},
		{date:''},
		{date:{}},
		{date:false},
		{datx:'error',url:'b'}
	]

	t.is(insights.pluckDates(data).length, 1, 'extract dates from samples')
	t.is(insights.toDate(data).length, 1, 'return a list of Date objects')
})

