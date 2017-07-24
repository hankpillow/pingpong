import {h} from 'preact'
import {connect} from 'preact-redux'
import {actions} from 'modules/store'
import Panel from './Panel'

const Dashboard = ({data}) => {
	data = data || []

	const splitInPages = list => {
		return list.reduce((result, item) => {
			if (!result[item.url]) {
				result[item.url] = []
			}
			result[item.url].push(item)
			return result
		}, {})
	}

	const panes = splitInPages(data)
	return (
			<div className={'dashboard'}>
				{Object.keys(panes).map(name => {
					return <Panel name={name} data={sortByDate(panes[name])}/>
				})}
			</div>
	)
}

export default connect(state => ({data:state.data}), actions)(Dashboard)
