// Copyright 2017, University of Colorado Boulder

/**
 * Drag handler for the magnet, for now it doesn't care about holding down keys.
 * It is modeled as a "sticky" drag handler because each arrow key press changes a consistent speed, so arrow keys act
 * more like a velocity changer than a speed one.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Input = require( 'SCENERY/input/Input' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var SPEEDS = [ 3, 8, 15 ];
  var DIRECTION_NOT_MOVING = null; // the direction value when magnet is not moving.
  var SPEED_INDEX_NOT_MOVING = -1; // the speedIndex value when magnet is not moving.

  var LEFT = Input.KEY_LEFT_ARROW;
  var RIGHT = Input.KEY_RIGHT_ARROW;
  var UP = Input.KEY_UP_ARROW;
  var DOWN = Input.KEY_DOWN_ARROW;
  var LEGAL_DIRECTIONS = [ LEFT, RIGHT, UP, DOWN ];

  // this may not be the best way to store this data, but it made sense to zepumph at the time.
  var DIRECTION_REVERSE_MAPPINGS = {};
  DIRECTION_REVERSE_MAPPINGS[ LEFT ] = RIGHT;
  DIRECTION_REVERSE_MAPPINGS[ RIGHT ] = LEFT;
  DIRECTION_REVERSE_MAPPINGS[ UP ] = DOWN;
  DIRECTION_REVERSE_MAPPINGS[ DOWN ] = UP;

  /**
   * @param {Property} positionProperty
   * @param {function} startDrag
   * @param {function} onDrag
   * @constructor
   */
  function MagnetAccessibleDragHandler( positionProperty, startDrag, onDrag ) {
    var self = this;

    this.onDrag = onDrag || function() {};
    this.startDrag = startDrag || function() {};
    this.positionProperty = positionProperty;
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

    // TODO: account for multiple events from a single hold down.
    this.keydown = function( event ) {
      this.startDrag();

      if ( Input.isArrowKey( event.keyCode ) ) {
        if ( self.model.direction === event.keyCode ) {
          incrementSpeed();
          // do nothing with direction, because the model direction is already set to the correct direction.
        }
        else if ( self.model.direction === DIRECTION_NOT_MOVING ) {
          self.model.direction = event.keyCode;
          incrementSpeed();
        }
        else {
          stopMovement();
        }
      }
      else if ( event.keyCode === Input.KEY_SPACE ) {
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

        // If onDrag function was supplied
        this.onDrag();
      }
    }
  } );
} );