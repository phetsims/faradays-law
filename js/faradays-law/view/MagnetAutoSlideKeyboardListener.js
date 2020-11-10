// Copyright 2018-2020, University of Colorado Boulder

/**
 * MagnetAutoSlideKeyboardListener is a keyboard listener that implement the "auto-slide" behavior, which is where the
 * user can press keys that will cause the magnet to translate horizontally until it hits an obstacle or the sim bounds.
 *
 * @author Michael Barlow (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import stepTimer from '../../../../axon/js/stepTimer.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import LinearFunction from '../../../../dot/js/LinearFunction.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import merge from '../../../../phet-core/js/merge.js';
import faradaysLaw from '../../faradaysLaw.js';
import FaradaysLawConstants from '../FaradaysLawConstants.js';
import MagnetDirectionEnum from '../model/MagnetDirectionEnum.js';
import FaradaysLawAlertManager from './FaradaysLawAlertManager.js';

// constants
const { LEFT, RIGHT } = MagnetDirectionEnum;
const HALF_MAGNET_WIDTH = FaradaysLawConstants.MAGNET_WIDTH / 2;
const HALF_MAGNET_HEIGHT = FaradaysLawConstants.MAGNET_HEIGHT / 2;
const KEY_CODE_DIGIT_1 = 49;
const KEY_CODE_DIGIT_2 = 50;
const KEY_CODE_DIGIT_3 = 51;

class MagnetAutoSlideKeyboardListener {

  constructor( model, options ) {
    options = merge( {

      // speeds, all in model coordinates per second
      slowSpeed: 90, // empirically determined such that the voltmeter doesn't peg when going through bigger coil
      mediumSpeed: 300,
      fastSpeed: 500,

      onKeyDown: _.noop,
      onKeyUp: _.noop
    }, options );

    const { mediumSpeed, slowSpeed, fastSpeed } = options;

    // Map of the control keys to a speed for each
    const keyToSpeedMap = new Map( [
      [ KEY_CODE_DIGIT_1, slowSpeed ],
      [ KEY_CODE_DIGIT_2, mediumSpeed ],
      [ KEY_CODE_DIGIT_3, fastSpeed ]
    ] );

    // Track the up/down state for each of the control keys.
    this.controlKeyIsDownMap = new Map();
    for ( const keyCode of keyToSpeedMap.keys() ) {
      this.controlKeyIsDownMap.set( keyCode, false );
    }

    // @public (read-only) - true when the magnet is being animated (moved)
    this.isAnimatingProperty = new BooleanProperty( false );

    // @public (read-only) - the position where the magnet will head towards if and when this listener is fired
    this.slideTargetPositionProperty = new Vector2Property( Vector2.ZERO );

    // @private - speed at which translation of the magnet should occur
    this.translationSpeed = 0;

    // @private
    this.model = model;
    this._dragBounds = FaradaysLawConstants.LAYOUT_BOUNDS.erodedXY( HALF_MAGNET_WIDTH, HALF_MAGNET_HEIGHT );

    // closure to update the slide target position based on the current position and desired direction of travel
    const updateSlideTarget = preferredDirection => {
      const magnetPosition = model.magnet.positionProperty.value;
      const leftMaxX = this._dragBounds.minX;
      const rightMaxX = this._dragBounds.maxX;

      let targetX = preferredDirection === RIGHT ? rightMaxX : leftMaxX;

      // Create a bounds that represents the path that the magnet would travel to get to the target.
      const magnetPathBounds = new Bounds2(
        Math.min( targetX, magnetPosition.x ),
        magnetPosition.y,
        Math.max( targetX, magnetPosition.x ),
        magnetPosition.y
      ).dilatedXY( HALF_MAGNET_WIDTH, HALF_MAGNET_HEIGHT );

      // Check for cases where the path to the target will bump up against obstacles and adjust if needed.
      const intersectedBounds = model.getIntersectedRestrictedBounds( magnetPathBounds );
      if ( intersectedBounds ) {
        const rightLimitX = intersectedBounds.minX - HALF_MAGNET_WIDTH;
        const leftLimitX = intersectedBounds.maxX + HALF_MAGNET_WIDTH;
        if ( preferredDirection === RIGHT ) {
          if ( magnetPosition.x !== rightLimitX ) {
            targetX = rightLimitX;
          }
          else {

            // The magnet is already at the limit, meaning it must be up against something.  Head the other direction.
            targetX = leftMaxX;
          }
        }
        else {
          if ( magnetPosition.x !== leftLimitX ) {
            targetX = leftLimitX;
          }
          else {

            // The magnet is already at the limit, meaning it must be up against something.  Head the other direction.
            targetX = rightMaxX;
          }
        }
      }

      // Set the new target position.
      this.slideTargetPositionProperty.set( new Vector2( targetX, magnetPosition.y ) );
    };

    // Update the target position when the number of coils changes, since a path may now be blocked or unblocked.
    model.topCoilVisibleProperty.link( () => {
      if ( this.isAnimatingProperty.value ) {
        const direction = model.magnet.positionProperty.value.x < this.slideTargetPositionProperty.value.x ?
                          RIGHT :
                          LEFT;
        updateSlideTarget( direction );
      }
    } );

    // key down handler
    this.keydown = event => {

      const keyCode = event.domEvent.keyCode;

      if ( keyToSpeedMap.has( keyCode ) ) {

        // Skip the changes if this key is already down.
        if ( !this.controlKeyIsDownMap.get( keyCode ) ) {

          // Mark this control key as being down.
          this.controlKeyIsDownMap.set( keyCode, true );

          // Update the slide target.
          if ( this.isAnimatingProperty.value ) {

            // An animation is in progress, so reverse it.
            if ( model.magnet.positionProperty.value.x < this.slideTargetPositionProperty.value.x ) {
              updateSlideTarget( LEFT );
            }
            else {
              updateSlideTarget( RIGHT );
            }
          }
          else {

            // The magnet is not currently sliding, so start it moving towards the coils.
            if ( model.magnet.positionProperty.value.x < FaradaysLawConstants.TOP_COIL_POSITION.x ) {
              updateSlideTarget( RIGHT );
            }
            else {
              updateSlideTarget( LEFT );
            }

            // Initiate the animation.
            this.isAnimatingProperty.set( true );
          }

          // Update the speed at which the magnet will move.
          this.translationSpeed = keyToSpeedMap.get( keyCode );
        }

        // Invoke the client-provided handler (this does nothing if the client didn't provide one).
        options.onKeyDown( event );
      }
      else if ( this.isAnimatingProperty.value ) {

        // Any key press that is not one of the control keys should stop the animation.
        this.isAnimatingProperty.set( false );
      }
    };

    // function for mapping speed linearly, which is then used to map it to text for a11y
    const speedToText = new LinearFunction( 0, fastSpeed, 0, 200, true );

    // key up handler
    this.keyup = event => {

      const releasedKeyCode = event.domEvent.keyCode;

      if ( keyToSpeedMap.has( releasedKeyCode ) ) {
        this.controlKeyIsDownMap.set( releasedKeyCode, false );

        const speedToTextValue = Utils.roundSymmetric( speedToText( this.translationSpeed ) );
        const direction = this.model.magnet.positionProperty.value.x < this.slideTargetPositionProperty.value.x ?
                          RIGHT :
                          LEFT;
        FaradaysLawAlertManager.magnetSlidingAlert( speedToTextValue, direction );
      }

      // Invoke the client-provided handler (this does nothing if the client didn't provide one).
      options.onKeyUp( event );
    };

    // step the drag listener, must be removed in dispose
    const stepListener = this.step.bind( this );
    stepTimer.addListener( stepListener );

    // @private - called in dispose
    this._disposeKeyboardDragListener = function() {
      stepTimer.removeListener( stepListener );
    };
  }

  /**
   * @public
   * @param {number} dt - in seconds
   */
  step( dt ) {

    // Determine whether any of the control keys are currently pressed because if they are, the animation should pause.
    let controlKeyPressed = false;
    for ( const isKeyDown of this.controlKeyIsDownMap.values() ) {
      if ( isKeyDown ) {
        controlKeyPressed = true;
      }
    }

    // If an animation is in progress and none of the control keys are pressed, move the magnet towards the target.
    if ( this.isAnimatingProperty.value && !controlKeyPressed ) {
      const magnetPosition = this.model.magnet.positionProperty.value;
      if ( !magnetPosition.equals( this.slideTargetPositionProperty.value ) ) {

        const deltaXToTarget = this.slideTargetPositionProperty.value.x - magnetPosition.x;
        let unconstrainedNewPosition;
        if ( Math.abs( deltaXToTarget ) <= dt * this.translationSpeed ) {

          // The magnet is almost to the target position, so just move it there.
          unconstrainedNewPosition = this.slideTargetPositionProperty.value;
        }
        else {
          const distanceSign = deltaXToTarget < 0 ? -1 : 1;
          const deltaVector = new Vector2( distanceSign * this.translationSpeed * dt, 0 );
          unconstrainedNewPosition = magnetPosition.plus( deltaVector );
        }

        // Make sure the new position doesn't put the magnet outside of the drag bounds.
        const constrainedNewPosition = this._dragBounds.closestPointTo( unconstrainedNewPosition );

        this.model.moveMagnetToPosition( constrainedNewPosition );
      }
      else {
        this.isAnimatingProperty.set( false );
      }
    }
  }

  /**
   * @public
   */
  dispose() {
    this._disposeKeyboardDragListener();
  }
}

faradaysLaw.register( 'MagnetAutoSlideKeyboardListener', MagnetAutoSlideKeyboardListener );
export default MagnetAutoSlideKeyboardListener;