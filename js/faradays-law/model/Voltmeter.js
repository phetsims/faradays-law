// Copyright 2014-2017, University of Colorado Boulder

/**
 * Model for the voltmeter in the 'Faradays Law' simulation.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );

  // constants
  var ACTIVITY_THRESHOLD = 1E-3; // Used to prevent perpetual oscillation of the needle, value empirically determined.
  var NEEDLE_RESPONSIVENESS = 50;  // needle responsiveness
  var NEEDLE_FRICTION = 10; // friction coefficient, so needle motion looks realistic

  /**
   * @param {FaradaysLawModel} model - simulation model
   * @param {Tandem} tandem
   * @constructor
   */
  function Voltmeter( model, tandem ) {

    // @private
    this.model = model;

    // @private {number} - rad/sec
    this.needleAngularVelocity = 0;

    // @private {number} - rad/s^2
    this.needleAngularAcceleration = 0;

    // @public {NumberProperty} Needle angle in radians. This drives the needle location and the light bulb brightness.
    this.voltageProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'voltageProperty' ),
      units: 'radians',
      phetioReadOnly: true
    } );

    // @private {NumberProperty} - input voltage to meter
    this.signalProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'signalProperty' ),
      units: 'volts'
    } );

    // @public {DerivedProperty.<number>}
    this.needleAngleProperty = new DerivedProperty( [ this.voltageProperty ], function( voltage ) {

      // The voltage and the angle are perfectly matched, in part because the sim is qualitative and
      // in part because there was no need to separate them, see https://github.com/phetsims/faradays-law/issues/96
      return voltage;
    } );
  }

  faradaysLaw.register( 'Voltmeter', Voltmeter );

  return inherit( Object, Voltmeter, {

    /**
     * Voltmeter needle evolution over time
     * @param {number} dt - elapsed time in seconds
     */
    step: function( dt ) {

      // Calculate the signal, combining the EMF from both coils.  The multiplier (including the sign thereof) is
      // empirically determined to make the needle move the correct amount and direction.
      this.signalProperty.set( -0.2 * ( this.model.bottomCoil.emfProperty.get() + this.model.topCoil.emfProperty.get() ) );

      this.needleAngularAcceleration = NEEDLE_RESPONSIVENESS * ( this.signalProperty.get() - this.voltageProperty.get() ) - NEEDLE_FRICTION * this.needleAngularVelocity; // angular acceleration of needle
      this.voltageProperty.set( this.voltageProperty.get() + this.needleAngularVelocity * dt + 0.5 * this.needleAngularAcceleration * dt * dt ); // angle of needle
      var angularVelocity = this.needleAngularVelocity + this.needleAngularAcceleration * dt;
      var angularAcceleration = NEEDLE_RESPONSIVENESS * ( this.signalProperty.get() - this.voltageProperty.get() ) - NEEDLE_FRICTION * angularVelocity;
      this.needleAngularVelocity = this.needleAngularVelocity + 0.5 * dt * ( this.needleAngularAcceleration + angularAcceleration );

      // Clamp the needle angle when its position, velocity, and acceleration go below a threshold so that it doesn't
      // oscillate forever.
      if ( this.needleAngularAcceleration !== 0 && Math.abs( this.needleAngularAcceleration ) < ACTIVITY_THRESHOLD &&
           this.needleAngularVelocity !== 0 && Math.abs( this.needleAngularVelocity ) < ACTIVITY_THRESHOLD &&
           this.voltageProperty.get() !== 0 && Math.abs( this.voltageProperty.get() ) < ACTIVITY_THRESHOLD ) {
        this.voltageProperty.set( 0 );
        this.needleAngularVelocity = 0;
        this.needleAngularAcceleration = 0;
      }
    }
  } );
} );