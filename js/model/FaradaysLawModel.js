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
      coilNumber: 1, // number of coils - 1 or 2
      showFieldLines: false
    } );

    this.magnetModel = new MagnetModel( 0.75 * width, 0.23 * height );

    this.coil1 = new CoilModel( 0.40 * width, 0.15 * height, 1, this.magnetModel );
    this.coil2 = new CoilModel( 0.40 * width, 0.6 * height, 2, this.magnetModel );

    this.voltMeterModel = new VoltMeterModel( this );
  }

  return inherit( PropertySet, FaradaysLawModel, {
    step: function( dt ) {
      dt = dt * 0.00133; // in original model 30ms interval corresponds to 40ms in math model, we apply this and get dt in seconds
      if ( this.coilNumber === 2 ) {
        this.coil1.step( dt );
      }
      this.coil2.step( dt );
      this.voltMeterModel.step( dt );
    }
  } );
} );