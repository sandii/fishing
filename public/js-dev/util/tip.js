function tip( t ){
	let text = document.createTextNode( t );
	let span = document.createElement('span');
	let sect = document.createElement('section');
	sect.className = 'tip-box';
	span.appendChild( text );
	sect.appendChild( span );
	document.body.appendChild( sect );

	let timer = setTimeout( remove, 3000 );
	sect.addEventListener('click', remove, false);
	function remove(){
		clearTimeout( timer );
		if( !sect.parentNode ) return;
		sect.parentNode.removeChild( sect );
	}
};
module.exports = tip;