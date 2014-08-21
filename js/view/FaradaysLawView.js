// Copyright 2002-2014, University of Colorado Boulder

/**
 * Scene graph for the 'Faradays Law' screen.
 *
 * @author Vasily Shakhov (MLearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ScreenView = require( 'JOIST/ScreenView' );

  /**
   * @param {gameModel} model - Faradays law simulation model object
   * @constructor
   */
  function FaradaysLawView( model ) {
    var self = this;
    ScreenView.call( this, { renderer: 'svg' } );

    this.model = model;
  }

  return inherit( ScreenView, FaradaysLawView, {
  } );
} )
;
