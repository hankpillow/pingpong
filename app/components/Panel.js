import url from 'url'
import {h} from 'preact'
import timeformat from 'modules/timeformat'
import {getUptime} from 'modules/insights'

const Panel = ({name, data}) => {
	const u = url.parse(name)
	const uptime = getUptime(data)
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
				<span>error: TBD</span>
			</div>
		</div>
	)
}

export default Panel
