// Copyright 2017-2020, University of Colorado Boulder

/**
 * Drag handler for the magnet; there is no special treatment for holding down keys.
 * It is modeled as a "sticky" drag handler. A directional arrow key press moves the magnet at a
 * consistent speed (no need to hold the key down). Each additional press of the same arrow key
 * will increase the velocity of the magnet.
 * Space bar will reverse the direction of the magnet while keeping the same speed.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import KeyboardUtils from '../../../../scenery/js/accessibility/KeyboardUtils.js';
import faradaysLaw from '../../faradaysLaw.js';

// constants
const SPEEDS = [ 3, 8, 15 ]; // The delta of the positionProperty each step.
const DIRECTION_NOT_MOVING = null; // the direction value when magnet is not moving.
const SPEED_INDEX_NOT_MOVING = -1; // the speedIndex value when magnet is not moving.

const LEFT = KeyboardUtils.KEY_LEFT_ARROW;
const RIGHT = KeyboardUtils.KEY_RIGHT_ARROW;
const UP = KeyboardUtils.KEY_UP_ARROW;
const DOWN = KeyboardUtils.KEY_DOWN_ARROW;
const LEGAL_DIRECTIONS = [ LEFT, RIGHT, UP, DOWN ];

// This may not be the best way to store this data, but it made sense to zepumph at the time.
const DIRECTION_REVERSE_MAPPINGS = {};
DIRECTION_REVERSE_MAPPINGS[ LEFT ] = RIGHT;
DIRECTION_REVERSE_MAPPINGS[ RIGHT ] = LEFT;
DIRECTION_REVERSE_MAPPINGS[ UP ] = DOWN;
DIRECTION_REVERSE_MAPPINGS[ DOWN ] = UP;

/**
 * @param {Property.<Vector2>} positionProperty - in model coordinate frame, updated based on the keyboard drag commands
 * @param {Object} [options]
 * @constructor
 */
function MagnetAccessibleDragHandler( positionProperty, options ) {
  const self = this;

  options = merge( {
    onDrag: function() {}, // supplemental function called each time a drag step occurs
    startDrag: function() {} // supplemental function called at the beginning of each drag
  }, options );

  // @private
  this.onDrag = options.onDrag;

  // @private
  this.positionProperty = positionProperty;

  /**
   * The model of the drag handler, manages the state of the speed and direction
   * @private
   * @type {{direction: number|null, speedIndex: number}}
   */
  this.model = { direction: DIRECTION_NOT_MOVING, speedIndex: SPEED_INDEX_NOT_MOVING };

  const stopMovement = function() {
    self.model = { direction: DIRECTION_NOT_MOVING, speedIndex: SPEED_INDEX_NOT_MOVING };
  };
  const incrementSpeed = function() {
    if ( self.model.speedIndex !== SPEEDS.length - 1 ) {
      self.model.speedIndex += 1;
    }
  };

  // switch the direction of motion 180 degrees
  const reverseDirection = function() {
    if ( LEGAL_DIRECTIONS.indexOf( self.model.direction ) >= 0 ) {
      self.model.direction = DIRECTION_REVERSE_MAPPINGS[ self.model.direction ];
    }
  };

  this.keydown = function( event ) {
    const domEvent = event.domEvent;

    options.startDrag();

    if ( KeyboardUtils.isArrowKey( domEvent.keyCode ) ) {
      if ( self.model.direction === domEvent.keyCode ) {
        incrementSpeed();

        // do nothing with direction, because the model direction is already set to the correct direction.
      }
      else if ( self.model.direction === DIRECTION_NOT_MOVING ) {
        self.model.direction = domEvent.keyCode;
        incrementSpeed();
      }
      else {
        stopMovement();
      }
    }
    else if ( domEvent.keyCode === KeyboardUtils.KEY_SPACE ) {
      reverseDirection();
    }
    else {
      stopMovement();
    }
  };
}

faradaysLaw.register( 'MagnetAccessibleDragHandler', MagnetAccessibleDragHandler );

inherit( Object, MagnetAccessibleDragHandler, {

  /**
   * Move the magnet with the accessibility controls.
   * @param {number} dt - elapsed time in seconds
   * @public
   */
  step: function( dt ) {

    if ( this.model.direction !== DIRECTION_NOT_MOVING ) {
      assert && assert( this.model.speedIndex >= 0 && this.model.speedIndex < SPEEDS.length,
        'speedIndex must correspond to a proper speed' );
      let deltaX = 0;
      let deltaY = 0;
      const positionDelta = SPEEDS[ this.model.speedIndex ];

      if ( this.model.direction === LEFT ) {
        deltaX = -positionDelta;
      }
      if ( this.model.direction === RIGHT ) {
        deltaX = positionDelta;
      }
      if ( this.model.direction === UP ) {
        deltaY = -positionDelta;
      }
      if ( this.model.direction === DOWN ) {
        deltaY = positionDelta;
      }

      // determine if the new position is within the constraints of the drag bounds
      const vectorDelta = new Vector2( deltaX, deltaY );
      const newPosition = this.positionProperty.get().plus( vectorDelta );

      // update the position if it is different
      if ( !newPosition.equals( this.positionProperty.get() ) ) {
        this.positionProperty.set( newPosition );
      }

      // If onDrag function was supplied, fire it here
      this.onDrag();
    }
  }
} );

export default MagnetAccessibleDragHandler;