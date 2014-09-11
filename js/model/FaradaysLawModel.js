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
    this.coil1 = new CoilModel( 448, 328, 2, this.magnetModel );
    this.coil2 = new CoilModel( 422, 131, 1, this.magnetModel );

    //restricted zones for magnet because of coils borders
    //first 2 for top coil
    this.restricted = [
      new Bounds2( 405, 55, 435, 65 ),
      new Bounds2( 415, 198, 445, 208 ),
      new Bounds2( 410, 251, 475, 261 ),
      new Bounds2( 420, 394, 480, 404 )
    ];
    //see this.moveMagnetToPosition method, we use this to calculate magnet position
    this.intersectedBounds = null;

    this.voltMeterModel = new VoltMeterModel( this );

    //if show second coil and magnet over it, reset magnet
    this.showSecondCoilProperty.link( function( show ) {
      if ( show && !self.moveMagnetToPosition( self.magnetModel.position ) ) {
        self.magnetModel.positionProperty.reset();
      }
      self.intersectedBounds = null;
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
     */
    moveMagnetToPosition: function( position ) {
      var movingDirection;
      var magnetBounds = new Bounds2( position.x - this.magnetModel.width / 2, position.y - this.magnetModel.height / 2, position.x + this.magnetModel.width / 2, position.y + this.magnetModel.height / 2 );

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
                this.intersectedBounds.movingDirection = 'bottom';
                this.intersectedBounds.setMaxY( 3000 );
              }
              else { //top
                this.intersectedBounds.movingDirection = 'top';
                this.intersectedBounds.setMinY( -3000 );
              }
            }
            else { //horizontal
              if ( movingDelta.x > 0 ) { //right
                this.intersectedBounds.movingDirection = 'right';
                this.intersectedBounds.setMaxX( 3000 );
              }
              else { //left
                this.intersectedBounds.movingDirection = 'left';
                this.intersectedBounds.setMinX( -3000 );
              }
            }
            break;
          }
        }
      }

      //intersection with any bounds
      if ( this.intersectedBounds && magnetBounds.intersectsBounds( this.intersectedBounds ) ) {
        switch( this.intersectedBounds.movingDirection ) {
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