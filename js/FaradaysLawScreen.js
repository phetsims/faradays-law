// Copyright 2002-2014, University of Colorado Boulder

/**
 * The 'Faradays Law' screen.
 *
 * Author: Vasily Shakhov (mlearner.com)
 */

define( function( require ) {
  'use strict';

  // modules
  var FaradaysLawView = require( 'FARADAYS_LAW/view/FaradaysLawView' );
  var FaradaysLawModel = require( 'FARADAYS_LAW/model/FaradaysLawModel' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var titleString = require( 'string!FARADAYS_LAW/faradays-law.name' );

  function MoleculesAndLightScreen() {
    Screen.call( this, titleString, null /* no icon, single-screen sim */,
      function() { return new FaradaysLawModel(); },
      function( model ) { return new FaradaysLawView( model ); },
      { backgroundColor: 'black' }
    );
  }

  return inherit( Screen, MoleculesAndLightScreen );
} );