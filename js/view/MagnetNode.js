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
   * @param width - width of Magnet
   * @param height - height of Magnet
   * @param label - label on half of magnet
   * @param backgroundColor
   * @param options
   * @returns {Node}
   */
  var drawHalfMagnetNode = function( width, height, label, backgroundColor, options ) {
    var node = new Node();

    // front part
    node.addChild( new Rectangle( -width / 4, -height / 2, width / 2, height, {
      fill: backgroundColor
    } ) );

    // label
    node.addChild( label );
    label.mutate( {
      centerX: 0,
      centerY: 0
    } );

    node.mutate( options );

    //3d looking
    node.addChild( new Path( new Shape()
      .moveTo( -width / 4, -height / 2 )
      .lineTo( -width / 4 + width * MAGNET_OFFSET_DX_RATIO, -height / 2 - height * MAGNET_OFFSET_DY_RATIO )
      .lineTo( width / 4 + width * MAGNET_OFFSET_DX_RATIO, -height / 2 - height * MAGNET_OFFSET_DY_RATIO )
      .lineTo( width / 4 + width * MAGNET_OFFSET_DX_RATIO, height / 2 - height * MAGNET_OFFSET_DY_RATIO )
      .lineTo( width / 4, height / 2 )
      .lineTo( width / 4, -height / 2 )
      .close(), {
      fill: backgroundColor.colorUtilsDarker( MAGNET_3D_SHADOW )
    } ) );

    node.addChild( Rectangle.bounds( node.localBounds.dilated( 1 ), {
      fill: 'rgba(0,0,0,0)'
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
} )
;
