import {h} from 'preact'
import {connect} from 'preact-redux'
import {actions} from '../store'

const Status = ({status}) => {
	return (
		<div><span>{status}</span></div>
	)
}

export default connect(state => (state),	actions)(Status)
