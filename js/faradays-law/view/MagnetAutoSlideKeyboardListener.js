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

    // @public (read-only) - true when the magnet is being animated (moved) by this object
    this.isAnimatingProperty = new BooleanProperty( false );

    // @public (read-only) - the position where the magnet will head towards if and when this listener is fired
    this.slideTargetPositionProperty = new Vector2Property( Vector2.ZERO );

    // @private - speed at which translation of the magnet should occur
    this.translationSpeed = 0;

    // @private
    this.model = model;
    this._constrainedDragBounds = FaradaysLawConstants.LAYOUT_BOUNDS.erodedXY( HALF_MAGNET_WIDTH, HALF_MAGNET_HEIGHT );

    // closure to update the slide target position based on the current position and preferred direction of travel
    const updateSlideTarget = () => {

      let preferredDirection;
      if ( this.isAnimatingProperty.value ) {

        // There is an animation in progress, so we want to reverse the direction.
        preferredDirection = model.magnet.positionProperty.value.x < this.slideTargetPositionProperty.value.x ?
                             LEFT :
                             RIGHT;
      }
      else {

        // The magnet is not currently sliding, so start it moving.  It will move towards the coils if there is room to
        // do so, otherwise it will move away from them.
        preferredDirection = model.magnet.positionProperty.value.x < FaradaysLawConstants.TOP_COIL_POSITION.x ?
                             RIGHT :
                             LEFT;
      }

      // convenience values
      const maxXPosition = this._constrainedDragBounds.maxX;
      const minXPosition = this._constrainedDragBounds.minX;
      const magnetPosition = model.magnet.positionProperty.value;
      const magnetBounds = model.magnet.getBounds();

      // Set the target X value assuming the magnet can move all the way to the boundary in the preferred direction.
      let targetX = preferredDirection === RIGHT ? maxXPosition : minXPosition;

      // Create a bounds that represents the path that the leading edge of the magnet would trace out if it moves in the
      // preferred direction all the way to the bounds.
      const leadingEdgePath = new Bounds2(
        preferredDirection === RIGHT ? magnetBounds.maxX : minXPosition - HALF_MAGNET_WIDTH,
        magnetPosition.y - HALF_MAGNET_HEIGHT,
        preferredDirection === RIGHT ? maxXPosition + HALF_MAGNET_WIDTH : magnetBounds.minX,
        magnetPosition.y + HALF_MAGNET_HEIGHT
      );

      // Check for cases where the path to the target will bump up against obstacles.
      const intersectedBounds = model.getIntersectedRestrictedBounds( leadingEdgePath );
      if ( intersectedBounds ) {

        // There is an obstacle in the path - adjust the target to adapt.
        if ( preferredDirection === RIGHT ) {

          assert && assert( intersectedBounds.minX >= magnetBounds.maxX, 'should not be in this state when moving right' );
          if ( intersectedBounds.minX > magnetBounds.maxX ) {

            // There is room to move towards the target in the preferred direction, so adjust the target.
            targetX = intersectedBounds.minX - HALF_MAGNET_WIDTH;
          }
          else {

            // The magnet must be up against an obstacle, so the target needs to be in the other direction.
            targetX = minXPosition;
          }
        }
        else {

          assert && assert( intersectedBounds.maxX <= magnetBounds.minX, 'should not be in this state when moving left' );
          if ( intersectedBounds.maxX < magnetBounds.minX ) {

            // There is room to move towards the target in the preferred direction, so adjust the target.
            targetX = intersectedBounds.maxX + HALF_MAGNET_WIDTH;
          }
          else {

            // The magnet must be up against an obstacle, so the target needs to be in the other direction.
            targetX = maxXPosition;
          }
        }
      }

      // Set the new target position.
      this.slideTargetPositionProperty.set( new Vector2( targetX, magnetPosition.y ) );
    };

    // To avoid odd behavior, stop any in-progress animations if the number of coils change.
    model.topCoilVisibleProperty.link( () => {
      if ( this.isAnimatingProperty.value ) {
        this.isAnimatingProperty.set( false );
        this.slideTargetPositionProperty.set( model.magnet.positionProperty.value );
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
          updateSlideTarget();

          // Initiate the animation.
          this.isAnimatingProperty.set( true );

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

    // Stop the animation if the user starts dragging the magnet.
    model.magnet.isDraggingProperty.link( isDragging => {
      if ( isDragging ) {
        this.isAnimatingProperty.set( false );
      }
    } );

    // step the drag listener, must be removed in dispose
    const stepListener = this.step.bind( this );
    stepTimer.addListener( stepListener );

    // @private - called in dispose
    this._disposeKeyboardDragListener = () => {
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
        const constrainedNewPosition = this._constrainedDragBounds.closestPointTo( unconstrainedNewPosition );

        // Move the magnet.
        this.model.moveMagnetToPosition( constrainedNewPosition );
      }

      // If the magnet is now at the destination, clear the animation flag.
      if ( magnetPosition.equals( this.slideTargetPositionProperty.value ) ) {
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