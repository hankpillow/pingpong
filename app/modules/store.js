const ACTION_DATA_FETCH = "fetch_data"
const ACTION_DATA_LOADED = "data_loaded"
const ACTION_SERVER_DOWN = "server_down"

const status = {
	LOADING: "loading",
	READY: "ready",
	ALERT: "alert"
}

const DEFAULT_STATE = {
	data:null,
	query:null,
	error:null,
	status:status.READY,
	api_result:null
}

const actions = (dispatch) => {
	return {

			load: (query) => {

				//notify app that a new request is about to happen
				dispatch({query, type: ACTION_DATA_FETCH})

				//fetch data and notify when its done
				fetch(query)
					.then(resp => resp.json())
					.then(data => dispatch({data, type:ACTION_DATA_LOADED}))
					.catch(error => dispatch({error, type: ACTION_SERVER_DOWN}))
		}
	}
}

const reducer = (state, action) => {

	switch(action.type) {

		case ACTION_DATA_FETCH:
			return {
				...state,
				status: status.LOADING,
				query: action.query
			}

		case ACTION_DATA_LOADED:
			return {
				...state,
				status: status.READY,
				api_result: action.data,
				data: action.data
			}

		case ACTION_SERVER_DOWN:
			return {
				...state,
				status: status.ALERT,
				error: action.error
			}

		default: return DEFAULT_STATE
	}
}

export {actions, reducer, status}
export default reducer
