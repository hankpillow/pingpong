// libs
import {h, render} from 'preact'
import {Provider} from 'preact-redux'
import thunk from 'redux-thunk'
import {createStore, applyMiddleware, compose} from 'redux'

// app
import {reducer} from 'modules/store'

// components
import Select from './components/Select'
import Status from './components/Status'
import Dashboard from './components/Dashboard'

const middleware = window.__REDUX_DEVTOOLS_EXTENSION__ ?
			compose(applyMiddleware(thunk), window.__REDUX_DEVTOOLS_EXTENSION__()) :
			applyMiddleware(thunk)

const store = createStore(reducer, {}, middleware)

render(
	<Provider store={store}>
		<main>
			<Status />
			<Select />
			<Dashboard />
		</main>
	</Provider>
, document.body)
