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

  // constants for magnet
  // offset for 3D looking, calculated as width*MAGNET_OFFSET_DX_RATIO
  var MAGNET_OFFSET_DX_RATIO = 1 / 35;
  var MAGNET_OFFSET_DY_RATIO = 1 / 15;
  var MAGNET_3D_SHADOW = 0.4;

  /**
   * @param magnetWidth - width of Magnet
   * @param magnetHeight - height of Magnet
   * @param label - label on half of magnet
   * @param backgroundColor
   * @param {Object} [options]
   * @returns {Node}
   */
  var drawHalfMagnetNode = function( magnetWidth, magnetHeight, label, backgroundColor, options ) {
    var node = new Node();

    // add the top and sides to create a 3D appearance
    node.addChild( new Path( new Shape()
      .moveTo( -magnetWidth / 4, -magnetHeight / 2 )
      .lineTo( -magnetWidth / 4 + magnetWidth * MAGNET_OFFSET_DX_RATIO, -magnetHeight / 2 - magnetHeight * MAGNET_OFFSET_DY_RATIO )
      .lineTo( magnetWidth / 4 + magnetWidth * MAGNET_OFFSET_DX_RATIO, -magnetHeight / 2 - magnetHeight * MAGNET_OFFSET_DY_RATIO )
      .lineTo( magnetWidth / 4 + magnetWidth * MAGNET_OFFSET_DX_RATIO, magnetHeight / 2 - magnetHeight * MAGNET_OFFSET_DY_RATIO )
      .lineTo( magnetWidth / 4, magnetHeight / 2 )
      .lineTo( -magnetWidth / 4, -magnetHeight / 2 )
      .close(), {
      fill: backgroundColor.colorUtilsDarker( MAGNET_3D_SHADOW )
    } ) );

    // add the front
    node.addChild( new Rectangle( -magnetWidth / 4, -magnetHeight / 2, magnetWidth / 2, magnetHeight, {
      fill: backgroundColor
    } ) );

    // Scale the label if it's too large.  This assumes that width, not height, is the important factor.
    label.scale( Math.min( ( magnetWidth * 0.45 ) / label.width, 1 ) );
    label.centerX = 0;
    label.centerY = 0;

    // label
    node.addChild( label );

    node.mutate( options );

    // this addresses an issue where artifacts were being left on the screen in some browser, see
    // https://github.com/phetsims/faradays-law/issues/48
    node.addChild( Rectangle.bounds( node.localBounds.dilated( 1 ), {
      fill: 'rgba( 0, 0, 0, 0 )'
    } ) );

    node.touchArea = node.localBounds.dilated( 10 );

    return node;
  };

  /**
   *
   * @param flipped - is magnet flipped
   * @param {Object} [options]
   * @constructor
   */
  function MagnetNode( flipped, options ) {
    Node.call( this, { cursor: 'pointer' } );

    // options of magnetNode
    options = _.extend( {
      width: 140,
      height: 30,
      font: new PhetFont( 24 ),
      fontColor: 'white'
    }, options );

    //create north pole magnet
    var northPoleLabel = new Text( nString, {
      font: options.font,
      fill: options.fontColor
    } );
    var northPole = drawHalfMagnetNode( options.width, options.height, northPoleLabel, new Color( '#db1e21' ), {
      left: -options.width / 2,
      centerY: 0
    } );
    this.addChild( northPole );

    //create south pole magnet
    var southPoleLabel = new Text( sString, {
      font: options.font,
      fill: options.fontColor
    } );
    var southPole = drawHalfMagnetNode( options.width, options.height, southPoleLabel, new Color( '#354d9a' ), {
      left: 0,
      centerY: 0
    } );
    this.addChild( southPole );

    if ( flipped ) {
      northPole.left = 0;
      southPole.left = -options.width / 2;
      northPole.moveToFront();
    }

  }

  return inherit( Node, MagnetNode );
} );
