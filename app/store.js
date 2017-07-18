const ACTION_DATA_FETCH = "fetch_data"
const ACTION_DATA_LOADED = "data_loaded"
const ACTION_SERVER_DOWN = "server_down"

const actions = (dispatch) => {
	return {
			load: (query) => {
				//notify app that a new request is about to happen
				dispatch({query, type: ACTION_DATA_FETCH})

				//fetch data and notify when its done
				fetch(document.body.dataset.api + query)
					.then(resp => resp.json())
					.then(data => dispatch({
						data,
						type:ACTION_DATA_LOADED
					}))
					.catch(error => dispatch({
						error,
						type: ACTION_SERVER_DOWN,
					}))
		}
	}
}
export {actions}

export default (state, action) => {
	switch(action.type) {
		case ACTION_DATA_FETCH:
			return {
				...state,
				data: [],
				query: action.query,
				status: "loading"
			}

		case ACTION_DATA_LOADED:
			return {
				...state,
				data: action.data,
				status: "ready"
			}

		case ACTION_SERVER_DOWN:
			return {
				...state,
				data: [],
				status: "loading"
			}

		default: return {status:"ready"}
	}
}
