import test from 'ava';
import * as insights from './modules/insights'

test('insight.filterSample', t => {
	const data = [
		{type:'sample',a:2},
		{type:'sample',a:1},
		{type:'error'}
	]

	t.is(insights.filterSample(data).length, 2, 'should handle sample')
	t.deepEqual(insights.filterSample(data)[0], data[0], 'should handle sample')
})
test('insight.filterError', t => {
	const data = [
		{type:'sample',a:2},
		{type:'sample',a:1},
		{type:'error'}
	]

	t.is(insights.filterError(data).length, 1, 'should filter error')
	t.deepEqual(insights.filterError(data)[0], data[2], 'should filter  error')
})

test('insight.getMedia', t => {
	const data = [
		{a:10, b:-10},
		{a:20, b:10},
		{a:10,url:'b'}
	]
	t.is(insights.getMedian('a', data), 10, 'handle avg values from given prop name')
	t.is(insights.getMedian('b', data), 0, 'handle avg values from given prop name')
})

test('insight.getUptime', t => {
	const data = [
		{http_code:200},
		{http_code:300},
		{http_code:302},
		{http_code:400},
		{http_code:500},
		{url:0}
	]
	t.is(insights.getUptime(data), 0.6, 'handle http_code 2xx and 3xx and return the mean')
})

test('insight.getDowntime', t => {
	const data = [
		{http_code:200},
		{http_code:300},
		{http_code:302},
		{http_code:400},
		{http_code:500},
		{url:0}
	]
	t.is(insights.getDowntime(data), 0.4, 'handle http_code 4xx and 5xx and return the mean')
})

test('insight.getFaster', t => {
	const data = [
		{b:200},
		{b:300},
		{b:300},
		{b:302},
		{b:302},
		{b:400},
		{b:500},
		{a:0}
	]
	t.deepEqual(insights.getFaster('b', data), data[0], 'handle returning the lower value from list')
})

test('insight.getSlower', t => {
	const data = [
		{b:200},
		{b:300},
		{b:300},
		{b:302},
		{b:302},
		{b:400},
		{b:500},
		{a:0}
	]
	t.deepEqual(insights.getSlower('b', data), data[6], 'handle returning the higher value from list')
})

test('insights [utils]', t => {
	const data = [
		{date:'2017-07-22 13:30:01'},
		{date:'"2017-07-22 13:30:01"'},
		{date:''},
		{date:{}},
		{date:false},
		{datx:'error',url:'b'}
	]
	t.is(insights.toDate(data).length, 1, 'return a list of Date objects')
	t.deepEqual(insights.toDate(data)[0], {date:new Date('2017-07-22 13:30:01')}, 'return a list of Date objects')
	t.is(insights.pluck('date', data).length, 6, 'extract dates from samples')
})

