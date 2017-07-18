import {h} from 'preact'
import {connect} from 'preact-redux'
import {actions} from '../store'

const Status = ({status}) => {
	return (
		<h1>{status}</h1>
	)
}

export default connect(state => (state),	actions)(Status)
