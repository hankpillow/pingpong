import {h} from 'preact'
import timeformat from 'modules/timeformat'
import url from 'url'

const getTimesProp = (prop, matcher) => {
	return list => {
		return list.reduce((result,item) => {
			try {
				if ( (matcher instanceof RegExp && item[prop].match(matcher)) ||
					(typeof matcher === 'function' && matcher(item[prop])) ) {
					result.ok++
				} else {
					result.nok++
				}
			} catch (err) {
				console.log(err)
				console.info(item, prop, matcher)
			}
			return result
		}, {ok:0,nok:0,total:list.length})
	}
}

const filterType = value => {
	return list => list.filter(item => item.type === value)
}
const filterError = list =>  filterType('error')(list)
const filterSample = list => filterType('sample')(list)

const getUptimeAvg = list => {
	const filterStatus = getTimesProp('http_code',/^(2|3)\d{2}$/ig)
	return filterStatus(list)
}

const Panel = ({name, data}) => {
	const u = url.parse(name)
	const uptime = getUptimeAvg(filterSample(data))
	return (
		<div className={'panel'}>
			<div className={'title'}>
				<h2>
					<a href={name} target={'_blank'}>{u.host}</a>
					<span>{u.path}</span>
					<sup>{u.query}</sup>
				</h2>
				<span>uptime:{uptime.ok / uptime.total} %</span>
				<span>requests ok: {uptime.ok}</span>
				<span>resquests nok: {uptime.nok}</span>
				<span>resquests total: {uptime.total}</span>
				<span>error: {filterError(data).length}</span>
			</div>
		</div>
	)
}

export default Panel
