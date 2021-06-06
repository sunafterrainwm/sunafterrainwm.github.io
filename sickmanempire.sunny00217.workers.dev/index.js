$( function () {
	window.history.pushState = ( function ( type ) {
		var orig = history[ type ];
		return function () {
			var rv = orig.apply( this, arguments );
			var e = new Event( type );
			e.arguments = arguments;
			window.dispatchEvent( e );
			return rv;
		};
	}( "pushState" ) );

	window.addEventListener( "pushState", function () {
		history.replaceState( "", "", window.location.pathname.replace( /^\/sickmanempire\//, "/" ) + window.location.hash );
	} );

	$( "a" ).filter( function () {
		return $( this ).html().match( "Powered by <b>GitBook</b>" );
	} ).remove();
} );
