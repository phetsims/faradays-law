// Copyright 2002-2014, University of Colorado Boulder

/**
 * Coil node for 'Faradays Law' simulation.
 *
 * @author Vasily Shakhov (MLearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Image = require( 'SCENERY/nodes/Image' );
  var CoilTypeEnum = require( 'FARADAYS_LAW/view/CoilTypeEnum' );

  // images
  var twoLoopFrontImage = require( 'image!FARADAYS_LAW/images/two-loop-front.png' );
  var twoLoopBackImage = require( 'image!FARADAYS_LAW/images/two-loop-back.png' );
  var fourLoopFrontImage = require( 'image!FARADAYS_LAW/images/four-loop-front.png' );
  var fourLoopBackImage = require( 'image!FARADAYS_LAW/images/four-loop-back.png' );
  var twoLoopFrontSmallImage = require( 'image!FARADAYS_LAW/images/two-loop-front-small.png' );
  var twoLoopBackSmallImage = require( 'image!FARADAYS_LAW/images/two-loop-back-small.png' );
  var fourLoopFrontSmallImage = require( 'image!FARADAYS_LAW/images/four-loop-front-small.png' );
  var fourLoopBackSmallImage = require( 'image!FARADAYS_LAW/images/four-loop-back-small.png' );

  var imageMap = {};
  imageMap[CoilTypeEnum.TWO_COIL] = {
    frontImage: {
      normal: twoLoopFrontImage,
      small: twoLoopFrontSmallImage
    },
    backImage: {
      normal: twoLoopBackImage,
      small: twoLoopBackSmallImage
    },
  };
  imageMap[CoilTypeEnum.FOUR_COIL] = {
    frontImage: {
      normal: fourLoopFrontImage,
      small: fourLoopFrontSmallImage
    },
    backImage: {
      normal: fourLoopBackImage,
      small: fourLoopBackSmallImage
    },
  };

  /**
   *
   * @param coilType - determines which picture must we add to show coil
   * @param options
   * @constructor
   */
  function CoilNode( coilType, options ) {
    Node.call( this );

    // support smaller images, so it isn't crazily aliased in Firefox. They are 1/6th the size of the normal images.
    var sizeScale = ( options && options.isSmall ) ? 6 : 1;
    var sizeField = ( options && options.isSmall ) ? 'small' : 'normal';

    var xOffset = CoilNode.xOffset + ( coilType === CoilTypeEnum.TWO_COIL ? CoilNode.twoOffset : 0 );

    this.backImage = new Image( imageMap[coilType].backImage[sizeField], {
      centerX: xOffset,
      centerY: 0,
      scale: sizeScale / 3
    } );
    this.addChild( this.backImage );

    this.frontImage = new Image( imageMap[coilType].frontImage[sizeField], {
      centerX: xOffset,
      centerY: 0,
      scale: sizeScale / 3
    } );
    this.addChild( this.frontImage );

    this.mutate( options );
  }

  // extra offset is applied to the two-coil image to align with the wires
  CoilNode.twoOffset = 8;
  CoilNode.xOffset = 8;

  return inherit( Node, CoilNode );
} )
;
