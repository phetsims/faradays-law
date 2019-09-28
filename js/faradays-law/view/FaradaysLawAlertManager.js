// Copyright 2018-2019, University of Colorado Boulder

define( require => {
  'use strict';

  // modules
  const faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  const MagnetDescriber = require( 'FARADAYS_LAW/faradays-law/view/MagnetDescriber' );
  const Utterance = require( 'SCENERY_PHET/accessibility/Utterance' );
  const utteranceQueue = require( 'SCENERY_PHET/accessibility/utteranceQueue' );

  // the alert manager
  class FaradaysLawAlertManager {

    constructor( describer ) {
      this.describer = describer;

      // @private {Utterance} - utterance for end of a keyboard movement, single utterance
      // gets added to the utteranceQueue to prevent too many alerts with this content
      this.keyboardMovementUtterance = new Utterance();
    }

    magnetFocusAlert() {
      const alert = this.describer.magnetFocusAlertText;
      utteranceQueue.addToBack( alert );
    }

    movementEndAlert() {
      this.keyboardMovementUtterance.alert = this.describer.magnetMovedAlertText();
      utteranceQueue.addToFront( this.keyboardMovementUtterance );
    }

    flipMagnetAlert( orientation ) {
      const alert = this.describer.getFlipMagnetAlertText( orientation );
      utteranceQueue.addToBack( alert );
    }

    static magnetSlidingAlert( speed, direction ) {
      const alert = MagnetDescriber.getMagnetSlidingAlertText( speed, direction );
      utteranceQueue.addToFront( alert );
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