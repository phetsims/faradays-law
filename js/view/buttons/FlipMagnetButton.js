// Copyright 2002-2014, University of Colorado Boulder

/**
 * Flip Magnet button for 'Faradays Law' simulation, contains magnet image node.
 *
 * @author Vasily Shakhov (MLearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var MagnetNode = require( 'FARADAYS_LAW/view/MagnetNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Path = require( 'SCENERY/nodes/Path' );
  var CurvedArrowShape = require( 'SCENERY_PHET/CurvedArrowShape' );

  /**
   * @param options
   * @constructor
   */
  function FlipMagnetButton( options ) {

    var arrowRadius = 20;
    var arcStartAngle = -Math.PI * 0.92;
    var arcEndAngle = -Math.PI * 0.18;
    var arrowShapeOptions = {
      headWidth: 5,
      headHeight: 5,
      tailWidth: 0
    };
    var arrowPathOptions = {
      stroke: '#000',
      lineWidth: 2,
      fill: '#000'
    };

    var children = [
      new Path( new CurvedArrowShape( arrowRadius, arcStartAngle, arcEndAngle, arrowShapeOptions ), arrowPathOptions ),
      new MagnetNode( false /*flipped*/, {
        width: 74,
        height: 16,
        font: new PhetFont( 14 )
      } ),
      new Path( new CurvedArrowShape( arrowRadius, arcStartAngle, arcEndAngle, arrowShapeOptions ), _.extend( {rotation: Math.PI}, arrowPathOptions ) )
    ];


    var contentNode = new VBox( {
      children: children,
      spacing: 1
    } );

    RectangularPushButton.call( this, _.extend( {
      content: contentNode,
      // baseColor: 'rgb(155,234,179)',
      // baseColor: 'rgb(195,254,205)',
      baseColor: 'rgb(205,254,195)',
      minWidth: 118,
      minHeight: 65,
      xTouchExpansion: 10,
      yTouchExpansion: 10
    }, options ) );


  }

  return inherit( RectangularPushButton, FlipMagnetButton );
} );