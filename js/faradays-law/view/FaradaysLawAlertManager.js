// Copyright 2018, University of Colorado Boulder

define( require => {
  'use strict';

  // modules
  const faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  const MagnetDescriber = require( 'FARADAYS_LAW/MagnetDescriber' );
  // const Utterance = require( 'SCENERY_PHET/accessibility/Utterance' );
  const utteranceQueue = require( 'SCENERY_PHET/accessibility/utteranceQueue' );

  // the alert manager
  const FaradaysLawAlertManager = {

    magnetFocusAlert: ( cueVisible ) => {
      const utterance = MagnetDescriber.getMagnetFocusAlertText( cueVisible );
      utteranceQueue.addToBack( utterance );
    }

  };

  return faradaysLaw.register( 'FaradaysLawAlertManager', FaradaysLawAlertManager );
} );