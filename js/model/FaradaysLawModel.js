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
  var Bounds2 = require( 'DOT/Bounds2' );

  /**
   * @param {Number} width of Screen
   * @param {Number} height of Screen
   * @constructor
   */
  function FaradaysLawModel( width, height ) {

    this.width = width;
    this.height = height;

    PropertySet.call( this, {
      showSecondCoil: true // number of coils - 1 or 2
    } );

    this.timeInterval = 0; //time since last model step
    this.targetTickTime = 0.03; //seconds, from original model, next step in model after targetTick time
    this.modelTickTime = 0.04;//seconds, from original model, the time for model step, not equal targetTick time

    this.magnetModel = new MagnetModel( 647, 219, 140, 30 );

    this.coil1 = new CoilModel( 448, 318, 2, this.magnetModel );
    this.coil2 = new CoilModel( 422, 141, 1, this.magnetModel );

    //restricted zones for magnet because of coils borders
    //first 2 for top coil
    this.restricted = [
      new Bounds2( 405, 65, 435, 75 ),
      new Bounds2( 415, 208, 445, 218 ),
      new Bounds2( 410, 241, 475, 251 ),
      new Bounds2( 420, 384, 480, 394 )
    ];

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
        this.timeInterval -= this.targetTickTime;
        this.coil1.step( this.modelTickTime );
        if ( this.showSecondCoil ) {
          this.coil2.step( this.modelTickTime );
        }
        this.voltMeterModel.step( this.modelTickTime );
      }
    },
    possiblePositionForMagnet: function( position ) {
      var magnetBounds = new Bounds2( position.x - this.magnetModel.width / 2, position.y - this.magnetModel.height / 2, position.x + this.magnetModel.width / 2, position.y + this.magnetModel.height / 2 );

      //intersection with first coil
      if ( magnetBounds.intersectsBounds( this.restricted[2] ) || magnetBounds.intersectsBounds( this.restricted[3] || magnetBounds.containsBounds( this.restricted[2] ) || magnetBounds.containsBounds( this.restricted[3] ) ) ) {
        return false;
      }

      //intersection with second coil
      if ( this.showSecondCoil ) {
        if ( magnetBounds.intersectsBounds( this.restricted[0] ) || magnetBounds.intersectsBounds( this.restricted[1] || magnetBounds.containsBounds( this.restricted[0] ) || magnetBounds.containsBounds( this.restricted[1] ) ) ) {
          return false;
        }
      }

      //no intersection
      return true;
    }
  } );
} )
;