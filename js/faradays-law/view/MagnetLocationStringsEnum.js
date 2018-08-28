// Copyright 2014-2017, University of Colorado Boulder

/**
 * Possible magnet region location strings.
 *
 * @author Michael Barlow (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  const FaradaysLawA11yStrings = require( 'FARADAYS_LAW/FaradaysLawA11yStrings' );

  // strings
  const topLeftString = FaradaysLawA11yStrings.topLeft.value;
  const topCenterString = FaradaysLawA11yStrings.topCenter.value;
  const topRightString = FaradaysLawA11yStrings.topRight.value;
  const middleLeftString = FaradaysLawA11yStrings.middleLeft.value;
  const centerString = FaradaysLawA11yStrings.center.value;
  const middleRightString = FaradaysLawA11yStrings.middleRight.value;
  const bottomLeftString = FaradaysLawA11yStrings.bottomLeft.value;
  const bottomCenterString = FaradaysLawA11yStrings.bottomCenter.value;
  const bottomRightString = FaradaysLawA11yStrings.bottomRight.value;

  const MagnetLocationStringsEnum = Object.freeze( [
    topLeftString,
    topCenterString,
    topRightString,
    middleLeftString,
    centerString,
    middleRightString,
    bottomLeftString,
    bottomCenterString,
    bottomRightString
  ] );

  return faradaysLaw.register( 'MagnetLocationStringsEnum', MagnetLocationStringsEnum );
} );