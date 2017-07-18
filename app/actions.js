export default {
	fetch: dispatch => (val) => dispatch({
		type: 'fetch_data',
		data: null,
		val
	})
}
