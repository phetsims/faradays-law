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
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var PropertyIO = require( 'AXON/PropertyIO' );
  var Vector2IO = require( 'DOT/Vector2IO' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {number} x - x position of magnet
   * @param {number} y - y position of magnet
   * @param {number} width - width of magnet
   * @param {number} height - height of magnet
   * @param {Tandem} tandem
   * @constructor
   */
  function Magnet( x, y, width, height, tandem ) {

    // @public {number} - width of the magnet
    this.width = width;

    // @public {number} - height of the magnet
    this.height = height;

    // @public {Property.<Vector2>} - position of the magnet
    this.positionProperty = new Property( new Vector2( x, y ), {
      tandem: tandem.createTandem( 'positionProperty' ),
      phetioType: PropertyIO( Vector2IO )
    } );

    // @public {BooleanProperty} - true if the magnet is flipped
    this.flippedProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'flippedProperty' )
    } );

    // @public {BooleanProperty} - show field lines for magnet
    this.showFieldLinesProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'showFieldLinesProperty' )
    } );
  }

  faradaysLaw.register( 'Magnet', Magnet );

  return inherit( Object, Magnet, {

    /**
     * Restore the initial conditions
     * @public
     */
    reset: function() {
      this.positionProperty.reset();
      this.flippedProperty.reset();
      this.showFieldLinesProperty.reset();
    }
  } );
} );