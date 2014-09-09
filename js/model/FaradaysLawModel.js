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
    var self = this;

    this.width = width;
    this.height = height;

    this.bounds = new Bounds2( 0, 0, width, height );

    PropertySet.call( this, {
      showSecondCoil: false // number of coils - 1 or 2
    } );

    this.timeInterval = 0; //time since last model step
    /*
     In original simulation each tick lasts 0.03 seconds, but model 'thinks' that 0.04 seconds passed
     */
    this.targetTickTime = 0.03; //seconds, from original model, next step in model after targetTick time
    this.modelTickTime = 0.04;//seconds, from original model, the time for model step, not equal targetTick time

    this.magnetModel = new MagnetModel( 647, 219, 140, 30 );

    // coils
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
    //see this.possiblePositionForMagnet method, we use this to extend bounds
    this.extendedRestricted = null;

    this.voltMeterModel = new VoltMeterModel( this );

    //if show second coil and magnet over it, reset magnet
    this.showSecondCoilProperty.link( function( show ) {
      if ( show && !self.possiblePositionForMagnet( self.magnetModel.position ) ) {
        self.magnetModel.positionProperty.reset();
      }
    } );

  }

  return inherit( PropertySet, FaradaysLawModel, {
    reset: function() {
      PropertySet.prototype.reset.call( this );
      this.magnetModel.reset();
    },
    /**
     * evolve model over time, if dt > targetTickTime calculate next step in model
     * @param dt
     */
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
    /**
     * @param position position of magnet
     * @returns {boolean} return whether magnet can be placed into position or not
     */
    possiblePositionForMagnet: function( position ) {
      var magnetBounds = new Bounds2( position.x - this.magnetModel.width / 2, position.y - this.magnetModel.height / 2, position.x + this.magnetModel.width / 2, position.y + this.magnetModel.height / 2 );

      //out or simulation bounds
      if ( !this.bounds.containsBounds( magnetBounds ) ) {
        return false;
      }

      //check intersection with any restricted areas
      var i = this.showSecondCoil ? 0 : 2; // if first coil not visible, check only second coil restrictions
      for ( ; i < this.restricted.length; i++ ) {
        var restricted = this.restricted[i];
        if ( magnetBounds.intersectsBounds( restricted ) ) {
          //extend area so magnet cannot jump through restricted area on other side of it if mouse far enough
          var movingDelta = position.minus( this.magnetModel.position );
          this.extendedRestricted = restricted.copy();
          if ( Math.abs( movingDelta.y ) > Math.abs( movingDelta.x ) ) { //vertical direction
            if ( movingDelta.y > 0 ) { //bottom
              this.extendedRestricted.maxY = this.height;
            }
            else { //top
              this.extendedRestricted.minY = 0;
            }
          }
          else { //horizontal
            if ( movingDelta.x > 0 ) { //right
              this.extendedRestricted.maxX = this.width;
            }
            else { //left
              this.extendedRestricted.minX = 0;
            }
          }

          return false;
        }
      }

      if ( this.extendedRestricted ) {
        if ( magnetBounds.intersectsBounds( this.extendedRestricted ) || magnetBounds.intersectsBounds( this.extendedRestricted ) ) {
          return false;
        }
      }


      this.extendedRestricted = null;

      //no intersection
      return true;
    }
  } )
    ;
} )
;