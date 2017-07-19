import {h} from 'preact'
import {connect} from 'preact-redux'
import {actions} from '../store'
import Row from './Row'

const Dashboard = ({data}) => {
	data = data || []

	const hosts = data.reduce((result, item) => {
		if (result.indexOf(item.host) === -1){
			result.push(item.host)
		}
		return result
	}, [])
	console.log(data)
	console.log(hosts)

	return (
		<h1>{hosts.join(' - ')}</h1>
	)
}

export default connect(state => ({data:state.data}), actions)(Dashboard)
			// return <Row index={index} data={item}/>
