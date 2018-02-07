// Copyright 2017, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  var inherit = require( 'PHET_CORE/inherit' );
  var KeyboardUtil = require( 'SCENERY/accessibility/KeyboardUtil' );
  var Node = require( 'SCENERY/nodes/Node' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var SPEEDS = [ 3, 8, 15 ]; // The delta of the positionProperty each step.

  function MagnetJumpKeyboardListener( options ) {
    var self = this;

    _.extend( {
      positionProperty: null,
      dragBounds: null,
      velocity: 10, // in model coordinates / step
      shiftVelocity: 5,
      onKeydown: null,
      onKeyup: null
    }, options );

    // readyToJump or jKeyPressed

    // @private
    this._onKeydown = options.onKeydown;
    this._onKeyup = options.onKeyup;
    this._isAnimating = false;
    this._dragBounds = options.dragBounds;
    this._boundsCenterX = this._dragBounds.maxX / 2;
    this._velocity = options.velocity;
    this._shiftVelocity = options.shiftVelocity;


    // @public
    this.positionProperty = options.positionProperty;
    this.reflectedPositionProperty = new Property( this.positionProperty.get().copy() );
    this.targetPositionProperty = new Property( this.positionProperty.get().copy() );

    this.positionProperty.link( function() {
      var reflectedPositionVector = self.positionProperty.get().copy();
      reflectedPositionVector.x = self._dragBounds.maxX - reflectedPositionVector.x;
      self.reflectedPositionProperty.set( reflectedPositionVector );
    } );
    

    this.keydown = function( event ) {
      self._isAnimating = false;

      if ( self._onKeydown ) {
        self._onKeydown( event );
      }
    };

    this.keyup = function( event ) {

      if ( event.key === 'j' ) {
        self._isAnimating = true;
        self.targetPositionProperty.set( this.reflectedPositionProperty.get() );
      }

      if ( self._onKeyup ) {
        self._onKeyup( event );
      }
    };

  }

  faradaysLaw.register( 'MagnetJumpKeyboardListener', MagnetJumpKeyboardListener );

  return inherit( Object, MagnetJumpKeyboardListener, {

    step: function( dt ) {

      if ( this._isAnimating && !this.positionProperty.get().equals( this.targetPositionProperty.get() ) ) {

        var direction = targetPositionDiff < 0 ? -1 : 1;

        // TODO: conditionally set delta based on shift key press
        //  - requires using an object to track other keys pressed on keyup
        var delta = this._velocity * direction;
        var newPositionX = this.positionProperty.get().x +  delta;

        this.positionProperty.set( new Vector2( newPositionX, this.positionProperty.get().y ) );
      }
    },

    updatePosition: function() {

    }
  } );
} );