import {h, render} from 'preact'
import {Provider} from 'preact-redux'
import thunk from 'redux-thunk'
import {createStore, applyMiddleware} from 'redux'
import App from './components/App'

const target = document.body
render(<App api={target.dataset.api} />, target)
