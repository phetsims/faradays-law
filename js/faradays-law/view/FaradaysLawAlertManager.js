// Copyright 2018-2020, University of Colorado Boulder

/**
 * Manages all alerts for the Faradays Law sim. Creates alert strings and sends them
 * to the UtteranceQueue to be spoken.
 *
 * As of 12/2/20, all sim-specific alerts are being disabled for a publication with only
 * alternative input because the alerts are somewhat unfinished and too frequent. Interactive
 * descriptions are not supported in this release, but we don't want to publish with
 * descriptions that we know would create an unpleasant experience. See
 * https://github.com/phetsims/faradays-law/issues/109
 */

import Utterance from '../../../../utterance-queue/js/Utterance.js';
import faradaysLaw from '../../faradaysLaw.js';
// import MagnetDescriber from './MagnetDescriber.js';

// the alert manager
class FaradaysLawAlertManager {

  constructor( describer ) {
    this.describer = describer;

    // @private {Utterance} - utterance for end of a keyboard movement, single utterance
    // gets added to the utteranceQueue to prevent too many alerts with this content
    this.keyboardMovementUtterance = new Utterance();
  }

  /**
   * @public
   */
  magnetFocusAlert() {
    //const alert = this.describer.magnetFocusAlertText;
    //phet.joist.sim.utteranceQueue.addToBack( alert );
  }

  /**
   * @public
   */
  movementEndAlert() {
    this.keyboardMovementUtterance.alert = this.describer.magnetMovedAlertText();
    //phet.joist.sim.utteranceQueue.addToFront( this.keyboardMovementUtterance );
  }

  /**
   * @public
   * @param {OrientationEnum} orientation
   */
  flipMagnetAlert( orientation ) {
    //const alert = this.describer.getFlipMagnetAlertText( orientation );
    //phet.joist.sim.utteranceQueue.addToBack( alert );
  }

  /**
   * @public
   * @param speed
   * @param direction
   */
  static magnetSlidingAlert( speed, direction ) {
    //const alert = MagnetDescriber.getMagnetSlidingAlertText( speed, direction );
    //phet.joist.sim.utteranceQueue.addToFront( alert );
  }

  /**
   * @public
   * @param showVoltmeter
   */
  static voltmeterAttachmentAlert( showVoltmeter ) {
    //const alert = MagnetDescriber.getVoltmeterAttachmentAlertText( showVoltmeter );
    //phet.joist.sim.utteranceQueue.addToBack( alert );
  }

  /**
   * @public
   * @param showLines
   */
  static fieldLinesVisibilityAlert( showLines ) {
    //const alert = MagnetDescriber.getFieldLinesVisibilityAlertText( showLines );
    //phet.joist.sim.utteranceQueue.addToBack( alert );
  }

  /**
   * @public
   * @param showTopCoil
   */
  static coilConnectionAlert( showTopCoil ) {
    //const alert = MagnetDescriber.getCoilConnectionAlertText( showTopCoil );
    //phet.joist.sim.utteranceQueue.addToBack( alert );
  }
}

faradaysLaw.register( 'FaradaysLawAlertManager', FaradaysLawAlertManager );
export default FaradaysLawAlertManager;