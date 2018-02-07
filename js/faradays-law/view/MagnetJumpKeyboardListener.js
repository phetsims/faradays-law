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
    this.targetPositionProperty = new Property( this.positionProperty.get() );
    this.reflectionVisibileProperty = new BooleanProperty( false );

    this.positionProperty.link( function() {
      var reflectedPositionVector = self.positionProperty.get().copy();
      reflectedPositionVector.x = self._dragBounds.maxX - reflectedPositionVector.x;
      self.targetPositionProperty.set( reflectedPositionVector );
      debugger;
    } );
    

    this.keydown = function( event ) {
      self._isAnimating = false;
      self.reflectionVisibileProperty.set( true );

      if ( self._onKeydown ) {
        self._onKeydown( event );
      }

      if ( event.key === 'j' ) {
        self.reflectionVisibileProperty.set( true );
      }
    };

    this.keyup = function( event ) {
      if ( self._onKeyup ) {
        self._onKeyup( event );
      }

      if ( event.key === 'j' ) {
        self._isAnimating = true;
      }
    };

  }

  faradaysLaw.register( 'MagnetJumpKeyboardListener', MagnetJumpKeyboardListener );

  return inherit( Object, MagnetJumpKeyboardListener, {

    step: function( dt ) {

      var refletionDelta = this.positionProperty().get().x - this.targetPositionProperty.get().x;

      // if ( this._animatingProperty.get() && !this._readyToJumpProperty.get() && this.refletionDelta !== 0 ) {

      // }
    },

    updatePosition: function() {}
  } );
} );