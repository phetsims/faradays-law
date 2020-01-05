// Copyright 2018-2020, University of Colorado Boulder

/**
 * A node that provides a visual cue for the speed of the magnet once the key is released.
 * The number of arrows displayed corresponds to the speed.
 *
 * @author Michael Barlow
 */
define( require => {
  'use strict';

  // modules
  const faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Shape = require( 'KITE/Shape' );

  // constants
  const ARROW_HEIGHT = 20; // dimensions for the arrow 
  const ARROW_WIDTH = 1 / 2 * Math.sqrt( 3 ) * ARROW_HEIGHT; // for equilateral triangle
  const ARROW_SPACING = 5;
  const NODE_PADDING = 8;

  // possible directions or the directional cues
  const DIRECTION_ANGLES = {
    left: -Math.PI / 2,
    right: Math.PI / 2
  };

  function JumpMagnitudeArrowNode( direction, options ) {

    this.arrows = [];

    while ( this.arrows.length < 3 ) {
      this.arrows.push( this.createArrow( direction ) );
    }

    const arrowsContainer = new HBox( { children: this.arrows, spacing: ARROW_SPACING } );

    if ( direction === 'left' ) {
      this.arrows = this.arrows.reverse();
    }

    Node.call( this );

    this.addChild( arrowsContainer );

    // position the arrows
    this.setKeyPositions = function( nodeBounds ) {
      if ( direction === 'left' ) {
        arrowsContainer.rightCenter = nodeBounds.leftCenter.plusXY( -NODE_PADDING, 0 );
      }
      else {
        arrowsContainer.leftCenter = nodeBounds.rightCenter.plusXY( NODE_PADDING, 0 );
      }
    };
  }

  faradaysLaw.register( 'JumpMagnitudeArrowNode', JumpMagnitudeArrowNode );

  return inherit( Node, JumpMagnitudeArrowNode, {

    createArrow: function( direction ) {
      const arrowShape = new Shape();
      arrowShape.moveTo( ARROW_HEIGHT / 2, 0 ).lineTo( ARROW_HEIGHT, ARROW_WIDTH ).lineTo( 0, ARROW_WIDTH ).close();
      const arrowIcon = new Path( arrowShape, {
        fill: 'white',
        stroke: 'black',
        lineJoin: 'bevel',
        lineCap: 'butt',
        lineWidth: 2,
        rotation: DIRECTION_ANGLES[ direction ]
      } );

      arrowIcon.visible = false;

      return arrowIcon;
    },

    showCue: function( magnitude ) {
      for ( let i = 0; i < magnitude; i++ ) {
        this.arrows[ i ].visible = true;
      }
    },

    hideCue: function() {
      for ( let i = 0; i < this.arrows.length; i++ ) {
        this.arrows[ i ].visible = false;
      }
    }
  } );
} );