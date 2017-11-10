// Copyright 2014-2017, University of Colorado Boulder

/**
 * The 'Faradays Law' screen.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Sam Reid (PhET Interactive Simulations)
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
        tandem: tandem,

        // Cap large dt values, which can occur when the tab containing the sim had been hidden and then re-shown
        maxDT: 0.1
      }
    );
  }

  faradaysLaw.register( 'FaradaysLawScreen', FaradaysLawScreen );

  return inherit( Screen, FaradaysLawScreen );
} );
