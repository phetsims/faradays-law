// Copyright 2014-2017, University of Colorado Boulder

/**
 * Magnet model for the 'Faradays Law' simulation.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var PropertyIO = require( 'AXON/PropertyIO' );
  var Vector2 = require( 'DOT/Vector2' );
  var Vector2IO = require( 'DOT/Vector2IO' );
  var OrientationEnum = require( 'FARADAYS_LAW/faradays-law/model/OrientationEnum' );

  /**
   * @param {Tandem} tandem
   * @constructor
   */
  function Magnet( tandem ) {

    // @public {number} - width of the magnet
    this.width = 140;

    // @public {number} - height of the magnet
    this.height = 30;

    // @public {Property.<Vector2>} - position of the magnet
    this.positionProperty = new Property( new Vector2( 647, 219 ), {
      tandem: tandem.createTandem( 'positionProperty' ),
      phetioType: PropertyIO( Vector2IO )
    } );

    // @public {BooleanProperty} - true if the magnet is flipped
    this.orientationProperty = new Property( OrientationEnum.NS, {
      validValues: OrientationEnum.values,
      tandem: tandem.createTandem( 'orientationProperty' )
    } );

    // @public {BooleanProperty} - show field lines for magnet
    this.showFieldLinesProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'showFieldLinesProperty' )
    } );
  }

  faradaysLaw.register( 'Magnet', Magnet );

  return inherit( Object, Magnet, {

    /**
     * Restore the initial conditions
     * @public
     */
    reset: function() {
      this.positionProperty.reset();
      this.orientationProperty.reset();
      this.showFieldLinesProperty.reset();
    }
  } );
} );