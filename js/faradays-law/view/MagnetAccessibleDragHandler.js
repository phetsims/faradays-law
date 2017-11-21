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
  var SPEEDS = [ 5, 10, 15 ];
  var LEGAL_DIRECTIONS = [ 'left', 'right', 'up', 'down' ];
  var DIRECTION_NOT_MOVING = null; // the direction value when magnet is not moving.
  var SPEED_INDEX_NOT_MOVING = -1; // the speedIndex value when magnet is not moving.
  var DIRECTION_REVERSE_MAPPINGS = { // this may not be the best way to store this data, but it made sense to zepumph at the time.
    left: 'right',
    right: 'left',
    up: 'down',
    down: 'up'
  };

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

    var stopMotion = function() {
      self.model = { direction: DIRECTION_NOT_MOVING, speedIndex: SPEED_INDEX_NOT_MOVING };
    };
    var increment = function() {
      if ( self.model.speedIndex !== SPEEDS.length - 1 ) {
        self.model.speedIndex += 1;
      }
    };

    // switch the direction of motion 180 degrees
    var reverseDirection = function() {
      if ( self.model.direction === DIRECTION_NOT_MOVING ) {
        return;
      }
      else if ( LEGAL_DIRECTIONS.indexOf( self.model.direction ) >= 0 ) {
        self.model.direction = DIRECTION_REVERSE_MAPPINGS[ self.model.direction ];
      }
      else {
        assert && assert( false, 'invalid direction,' + self.model.direction );
      }
    };

    // TODO: account for multiple events from a single hold down.
    this.keydown = function( event ) {
      this.startDrag();
      if ( event.keyCode === Input.KEY_LEFT_ARROW ) {
        if ( self.model.direction === 'left' || self.model.direction === DIRECTION_NOT_MOVING ) {
          increment();
          self.model.direction = 'left';
        }
        else {
          stopMotion();
        }
      }
      else if ( event.keyCode === Input.KEY_RIGHT_ARROW ) {

        if ( self.model.direction === 'right' || self.model.direction === DIRECTION_NOT_MOVING ) {
          increment();
          self.model.direction = 'right';
        }
        else {
          stopMotion();
        }
      }
      else if ( event.keyCode === Input.KEY_UP_ARROW ) {

        if ( self.model.direction === 'up' || self.model.direction === DIRECTION_NOT_MOVING ) {
          increment();
          self.model.direction = 'up';
        }
        else {
          stopMotion();
        }
      }
      else if ( event.keyCode === Input.KEY_DOWN_ARROW ) {

        if ( self.model.direction === 'down' || self.model.direction === DIRECTION_NOT_MOVING ) {
          increment();
          self.model.direction = 'down';
        }
        else {
          stopMotion();
        }
      }
      else if ( event.keyCode === Input.KEY_SPACE ) {
        reverseDirection();
      }
      else {
        stopMotion();
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

        if ( this.model.direction === 'left' ) {
          deltaX = -positionDelta;
        }
        if ( this.model.direction === 'right' ) {
          deltaX = positionDelta;
        }
        if ( this.model.direction === 'up' ) {
          deltaY = -positionDelta;
        }
        if ( this.model.direction === 'down' ) {
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