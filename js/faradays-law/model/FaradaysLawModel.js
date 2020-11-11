// Copyright 2014-2020, University of Colorado Boulder

/**
 * Model container for the 'Faradays Law' simulation.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Sam Reid (PhET Interactive Simulations)
 */

// modules
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import faradaysLaw from '../../faradaysLaw.js';
import FaradaysLawConstants from '../FaradaysLawConstants.js';
import CoilTypeEnum from '../view/CoilTypeEnum.js';
import Coil from './Coil.js';
import EdgeEnum from './EdgeEnum.js';
import Magnet from './Magnet.js';
import Voltmeter from './Voltmeter.js';

// constants

// Values used for the restricted zones where the magnet can't be dragged due to the presence of the coils.  These
// numbers were empirically determined based upon how the artwork for the coils appear in the view.
const COIL_RESTRICTED_AREA_HEIGHT = 11;
const TOP_COIL_RESTRICTED_AREA_WIDTH = 25;
const BOTTOM_COIL_RESTRICTED_AREA_WIDTH = 55;

// Amount that coil bounds are extended to prevent magnet from jumping around the edges, in model units, empirically
// determined.
const COIL_BOUNDS_EXTENSION_AMOUNT = 3000;

class FaradaysLawModel {

  /**
   * @param {Bounds2} bounds of Screen
   * @param {Tandem} tandem
   */
  constructor( bounds, tandem ) {

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
    this.voltmeterVisibleProperty = new BooleanProperty( false, {
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
    this.coilBumpEmitter = new Emitter( { parameters: [ { valueType: CoilTypeEnum } ] } );

    // @public (listen-only) - emitter that fires when the magnet bumps into the outer drag bounds
    this.edgeBumpEmitter = new Emitter();

    // @private - see this.moveMagnetToPosition method, used to calculate allowed magnet positions
    this.intersectedBounds = null;

    // @private {EdgeEnum|null} - moving direction of the magnet when intersecting coils
    this.magnetMovingDirection = null;

    // @private {Bounds2|null} - bounds where magnet was set to on the last movement attempt, used to detect transitions
    // between being totally in bounds and reaching the boundary edge
    this.previousMagnetBounds = null;

    // If the magnet intersects the top coil area when the top coil is shown, then reset the magnet.
    this.topCoilVisibleProperty.link( showTopCoil => {
      if ( showTopCoil && this.magnetIntersectsTopCoilArea() ) {
        this.magnet.positionProperty.reset();
      }
      this.intersectedBounds = null;
      this.topCoil.reset();
    } );
  }

  /**
   * Restore to initial conditions
   * @public
   */
  reset() {
    this.resetInProgressProperty.set( true );
    this.magnet.reset();
    this.topCoilVisibleProperty.reset();
    this.magnetArrowsVisibleProperty.reset();
    this.bottomCoil.reset();
    this.topCoil.reset();
    this.voltmeterVisibleProperty.reset();
    this.resetInProgressProperty.set( false );
  }

  /**
   * Move the model forward in time
   * @param {number} dt - in seconds
   * @public
   */
  step( dt ) {
    this.bottomCoil.step( dt );
    this.topCoilVisibleProperty.get() && this.topCoil.step( dt );
    this.voltmeter.step( dt );
  }

  /**
   * Returns true if magnet intersects coil bounds
   * @returns {boolean}
   * @private
   */
  magnetIntersectsTopCoilArea() {
    const magnetBounds = Bounds2.point( this.magnet.positionProperty.get() ).dilatedXY( this.magnet.width / 2, this.magnet.height / 2 );
    return magnetBounds.intersectsBounds(
      this.topCoilRestrictedBounds[ 1 ] ) || magnetBounds.intersectsBounds( this.topCoilRestrictedBounds[ 0 ]
    );
  }

  /**
   * Return one of the model's restricted bounds if it intersects with the given bounds. Can return null.
   * @param  {Bounds2} bounds
   * @returns {Bounds2|null}
   * @public
   */
  getIntersectedRestrictedBounds( bounds ) {

    let intersectedRestrictedBounds = null;

    // Handle whether one or both coils are visible.
    let restrictedBoundsList = [ ...this.bottomCoilRestrictedBounds ];
    if ( this.topCoilVisibleProperty.get() ) {
      restrictedBoundsList = restrictedBoundsList.concat( this.topCoilRestrictedBounds );
    }

    // test against all restricted bounds
    for ( let i = 0; i < restrictedBoundsList.length; i++ ) {
      if ( bounds.intersectsBounds( restrictedBoundsList[ i ] ) ) {
        intersectedRestrictedBounds = restrictedBoundsList[ i ];
        break;
      }
    }

    return intersectedRestrictedBounds;
  }

  /**
   * @param {Vector2} proposedPosition - proposed position of magnet.  The magnet will be moved to this location unless
   * doing so would cause it to go into a restricted area
   * @public
   */
  moveMagnetToPosition( proposedPosition ) {

    const currentMagnetBounds = this.magnet.getBounds();
    const proposedTranslation = proposedPosition.minus( this.magnet.positionProperty.value );
    const projectedMagnetBounds = currentMagnetBounds.shifted( proposedTranslation.x, proposedTranslation.y );

    // check intersection with any restricted areas if not intersected yet
    if ( this.intersectedBounds === null ) {

      // Make a list of the restricted bounds based on which coils are currently visible.
      let restrictedBoundsList = [ ...this.bottomCoilRestrictedBounds ];
      if ( this.topCoilVisibleProperty.value ) {
        restrictedBoundsList = this.bottomCoilRestrictedBounds.concat( this.topCoilRestrictedBounds );
      }

      // Test whether the projected bounds intersect with any of the restricted bounds.
      for ( let i = 0; i < restrictedBoundsList.length; i++ ) {
        const restrictedBounds = restrictedBoundsList[ i ];
        if ( projectedMagnetBounds.intersectsBounds( restrictedBounds ) ) {

          // Emit an event to indicate that the magnet has bumped into one of the coils.
          if ( this.bottomCoilRestrictedBounds.includes( restrictedBounds ) ) {
            this.coilBumpEmitter.emit( CoilTypeEnum.FOUR_COIL );
          }
          else {
            this.coilBumpEmitter.emit( CoilTypeEnum.TWO_COIL );
          }

          // extend area so magnet cannot jump through restricted area on other side of it if mouse far enough
          this.intersectedBounds = restrictedBounds.copy();

          if ( Math.abs( proposedTranslation.y ) > Math.abs( proposedTranslation.x ) ) {

            // vertical direction
            if ( proposedTranslation.y > 0 ) {
              this.magnetMovingDirection = EdgeEnum.BOTTOM;
              this.intersectedBounds.setMaxY( COIL_BOUNDS_EXTENSION_AMOUNT );
            }
            else {
              this.magnetMovingDirection = EdgeEnum.TOP;
              this.intersectedBounds.setMinY( -COIL_BOUNDS_EXTENSION_AMOUNT );
            }
          }
          else {

            // horizontal
            if ( proposedTranslation.x > 0 ) {
              this.magnetMovingDirection = EdgeEnum.RIGHT;
              this.intersectedBounds.setMaxX( COIL_BOUNDS_EXTENSION_AMOUNT );
            }
            else {
              this.magnetMovingDirection = EdgeEnum.LEFT;
              this.intersectedBounds.setMinX( -COIL_BOUNDS_EXTENSION_AMOUNT );
            }
          }
          break;
        }
      }
    }

    // Limit the magnet's position if the proposed position would put it in a restricted area or out of the sim bounds.
    const newPosition = proposedPosition.copy();
    if ( this.intersectedBounds && projectedMagnetBounds.intersectsBounds( this.intersectedBounds ) ) {
      if ( this.magnetMovingDirection === EdgeEnum.BOTTOM ) {
        newPosition.y = this.intersectedBounds.y - this.magnet.height / 2;
      }
      else if ( this.magnetMovingDirection === EdgeEnum.TOP ) {
        newPosition.y = this.intersectedBounds.maxY + this.magnet.height / 2;
      }
      else if ( this.magnetMovingDirection === EdgeEnum.LEFT ) {
        newPosition.x = this.intersectedBounds.maxX + this.magnet.width / 2;
      }
      else if ( this.magnetMovingDirection === EdgeEnum.RIGHT ) {
        newPosition.x = this.intersectedBounds.x - this.magnet.width / 2;
      }
      else {
        throw new Error( 'invalid magnetMovingDirection: ' + this.magnetMovingDirection );
      }
    }
    else {
      this.intersectedBounds = null;

      // Limit the motion of the magnet to be within the sim bounds, which are generally the layout bounds of the view.
      if ( !this.bounds.containsBounds( projectedMagnetBounds ) ) {
        newPosition.x = Math.max( Math.min( proposedPosition.x, this.bounds.maxX - this.magnet.width / 2 ), this.bounds.x + this.magnet.width / 2 );
        newPosition.y = Math.max( Math.min( proposedPosition.y, this.bounds.maxY - this.magnet.height / 2 ), this.bounds.y + this.magnet.height / 2 );
      }
    }

    // Set the resultant position.
    this.magnet.positionProperty.set( newPosition );

    // Figure out what the bounds ended up being after checking the potential limits.
    let finalMagnetBounds;
    if ( newPosition.equals( proposedPosition ) ) {
      finalMagnetBounds = projectedMagnetBounds;
    }
    else {
      finalMagnetBounds = this.magnet.getBounds();
    }

    // Check whether the position has changed such that the magnet has hit a boundary.
    if ( this.previousMagnetBounds &&
         ( ( this.previousMagnetBounds.maxX < this.bounds.maxX && finalMagnetBounds.maxX >= this.bounds.maxX ) ||
           ( this.previousMagnetBounds.minX > this.bounds.minX && finalMagnetBounds.minX <= this.bounds.minX ) ||
           ( this.previousMagnetBounds.maxY < this.bounds.maxY && finalMagnetBounds.maxY >= this.bounds.maxY ) ||
           ( this.previousMagnetBounds.minY > this.bounds.minY && finalMagnetBounds.minY <= this.bounds.minY )
         )
    ) {
      this.edgeBumpEmitter.emit();
    }

    // Keep a history of the bounds so that edge bumps can be detected.
    this.previousMagnetBounds = finalMagnetBounds;
  }
}

faradaysLaw.register( 'FaradaysLawModel', FaradaysLawModel );
export default FaradaysLawModel;
