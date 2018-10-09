// Copyright 2014-2018, University of Colorado Boulder

/**
 * Model container for the 'Faradays Law' simulation.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var NumberProperty = require( 'AXON/NumberProperty' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Coil = require( 'FARADAYS_LAW/faradays-law/model/Coil' );
  var EdgeEnum = require( 'FARADAYS_LAW/faradays-law/model/EdgeEnum' );
  var faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  var FaradaysLawConstants = require( 'FARADAYS_LAW/faradays-law/FaradaysLawConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Magnet = require( 'FARADAYS_LAW/faradays-law/model/Magnet' );
  // var Vector2 = require( 'DOT/Vector2' );
  var Voltmeter = require( 'FARADAYS_LAW/faradays-law/model/Voltmeter' );

  // constants
  // restricted zones for magnet because of coils
  var TWO_COIL_RESTRICTED_BOUNDS = new Bounds2( 0, 0, 25, 11 );
  var FOUR_COIL_RESTRICTED_BOUNDS = new Bounds2( 0, 0, 55, 11 );

  /**
   * @param {Bounds2} bounds of Screen
   * @param {Tandem} tandem
   * @constructor
   */
  function FaradaysLawModel( bounds, tandem ) {
    var self = this;

    // @public (read-only) (Bounds2}
    this.bounds = bounds;

    // @public - Whether the top coil should be shown
    this.topCoilVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'topCoilVisibleProperty' ),
      phetioDocumentation: 'True if and only if the top coil is visible'
    } );

    // @public - true if the magnet arrows should be shown
    this.magnetArrowsVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'magnetArrowsVisibleProperty' ),
      phetioDocumentation: 'True if the magnet arrows are shown'
    } );

    this.voltmeterVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'voltmeterVisibleProperty' ),
      phetioDocumentation: 'True if the voltmeter is shown'
    } );

    // @public {NumberProperty} Voltage indicated by the voltmeter. This drives the needle location and the light bulb brightness.
    this.voltageProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'voltageProperty' ),
      phetioDocumentation: 'Voltage indicated by the voltmeter. This drives the needle location and the light bulb brightness.',
      phetioReadOnly: true,
      phetioHighFrequency: true,
      units: 'volts'
    } );

    // @public - the magnet which can be dragged
    this.magnet = new Magnet( tandem.createTandem( 'magnet' ) );

    // @public - bottom coil
    this.bottomCoil = new Coil( FaradaysLawConstants.BOTTOM_COIL_POSITION, 4, this.magnet );

    // @public - top coil
    this.topCoil = new Coil( FaradaysLawConstants.TOP_COIL_POSITION, 2, this.magnet );

    // @private - regions the magnet cannot be dragged
    this.listOfRestrictedBounds = [
      TWO_COIL_RESTRICTED_BOUNDS.shifted( this.topCoil.position.x - 7, this.topCoil.position.y - 76 ),
      TWO_COIL_RESTRICTED_BOUNDS.shifted( this.topCoil.position.x, this.topCoil.position.y + 67 ),
      FOUR_COIL_RESTRICTED_BOUNDS.shifted( this.bottomCoil.position.x - 30, this.bottomCoil.position.y - 76 ),
      FOUR_COIL_RESTRICTED_BOUNDS.shifted( this.bottomCoil.position.x - 23, this.bottomCoil.position.y + 67 )
    ];

    // @private - see this.moveMagnetToPosition method, used to calculate magnet position
    this.intersectedBounds = null;

    // @private {EdgeEnum|null} - moving direction of the magnet when intersecting coils
    this.magnetMovingDirection = null;

    // @public - the Voltmeter
    this.voltmeter = new Voltmeter( this );

    // If the magnet intersects the top coil area when the top coil is shown, then reset the magnet.
    this.topCoilVisibleProperty.link( function( showTopCoil ) {
      if ( showTopCoil && self.magnetIntersectsTopCoilArea() ) {
        self.magnet.positionProperty.reset();
      }
      self.intersectedBounds = null;
      self.topCoil.reset();
    } );
  }

  faradaysLaw.register( 'FaradaysLawModel', FaradaysLawModel );

  return inherit( Object, FaradaysLawModel, {

    /**
     * Restore to initial conditions
     * @public
     */
    reset: function() {
      this.magnet.reset();
      this.topCoilVisibleProperty.reset();
      this.magnetArrowsVisibleProperty.reset();
      this.bottomCoil.reset();
      this.topCoil.reset();
    },

    /**
     * Move the model forward in time
     * @param {number} dt - in seconds
     * @public
     */
    step: function( dt ) {
      this.bottomCoil.step( dt );
      this.topCoilVisibleProperty.get() && this.topCoil.step( dt );
      this.voltmeter.step( dt );
      // console.log(this.bottomCoil.magneticFieldProperty.get());
    },

    /**
     * Returns true if magnet intersects coil bounds
     * @returns {boolean}
     * @private
     */
    magnetIntersectsTopCoilArea: function() {
      var magnetBounds = Bounds2.point( this.magnet.positionProperty.get() ).dilatedXY( this.magnet.width / 2, this.magnet.height / 2 );
      return magnetBounds.intersectsBounds( this.listOfRestrictedBounds[ 1 ] ) || magnetBounds.intersectsBounds( this.listOfRestrictedBounds[ 0 ] );
    },

    /**
     * Return one of the model's restricted bounds if it intersects with the given bounds. Can return null.
     * @param  {Bounds2} bounds
     * @return {Bounds2|null}
     */
    getIntersectedRestrictedBounds: function( bounds ) {
      var stoppingValue = this.topCoilVisibleProperty.get() ? 0 : 2;

      for ( var i = this.listOfRestrictedBounds.length - 1; i >= stoppingValue; i-- ) {
        var restrictedBounds = this.listOfRestrictedBounds[ i ];

        if ( bounds.intersectsBounds( restrictedBounds ) ) {
          return restrictedBounds;
        }
      }

      return null;
    },

    /**
     * @param {Vector2} position - position of magnet
     * @public
     */
    moveMagnetToPosition: function( position ) {

      // Check the bounds of the magnet, but subtract 1 to prevent it from passing through the coils vertically
      // see https://github.com/phetsims/faradays-law/issues/47
      var magnetBounds = new Bounds2(
        Math.min( position.x, this.magnet.positionProperty.get().x ),
        Math.min( position.y, this.magnet.positionProperty.get().y ),
        Math.max( position.x, this.magnet.positionProperty.get().x ),
        Math.max( position.y, this.magnet.positionProperty.get().y )
      ).dilatedXY( this.magnet.width / 2 - 1, this.magnet.height / 2 - 1 );

      // check intersection with any restricted areas if not intersected yet
      if ( this.intersectedBounds === null ) {

        // if first coil not visible, check only second coil restrictions
        for ( var i = this.topCoilVisibleProperty.get() ? 0 : 2; i < this.listOfRestrictedBounds.length; i++ ) {
          var restrictedBounds = this.listOfRestrictedBounds[ i ];
          if ( magnetBounds.intersectsBounds( restrictedBounds ) ) {

            // extend area so magnet cannot jump through restricted area on other side of it if mouse far enough
            var movingDelta = position.minus( this.magnet.positionProperty.get() );
            this.intersectedBounds = restrictedBounds.copy();
            if ( Math.abs( movingDelta.y ) > Math.abs( movingDelta.x ) ) {

              // vertical direction
              if ( movingDelta.y > 0 ) {
                this.magnetMovingDirection = EdgeEnum.BOTTOM;
                this.intersectedBounds.setMaxY( 3000 );
              }
              else {
                this.magnetMovingDirection = EdgeEnum.TOP;
                this.intersectedBounds.setMinY( -3000 );
              }
            }
            else {

              // horizontal
              if ( movingDelta.x > 0 ) {
                this.magnetMovingDirection = EdgeEnum.RIGHT;
                this.intersectedBounds.setMaxX( 3000 );
              }
              else {
                this.magnetMovingDirection = EdgeEnum.LEFT;
                this.intersectedBounds.setMinX( -3000 );
              }
            }
            break;
          }
        }
      }

      // intersection with any bounds
      if ( this.intersectedBounds && magnetBounds.intersectsBounds( this.intersectedBounds ) ) {
        if ( this.magnetMovingDirection === EdgeEnum.BOTTOM ) {
          position.y = this.intersectedBounds.y - this.magnet.height / 2;
        }
        else if ( this.magnetMovingDirection === EdgeEnum.TOP ) {
          position.y = this.intersectedBounds.maxY + this.magnet.height / 2;
        }
        else if ( this.magnetMovingDirection === EdgeEnum.LEFT ) {
          position.x = this.intersectedBounds.maxX + this.magnet.width / 2;
        }
        else if ( this.magnetMovingDirection === EdgeEnum.RIGHT ) {
          position.x = this.intersectedBounds.x - this.magnet.width / 2;
        }
        else {
          throw new Error( 'invalid magnetMovingDirection: ' + this.magnetMovingDirection );
        }
      }
      else {
        this.intersectedBounds = null;

        // out of simulation bounds
        if ( !this.bounds.containsBounds( magnetBounds ) ) {
          position.x = Math.max( Math.min( position.x, this.bounds.maxX - this.magnet.width / 2 ), this.bounds.x + this.magnet.width / 2 );
          position.y = Math.max( Math.min( position.y, this.bounds.maxY - this.magnet.height / 2 ), this.bounds.y + this.magnet.height / 2 );
        }
      }
      this.magnet.positionProperty.set( position );
    }
  } );
} );