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
      showSecondCoil: false, // number of coils - 1 or 2
      showCoilArrows: true
    } );

    this.timeInterval = 0; //time since last model step
    /*
     In original simulation each tick lasts 0.03 seconds, but model 'thinks' that 0.04 seconds passed
     */
    this.targetTickTime = 0.03; //seconds, from original model, next step in model after targetTick time
    this.modelTickTime = 0.04;//seconds, from original model, the time for model step, not equal targetTick time

    this.magnetModel = new MagnetModel( 647, 219, 140, 30 );

    // coils
    this.bottomCoil = new CoilModel( 448, 328, 4, this.magnetModel );
    this.topCoil = new CoilModel( 422, 131, 2, this.magnetModel );

    //restricted zones for magnet because of coils borders
    //first 2 for top coil
    var TWO_COIL_RESTRICTED_BOUNDS = new Bounds2( 0, 0, 25, 11 );
    var FOUR_COIL_RESTRICTED_BOUNDS = new Bounds2( 0, 0, 55, 11 );
    this.restricted = [
      TWO_COIL_RESTRICTED_BOUNDS.shifted( this.topCoil.position.x - 7, this.topCoil.position.y - 76 ),
      TWO_COIL_RESTRICTED_BOUNDS.shifted( this.topCoil.position.x, this.topCoil.position.y + 67 ),
      FOUR_COIL_RESTRICTED_BOUNDS.shifted( this.bottomCoil.position.x - 30, this.bottomCoil.position.y - 76 ),
      FOUR_COIL_RESTRICTED_BOUNDS.shifted( this.bottomCoil.position.x - 23, this.bottomCoil.position.y + 67 )
    ];
    //see this.moveMagnetToPosition method, we use this to calculate magnet position
    this.intersectedBounds = null;
    this.magnetMovingDirection = null; // moving direction of the magnet when intersecting coils

    this.voltMeterModel = new VoltMeterModel( this );

    //if show second coil and magnet over it, reset magnet
    this.showSecondCoilProperty.link( function( show ) {
      if ( show && self.intersectionWithSecondCoil() ) {
        self.magnetModel.positionProperty.reset();
      }
      self.intersectedBounds = null;
      self.topCoil.reset();
    } );

  }

  return inherit( PropertySet, FaradaysLawModel, {

    reset: function() {
      this.magnetModel.reset();
      PropertySet.prototype.reset.call( this );
      this.bottomCoil.reset();
      this.topCoil.reset();
    },

    /**
     * evolve model over time, if dt > targetTickTime calculate next step in model
     * @param dt
     */
    step: function( dt ) {
      this.timeInterval += dt;
      if ( this.timeInterval >= 2 * this.targetTickTime ) {
        // prevent incorrect behaviour when running in background
        this.timeInterval = this.targetTickTime;
      }
      if ( this.timeInterval >= this.targetTickTime ) {
        this.timeInterval -= this.targetTickTime;
        this.bottomCoil.step( this.modelTickTime );
        if ( this.showSecondCoil ) {
          this.topCoil.step( this.modelTickTime );
        }
        this.voltMeterModel.step( this.modelTickTime );
      }
    },

    /**
     *  return if Magnet intersects coil bounds
     * @param magnetBounds
     * @returns {boolean}
     */
    intersectionWithSecondCoil: function() {
      var magnetBounds = Bounds2.point( this.magnetModel.position ).dilatedXY( this.magnetModel.width / 2, this.magnetModel.height / 2 );
      return magnetBounds.intersectsBounds( this.restricted[1] ) || magnetBounds.intersectsBounds( this.restricted[0] );
    },

    /**
     * @param position position of magnet
     */
    moveMagnetToPosition: function( position ) {
      var magnetBounds = new Bounds2(
        Math.min( position.x, this.magnetModel.position.x ),
        Math.min( position.y, this.magnetModel.position.y ),
        Math.max( position.x, this.magnetModel.position.x ),
        Math.max( position.y, this.magnetModel.position.y )
      ).dilatedXY( this.magnetModel.width / 2-1, this.magnetModel.height / 2-1 );

      //check intersection with any restricted areas if not intersected yet
      if ( this.intersectedBounds === null ) {
        var i = this.showSecondCoil ? 0 : 2; // if first coil not visible, check only second coil restrictions
        for ( ; i < this.restricted.length; i++ ) {
          var restricted = this.restricted[i];
          if ( magnetBounds.intersectsBounds( restricted ) ) {
            //extend area so magnet cannot jump through restricted area on other side of it if mouse far enough
            var movingDelta = position.minus( this.magnetModel.position );
            this.intersectedBounds = restricted.copy();
            if ( Math.abs( movingDelta.y ) > Math.abs( movingDelta.x ) ) { //vertical direction
              if ( movingDelta.y > 0 ) { //bottom
                this.magnetMovingDirection = 'bottom';
                this.intersectedBounds.setMaxY( 3000 );
              }
              else { //top
                this.magnetMovingDirection = 'top';
                this.intersectedBounds.setMinY( -3000 );
              }
            }
            else { //horizontal
              if ( movingDelta.x > 0 ) { //right
                this.magnetMovingDirection = 'right';
                this.intersectedBounds.setMaxX( 3000 );
              }
              else { //left
                this.magnetMovingDirection = 'left';
                this.intersectedBounds.setMinX( -3000 );
              }
            }
            break;
          }
        }
      }

      //intersection with any bounds
      if ( this.intersectedBounds && magnetBounds.intersectsBounds( this.intersectedBounds ) ) {
        switch( this.magnetMovingDirection ) {
          case 'bottom' :
            position.y = this.intersectedBounds.y - this.magnetModel.height / 2;
            break;
          case 'top' :
            position.y = this.intersectedBounds.maxY + this.magnetModel.height / 2;
            break;
          case 'left' :
            position.x = this.intersectedBounds.maxX + this.magnetModel.width / 2;
            break;
          case 'right' :
            position.x = this.intersectedBounds.x - this.magnetModel.width / 2;
            break;
        }
      }
      else {
        this.intersectedBounds = null;

        //out or simulation bounds
        if ( !this.bounds.containsBounds( magnetBounds ) ) {
          position.x = Math.max( Math.min( position.x, this.bounds.maxX - this.magnetModel.width / 2 ), this.bounds.x + this.magnetModel.width / 2 );
          position.y = Math.max( Math.min( position.y, this.bounds.maxY - this.magnetModel.height / 2 ), this.bounds.y + this.magnetModel.height / 2 );
        }
      }
      this.magnetModel.position = position;

    }
  } );
} );
