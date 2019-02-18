// Copyright 2017-2018, University of Colorado Boulder

/**
 * Drag handler for the magnet; there is no special treatment for holding down keys.
 * It is modeled as a "sticky" drag handler. A directional arrow key press moves the magnet at a
 * consistent speed (no need to hold the key down). Each additional press of the same arrow key
 * will increase the velocity of the magnet.
 * Space bar will reverse the direction of the magnet while keeping the same speed.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  var inherit = require( 'PHET_CORE/inherit' );
  var KeyboardUtil = require( 'SCENERY/accessibility/KeyboardUtil' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var SPEEDS = [ 3, 8, 15 ]; // The delta of the positionProperty each step.
  var DIRECTION_NOT_MOVING = null; // the direction value when magnet is not moving.
  var SPEED_INDEX_NOT_MOVING = -1; // the speedIndex value when magnet is not moving.

  var LEFT = KeyboardUtil.KEY_LEFT_ARROW;
  var RIGHT = KeyboardUtil.KEY_RIGHT_ARROW;
  var UP = KeyboardUtil.KEY_UP_ARROW;
  var DOWN = KeyboardUtil.KEY_DOWN_ARROW;
  var LEGAL_DIRECTIONS = [ LEFT, RIGHT, UP, DOWN ];

  // This may not be the best way to store this data, but it made sense to zepumph at the time.
  var DIRECTION_REVERSE_MAPPINGS = {};
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
    var self = this;

    options = _.extend( {
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

    var stopMovement = function() {
      self.model = { direction: DIRECTION_NOT_MOVING, speedIndex: SPEED_INDEX_NOT_MOVING };
    };
    var incrementSpeed = function() {
      if ( self.model.speedIndex !== SPEEDS.length - 1 ) {
        self.model.speedIndex += 1;
      }
    };

    // switch the direction of motion 180 degrees
    var reverseDirection = function() {
      if ( LEGAL_DIRECTIONS.indexOf( self.model.direction ) >= 0 ) {
        self.model.direction = DIRECTION_REVERSE_MAPPINGS[ self.model.direction ];
      }
    };

    this.keydown = function( event ) {
      var domEvent = event.domEvent;

      options.startDrag();

      if ( KeyboardUtil.isArrowKey( domEvent.keyCode ) ) {
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
      else if ( domEvent.keyCode === KeyboardUtil.KEY_SPACE ) {
        reverseDirection();
      }
      else {
        stopMovement();
      }
    };
  }

  faradaysLaw.register( 'MagnetAccessibleDragHandler', MagnetAccessibleDragHandler );

  return inherit( Object, MagnetAccessibleDragHandler, {

    /**
     * Move the magnet with the accessibility controls.
     * @param {number} dt - elapsed time in seconds
     * @public
     */
    step: function( dt ) {

      if ( this.model.direction !== DIRECTION_NOT_MOVING ) {
        assert && assert( this.model.speedIndex >= 0 && this.model.speedIndex < SPEEDS.length,
          'speedIndex must correspond to a proper speed' );
        var deltaX = 0;
        var deltaY = 0;
        var positionDelta = SPEEDS[ this.model.speedIndex ];

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
        var vectorDelta = new Vector2( deltaX, deltaY );
        var newPosition = this.positionProperty.get().plus( vectorDelta );

        // update the position if it is different
        if ( !newPosition.equals( this.positionProperty.get() ) ) {
          this.positionProperty.set( newPosition );
        }

        // If onDrag function was supplied, fire it here
        this.onDrag();
      }
    }
  } );
} );