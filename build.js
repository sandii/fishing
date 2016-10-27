var fs 		= require('fs');
var path 	= require('path');

var CleanCSS= require('clean-css');
var fnv 	= require('fnv-plus');

var hashMap = {};


minifyCss('./css-debug/', './css/');
console.log('Minify CSS done!\n');

getHashMap('./js/');
getHashMap('./css/');
console.log('Get hash-map done!\n');

transferHtml('./html-debug/', './html/');
console.log('Transfer HTML done!\n');


function minifyCss( src, dst ){
	fs.readdirSync( src ).forEach(function( name ){
		var srcPath = path.join( src, name );
		var dstPath = path.join( dst, name );
		if( fs.statSync( srcPath ).isDirectory() ) return;
		var str = fs.readFileSync( srcPath ).toString();

		var minStrNew = new CleanCSS({
			relativeTo : src
		}).minify( str ).styles;
		var minStrOld = fs.existsSync( dstPath ) ? fs.readFileSync( dstPath ).toString() : '';
		if( minStrNew === minStrOld ) return;
		fs.writeFileSync( dstPath, minStrNew );
		console.log('Update '+ dstPath );
	});
}
function getHashMap( dir ){
	fs.readdirSync( dir ).forEach(function( name ){
		var pathname = path.join( dir, name );
		var str = fs.readFileSync( pathname ).toString();
		var hash = fnv.hash( str, 64 ).str();
		pathname = pathname.replace(/\\/g, '/');
		hashMap[ pathname ] = hash;
	});
}
function transferHtml( src, dst ){
	fs.readdirSync( src ).forEach(function( name ){
		var srcPath = path.join( src, name );
		var dstPath = path.join( dst, name );
		if( fs.lstatSync( srcPath ).isDirectory() ) return;
		var str = fs.readFileSync( srcPath ).toString();
		str = str.replace(/\.\.\/css\-debug\//g, '../css/');
		str = stamp( str );
		
		var strOld = fs.existsSync( dstPath ) ? fs.readFileSync( dstPath ).toString() : '';
		if( str === strOld ) return;
		fs.writeFileSync( dstPath, str );
		console.log('Update: '+ dstPath );
	});
}
function stamp( str ){
	for( var pathname in hashMap ){
		var reg = pathname;
		var rep = pathname +'?v='+ hashMap[ pathname ];
		str = str.replace( reg, rep );
	}
	return str;
}