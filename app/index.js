import {h, render} from 'preact'
import {Provider} from 'preact-redux'
import thunk from 'redux-thunk'
import {createStore, applyMiddleware} from 'redux'
import reducer from './store'
import APIRequest from './components/APIRequest'
import Status from './components/Status'

const store = createStore(
	reducer, {},
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

render(
	<Provider store={store}>
		<main>
			<header><Status /> <APIRequest /> </header>
		</main>
	</Provider>
, document.body)
