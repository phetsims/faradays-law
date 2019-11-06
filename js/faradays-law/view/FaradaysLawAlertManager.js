// Copyright 2018-2019, University of Colorado Boulder

define( require => {
  'use strict';

  // modules
  const faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  const MagnetDescriber = require( 'FARADAYS_LAW/faradays-law/view/MagnetDescriber' );
  const Utterance = require( 'UTTERANCE_QUEUE/Utterance' );
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
      phet.joist.sim.display.utteranceQueue.addToBack( alert );
    }

    movementEndAlert() {
      this.keyboardMovementUtterance.alert = this.describer.magnetMovedAlertText();
      phet.joist.sim.display.utteranceQueue.addToFront( this.keyboardMovementUtterance );
    }

    flipMagnetAlert( orientation ) {
      const alert = this.describer.getFlipMagnetAlertText( orientation );
      phet.joist.sim.display.utteranceQueue.addToBack( alert );
    }

    static magnetSlidingAlert( speed, direction ) {
      const alert = MagnetDescriber.getMagnetSlidingAlertText( speed, direction );
      phet.joist.sim.display.utteranceQueue.addToFront( alert );
    }

    static voltmeterAttachmentAlert( showVoltmeter ) {
      const alert = MagnetDescriber.getVoltmeterAttachmentAlertText( showVoltmeter );
      phet.joist.sim.display.utteranceQueue.addToBack( alert );
    }

    static fieldLinesVisibilityAlert( showLines ) {
      const alert = MagnetDescriber.getFieldLinesVisibilityAlertText( showLines );
      phet.joist.sim.display.utteranceQueue.addToBack( alert );
    }

    static coilConnectionAlert( showTopCoil ) {
      const alert = MagnetDescriber.getCoilConnectionAlertText( showTopCoil );
      phet.joist.sim.display.utteranceQueue.addToBack( alert );
    }
  }

  return faradaysLaw.register( 'FaradaysLawAlertManager', FaradaysLawAlertManager );
} );