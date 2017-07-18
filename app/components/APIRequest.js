import {h} from 'preact'
import {connect} from 'preact-redux'
import {actions} from '../store'

const TimeRequest = ({loading, load}) => {
	let getSelected = evt => load(evt.target.options[evt.target.selectedIndex].value)
	return (
		<select className={loading? 'loading' : ''} onChange={getSelected}>
			<option value="5m">just now</option>
			<option value="1d">yesterday</option>
			<option value="7d">last week</option>
			<option value="30d">last month</option>
		</select>
	)
}

export default connect(state => (state),	actions)(TimeRequest)
