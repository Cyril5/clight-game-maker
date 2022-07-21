var Stats = function () {

	var mode = 0;

	var container = document.createElement( 'div' );
	container.style.cssText = 'position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000';
	container.addEventListener( 'click', function ( event ) {

		event.preventDefault();
		showPanel( ++ mode % container.children.length );

	}, false );

	//

	/**
	 * @param {{ dom: any; }} panel
	 */
	function addPanel( panel ) {

		container.appendChild( panel.dom );
		return panel;

	}

	/**
	 * @param {number} id
	 */
	function showPanel( id ) {

		for ( var i = 0; i < container.children.length; i ++ ) {

			// @ts-ignore
			container.children[ i ].style.display = i === id ? 'block' : 'none';

		}

		mode = id;

	}

	//

	var beginTime = ( performance || Date ).now(), prevTime = beginTime, frames = 0;

	// @ts-ignore
	var fpsPanel = addPanel( new Stats.Panel( 'FPS', '#0ff', '#002' ) );
	// @ts-ignore
	var msPanel = addPanel( new Stats.Panel( 'MS', '#0f0', '#020' ) );

	// @ts-ignore
	if ( self.performance && self.performance.memory ) {

		// @ts-ignore
		var memPanel = addPanel( new Stats.Panel( 'MB', '#f08', '#201' ) );

	}

	showPanel( 0 );

	return {

		REVISION: 16,

		dom: container,

		addPanel: addPanel,
		showPanel: showPanel,

		begin: function () {

			beginTime = ( performance || Date ).now();

		},

		end: function () {

			frames ++;

			var time = ( performance || Date ).now();

			// @ts-ignore
			msPanel.update( time - beginTime, 200 );

			if ( time >= prevTime + 1000 ) {

				// @ts-ignore
				fpsPanel.update( ( frames * 1000 ) / ( time - prevTime ), 100 );

				prevTime = time;
				frames = 0;

				if ( memPanel ) {

					// @ts-ignore
					var memory = performance.memory;
					// @ts-ignore
					memPanel.update( memory.usedJSHeapSize / 1048576, memory.jsHeapSizeLimit / 1048576 );

				}

			}

			return time;

		},

		update: function () {

			beginTime = this.end();

		},

		// Backwards Compatibility

		domElement: container,
		setMode: showPanel

	};

};

// @ts-ignore
Stats.Panel = function ( name, fg, bg ) {

	var min = Infinity, max = 0, round = Math.round;
	var PR = round( window.devicePixelRatio || 1 );

	var WIDTH = 80 * PR, HEIGHT = 48 * PR,
		TEXT_X = 3 * PR, TEXT_Y = 2 * PR,
		GRAPH_X = 3 * PR, GRAPH_Y = 15 * PR,
		GRAPH_WIDTH = 74 * PR, GRAPH_HEIGHT = 30 * PR;

	var canvas = document.createElement( 'canvas' );
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	canvas.style.cssText = 'width:80px;height:48px';

	var context = canvas.getContext( '2d' );
	// @ts-ignore
	context.font = 'bold ' + ( 9 * PR ) + 'px Helvetica,Arial,sans-serif';
	// @ts-ignore
	context.textBaseline = 'top';

	// @ts-ignore
	context.fillStyle = bg;
	// @ts-ignore
	context.fillRect( 0, 0, WIDTH, HEIGHT );

	// @ts-ignore
	context.fillStyle = fg;
	// @ts-ignore
	context.fillText( name, TEXT_X, TEXT_Y );
	// @ts-ignore
	context.fillRect( GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT );

	// @ts-ignore
	context.fillStyle = bg;
	// @ts-ignore
	context.globalAlpha = 0.9;
	// @ts-ignore
	context.fillRect( GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT );

	return {

		dom: canvas,

		// @ts-ignore
		update: function ( value, maxValue ) {

			min = Math.min( min, value );
			max = Math.max( max, value );

			// @ts-ignore
			context.fillStyle = bg;
			// @ts-ignore
			context.globalAlpha = 1;
			// @ts-ignore
			context.fillRect( 0, 0, WIDTH, GRAPH_Y );
			// @ts-ignore
			context.fillStyle = fg;
			// @ts-ignore
			context.fillText( round( value ) + ' ' + name + ' (' + round( min ) + '-' + round( max ) + ')', TEXT_X, TEXT_Y );

			// @ts-ignore
			context.drawImage( canvas, GRAPH_X + PR, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT, GRAPH_X, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT );

			// @ts-ignore
			context.fillRect( GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT );

			// @ts-ignore
			context.fillStyle = bg;
			// @ts-ignore
			context.globalAlpha = 0.9;
			// @ts-ignore
			context.fillRect( GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, round( ( 1 - ( value / maxValue ) ) * GRAPH_HEIGHT ) );

		}

	};

};

export default Stats;