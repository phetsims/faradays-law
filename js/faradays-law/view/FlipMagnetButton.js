// Copyright 2014-2019, University of Colorado Boulder

/**
 * Flip Magnet button for 'Faradays Law' simulation, contains magnet image node.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const AccessiblePeer = require( 'SCENERY/accessibility/AccessiblePeer' );
  const faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  const FaradaysLawA11yStrings = require( 'FARADAYS_LAW/FaradaysLawA11yStrings' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MagnetNode = require( 'FARADAYS_LAW/faradays-law/view/MagnetNode' );
  const Matrix3 = require( 'DOT/Matrix3' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  const Shape = require( 'KITE/Shape' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // a11y strings
  const flipMagnetString = FaradaysLawA11yStrings.flipMagnet.value;
  const flipPolesString = FaradaysLawA11yStrings.flipPoles.value;

  /**
   * @param {Tandem} tandem
   * @param {Object} [options]
   * @constructor
   */
  function FlipMagnetButton( tandem, options ) {

    const contentNode = new VBox( {
      children: [
        createCurvedArrow( 0 ),
        new MagnetNode( false, {
          width: 74,
          height: 16,
          font: new PhetFont( 14 )
        } ),
        createCurvedArrow( Math.PI )
      ],
      spacing: 1
    } );

    RectangularPushButton.call( this, merge( {
      content: contentNode,
      baseColor: 'rgb(205,254,195)',
      minWidth: 118,
      minHeight: 65,
      touchAreaXDilation: 10,
      touchAreaYDilation: 10,
      tandem: tandem,
      phetioDocumentation: 'When pressed, changes the orientation of the bar magnet.',
      innerContent: flipMagnetString,
      descriptionContent: flipPolesString,
      appendDescription: true,
      containerTagName: 'li'
    }, options ) );

    this.addAriaDescribedbyAssociation( {
      otherNode: this,
      otherElementName: AccessiblePeer.DESCRIPTION_SIBLING,
      thisElementName: AccessiblePeer.PRIMARY_SIBLING
    } );
  }

  /**
   * Create curved arrow to display on the button
   * @param {number} rotation
   * @returns {Node}
   */
  var createCurvedArrow = function( rotation ) {

    // variables for arrow and arc
    const radius = 20;
    const lineWidth = 2.3;
    const arcStartAngle = -Math.PI * 0.90;
    const arcEndAngle = -Math.PI * 0.18;

    const arcShape = new Shape()
      .moveTo( ( radius + lineWidth / 2 ) * Math.cos( arcStartAngle ), ( radius + lineWidth / 2 ) * Math.sin( arcStartAngle ) ) // Inner edge of end.
      .arc( 0, 0, radius, arcStartAngle, arcEndAngle, false ); // Outer curve.

    const matrix = Matrix3.translation( radius * Math.cos( arcEndAngle ), radius * Math.sin( arcEndAngle ) )
      .timesMatrix( Matrix3.rotation2( arcEndAngle ) );
    const arrowHeadShape = new Shape()
      .moveTo( 0, 8 )
      .lineTo( 4, 0 )
      .lineTo( -4, 0 )
      .close()
      .transformed( matrix );
    return new Node( {
      children: [ new Path( arcShape, {
        stroke: '#000',
        lineWidth: lineWidth
      } ), new Path( arrowHeadShape, {
        fill: '#000'
      } )
      ],
      rotation: rotation
    } );
  };

  faradaysLaw.register( 'FlipMagnetButton', FlipMagnetButton );

  return inherit( RectangularPushButton, FlipMagnetButton );
} );