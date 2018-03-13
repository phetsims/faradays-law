// Copyright 2017, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  var inherit = require( 'PHET_CORE/inherit' );
  var KeyboardUtil = require( 'SCENERY/accessibility/KeyboardUtil' );
  var Property = require( 'AXON/Property' );
  var Timer = require( 'PHET_CORE/Timer' );
  var Vector2 = require( 'DOT/Vector2' );

  function MagnetJumpKeyboardListener( positionProperty, model, options ) {
    var self = this;

    options = _.extend( {
      dragBounds: null,
      defaultVelocity: 10, // in model coordinates / step
      shiftVelocity: 5,
      fastVelocity: 15,
      onKeydown: null,
      onKeyup: null
    }, options );

    // @private
    this._onKeydown = options.onKeydown;
    this._onKeyup = options.onKeyup;
    this._isAnimating = false;
    this._dragBounds = options.dragBounds ? options.dragBounds : model.bounds;
    this._stepDelta = options._defaultVelocity;
    this._defaultVelocity = options.defaultVelocity;
    this._shiftVelocity = options.shiftVelocity;
    this._fastVelocity = options.fastVelocity;
    this._shiftKeyPressed = false;
    this._shiftAnimate = false;

    // @public
    this.model = model;
    this.positionProperty = positionProperty;
    this.reflectedPositionProperty = new Property( this.positionProperty.get().copy() );
    this.targetPositionProperty = new Property( this.positionProperty.get().copy() );

    this.positionProperty.link( function() {
      var reflectedPositionVector = self.positionProperty.get().copy();
      reflectedPositionVector.x = self._dragBounds.maxX - reflectedPositionVector.x;
      self.reflectedPositionProperty.set( reflectedPositionVector );
    } );
    

    this.keydown = function( event ) {
      
      if ( self._onKeydown ) {
        self._onKeydown( event );
      }
      
      // set the stepDelta
      switch ( event.keyCode ) {
        case KeyboardUtil.KEY_SHIFT:
          self._stepDelta = self._shiftVelocity;
          break;
        case KeyboardUtil.KEY_C:
          self._stepDelta = self._fastVelocity;
          break;
        default:
          self._stepDelta = self._defaultVelocity;
          self._isAnimating = false;
      }

    };

    this.keyup = function( event ) {

      if ( event.keyCode === KeyboardUtil.KEY_J ) {
        self._isAnimating = true;
        self.targetPositionProperty.set( this.reflectedPositionProperty.get() );
      }

      // reset stepDelta
      self._stepDelta = self._defaultVelocity;

      if ( self._onKeyup ) {
        self._onKeyup( event );
      }
    };

    // step the drag listener, must be removed in dispose
    var stepListener = this.step.bind( this );
    Timer.addStepListener( stepListener );

    // @private - called in dispose
    this._disposeKeyboardDragListener = function() {
      Timer.removeStepListener( stepListener );
    };
  }

  faradaysLaw.register( 'MagnetJumpKeyboardListener', MagnetJumpKeyboardListener );

  return inherit( Object, MagnetJumpKeyboardListener, {

    step: function( dt ) {

      if ( this._isAnimating ) {
        if ( !this.positionProperty.get().equals( this.targetPositionProperty.get() ) ) {

          var diffX = this.targetPositionProperty.get().x - this.positionProperty.get().x;
          var direction = diffX < 0 ? -1 : 1;

          var deltaVector = new Vector2( Math.min( Math.abs( diffX ), this._stepDelta ) * direction, 0 );

          var newPosition = this.positionProperty.get().plus( deltaVector );

          newPosition = this._dragBounds.closestPointTo( newPosition );

          this.model.moveMagnetToPosition( newPosition );
        } else {
          this._isAnimating = false;
        }
      }
    },

    dispose: function() {
      this._disposeKeyboardDragListener();
    }
  } );
} );
