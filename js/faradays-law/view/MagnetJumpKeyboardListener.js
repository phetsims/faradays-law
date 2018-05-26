// Copyright 2017, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Timer = require( 'PHET_CORE/Timer' );
  var Vector2 = require( 'DOT/Vector2' );

  function MagnetJumpKeyboardListener( model, options ) {
    var self = this;

    options = _.extend( {
      dragBounds: null,
      defaultVelocity: 10, // in model coordinates / step
      shiftVelocity: 5,
      fastVelocity: 15,
      onKeydown: null,
      onKeyup: null
    }, options );

    var halfMagnetHeight = model.magnet.height / 2;
    var halfMagnetWidth = model.magnet.width / 2;

    // @private
    this._onKeydown = options.onKeydown;
    this._onKeyup = options.onKeyup;
    this._isAnimating = false;
    this._dragBounds = options.dragBounds ?
                        options.dragBounds :
                        model.bounds.erodedXY( halfMagnetWidth, halfMagnetHeight );
    this._stepDelta = options._defaultVelocity;
    this._defaultVelocity = options.defaultVelocity;
    this._shiftVelocity = options.shiftVelocity;
    this._fastVelocity = options.fastVelocity;

    // @public
    this.model = model;
    this.positionProperty = new Property( model.magnet.positionProperty.get().copy() );
    this.targetPositionProperty = new Property( model.magnet.positionProperty.get().copy() );

    model.magnet.positionProperty.link( function( position ) {
      var targetX = position.x >= ( self._dragBounds.maxX / 2 ) ? self._dragBounds.minX : self._dragBounds.maxX;

      var magnetPathBounds = new Bounds2(
        Math.min( targetX, position.x ),
        position.y,
        Math.max( targetX, position.x ),
        position.y
      ).dilatedXY( halfMagnetWidth - 1, halfMagnetHeight - 1 );

      var intersectedBounds = model.getIntersectedRestrictedBounds( magnetPathBounds );

      if ( intersectedBounds ) {
        targetX = targetX > 0 ? intersectedBounds.minX : intersectedBounds.maxX;
      }

      self.positionProperty.set( position );
      self.targetPositionProperty.set( new Vector2( targetX, position.y ) );
    } );
    

    this.keydown = function( event ) {
      console.log( event.keyCode );
      
      if ( self._onKeydown ) {
        self._onKeydown( event );
      }

      self._isAnimating = false;

      // reset stepDelta
      self._stepDelta = self._defaultVelocity;
      
      // set the stepDelta
      switch ( event.keyCode ) {
        case 49:
          self._stepDelta = self._shiftVelocity;
          break;
        case 50:
          self._stepDelta = self._defaultVelocity;
          break;
        case 51:
          self._stepDelta = self._fastVelocity;
          break;
        default:
      }

      console.log( self._stepDelta );
    };

    this.keyup = function( event ) {

      if ( !self._isAnimating ) {
        if ( event.keyCode >= 49 && event.keyCode <= 51) {
          self._isAnimating = true;
        }
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
