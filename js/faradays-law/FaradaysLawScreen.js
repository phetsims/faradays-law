// Copyright 2014-2017, University of Colorado Boulder

/**
 * The 'Faradays Law' screen.
 *
 * Author: Vasily Shakhov (mlearner.com)
 */

define( function( require ) {
  'use strict';

  // modules
  var faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  var FaradaysLawConstants = require( 'FARADAYS_LAW/faradays-law/FaradaysLawConstants' );
  var FaradaysLawModel = require( 'FARADAYS_LAW/faradays-law/model/FaradaysLawModel' );
  var FaradaysLawScreenView = require( 'FARADAYS_LAW/faradays-law/view/FaradaysLawScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );

  function FaradaysLawScreen( tandem ) {
    Screen.call( this,
      function() {
        return new FaradaysLawModel( FaradaysLawConstants.LAYOUT_BOUNDS, tandem.createTandem( 'model' ) );
      },
      function( model ) {
        return new FaradaysLawScreenView( model, tandem.createTandem( 'view' ) );
      }, {
        backgroundColorProperty: new Property( 'rgb( 151, 208, 255 )' ),
        tandem: tandem
      }
    );
  }

  faradaysLaw.register( 'FaradaysLawScreen', FaradaysLawScreen );

  return inherit( Screen, FaradaysLawScreen );
} );
