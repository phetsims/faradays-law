// Copyright 2002-2014, University of Colorado Boulder

/**
 * Model container for the 'Faradays Law' simulation.
 *
 * @author Vasily Shakhov (MLearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var CoilModel = require( 'FARADAYS_LAW/model/CoilModel' );
  var MagnetModel = require( 'FARADAYS_LAW/model/MagnetModel' );
  var VoltMeterModel = require( 'FARADAYS_LAW/model/VoltMeterModel' );

  /**
   * @param {Number} width of Screen
   * @param {Number} height of Screen
   * @constructor
   */
  function FaradaysLawModel( width, height ) {

    this.width = width;
    this.height = height;

    PropertySet.call( this, {
      showSecondCoil: false // number of coils - 1 or 2
    } );

    this.timeInterval = 0; //time since last model step
    this.targetTickTime = 0.03; //seconds, from original model, next step in model after targetTick time
    this.modelTickTime = 0.04;//seconds, from original model, the time for model step, not equal targetTick time

    this.magnetModel = new MagnetModel( 647, 219 );

    this.coil1 = new CoilModel( 448, 318, 2, this.magnetModel );
    this.coil2 = new CoilModel( 422, 141, 1, this.magnetModel );

    this.voltMeterModel = new VoltMeterModel( this );
  }

  return inherit( PropertySet, FaradaysLawModel, {
    reset: function() {
      PropertySet.prototype.reset.call( this );
      this.magnetModel.reset();
    },
    step: function( dt ) {
      this.timeInterval += dt;
      if ( this.timeInterval > this.targetTickTime ) {
        this.timeInterval-=this.targetTickTime;
        this.coil1.step( this.modelTickTime );
        if ( this.showSecondCoil ) {
          this.coil2.step( this.modelTickTime );
        }
        this.voltMeterModel.step( this.modelTickTime );
      }
    }
  } );
} )
;