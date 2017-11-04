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
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {number} x - centerX of the coil
   * @param {number} y - centerY of the coil
   * @param {number} numberOfSpirals - number of spirals
   * @param {MagnetModel} magnetModel - model of the magnet
   * @constructor
   */
  function CoilModel( x, y, numberOfSpirals, magnetModel ) {
    var self = this;

    // @private
    this.sense = 1; //sense of magnet = +1 or -1, simulates flipping of magnet. Magnetic field sign

    // @public (read-only) // TODO convert args to Vector2
    this.position = new Vector2( x, y );

    // @private - current value of magnetic field
    this.magneticFieldProperty = new Property( 0 );

    // @private - previous value of magnetic field
    this.previousMagneticFieldProperty = new Property( 0 );

    // @public - signal strength in coil = 'electromotive force'
    this.emfProperty = new Property( 0 );

    magnetModel.flippedProperty.link( function( flipped ) {
      self.sense = flipped ? -1 : 1; //change magnetic field direction
    } );

    this.magnetModel = magnetModel;

    //from flash simulation
    this.A = 50; //near-field radius in pixels, set size for transition from B=constant to B=power law
    this.N = numberOfSpirals / 2;  //number of turns in coil (equal to half the number of turns in the graphic image)

    this.reset();
  }

  faradaysLaw.register( 'CoilModel', CoilModel );

  return inherit( Property, CoilModel, {

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
      var rSquared = this.position.distanceSquared( this.magnetModel.positionProperty.get() ) / (this.A * this.A);  // normalized squared distance from coil to magnet

      // if magnet is very close to coil, then B field is at max value;
      if ( rSquared < 1 ) {
        this.magneticFieldProperty.set( this.sense * 2 );
      }
      else {

        // modified dipole field --  power law of 2 gives better feel than cubic power law (original comment)
        // formula: B = s *(3 * dx^2 -r^2) / r^4, where
        // s - +-1 - sign for position of magnet
        // r - normalized distance between magnet and coil

        // normalized x-displacement from coil to magnet
        var dx = (this.magnetModel.positionProperty.get().x - this.position.x) / this.A;
        this.magneticFieldProperty.set( this.sense * (3 * dx * dx - rSquared) / (rSquared * rSquared) );
      }
    },

    /**
     * Evolution of emf in coil over time
     * @param {number} dt - time in seconds
     * @public
     */
    step: function( dt ) {
      this.updateMagneticField();

      // emf = (nbr coils)*(change in B)/(change in t)
      this.emfProperty.set( this.N * (this.magneticFieldProperty.get() - this.previousMagneticFieldProperty.get()) / dt );
      this.previousMagneticFieldProperty.set( this.magneticFieldProperty.get() );
    }
  } );
} );