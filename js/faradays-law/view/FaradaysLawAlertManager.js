// Copyright 2018, University of Colorado Boulder

define( require => {
  'use strict';

  // modules
  const faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  const MagnetDescriber = require( 'FARADAYS_LAW/faradays-law/view/MagnetDescriber' );
  const Utterance = require( 'SCENERY_PHET/accessibility/Utterance' );
  const utteranceQueue = require( 'SCENERY_PHET/accessibility/utteranceQueue' );

  // the alert manager
  class FaradaysLawAlertManager {

    constructor( describer  ) {
      this.describer = describer;
    }

    magnetFocusAlert() {
      const alert = this.describer.magnetFocusAlertText;
      utteranceQueue.addToBack( alert );
    }

    movementEndAlert() {
      const alert = new Utterance( { alert: this.describer.magnetMovedAlertText(), uniqueGroupId: 'keyboardMove' } );
      utteranceQueue.addToFront( alert );
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