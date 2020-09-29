// Copyright 2014-2020, University of Colorado Boulder

/**
 * Magnet model for the 'Faradays Law' simulation.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Sam Reid (PhET Interactive Simulations)
 */


// modules
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import inherit from '../../../../phet-core/js/inherit.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import faradaysLaw from '../../faradaysLaw.js';
import FaradaysLawConstants from '../FaradaysLawConstants.js';
import OrientationEnum from './OrientationEnum.js';

/**
 * @param {Tandem} tandem
 * @constructor
 */
function Magnet( tandem ) {

  // @public {number} - width of the magnet
  this.width = FaradaysLawConstants.MAGNET_WIDTH;

  // @public {number} - height of the magnet
  this.height = FaradaysLawConstants.MAGNET_HEIGHT;

  // @public - position of the magnet
  this.positionProperty = new Vector2Property( new Vector2( 647, 219 ), {
    tandem: tandem.createTandem( 'positionProperty' ),
    phetioDocumentation: 'The position of the center of the bar magnet in view coordinates',
    phetioHighFrequency: true
  } );

  // @public {BooleanProperty} - true if the magnet is flipped
  this.orientationProperty = new Property( OrientationEnum.NS, {
    validValues: OrientationEnum.values,
    tandem: tandem.createTandem( 'orientationProperty' ),
    phetioDocumentation: 'The direction the bar magnet is oriented',
    phetioType: Property.PropertyIO( StringIO ) // Should we create OrientationEnumIO?
  } );

  // @public {BooleanProperty} - show field lines for magnet
  this.fieldLinesVisibleProperty = new BooleanProperty( false, {
    tandem: tandem.createTandem( 'fieldLinesVisibleProperty' ),
    phetioDocumentation: 'True if the field lines are visible'
  } );
}

faradaysLaw.register( 'Magnet', Magnet );

inherit( Object, Magnet, {

  /**
   * Restore the initial conditions
   * @public
   */
  reset: function() {
    this.positionProperty.reset();
    this.orientationProperty.reset();
    this.fieldLinesVisibleProperty.reset();
  }
} );

export default Magnet;
