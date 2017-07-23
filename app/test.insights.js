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

test('insights.groupByDay', t => {
	const data = [
		{date: new Date('2016-01-19 13:30:01')},
		{date: new Date('2016-01-19 23:10:31')},
		{date: new Date('2017-07-19 13:30:01')},
		{date: new Date('2017-07-21 13:32:01')},
		{date: new Date('2017-07-21 13:33:01')},
		{date: new Date('2017-07-22 13:50:01')},
		{date: new Date('2017-07-23 14:30:01')},
		{date: new Date('2017-07-23 14:30:01')},
	]
	var expected = [
		[
			{date: new Date("2016-01-19T15:30:01.000Z"), groupBy: "2016-0-19"},
			{date: new Date("2016-01-20T01:10:31.000Z"), groupBy: "2016-0-19"}
		],
		[
			{date: new Date("2017-07-19T16:30:01.000Z"),groupBy: "2017-6-19"}
		],
		[
			{date: new Date("2017-07-21T16:32:01.000Z"), groupBy: "2017-6-21"},
			{date: new Date("2017-07-21T16:33:01.000Z"), groupBy: "2017-6-21"}
		],
		[
			{date: new Date("2017-07-22T16:50:01.000Z"), groupBy: "2017-6-22"}
		],
		[
			{date: new Date("2017-07-23T17:30:01.000Z"), groupBy: "2017-6-23"},
			{date: new Date("2017-07-23T17:30:01.000Z"), groupBy: "2017-6-23"}
		]
	]

	t.deepEqual(insights.groupByDay(data), expected, 'group items by day')
})

test('insights.groupByWeek', t => {
	const data = [
		{date: new Date('2017-07-05 13:30:01')},
		{date: new Date('2017-07-19 13:31:01')},
		{date: new Date('2017-07-23 13:32:01')},
		{date: new Date('2017-08-01 13:33:01')},
		{date: new Date('2017-08-13 13:50:01')},
		{date: new Date('2017-08-27 14:30:01')},
		{date: new Date('2017-09-29 09:30:51')},
		{date: new Date('2017-09-30 13:30:21')},
		{date: new Date('2017-09-31 14:10:05')},
		{date: new Date('2017-10-12 13:30:01')},
		{date: new Date('2017-10-30 13:30:01')}
	]
	const expected = [
		[ { date: new Date("2017-07-05T16:30:01.000Z"), groupBy: "2017-W27" } ],
		[
			{ date: new Date("2017-07-19T16:31:01.000Z"), groupBy: "2017-W29" },
			{ date: new Date("2017-07-23T16:32:01.000Z"), groupBy: "2017-W29" }
		],
		[ { date: new Date("2017-08-01T16:33:01.000Z"), groupBy: "2017-W31" } ],
		[ { date: new Date("2017-08-13T16:50:01.000Z"), groupBy: "2017-W32" } ],
		[ { date: new Date("2017-08-27T17:30:01.000Z"), groupBy: "2017-W34" } ],
		[
			{ date: new Date("2017-09-29T12:30:51.000Z"), groupBy: "2017-W39" },
			{ date: new Date("2017-09-30T16:30:21.000Z"), groupBy: "2017-W39" },
			{ date: new Date("2017-10-01T17:10:05.000Z"), groupBy: "2017-W39" }
		],
		[ { date: new Date("2017-10-12T16:30:01.000Z"), groupBy: "2017-W41" } ],
		[ { date: new Date("2017-10-30T15:30:01.000Z"), groupBy: "2017-W44" } ]
	]

	t.deepEqual(insights.groupByWeek(data), expected, 'group items by week')
})


