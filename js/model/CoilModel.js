// Copyright 2002-2014, University of Colorado Boulder

/**
 * Model container for the coil in 'Faradays Law' simulation.
 *
 * @author Vasily Shakhov (MLearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   *
   * @param x - centerX of the coil
   * @param y - centerY of the coil
   * @param N - number of spirals
   * @param magnetModel - model of the magnet
   * @constructor
   */
  function CoilModel( x, y, N, magnetModel ) {
    var self = this;
    this.s = 1; //sense of magnet = +1 or -1, simulates flipping of magnet. Magnetic field sign, from flash origin
    this.position = new Vector2( x, y );

    PropertySet.call( this, {
      B: 0, //current value of magnetic field
      BLast: 0, //previous value of magnetic field
      emf: 0 //signal strength in coil = 'electromotive force'
    } );

    magnetModel.flippedProperty.link( function( flipped ) {
      self.s = flipped ? -1 : 1; //change magnetic field direction
    } );

    this.magnetModel = magnetModel;

    //from flash simulation
    this.A = 50; //near-field radius in pixels, set size for transition from B=constant to B=power law
    this.N = N / 2;  //number of turns in coil (equal to half the number of turns in the graphic image)

    this.reset();
  }

  return inherit( PropertySet, CoilModel, {
    reset: function() {
      PropertySet.prototype.reset.call( this );
      this.calculateB();
      this.BLast = this.B;
    },
    // Calculate magnetic field with current magnet position
    calculateB : function() {
      var rSquared = this.position.distanceSquared( this.magnetModel.position ) / (this.A * this.A);  // normalized squared distance from coil to magnet

      if ( rSquared < 1 ) {  //if magnet is very close to coil, then B field is at max value;
        this.B = this.s * 2;
      }
      else {
        //modified dipole field --  power law of 2 gives better feel than cubic power law (original comment)
        // formula: B = s *(3 * dx^2 -r^2) / r^4, where
        // s - +-1 - sign for position of magnet
        // r - normalized distance between magner and coil
        // dx - //normalized x-displacement from coil to magnet
        var dx = (this.magnetModel.position.x - this.position.x) / this.A;
        this.B = this.s * (3 * dx * dx - rSquared) / (rSquared * rSquared);
      }
    },
    /**
     * evolution of emf in coil over time
     * @param dt - time in seconds
     */
    step: function( dt ) {
      this.calculateB();
      this.emf = this.N * (this.B - this.BLast) / dt;    //emf = (nbr coils)*(change in B)/(change in t)
      this.BLast = this.B;
    }
  } );
} );