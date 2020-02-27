// Copyright 2014-2019, University of Colorado Boulder

/**
 * The 'Faradays Law' screen.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import inherit from '../../../phet-core/js/inherit.js';
import faradaysLaw from '../faradaysLaw.js';
import FaradaysLawConstants from './FaradaysLawConstants.js';
import FaradaysLawModel from './model/FaradaysLawModel.js';
import FaradaysLawScreenView from './view/FaradaysLawScreenView.js';

/**
 * @param {Tandem} tandem
 * @constructor
 */
function FaradaysLawScreen( tandem ) {
  Screen.call( this,
    function() {
      return new FaradaysLawModel( FaradaysLawConstants.LAYOUT_BOUNDS, tandem.createTandem( 'model' ) );
    },
    function( model ) {
      return new FaradaysLawScreenView( model, tandem.createTandem( 'view' ) );
    }, {
      backgroundColorProperty: new Property( 'rgb( 151, 208, 255 )' ),
      tandem: tandem,

      // Cap large dt values, which can occur when the tab containing the sim had been hidden and then re-shown
      maxDT: 0.1
    }
  );
}

faradaysLaw.register( 'FaradaysLawScreen', FaradaysLawScreen );

inherit( Screen, FaradaysLawScreen );
export default FaradaysLawScreen;