// Copyright 2014-2017, University of Colorado Boulder

/**
 * Model container for the coil in 'Faradays Law' simulation.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );

  // constants
  // in pixels, set size for transition from B=constant to B=power law
  var NEAR_FIELD_RADIUS = 50;

  /**
   * @param {Vector2} position - center of the coil
   * @param {number} numberOfSpirals - number of spirals
   * @param {Magnet} magnet - model of the magnet
   * @constructor
   */
  function Coil( position, numberOfSpirals, magnet ) {

    // @private
    this.sense = 1; // sense of magnet = +1 or -1, simulates flipping of magnet. Magnetic field sign

    // @public (read-only)
    this.position = position;

    // @private - current value of magnetic field
    this.magneticFieldProperty = new Property( 0 );

    // @private - previous value of magnetic field
    this.previousMagneticFieldProperty = new Property( 0 );

    // @public - signal strength in coil = 'electromotive force'
    this.emfProperty = new Property( 0 );

    // @private
    this.magnet = magnet;

    // @private
    this.numberOfSpirals = numberOfSpirals;

    // set up initial conditions
    this.updateMagneticField();

    // Must be called after updateMagneticField to store the initial value
    this.previousMagneticFieldProperty.set( this.magneticFieldProperty.get() );
  }

  faradaysLaw.register( 'Coil', Coil );

  return inherit( Object, Coil, {

    /**
     * Restore initial conditions
     * @public
     */
    reset: function() {
      this.magneticFieldProperty.reset();
      this.previousMagneticFieldProperty.reset();
      this.emfProperty.reset();
      this.updateMagneticField();
      this.previousMagneticFieldProperty.set( this.magneticFieldProperty.get() );
    },

    /**
     * Calculate magnetic field with current magnet position
     * @private
     */
    updateMagneticField: function() {

      var sign = this.magnet.flippedProperty.value ? -1 : 1;

      var rSquared = this.position.distanceSquared( this.magnet.positionProperty.get() ) /
                     (NEAR_FIELD_RADIUS * NEAR_FIELD_RADIUS);  // normalized squared distance from coil to magnet

      // if magnet is very close to coil, then B field is at max value;
      if ( rSquared < 1 ) {
        this.magneticFieldProperty.set( sign * 2 );
      }
      else {

        // modified dipole field --  power law of 2 gives better feel than cubic power law (original comment)
        // formula: B = s *(3 * dx^2 -r^2) / r^4, where
        // s - +-1 - sign for position of magnet
        // r - normalized distance between magnet and coil

        // normalized x-displacement from coil to magnet
        var dx = (this.magnet.positionProperty.get().x - this.position.x) / NEAR_FIELD_RADIUS;
        this.magneticFieldProperty.set( sign * (3 * dx * dx - rSquared) / (rSquared * rSquared) );
      }
    },

    /**
     * Evolution of emf in coil over time
     * @param {number} dt - time in seconds
     * @public
     */
    step: function( dt ) {
      this.updateMagneticField();

      // number of turns in coil (equal to half the number of turns in the graphic image)
      var numberOfCoils = this.numberOfSpirals / 2;

      // emf = (nbr coils)*(change in B)/(change in t)
      var changeInMagneticField = this.magneticFieldProperty.get() - this.previousMagneticFieldProperty.get();
      this.emfProperty.set( numberOfCoils * changeInMagneticField / dt );
      this.previousMagneticFieldProperty.set( this.magneticFieldProperty.get() );
    }
  } );
} );