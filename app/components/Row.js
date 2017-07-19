import {h, Component} from 'preact'
import {connect} from 'preact-redux'
import {actions} from '../store'

class Row extends Component {
	render() {
		const blob = this.props.data
		return (
			<div>
				<span>{blob.date} </span>
				<span>{blob.http_code} </span>
				<span>{blob.time_namelookup} </span>
				<span>{blob.time_connect} </span>
				<span>{blob.time_appconnect} </span>
				<span>{blob.time_pretransfer} </span>
				<span>{blob.time_redirect} </span>
				<span>{blob.time_starttransfer} </span>
				<span>{blob.time_total} </span>
				<span>{blob.num_redirects} </span>
				<span>{blob.url} </span>
			</div>
		)
	}
}
export default connect(state => ({state}),	actions)(Row)
