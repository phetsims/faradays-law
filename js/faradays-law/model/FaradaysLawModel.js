// Copyright 2014-2020, University of Colorado Boulder

/**
 * Model container for the 'Faradays Law' simulation.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Sam Reid (PhET Interactive Simulations)
 */

// modules
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import inherit from '../../../../phet-core/js/inherit.js';
import faradaysLaw from '../../faradaysLaw.js';
import FaradaysLawConstants from '../FaradaysLawConstants.js';
import Coil from './Coil.js';
import EdgeEnum from './EdgeEnum.js';
import Magnet from './Magnet.js';
import Voltmeter from './Voltmeter.js';
import Emitter from '../../../../axon/js/Emitter.js';

// constants

// Values used for the restricted zones where the magnet can't be dragged due to the presence of the coils.  These
// numbers were empirically determined based upon how the artwork for the coils appear in the view.
const COIL_RESTRICTED_AREA_HEIGHT = 11;
const TOP_COIL_RESTRICTED_AREA_WIDTH = 25;
const BOTTOM_COIL_RESTRICTED_AREA_WIDTH = 55;

/**
 * @param {Bounds2} bounds of Screen
 * @param {Tandem} tandem
 * @constructor
 */
function FaradaysLawModel( bounds, tandem ) {
  const self = this;

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

  // @public
  this.voltmeterVisibleProperty = new BooleanProperty( true, {
    tandem: tandem.createTandem( 'voltmeterVisibleProperty' ),
    phetioDocumentation: 'True if the voltmeter is shown'
  } );

  // @public {NumberProperty} Voltage indicated by the voltmeter. This drives the needle position and the light bulb brightness.
  this.voltageProperty = new NumberProperty( 0, {
    tandem: tandem.createTandem( 'voltageProperty' ),
    phetioDocumentation: 'Voltage indicated by the voltmeter. This drives the needle position and the light bulb brightness.',
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

  // @public (read-only) {Bounds2[]} - Regions where the magnet cannot be dragged.  There are two for each coil, one for
  // the upper portion of the coil and one for the lower portion.  The hard coded numbers are empirically determined
  // based upon how the artwork for the coils ended up projecting into the view.
  this.topCoilRestrictedBounds = [

    // upper portion of the coil
    Bounds2.rect(
      this.topCoil.position.x - 7,
      this.topCoil.position.y - 76,
      TOP_COIL_RESTRICTED_AREA_WIDTH,
      COIL_RESTRICTED_AREA_HEIGHT
    ),

    // lower portion of the coil
    Bounds2.rect(
      this.topCoil.position.x,
      this.topCoil.position.y + 67,
      TOP_COIL_RESTRICTED_AREA_WIDTH,
      COIL_RESTRICTED_AREA_HEIGHT
    )
  ];
  this.bottomCoilRestrictedBounds = [

    // upper portion of the coil
    Bounds2.rect(
      this.bottomCoil.position.x - 30,
      this.bottomCoil.position.y - 76,
      BOTTOM_COIL_RESTRICTED_AREA_WIDTH,
      COIL_RESTRICTED_AREA_HEIGHT
    ),

    // lower portion of the coil
    Bounds2.rect(
      this.bottomCoil.position.x - 23,
      this.bottomCoil.position.y + 67,
      BOTTOM_COIL_RESTRICTED_AREA_WIDTH,
      COIL_RESTRICTED_AREA_HEIGHT
    )
  ];

  // @public - the Voltmeter
  this.voltmeter = new Voltmeter( this );

  // @public (read-only)
  this.resetInProgressProperty = new BooleanProperty( false );

  // @public (listen-only) - emitter that fires when the magnet bumps into a coil
  this.coilBumpEmitter = new Emitter( { parameters: [{ valueType: 'number' }] } );

  // @private - see this.moveMagnetToPosition method, used to calculate magnet position
  this.intersectedBounds = null;

  // @private {EdgeEnum|null} - moving direction of the magnet when intersecting coils
  this.magnetMovingDirection = null;

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

inherit( Object, FaradaysLawModel, {

  /**
   * Restore to initial conditions
   * @public
   */
  reset: function() {
    this.resetInProgressProperty.set( true );
    this.magnet.reset();
    this.topCoilVisibleProperty.reset();
    this.magnetArrowsVisibleProperty.reset();
    this.bottomCoil.reset();
    this.topCoil.reset();
    this.resetInProgressProperty.set( true );
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
    const magnetBounds = Bounds2.point( this.magnet.positionProperty.get() ).dilatedXY( this.magnet.width / 2, this.magnet.height / 2 );
    return magnetBounds.intersectsBounds(
      this.topCoilRestrictedBounds[ 1 ] ) || magnetBounds.intersectsBounds( this.topCoilRestrictedBounds[ 0 ]
    );
  },

  /**
   * Return one of the model's restricted bounds if it intersects with the given bounds. Can return null.
   * @param  {Bounds2} bounds
   * @returns {Bounds2|null}
   */
  getIntersectedRestrictedBounds: function( bounds ) {

    let intersectedRestrictedBounds = null;

    // Handle whether one or both coils are visible.
    const restrictedBoundsList = [...this.bottomCoilRestrictedBounds];
    if ( this.topCoilVisibleProperty.get() ) {
      restrictedBoundsList.concat( this.topCoilRestrictedBounds );
    }

    // test against all restricted bounds
    for ( let i = 0; i < restrictedBoundsList.length; i++ ) {
      if ( bounds.intersectsBounds( restrictedBoundsList[ i ] ) ) {
        intersectedRestrictedBounds = restrictedBoundsList[ i ];
        break;
      }
    }

    return intersectedRestrictedBounds;
  },

  /**
   * @param {Vector2} position - position of magnet
   * @public
   */
  moveMagnetToPosition: function( position ) {

    // Check the bounds of the magnet, but subtract 1 to prevent it from passing through the coils vertically
    // see https://github.com/phetsims/faradays-law/issues/47
    const magnetBounds = new Bounds2(
      Math.min( position.x, this.magnet.positionProperty.get().x ),
      Math.min( position.y, this.magnet.positionProperty.get().y ),
      Math.max( position.x, this.magnet.positionProperty.get().x ),
      Math.max( position.y, this.magnet.positionProperty.get().y )
    ).dilatedXY( this.magnet.width / 2 - 1, this.magnet.height / 2 - 1 );

    // check intersection with any restricted areas if not intersected yet
    if ( this.intersectedBounds === null ) {

      // if first coil not visible, check only second coil restrictions
      let restrictedBoundsList;
      if ( this.topCoilVisibleProperty.value ) {
        restrictedBoundsList = this.bottomCoilRestrictedBounds.concat( this.topCoilRestrictedBounds );
      }
      else {
        restrictedBoundsList = [...this.bottomCoilRestrictedBounds];
      }
      for ( let i = 0; i < restrictedBoundsList.length; i++ ) {
        const restrictedBounds = restrictedBoundsList[ i ];
        if ( magnetBounds.intersectsBounds( restrictedBounds ) ) {

          // Emit an event to indicate that the magnet has bumped into one of the coils.
          if ( this.bottomCoilRestrictedBounds.includes( restrictedBounds ) ) {
            this.coilBumpEmitter.emit( 0 );
          }
          else {
            this.coilBumpEmitter.emit( 1 );
          }

          // extend area so magnet cannot jump through restricted area on other side of it if mouse far enough
          const movingDelta = position.minus( this.magnet.positionProperty.get() );
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

export default FaradaysLawModel;
