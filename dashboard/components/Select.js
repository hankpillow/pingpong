import {h} from 'preact'
import {connect} from 'preact-redux'
import {actions, status as ST} from 'modules/store'

const TimeRequest = ({status, load}) => {

	let getSelected = evt => {
		const value = evt.target.options[evt.target.selectedIndex].value
		if (value.length) load(evt.target.form.action + value)
	}

	return (
		<form
			className={status}
			name={'data-picker'}
			disabled={status != ST.READY ? 'disabled' : ''}
			action="/api/"
		>
			<label>
				<select onChange={getSelected}>
					<option value="">Select the range you want to inspect</option>
					<option value="30m">just now</option>
					<option value="24h">last 24h</option>
					<option value="7d">last week</option>
					<option value="31d">last month</option>
					<option value="90d">90 days</option>
				</select>
			</label>
		</form>
	)
}

export default connect(state => (state),	actions)(TimeRequest)
