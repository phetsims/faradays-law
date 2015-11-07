// Copyright 2014-2015, University of Colorado Boulder

/**
 * Encapsulates the position of wires, voltmeter, bulb objects on the screen relative to coils position.
 * @author Vasily Shakhov (mlearner.com)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var BULB_POSITION = new Vector2( 190, 244 );
  var VOLTMETER_POSITION = BULB_POSITION.minusXY( 0, 165 );

  var Aligner = function( model, bottomCoilEndRelativePositions, topCoilEndRelativePositions ) {
    this.bottomCoilPosition = model.bottomCoil.position;
    this.topCoilPosition = model.topCoil.position;
    this.bulbPosition = BULB_POSITION;
    this.voltmeterPosition = VOLTMETER_POSITION;

    this.bottomCoilEndPositions = {
      topEnd: bottomCoilEndRelativePositions.topEnd.plus( model.bottomCoil.position ),
      bottomEnd: bottomCoilEndRelativePositions.bottomEnd.plus( model.bottomCoil.position )
    };

    this.topCoilEndPositions = {
      topEnd: topCoilEndRelativePositions.topEnd.plus( model.topCoil.position ),
      bottomEnd: topCoilEndRelativePositions.bottomEnd.plus( model.topCoil.position )
    };
  };

  return inherit( Object, Aligner );
} );
