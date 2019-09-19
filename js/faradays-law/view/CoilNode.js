// Copyright 2014-2017, University of Colorado Boulder

/**
 * Coil node for 'Faradays Law' simulation.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const CoilTypeEnum = require( 'FARADAYS_LAW/faradays-law/view/CoilTypeEnum' );
  const faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Vector2 = require( 'DOT/Vector2' );

  // images
  const fourLoopBackImage = require( 'mipmap!FARADAYS_LAW/four-loop-back.png' );
  const fourLoopFrontImage = require( 'mipmap!FARADAYS_LAW/four-loop-front.png' );
  const twoLoopBackImage = require( 'mipmap!FARADAYS_LAW/two-loop-back.png' );
  const twoLoopFrontImage = require( 'mipmap!FARADAYS_LAW/two-loop-front.png' );

  const IMAGE_MAP = {};
  IMAGE_MAP[ CoilTypeEnum.TWO_COIL ] = {
    frontImage: twoLoopFrontImage,
    backImage: twoLoopBackImage
  };
  IMAGE_MAP[ CoilTypeEnum.FOUR_COIL ] = {
    frontImage: fourLoopFrontImage,
    backImage: fourLoopBackImage
  };

  // each coil have 2 ends, coordinates of each end relative to center of the coil
  const COIL_END_COORDINATES_MAP = {};
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

    const scale = 1 / 3;

    const xOffset = CoilNode.xOffset + ( coilType === CoilTypeEnum.TWO_COIL ? CoilNode.twoOffset : 0 );

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