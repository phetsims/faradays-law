// Copyright 2018, University of Colorado Boulder

define( require => {
  'use strict';

  // modules
  const faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  const KeyboardUtil = require( 'SCENERY/accessibility/KeyboardUtil' );
  // const Utterance = require( 'SCENERY_PHET/accessibility/Utterance' );
  const utteranceQueue = require( 'SCENERY_PHET/accessibility/utteranceQueue' );

  // the alert manager
  class FaradaysLawAlertManager {

    constructor( describer, regionManager ) {
      this.describer = describer;
      this.regionManager = regionManager;

      // @private - conditions for alerts
      this._justFocused = false;
      this._tabReleased = false;
      this._shiftDown = false;
      this._aKeyWasJustPressed = false;
    }

    getAccessibleInputListener() {
      return {
        keyup: this.onKeyup.bind( this ),
        keydown: this.onKeydown.bind( this ),
        focus: this.onFocus.bind( this )
      };
    }

    onKeydown( event ) {
      if ( this._justFocused ) {
        this._justFocused = false;
      }

      this._justFocused = false; //
    }

    onKeyup( event ) {

      const isMovementKey = KeyboardUtil.isArrowKey( event.keyCode ) || KeyboardUtil.isWASDKey( event.keyCode );

      if ( !this._justFocused && isMovementKey ) {
        // wait until we have at least 1 keydown event

        if ( this.regionManager.magnetIsAnimating ) {
          // silence the location-related alerts and send the sliding alert
          this.magnetSlidingAlert();
        } else {
          // the magnet is not animating, so we can produce the end movement alert
          this.movementEndAlert();
        }
        this._justFocused = false;
      }
    }

    onFocus( event ) {
      // set flag to override the next keyup alert
      this.magnetFocusAlert();
      this._justFocused = true;
    }

    magnetFocusAlert() {
      const alert = this.describer.magnetFocusAlertText;
      utteranceQueue.addToBack( alert );
    }

    magnetSlidingAlert() {
      // alert
      // const speed = SPEEDS[ Util.toFixedNumber(speedToText( self._stepDelta ), 0) ];
      // const direction = (self.positionProperty.get() - self.targetPositionVector) > 0 ? DIRECTIONS.left : DIRECTIONS.right;
      //
      // const alert = StringUtils.fillIn( magnetSlidingAlertPatternString, { speed: speed, direction: direction} );
      // utteranceQueue.addToBack( alert );
    }

    movementEndAlert() {
      const alert = this.describer.magnetMovedAlertText();
      utteranceQueue.addToBack( alert );
      this.regionManager.resetKeyboardStop();
    }
  }

  return faradaysLaw.register( 'FaradaysLawAlertManager', FaradaysLawAlertManager );
} );