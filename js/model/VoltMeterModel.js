// Copyright 2002-2014, University of Colorado Boulder

/**
 * Model container for the magnet in 'Faradays Law' simulation.
 *
 * @author Vasily Shakhov (MLearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Vector2 = require( 'DOT/Vector2' );

  function VoltMeterModel( faradaysLawModel ) {

    this.faradaysLawModel = faradaysLawModel;

    this.omega = 0; //angular velocity of needle in rad/sec
    this.alpha = 0; //angular acceleration of needle in rad/s^2
    this.D = 50;  	// needle responsiveness
    this.C = 1; 	// meter gain
    this.B = 10; 	// friction coefficient, so needle motion looks realistic
    this.signal = 0;	//input voltage to meter

    PropertySet.call( this, {
      theta:0 //needle angle in radians
    } );

  }

  return inherit( PropertySet, VoltMeterModel, {
    step: function(dt){
      this.signal = 0.2*(this.faradaysLawModel.coil1.emf + this.faradaysLawModel.coil2.emf);  //combine signals from both coils

      this.alpha = this.D*(this.signal - this.C*this.theta)-this.B*this.omega;
      this.theta = this.theta + this.omega*dt + 0.5*this.alpha*dt*dt;
      var omegaTemp = this.omega + this.alpha*dt;
      var alphaTemp = this.D*(this.signal - this.C*this.theta) - this.B*omegaTemp;
      this.omega = this.omega + 0.5*dt*(this.alpha + alphaTemp);
    }
  });
} );