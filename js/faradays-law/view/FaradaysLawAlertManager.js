// Copyright 2018, University of Colorado Boulder

define( require => {
  'use strict';

  // modules
  const faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  const KeyboardUtil = require( 'SCENERY/accessibility/KeyboardUtil' );
  const MagnetDescriber = require( 'FARADAYS_LAW/faradays-law/view/MagnetDescriber' );
  const Utterance = require( 'SCENERY_PHET/accessibility/Utterance' );
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
      // a keydown event will always allow the movement alerts to occur
      this._justFocused = false;
    }

    onKeyup( event ) {

      const isMovementKey = KeyboardUtil.isArrowKey( event.keyCode ) || KeyboardUtil.isWASDKey( event.keyCode );
      const { magnetIsAnimating, magnetStoppedByKeyboard } = this.regionManager;

      if ( !this._justFocused ) {

        if ( isMovementKey ) {
          this.movementEndAlert();
        } else {
          if ( !magnetIsAnimating && magnetStoppedByKeyboard ) {
            this.movementEndAlert();
          }
        }
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

    movementEndAlert() {
      const alert = new Utterance( this.describer.magnetMovedAlertText(), { typeId: 'keyboardMove' } );
      utteranceQueue.addToBack( alert );
      this.regionManager.resetKeyboardStop();
      this._justFocused = false;
    }

    static magnetSlidingAlert( speed, direction ) {
      const alert = MagnetDescriber.getMagnetSlidingAlertText( speed, direction );
      utteranceQueue.addToBack( alert );
    }

    static voltmeterAttachmentAlert( showVoltmeter ) {
      const alert = MagnetDescriber.getVoltmeterAttachmentAlertText( showVoltmeter );
      utteranceQueue.addToBack( alert );
    }

    static fieldLinesVisibilityAlert( showLines ) {
      const alert = MagnetDescriber.getFieldLinesVisibilityAlertText( showLines );
      utteranceQueue.addToBack( alert );
    }

    static coilConnectionAlert( showTopCoil ) {
      const alert = MagnetDescriber.getCoilConnectionAlertText( showTopCoil );
      utteranceQueue.addToBack( alert );
    }
  }

  return faradaysLaw.register( 'FaradaysLawAlertManager', FaradaysLawAlertManager );
} );