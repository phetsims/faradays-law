// Copyright 2014-2017, University of Colorado Boulder

/**
 * Model container for the 'Faradays Law' simulation.
 *
 * @author Vasily Shakhov (MLearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var CoilModel = require( 'FARADAYS_LAW/faradays-law/model/CoilModel' );
  var faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MagnetModel = require( 'FARADAYS_LAW/faradays-law/model/MagnetModel' );
  var Property = require( 'AXON/Property' );
  var VoltmeterModel = require( 'FARADAYS_LAW/faradays-law/model/VoltmeterModel' );

  // phet-io modules
  var TBoolean = require( 'ifphetio!PHET_IO/types/TBoolean' );

  /**
   * @param {number} width of Screen
   * @param {number} height of Screen
   * @param {Tandem} tandem
   * @constructor
   */
  function FaradaysLawModel( width, height, tandem ) {
    var self = this;

    this.width = width;
    this.height = height;

    this.bounds = new Bounds2( 0, 0, width, height );

    // number of coils - 1 or 2
    this.showSecondCoilProperty = new Property( false, {
      tandem: tandem.createTandem( 'showSecondCoilProperty' ),
      phetioValueType: TBoolean
    } );

    this.showMagnetArrowsProperty = new Property( true, {
      tandem: tandem.createTandem( 'showMagnetArrowsProperty' ),
      phetioValueType: TBoolean
    } );

    this.timeInterval = 0; //time since last model step

    this.magnetModel = new MagnetModel( 647, 219, 140, 30, tandem.createTandem( 'magnetModel' ) );

    // coils
    this.bottomCoil = new CoilModel( 448, 328, 4, this.magnetModel );
    this.topCoil = new CoilModel( 422, 131, 2, this.magnetModel );

    // restricted zones for magnet because of coils
    var TWO_COIL_RESTRICTED_BOUNDS = new Bounds2( 0, 0, 25, 11 );
    var FOUR_COIL_RESTRICTED_BOUNDS = new Bounds2( 0, 0, 55, 11 );
    this.restricted = [
      TWO_COIL_RESTRICTED_BOUNDS.shifted( this.topCoil.position.x - 7, this.topCoil.position.y - 76 ),
      TWO_COIL_RESTRICTED_BOUNDS.shifted( this.topCoil.position.x, this.topCoil.position.y + 67 ),
      FOUR_COIL_RESTRICTED_BOUNDS.shifted( this.bottomCoil.position.x - 30, this.bottomCoil.position.y - 76 ),
      FOUR_COIL_RESTRICTED_BOUNDS.shifted( this.bottomCoil.position.x - 23, this.bottomCoil.position.y + 67 )
    ];

    // see this.moveMagnetToPosition method, we use this to calculate magnet position
    this.intersectedBounds = null;
    this.magnetMovingDirection = null; // moving direction of the magnet when intersecting coils

    this.voltmeterModel = new VoltmeterModel( this, tandem.createTandem( 'voltmeterModel' ) );

    //if show second coil and magnet over it, reset magnet
    this.showSecondCoilProperty.link( function( show ) {
      if ( show && self.intersectionWithSecondCoil() ) {
        self.magnetModel.positionProperty.reset();
      }
      self.intersectedBounds = null;
      self.topCoil.reset();
    } );
  }

  faradaysLaw.register( 'FaradaysLawModel', FaradaysLawModel );

  return inherit( Object, FaradaysLawModel, {

    reset: function() {
      this.magnetModel.reset();
      this.showSecondCoilProperty.reset();
      this.showMagnetArrowsProperty.reset();
      this.bottomCoil.reset();
      this.topCoil.reset();
    },

    /**
     * main step function for the model
     * @param {number} dt
     */
    step: function( dt ) {
      // Cap large dt values, which can occur when the tab containing the sim had been hidden and then re-shown
      dt = Math.min( 0.1, dt );

      // step the individual model elements
      this.bottomCoil.step( dt );
      if ( this.showSecondCoilProperty.get() ) {
        this.topCoil.step( dt );
      }
      this.voltmeterModel.step( dt );
    },

    /**
     * returns true if magnet intersects coil bounds
     * @returns {boolean}
     */
    intersectionWithSecondCoil: function() {
      var magnetBounds = Bounds2.point( this.magnetModel.positionProperty.get() ).dilatedXY( this.magnetModel.width / 2, this.magnetModel.height / 2 );
      return magnetBounds.intersectsBounds( this.restricted[ 1 ] ) || magnetBounds.intersectsBounds( this.restricted[ 0 ] );
    },

    /**
     * @param position position of magnet
     */
    moveMagnetToPosition: function( position ) {
      var magnetBounds = new Bounds2(
        Math.min( position.x, this.magnetModel.positionProperty.get().x ),
        Math.min( position.y, this.magnetModel.positionProperty.get().y ),
        Math.max( position.x, this.magnetModel.positionProperty.get().x ),
        Math.max( position.y, this.magnetModel.positionProperty.get().y )
      ).dilatedXY( this.magnetModel.width / 2 - 1, this.magnetModel.height / 2 - 1 );

      // check intersection with any restricted areas if not intersected yet
      if ( this.intersectedBounds === null ) {
        var i = this.showSecondCoilProperty.get() ? 0 : 2; // if first coil not visible, check only second coil restrictions
        for ( ; i < this.restricted.length; i++ ) {
          var restricted = this.restricted[ i ];
          if ( magnetBounds.intersectsBounds( restricted ) ) {

            // extend area so magnet cannot jump through restricted area on other side of it if mouse far enough
            var movingDelta = position.minus( this.magnetModel.positionProperty.get() );
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
          default:
            throw new Error( 'invalid magnetMovingDirection: ' + this.magnetMovingDirection );
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
      this.magnetModel.positionProperty.set( position );

    }
  } );
} );
