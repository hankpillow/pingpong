import test from 'ava'
import * as d from '../../dashboard/modules/data'

test('data.filterSample', t => {
	const data = [
		{type:'sample',a:2},
		{type:'sample',a:1},
		{type:'error'}
	]

	t.is(d.filterSample(data).length, 2, 'should handle sample')
	t.deepEqual(d.filterSample(data)[0], data[0], 'should handle sample')
})
test('data.filterError', t => {
	const data = [
		{type:'sample',a:2},
		{type:'sample',a:1},
		{type:'error'}
	]

	t.is(d.filterError(data).length, 1, 'should filter error')
	t.deepEqual(d.filterError(data)[0], data[2], 'should filter  error')
})


test('data.groupByHour', t => {
	const data = [
		{date: new Date('2016-01-19 13:30:01')},
		{date: new Date('2016-01-19 13:10:31')},
		{date: new Date('2017-07-19 14:30:01')},
	]
	const expected = [["2016-0-19-13","2016-0-19-13" ], ["2017-6-19-14"]]
	const result = d.groupByHour(data).map(arr => d.pluck('groupBy', arr))

	t.deepEqual(result, expected, 'group items by hour')
})

test('data.groupByDay', t => {
	const data = [
		{date: new Date('2016-01-19 13:30:01')},
		{date: new Date('2016-01-19 23:10:31')},
		{date: new Date('2017-07-19 13:30:01')},
	]
	const expected = [[ "2016-0-19", "2016-0-19" ], [ "2017-6-19" ]]
	const result = d.groupByDay(data).map(arr => d.pluck('groupBy', arr))
	t.deepEqual(result, expected, 'group items by day')
})

test('data.groupByWeek', t => {
	const data = [
		{date: new Date('2017-07-05 13:30:01')},
		{date: new Date('2017-07-19 13:31:01')},
		{date: new Date('2017-07-23 13:32:01')},
	]
	const expected = [ [ "2017-W27"], [ "2017-W29", "2017-W29" ] ]
	const result = d.groupByWeek(data).map(arr => d.pluck('groupBy', arr))
	t.deepEqual(result, expected, 'group items by week')
})

test('data.groupByMonth', t => {
	const data = [
		{date: new Date('2017-07-05 13:30:01')},
		{date: new Date('2017-07-19 13:31:01')},
		{date: new Date('2017-08-01 13:33:01')}
	]
	const expected = [["2017-6" ,"2017-6"], ["2017-7"]]
	const result = d.groupByMonth(data).map(arr => d.pluck('groupBy', arr))
	t.deepEqual(result, expected, 'group items by month')
})

test('data.groupByYear', t => {
	const data = [
		{date: new Date('2017-07-05 13:30:01')},
		{date: new Date('2017-07-19 13:31:01')},
		{date: new Date('2018-08-01 13:33:01')},
	]
	const expected = [["2017","2017"],["2018"]]
	const result = d.groupByYear(data).map(arr => d.pluck('groupBy', arr))
	t.deepEqual(result, expected, 'group items by year')
})
