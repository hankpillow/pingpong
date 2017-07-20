import {h} from 'preact'

const Panel = ({name, data}) => {
	return (
		<div className={'panel'}>
			<h2>Name is: {name}</h2>
			<ul>
				{data.map(item => {
					return <li>{item.date}</li>
				})}
			</ul>
		</div>
	)
}

export default Panel
