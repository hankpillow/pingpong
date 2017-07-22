import url from 'url'
import {h} from 'preact'
import timeformat from 'modules/timeformat'
import * as insights from 'modules/insights'

const Panel = ({name, data}) => {

	const u = url.parse(name)
	const samples = insights.filterSample(data)
	const errors = insights.filterError(data)
	const uptime = insights.getUptime(samples)
	const first = samples[0]
	const last = samples[samples.length -1]

	return (
		<div className={'panel'}>
			<h2>
				<a href={name} target={'_blank'}>{u.host}</a>
				<span>{u.path || '' + u.query || ''}</span>
			</h2>
			<sup>
				<time datetime={first.date}>{timeformat(first.date)}</time> to
				<time datetime={last.date}>{timeformat(last.date)} </time>
			</sup>
			<ul>
				<li>uptime: {parseInt(uptime * 100)}%</li>
				<li>samples: {samples.length}</li>
				<li>error: {errors.length}</li>
			</ul>
			<div className={'uptime-chcks'}>
				<span>uptime checks:</span>
				<ol>
					<li></li>
				</ol>
		</div>
	)
}

export default Panel
