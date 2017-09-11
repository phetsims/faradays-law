// Copyright 2014-2015, University of Colorado Boulder

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
  var FaradaysLawView = require( 'FARADAYS_LAW/faradays-law/view/FaradaysLawView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );

  function FaradaysLawScreen( tandem ) {
    Screen.call( this,
      function() {
        return new FaradaysLawModel( FaradaysLawConstants.LAYOUT_BOUNDS.width, FaradaysLawConstants.LAYOUT_BOUNDS.height, tandem.createTandem( 'model' ) );
      },
      function( model ) {
        return new FaradaysLawView( model, tandem.createTandem( 'view' ) );
      }, {
        backgroundColorProperty: new Property( 'rgb( 151, 208, 255 )' ),
        tandem: tandem
      }
    );
  }

  faradaysLaw.register( 'FaradaysLawScreen', FaradaysLawScreen );

  return inherit( Screen, FaradaysLawScreen );
} );
