// Copyright 2014-2017, University of Colorado Boulder

/**
 * Coil node for 'Faradays Law' simulation.
 *
 * @author Vasily Shakhov (MLearner)
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
  var fourLoopBackSmallImage = require( 'mipmap!FARADAYS_LAW/four-loop-back-small.png' );
  var fourLoopFrontImage = require( 'mipmap!FARADAYS_LAW/four-loop-front.png' );
  var fourLoopFrontSmallImage = require( 'mipmap!FARADAYS_LAW/four-loop-front-small.png' );
  var twoLoopBackImage = require( 'mipmap!FARADAYS_LAW/two-loop-back.png' );
  var twoLoopBackSmallImage = require( 'mipmap!FARADAYS_LAW/two-loop-back-small.png' );
  var twoLoopFrontImage = require( 'mipmap!FARADAYS_LAW/two-loop-front.png' );
  var twoLoopFrontSmallImage = require( 'mipmap!FARADAYS_LAW/two-loop-front-small.png' );

  var imageMap = {};
  imageMap[ CoilTypeEnum.TWO_COIL ] = {
    frontImage: {
      normal: twoLoopFrontImage,
      small: twoLoopFrontSmallImage
    },
    backImage: {
      normal: twoLoopBackImage,
      small: twoLoopBackSmallImage
    }
  };
  imageMap[ CoilTypeEnum.FOUR_COIL ] = {
    frontImage: {
      normal: fourLoopFrontImage,
      small: fourLoopFrontSmallImage
    },
    backImage: {
      normal: fourLoopBackImage,
      small: fourLoopBackSmallImage
    }
  };

  // each coil have 2 ends, coordinates of each end relative to center of the coil
  var coilEndCoordinatesMap = {};
  coilEndCoordinatesMap[ CoilTypeEnum.TWO_COIL ] = {
    topEnd: new Vector2( 30, -10 ),
    bottomEnd: new Vector2( 60, 6 )
  };
  coilEndCoordinatesMap[ CoilTypeEnum.FOUR_COIL ] = {
    topEnd: new Vector2( 0, -10 ),
    bottomEnd: new Vector2( 70, 6 )
  };


  /**
   *
   * @param coilType - determines which picture must we add to show coil
   * @param {Object} [options]
   * @constructor
   */
  function CoilNode( coilType, options ) {
    Node.call( this );

    // support smaller images, so it isn't crazily aliased in Firefox. They are 1/6th the size of the normal images.
    var sizeScale = ( options && options.isSmall ) ? 6 : 1;
    var sizeField = ( options && options.isSmall ) ? 'small' : 'normal';

    var xOffset = CoilNode.xOffset + ( coilType === CoilTypeEnum.TWO_COIL ? CoilNode.twoOffset : 0 );

    this.backImage = new Image( imageMap[ coilType ].backImage[ sizeField ], {
      centerX: xOffset,
      centerY: 0,
      scale: sizeScale / 3
    } );
    this.addChild( this.backImage );

    // In FaradaysLawScreenView front image detached from this Node and appended to front layer
    // because front of coil must be over magnet and backImage must be under it.
    this.frontImage = new Image( imageMap[ coilType ].frontImage[ sizeField ], {
      centerX: xOffset,
      centerY: 0,
      scale: sizeScale / 3
    } );
    this.addChild( this.frontImage );

    this.endRelativePositions = coilEndCoordinatesMap[ coilType ];

    this.mutate( options );
  }

  // extra offset is applied to the two-coil image to align with the wires
  CoilNode.twoOffset = 8;
  CoilNode.xOffset = 8;

  faradaysLaw.register( 'CoilNode', CoilNode );

  return inherit( Node, CoilNode );
} );
