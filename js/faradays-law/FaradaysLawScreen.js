// Copyright 2014-2015, University of Colorado Boulder

/**
 * The 'Faradays Law' screen.
 *
 * Author: Vasily Shakhov (mlearner.com)
 */

define( function( require ) {
  'use strict';

  // modules
  var FaradaysLawConstants = require( 'FARADAYS_LAW/faradays-law/FaradaysLawConstants' );
  var FaradaysLawView = require( 'FARADAYS_LAW/faradays-law/view/FaradaysLawView' );
  var FaradaysLawModel = require( 'FARADAYS_LAW/faradays-law/model/FaradaysLawModel' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );
  var faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );

  // strings
  var faradaysLawTitleString = require( 'string!FARADAYS_LAW/faradays-law.title' );

  function FaradaysLawScreen( tandem ) {
    Screen.call( this, faradaysLawTitleString, null /* no icon, single-screen sim */,
      function() {
        return new FaradaysLawModel( FaradaysLawConstants.LAYOUT_BOUNDS.width, FaradaysLawConstants.LAYOUT_BOUNDS.height, tandem.createTandem( 'model' ) );
      },
      function( model ) {
        return new FaradaysLawView( model, tandem.createTandem( 'view' ) );
      }, {
        backgroundColor: 'rgb( 151, 208, 255 )'
      }
    );
  }

  faradaysLaw.register( 'FaradaysLawScreen', FaradaysLawScreen );
  
  return inherit( Screen, FaradaysLawScreen );
} );
