const path = require('path')

module.exports = {

	//input
	entry: {
		main: './app'
	},

	//output
	output: {
		path: path.join(__dirname + '/app'),
		filename: 'app.bundle.js'
	},

	//transform
	module: {
		rules: [{
			test: /\.jsx?$/i,
			use:[{
				loader: 'babel-loader',
				options: {
					presets: ['env'],
					plugins: [
						['transform-react-jsx', {pragma: 'h'}]
					]
				}
			}]
		}]
	}
}
