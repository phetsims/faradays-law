// Copyright 2018-2020, University of Colorado Boulder

/**
 * Possible magnet region location strings.
 *
 * @author Michael Barlow (PhET Interactive Simulations)
 */

import faradaysLaw from '../../faradaysLaw.js';
import faradaysLawStrings from '../../faradaysLawStrings.js';

// strings
const topLeftString = faradaysLawStrings.a11y.topLeft;
const topCenterString = faradaysLawStrings.a11y.topCenter;
const topRightString = faradaysLawStrings.a11y.topRight;
const middleLeftString = faradaysLawStrings.a11y.middleLeft;
const centerString = faradaysLawStrings.a11y.center;
const middleRightString = faradaysLawStrings.a11y.middleRight;
const bottomLeftString = faradaysLawStrings.a11y.bottomLeft;
const bottomCenterString = faradaysLawStrings.a11y.bottomCenter;
const bottomRightString = faradaysLawStrings.a11y.bottomRight;

const MagnetLocationStringsEnum = [
  topLeftString,
  topCenterString,
  topRightString,
  middleLeftString,
  centerString,
  middleRightString,
  bottomLeftString,
  bottomCenterString,
  bottomRightString
];

if ( assert ) { Object.feeze( MagnetLocationStringsEnum ); }

faradaysLaw.register( 'MagnetLocationStringsEnum', MagnetLocationStringsEnum );
export default MagnetLocationStringsEnum;