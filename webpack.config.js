const path = require('path')
const webpack = require('webpack')

module.exports = function(env) {

	env = env || process.env.NODE_ENV || 'production'

	let isDev = env === 'development'

	let config = {

		entry: { main: './app' },

		output: {
			path: path.join(__dirname + '/api'),
			filename: 'app.bundle.js'
		},

		resolve: {
			modules: ['node_modules'],
			alias: {
				root: path.resolve(__dirname + '/api')
			}
		},

		module: {
			rules: [{
				test: /\.jsx?$/i,
				use:[{
					loader: 'babel-loader',
					options: {
						presets: ['env'],
						plugins: [
							["transform-object-rest-spread"],
							['transform-react-jsx', {pragma: 'h'}]
						]
					}
				}]
			}]
		},

		plugins: [
			new webpack.NoEmitOnErrorsPlugin()
		]
	}

	if (isDev){
		config.devtool = 'source-map',
		config.devServer = {
			contentBase: path.join(__dirname, '/app'),
			compress: false,
			proxy: {
				'/api': {
					target: 'http://localhost:8000',
					secure: false
				}
			}
		}
	} else {
		config.plugins.push(new webpack.optimize.UglifyJsPlugin({
			compress: true,
			sourceMap: false
		}))
	}
	return config
}
