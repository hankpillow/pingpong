import {h} from 'preact'
import {connect} from 'preact-redux'
import {actions, status as ST} from '../store'

const TimeRequest = ({status, load}) => {

	let getSelected = evt => {
		const value = evt.target.options[evt.target.selectedIndex].value
		if (value.length) load(evt.target.form.action + value)
	}

	return (
		<form className="{status}" disabled={status != ST.READY ? 'disabled' : ''} action="/api/">
			<label>
				<select onChange={getSelected}>
					<option value="">Select the range you want to inspect</option>
					<option value="30m">last 30m</option>
					<option value="24h">last 24h</option>
					<option value="7d">last 7d</option>
				</select>
			</label>
		</form>
	)
}

export default connect(state => (state),	actions)(TimeRequest)
