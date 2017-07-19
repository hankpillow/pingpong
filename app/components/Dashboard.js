import {h} from 'preact'
import {connect} from 'preact-redux'
import {actions} from '../store'
import Row from './Row'

const Dashboard = ({data}) => {
	data = data || []
	return (
		<ul>{data.map((item, index) => {
			return <Row index={index} data={item}/>
		})}
		</ul>
	)
}

export default connect(state => ({data:state.data}),actions)(Dashboard)
