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

	const sortByDate = list => {
		return list.sort((a, b) => {
			if(a.date < b.date) return -1;
			if(a.date > b.date) return 1;
			return 0;
		})
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
