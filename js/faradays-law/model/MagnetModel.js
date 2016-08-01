// Copyright 2014-2015, University of Colorado Boulder

/**
 * Model container for the magnet in 'Faradays Law' simulation.
 *
 * @author Vasily Shakhov (MLearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Vector2 = require( 'DOT/Vector2' );
  var faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );

  // phet-io modules
  var TBoolean = require( 'ifphetio!PHET_IO/types/TBoolean' );
  var TVector2 = require( 'ifphetio!PHET_IO/types/dot/TVector2' );

  /**
   *
   * @param {number} x - x position of magnet
   * @param {number} y - y position of magnet
   * @param {number} width - width of magnet
   * @param {number} height - height of magnet
   * @param {Tandem} tandem
   * @constructor
   */
  function MagnetModel( x, y, width, height, tandem ) {

    this.width = width;
    this.height = height;

    PropertySet.call( this, {
      position: new Vector2( x, y ),
      flipped: false, //is magnet flipped
      showFieldLines: false // show field lines for magnet
    }, {
      tandemSet: {
        position: tandem.createTandem( 'positionProperty' ),
        flipped: tandem.createTandem( 'flippedProperty' ),
        showFieldLines: tandem.createTandem( 'showFieldLinesProperty' )
      },
      phetioValueTypeSet: {
        position: TVector2,
        flipped: TBoolean,
        showFieldLines: TBoolean
      }
    } );
  }

  faradaysLaw.register( 'MagnetModel', MagnetModel );

  return inherit( PropertySet, MagnetModel );
} );