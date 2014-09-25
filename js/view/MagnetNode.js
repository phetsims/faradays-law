// Copyright 2002-2014, University of Colorado Boulder

/**
 * Magnet Node for 'Faradays Law' simulation.
 * @author Vasily Shakhov (MLearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Color = require( 'SCENERY/util/Color' );

  // strings
  var nString = require( 'string!FARADAYS_LAW/faradays-law.n' );
  var sString = require( 'string!FARADAYS_LAW/faradays-law.s' );

  /**
   * @param label - label on half of magnet
   * @param backgroundColor
   * @param options
   * @returns {Node}
   */
  var drawHalfMagnetNode = function( label, backgroundColor, options ) {
    var node = new Node();

    // front part
    node.addChild( new Rectangle( -options.width / 4, -options.height / 2, options.width / 2, options.height, {
      fill: backgroundColor
    } ) );

    // label
    node.addChild( new Text( label, {
      centerY: 0,
      centerX: 0,
      font: options.font,
      fill: 'white'
    } ) );

    node.mutate( options );

    //3d looking
    node.addChild( new Path( new Shape()
      .moveTo( -options.width / 4, -options.height / 2 )
      .lineTo( -options.width / 4 + options.dx, -options.height / 2 - options.dy )
      .lineTo( options.width / 4 + options.dx, -options.height / 2 - options.dy )
      .lineTo( options.width / 4 + options.dx, options.height / 2 - options.dy )
      .lineTo( options.width / 4, options.height / 2 )
      .lineTo( options.width / 4, -options.height / 2 )
      .close(), {
      fill: backgroundColor.colorUtilsDarker( 0.4 )
    } ) );

    node.touchArea = node.localBounds.dilated( 10 );

    return node;
  };

  /**
   *
   * @param flipped - is magnet flipped
   * @param options
   * @constructor
   */
  function MagnetNode( flipped, options ) {
    Node.call( this, {cursor: 'pointer'} );

    options = _.extend( {
      width: 140,
      height: 30,
      dx: 4,
      dy: 2,
      font: new PhetFont( 24 )
    }, options );

    //create north pole magnet
    var northPole = drawHalfMagnetNode( nString, new Color( '#db1e21' ), _.extend( {
      left: -options.width / 2,
      centerY: 0
    }, options ) );
    this.addChild( northPole );

    //create south pole magnet
    var southPole = drawHalfMagnetNode( sString, new Color( '#354d9a' ), _.extend( {
      left: 0,
      centerY: 0
    }, options ) );
    this.addChild( southPole );

    if ( flipped ) {
      northPole.left = 0;
      southPole.left = -options.width / 2;
      northPole.moveToFront();
    }

  }

  return inherit( Node, MagnetNode );
} )
;
