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
      velocity: 10, // in model coordinates / step
      shiftVelocity: 5,
      onKeydown: null,
      onKeyup: null
    }, options );

    // @private
    this._onKeydown = options.onKeydown;
    this._onKeyup = options.onKeyup;
    this._isAnimating = false;
    this._dragBounds = options.dragBounds;
    this._boundsCenterX = this._dragBounds.maxX / 2;
    this._velocity = options.velocity;
    this._shiftVelocity = options.shiftVelocity;
    this._shiftKeyPressed = false;
    this._shiftAnimate = false;

    console.log( options.velocity );
    console.log( self._velocity );

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
      
      // if the key pressed is not an augmenting key
      if ( !event.keyCode === KeyboardUtil.SHIFT_KEY ) {
        self._isAnimating = false;
      }

      // self._shiftAnimate = false;

      if ( event.keyCode === KeyboardUtil.KEY_SHIFT ) {
        this._shiftKeyPressed = true;
      }
    };

    this.keyup = function( event ) {

      if ( event.keyCode === KeyboardUtil.KEY_J ) {
        self._isAnimating = true;
        self.targetPositionProperty.set( this.reflectedPositionProperty.get() );
      }

      if ( event.keyCode === KeyboardUtil.KEY_SHIFT ) {
        self._shiftKeyPressed = false;
      }

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

          var deltaX = 0;
          var deltaIncrement = this._shiftKeyPressed ? this._shiftVelocity : this._velocity;

          var diffX = this.targetPositionProperty.get().x - this.positionProperty.get().x;
          var direction = diffX < 0 ? -1 : 1;

          deltaIncrement = Math.min( Math.abs( diffX ), deltaIncrement ) * direction;

          var deltaVector = new Vector2( deltaX + deltaIncrement, 0 );

          var newPosition = this.positionProperty.get().plus( deltaVector );

          newPosition = this.model.bounds.closestPointTo( newPosition );

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
