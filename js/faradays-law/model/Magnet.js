// Copyright 2014-2017, University of Colorado Boulder

/**
 * Magnet model for the 'Faradays Law' simulation.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var TVector2 = require( 'DOT/TVector2' );
  var Vector2 = require( 'DOT/Vector2' );

  // phet-io modules
  var TBoolean = require( 'ifphetio!PHET_IO/types/TBoolean' );

  /**
   * @param {number} x - x position of magnet
   * @param {number} y - y position of magnet
   * @param {number} width - width of magnet
   * @param {number} height - height of magnet
   * @param {Tandem} tandem
   * @constructor
   */
  function Magnet( x, y, width, height, tandem ) {

    this.width = width;
    this.height = height;

    this.positionProperty = new Property( new Vector2( x, y ), {
      tandem: tandem.createTandem( 'positionProperty' ),
      phetioValueType: TVector2
    } );

    // is the magnet flipped?
    this.flippedProperty = new Property( false, {
      tandem: tandem.createTandem( 'flippedProperty' ),
      phetioValueType: TBoolean
    } );

    // show field lines for magnet
    this.showFieldLinesProperty = new Property( false, {
      tandem: tandem.createTandem( 'showFieldLinesProperty' ),
      phetioValueType: TBoolean
    } );
  }

  faradaysLaw.register( 'Magnet', Magnet );

  return inherit( Object, Magnet, {

    reset: function() {
      this.positionProperty.reset();
      this.flippedProperty.reset();
      this.showFieldLinesProperty.reset();
    }
  } );
} );