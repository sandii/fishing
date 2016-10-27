var fs = require('fs');
var path = require('path');
var webpack = require('webpack');

var DEBUG = process.env.NODE_ENV === 'DEBUG';
console.log( process.env.NODE_ENV || 'BUILDING BEGINS');
var serverEntry = DEBUG ? [
	'webpack-dev-server/client?http://localhost:3000',
	'webpack/hot/only-dev-server'
] : [];


var config = {
	entry : (function(){
		var rs = {};
		var src = './public/js-dev/';
		fs.readdirSync( src ).forEach(function( filename ){
			var pathname = src + filename;
			if( fs.lstatSync( pathname ).isDirectory() ) return;
			var name = path.parse( pathname ).name;
			rs[ name ] = serverEntry.concat( pathname );
		});
		return rs;
	}()),
	output : {
		path : path.join( __dirname, 'js' ),
		filename : '[name].js',
		publicPath : '/public/js/'
	},
	module: {
		loaders: [
		  {
		    test: /\.js$/,
		    exclude: /node_modules/,
		    loader: 'babel-loader',
		    query: {
		      presets: ['react','es2015']
		    }
		  }
		]
	},
	plugins: [
		(DEBUG
			? new webpack.HotModuleReplacementPlugin()
			: new webpack.optimize.UglifyJsPlugin() 
		),		
		new webpack.NoErrorsPlugin()
	]
};

module.exports = config;