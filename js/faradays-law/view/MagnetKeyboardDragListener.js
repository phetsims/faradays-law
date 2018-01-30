// Copyright 2017, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  var inherit = require( 'PHET_CORE/inherit' );
  var KeyboardDragListener = require( 'SCENERY_PHET/accessibility/listeners/KeyboardDragListener' );
  var KeyboardUtil = require( 'SCENERY/accessibility/KeyboardUtil' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var SPEEDS = [ 3, 8, 15 ]; // The delta of the positionProperty each step.

  function MagnetKeyboardDragListener( positionProperty, options ) {
    var self = this;

    KeyboardDragListener.call( this, { locationProperty: positionProperty } );
  }

  faradaysLaw.register( 'MagnetKeyboardDragListener', MagnetKeyboardDragListener );

  return inherit( KeyboardDragListener, { } );
} );