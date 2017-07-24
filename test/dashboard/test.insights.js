import test from 'ava'
import * as insights from '../../dashboard/modules/insights'

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
