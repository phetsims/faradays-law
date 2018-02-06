// Copyright 2017, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  var inherit = require( 'PHET_CORE/inherit' );
  var KeyboardUtil = require( 'SCENERY/accessibility/KeyboardUtil' );
  var Node = require( 'SCENERY/nodes/Node' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var SPEEDS = [ 3, 8, 15 ]; // The delta of the positionProperty each step.

  function MagnetJumpKeyboardListener( positionProperty, model, options ) {
    var self = this;

    _.extend( {
      dragBounds: null,
      velocity: 10 // in model coordinates / step
    }, options );

    // readyToJump or jKeyPressed

    // @private
    this._animatingProperty = new BooleanProperty( false );
    this._readyToJumpProperty = new BooleanProperty( false );
    this._dragBounds = options.dragBounds ? options.dragBounds : model.bounds;
    this._boundsCenterX = this._dragBounds.maxX / 2;

    // @public
    this.positionProperty = positionProperty;
    this.reflectedPositionProperty = new Property( this.positionProperty.get().copy() );

    this.positionProperty.link( function() {
      var reflectedPositionVector = this.positionProperty.get().copy();
      var reflectedPositionVector.x = ( 2 * this._dragBounds.max ) - positionVector.x;
      this.reflectedPositionProperty.set( reflectedPositionVector );
    } );
    

    this.keydown = function( event ) {
      if ( event.key === 'j' ) {
        this.reflectedPositionProperty.set();
        this._readyToJumpProperty.set( true );
      }
    };
    this.keyup = function( event ) {
      if ( event. key === 'j' ) {
        this._animatingProperty.set( true );
      }
    };

    // var listenerOptions = _.pick( options, [ 'dragBounds', 'start', 'drag' ] );
    // listenerOptions.locationProperty = positionProperty;
  }

  faradaysLaw.register( 'MagnetJumpKeyboardListener', MagnetJumpKeyboardListener );

  return inherit( Object, MagnetJumpKeyboardListener, {

    step: function( dt ) {

      var refletionDelta = this.positionProperty().get().x - this.reflectedPositionProperty.get().x;

      if ( this._animatingProperty.get() && !this._readyToJumpProperty.get() && this.refletionDelta != 0 ) {

      }
    },

    updatePosition: function() {}
  } );
} );