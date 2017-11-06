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

    // @public {NumberProperty} Needle angle in radians. This drives both the needle location and the light bulb brightness.
    this.needleAngleProperty = new NumberProperty( 0 );

    // @private - input voltage to meter
    this.signalProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'signalProperty' ),
      units: 'volts'
    } );
  }

  faradaysLaw.register( 'Voltmeter', Voltmeter );

  return inherit( Object, Voltmeter, {

    /**
     * Voltmeter needle evolution over time
     * @param dt
     */
    step: function( dt ) {

      // Calculate the signal, combining the EMF from both coils.  The multiplier (including the sign thereof) is
      // empirically determined to make the needle move the correct amount and direction.
      this.signalProperty.set( -0.2 * (this.model.bottomCoil.emfProperty.get() + this.model.topCoil.emfProperty.get()) );

      this.needleAngularAcceleration = NEEDLE_RESPONSIVENESS * (this.signalProperty.get() - this.needleAngleProperty.get()) - NEEDLE_FRICTION * this.needleAngularVelocity; //angular acceleration of needle
      this.needleAngleProperty.set( this.needleAngleProperty.get() + this.needleAngularVelocity * dt + 0.5 * this.needleAngularAcceleration * dt * dt ); //angle of needle
      var omega = this.needleAngularVelocity + this.needleAngularAcceleration * dt;
      var alpha = NEEDLE_RESPONSIVENESS * (this.signalProperty.get() - this.needleAngleProperty.get()) - NEEDLE_FRICTION * omega;
      this.needleAngularVelocity = this.needleAngularVelocity + 0.5 * dt * (this.needleAngularAcceleration + alpha);

      // Clamp the needle angle when its position, velocity, and acceleration go below a threshold so that it doesn't
      // oscillate forever.
      if ( this.needleAngularAcceleration !== 0 && Math.abs( this.needleAngularAcceleration ) < ACTIVITY_THRESHOLD &&
           this.needleAngularVelocity !== 0 && Math.abs( this.needleAngularVelocity ) < ACTIVITY_THRESHOLD &&
           this.needleAngleProperty.get() !== 0 && Math.abs( this.needleAngleProperty.get() ) < ACTIVITY_THRESHOLD ) {
        this.needleAngleProperty.set( 0 );
        this.needleAngularVelocity = 0;
        this.needleAngularAcceleration = 0;
      }
    }
  } );
} );