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

      // speeds, all in model coordinates / step
      slowSpeed: 5,
      mediumSpeed: 10,
      fastSpeed: 15,

      onKeydown: event => {},
      onKeyup: event => {}
    }, options );

    const { mediumSpeed, slowSpeed, fastSpeed } = options;

    // @public (read-only) - true when the magnet is being animated (moved)
    this.isAnimatingProperty = new BooleanProperty( false );

    // @public (read-only) - the position where the magnet will head towards if and when this listener is fired
    this.reflectedPositionProperty = new Vector2Property( Vector2.ZERO );

    // @private - the position towards which the magnet moves when this object is stepped (if not already there)
    this.targetPosition = new Vector2( 0, 0 );

    // @private
    this.model = model;
    this._dragBounds = FaradaysLawConstants.LAYOUT_BOUNDS.erodedXY( HALF_MAGNET_WIDTH, HALF_MAGNET_HEIGHT );
    this._stepDelta = mediumSpeed;

    // Set the reflected position in response to the magnet's current position.
    const setReflectedPosition = position => {
      const leftX = this._dragBounds.minX;

      let targetX = position.x >= ( this._dragBounds.maxX / 2 ) ? leftX : this._dragBounds.maxX;

      // Check for cases where the path to the target will bump up against the coils and adjust if needed.
      const magnetPathBounds = new Bounds2(
        Math.min( targetX, position.x ),
        position.y,
        Math.max( targetX, position.x ),
        position.y
      ).dilatedXY( HALF_MAGNET_WIDTH - 1, HALF_MAGNET_HEIGHT - 1 );

      const intersectedBounds = model.getIntersectedRestrictedBounds( magnetPathBounds );

      if ( intersectedBounds ) {
        targetX = targetX > leftX ?
                  intersectedBounds.minX - HALF_MAGNET_WIDTH :
                  intersectedBounds.maxX + HALF_MAGNET_WIDTH;
      }

      this.reflectedPositionProperty.set( new Vector2( targetX, position.y ) );
    };

    model.magnet.positionProperty.link( setReflectedPosition );

    // key down handler
    this.keydown = event => {
      options.onKeydown( event );

      this.isAnimatingProperty.value = false;

      // reset stepDelta
      this._stepDelta = mediumSpeed;

      // Set the stepDelta based on the key that was pressed.
      switch( event.domEvent.keyCode ) {

        case KEY_CODE_DIGIT_1:
          this._stepDelta = slowSpeed;
          break;

        case KEY_CODE_DIGIT_2:
          this._stepDelta = mediumSpeed;
          break;

        case KEY_CODE_DIGIT_3:
          this._stepDelta = fastSpeed;
          break;

        default:
          break;
      }
    };

    const speedToText = new LinearFunction( slowSpeed, fastSpeed, 0, 2, true );

    // key up handler
    this.keyup = event => {

      const domEvent = event.domEvent;
      if ( !this.isAnimatingProperty.value ) {
        if ( domEvent.keyCode >= 49 && domEvent.keyCode <= 51 ) {
          this.targetPosition = this.reflectedPositionProperty.get();
          this.isAnimatingProperty.value = true;

          const speed = Utils.roundSymmetric( speedToText( this._stepDelta ) );
          const direction = this.getMagnetDirection( this.model.magnet.positionProperty.value.x - this.targetPosition.x );
          FaradaysLawAlertManager.magnetSlidingAlert( speed, direction );
        }
      }

      options.onKeyup( event );
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
    const animating = this.isAnimatingProperty.get();

    if ( animating ) {
      const magnetPosition = this.model.magnet.positionProperty.value;
      if ( !magnetPosition.equals( this.targetPosition ) ) {

        const diffX = this.targetPosition.x - magnetPosition.x;
        const direction = diffX < 0 ? -1 : 1;

        const deltaVector = new Vector2( Math.min( Math.abs( diffX ), this._stepDelta ) * direction, 0 );

        let newPosition = magnetPosition.plus( deltaVector );

        newPosition = this._dragBounds.closestPointTo( newPosition );

        this.model.moveMagnetToPosition( newPosition );
      }
      else {
        this.isAnimatingProperty.value = false;
      }
    }
  }

  /**
   * @public
   * @param {number} positionDelta
   * @returns {string}
   */
  getMagnetDirection( positionDelta ) {
    return positionDelta > 0 ? LEFT : RIGHT;
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