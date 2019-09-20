// Copyright 2014-2019, University of Colorado Boulder

/**
 * The 'Faradays Law' screen.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  const FaradaysLawConstants = require( 'FARADAYS_LAW/faradays-law/FaradaysLawConstants' );
  const FaradaysLawModel = require( 'FARADAYS_LAW/faradays-law/model/FaradaysLawModel' );
  const FaradaysLawScreenView = require( 'FARADAYS_LAW/faradays-law/view/FaradaysLawScreenView' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );

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

  return inherit( Screen, FaradaysLawScreen );
} );
