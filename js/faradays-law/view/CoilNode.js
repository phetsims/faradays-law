// Copyright 2014-2017, University of Colorado Boulder

/**
 * Coil node for 'Faradays Law' simulation.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var CoilTypeEnum = require( 'FARADAYS_LAW/faradays-law/view/CoilTypeEnum' );
  var faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Vector2 = require( 'DOT/Vector2' );

  // images
  var fourLoopBackImage = require( 'mipmap!FARADAYS_LAW/four-loop-back.png' );
  var fourLoopFrontImage = require( 'mipmap!FARADAYS_LAW/four-loop-front.png' );
  var twoLoopBackImage = require( 'mipmap!FARADAYS_LAW/two-loop-back.png' );
  var twoLoopFrontImage = require( 'mipmap!FARADAYS_LAW/two-loop-front.png' );

  var IMAGE_MAP = {};
  IMAGE_MAP[ CoilTypeEnum.TWO_COIL ] = {
    frontImage: twoLoopFrontImage,
    backImage: twoLoopBackImage
  };
  IMAGE_MAP[ CoilTypeEnum.FOUR_COIL ] = {
    frontImage: fourLoopFrontImage,
    backImage: fourLoopBackImage
  };

  // each coil have 2 ends, coordinates of each end relative to center of the coil
  var COIL_END_COORDINATES_MAP = {};
  COIL_END_COORDINATES_MAP[ CoilTypeEnum.TWO_COIL ] = {
    topEnd: new Vector2( 30, -10 ),
    bottomEnd: new Vector2( 60, 6 )
  };
  COIL_END_COORDINATES_MAP[ CoilTypeEnum.FOUR_COIL ] = {
    topEnd: new Vector2( 0, -10 ),
    bottomEnd: new Vector2( 70, 6 )
  };

  /**
   * @param {CoilTypeEnum} coilType - determines which picture must we add to show coil
   * @param {Object} [options]
   * @constructor
   */
  function CoilNode( coilType, options ) {
    options = options || {};
    Node.call( this );

    var scale = 1 / 3;

    var xOffset = CoilNode.xOffset + ( coilType === CoilTypeEnum.TWO_COIL ? CoilNode.twoOffset : 0 );

    this.addChild( new Image( IMAGE_MAP[ coilType ].backImage, {
      centerX: xOffset,
      centerY: 0,
      scale: scale
    } ) );

    // In FaradaysLawScreenView, the front image is detached from this Node and appended to front layer because the
    // front of the coil must be over magnet and backImage must be under it.
    // @public
    this.frontImage = new Image( IMAGE_MAP[ coilType ].frontImage, {
      centerX: xOffset,
      centerY: 0,
      scale: scale
    } );
    this.addChild( this.frontImage );

    this.endRelativePositions = COIL_END_COORDINATES_MAP[ coilType ];

    this.mutate( options );
  }

  faradaysLaw.register( 'CoilNode', CoilNode );

  return inherit( Node, CoilNode, {}, {

    // extra offset is applied to the two-coil image to align with the wires
    twoOffset: 8,
    xOffset: 8
  } );
} );