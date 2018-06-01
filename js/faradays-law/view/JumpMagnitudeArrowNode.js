// Copyright 2018, University of Colorado Boulder

/**
 * A node that provides a visual cue for the speed of the magnet once the key is released.
 * The number of arrows displayed corresponds to the speed.
 *
 * @author Michael Barlow
 */

define( function ( require ) {
  'use strict';

  // modules
  var faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  var Node = require( 'SCENERY/nodes/Node' );

  function JumpMagnitudeArrowNode( magnitude, options ) {
      
      Node.call( this );
  }

  faradaysLaw.register( 'JumpMagnitudeArrowNode', JumpMagnitudeArrowNode );

  return JumpMagnitudeArrowNode;
} ); 