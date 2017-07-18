import {h, Component} from 'preact'
import Fetcher from './Fetcher'
import {Provider} from 'preact-redux'

export class App extends Component {
	render() {
		return (
			<main>
				<Fetcher api={this.props.api} />
			</main>
		)
	}
}

export default App
