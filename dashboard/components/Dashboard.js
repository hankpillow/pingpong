//libs
import {h} from 'preact'
import {connect} from 'preact-redux'

//modules
import * as D from 'modules/data'
import {actions} from 'modules/store'
import {getUptime} from 'modules/insights'
import {tinyDate, pretty} from 'modules/timeformat'

//comps
import {ErrorList} from 'components/insights/ErrorList'

const Dashboard = ({data}) => {
	data = data || []

	const samples = D.filterSample(data)
	const errors = D.filterError(data)
	const uptime = getUptime(samples)

	if (data.length === 0) {
		// first state
		return ''
	} else if (samples.length === 0 && errors.length){
		// only errors
		return (
			<div className={'panel'}>
				<ErrorList data={errors} />
			</div>
			)
	}

	return (
			<div className={'dashboard'}>
				<ul>
					<li>uptime: {parseInt(uptime * 100)}%</li>
					<li>samples: {samples.length}</li>
					<li>error: {errors.length}</li>
				</ul>
				<div className={'uptime-chcks'}>
					<span>uptime checks:</span>
					<span>{samples[0].date}</span>
				</div>
				<ErrorList data={errors} />
			</div>
	)
}

export default connect(
	state => ({data:state.data}),
	actions)
(Dashboard)
