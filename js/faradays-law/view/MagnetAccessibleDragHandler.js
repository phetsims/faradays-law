// Copyright 2017, University of Colorado Boulder

/**
 * Drag handler for the magnet, for now it doesn't care about holding down keys.
 * It is modeled as a "sticky" drag handler because each arrow key press changes a consistent speed, so arrow keys act
 * more like a velocity changer than a speed one.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations
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


  /**
   *
   * @param {Property} positionProperty
   * @param {function} startDrag
   * @param {function} onDrag
   * @constructor
   */
  function MagnetAccessibleDragHandler( positionProperty, startDrag, onDrag ) {
    var self = this;

    this.onDrag = onDrag;
    this.positionProperty = positionProperty;
    this.speedState = { direction: null, speedIndex: -1 };

    var stopMotion = function() {
      self.speedState = { direction: null, speedIndex: -1 };
    };
    var increment = function() {
      if ( self.speedState.speedIndex !== SPEEDS.length - 1 ) {
        self.speedState.speedIndex += 1;
      }
    };

    // TODO: account for multiple events from a single hold down.
    this.keydown = function( event ) {
      startDrag();
      if ( event.keyCode === Input.KEY_LEFT_ARROW ) {
        if ( self.speedState.direction === 'left' || self.speedState.direction === null ) {
          increment();
          self.speedState.direction = 'left';
        }
        else {
          stopMotion();
        }
      }
      if ( event.keyCode === Input.KEY_RIGHT_ARROW ) {

        if ( self.speedState.direction === 'right' || self.speedState.direction === null ) {
          increment();
          self.speedState.direction = 'right';
        }
        else {
          stopMotion();
        }
      }
      if ( event.keyCode === Input.KEY_UP_ARROW ) {

        if ( self.speedState.direction === 'up' || self.speedState.direction === null ) {
          increment();
          self.speedState.direction = 'up';
        }
        else {
          stopMotion();
        }
      }
      if ( event.keyCode === Input.KEY_DOWN_ARROW ) {

        if ( self.speedState.direction === 'down' || self.speedState.direction === null ) {
          increment();
          self.speedState.direction = 'down';
        }
        else {
          stopMotion();
        }
      }
    };
  }

  faradaysLaw.register( 'MagnetAccessibleDragHandler', MagnetAccessibleDragHandler );

  return inherit( Object, MagnetAccessibleDragHandler, {
    step: function( dt ) {

      if ( this.speedState.direction !== null ) {
        assert && assert( this.speedState.speedIndex >= 0 && this.speedState.speedIndex < SPEEDS.length,
          'speedIndex must correspond to a proper speed' );
        var deltaX = 0;
        var deltaY = 0;
        var positionDelta = SPEEDS[ this.speedState.speedIndex ];

        if ( this.speedState.direction === 'left' ) {
          deltaX = -positionDelta;
        }
        if ( this.speedState.direction === 'right' ) {
          deltaX = positionDelta;
        }
        if ( this.speedState.direction === 'up' ) {
          deltaY = -positionDelta;
        }
        if ( this.speedState.direction === 'down' ) {
          deltaY = positionDelta;
        }

        // determine if the new position is within the constraints of the drag bounds
        var vectorDelta = new Vector2( deltaX, deltaY );
        var newPosition = this.positionProperty.get().plus( vectorDelta );

        // update the position if it is different
        if ( !newPosition.equals( this.positionProperty.get() ) ) {
          this.positionProperty.set( newPosition );
        }
      }

      this.onDrag();

    }
  } );

} )
;
