// Copyright 2020, University of Colorado Boulder

/**
 * A node that provides an interaction cue for interacting with the magnet in Faraday's Law.
 * When focused for the first time, arrow and letter keys will appear to indicate that the user can use WASD or arrow
 * keys to move it around the play area. After the first interaction, this will be invisible.
 *
 * @author Michael Barlow
 */

import Shape from '../../../../kite/js/Shape.js';
import inherit from '../../../../phet-core/js/inherit.js';
import TextKeyNode from '../../../../scenery-phet/js/keyboard/TextKeyNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import faradaysLaw from '../../faradaysLaw.js';

// constants
const ARROW_HEIGHT = 15; // dimensions for the arrow
const KEY_HEIGHT = 24; // height of the arrow key, larger than default KeyNode height
const ARROW_WIDTH = 1 / 2 * Math.sqrt( 3 ) * ARROW_HEIGHT; // for equilateral triangle
const TEXT_KEY_OPTIONS = { font: new PhetFont( 14 ), forceSquareKey: true, keyHeight: KEY_HEIGHT };
const KEY_ARROW_SPACING = 2;
const NODE_PADDING = 8;

// possible directions or the directional cues
const DIRECTION_ANGLES = {
  up: 0,
  down: Math.PI,
  left: -Math.PI / 2,
  right: Math.PI / 2
};

function MagnetInteractionCueNode() {

  Node.call( this );

  const a11yEnabled = phet.joist.sim.supportsInteractiveDescriptions;

  const wNode = a11yEnabled ? this.createA11yMovementKeyNode( 'up' ) : this.createMovementKeyNode( 'up' );
  const aNode = a11yEnabled ? this.createA11yMovementKeyNode( 'left' ) : this.createMovementKeyNode( 'left' );
  const sNode = a11yEnabled ? this.createA11yMovementKeyNode( 'down' ) : this.createMovementKeyNode( 'down' );
  const dNode = a11yEnabled ? this.createA11yMovementKeyNode( 'right' ) : this.createMovementKeyNode( 'right' );

  this.children = [ wNode, aNode, sNode, dNode ];

  // todo set positions of keys
  this.setKeyPositions = function( nodeBounds ) {
    aNode.rightCenter = nodeBounds.leftCenter.plusXY( -NODE_PADDING, 0 );
    dNode.leftCenter = nodeBounds.rightCenter.plusXY( NODE_PADDING, 0 );
    wNode.centerBottom = nodeBounds.centerTop.plusXY( 0, -NODE_PADDING );
    sNode.centerTop = nodeBounds.centerBottom.plusXY( 0, NODE_PADDING );
  };
}

faradaysLaw.register( 'MagnetInteractionCueNode', MagnetInteractionCueNode );

inherit( Node, MagnetInteractionCueNode, {

  createMovementKeyNode: function( direction ) {

    // create the arrow icon
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

    // determine direction dependent variables
    let box;
    if ( direction === 'up' ) {
      box = new VBox( { children: [ arrowIcon ], spacing: KEY_ARROW_SPACING } );
    }
    else if ( direction === 'left' ) {
      box = new HBox( { children: [ arrowIcon ], spacing: KEY_ARROW_SPACING } );
    }
    else if ( direction === 'right' ) {
      box = new HBox( { children: [ arrowIcon ], spacing: KEY_ARROW_SPACING } );
    }
    else if ( direction === 'down' ) {
      box = new VBox( { children: [ arrowIcon ], spacing: KEY_ARROW_SPACING } );
    }

    assert && assert( box, 'No box created for direction ' + direction );
    return box;
  },

  createA11yMovementKeyNode: function( direction ) {

    // create the arrow icon
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

    // determine direction dependent variables
    let keyIcon;
    let box;
    if ( direction === 'up' ) {
      keyIcon = new TextKeyNode( 'W', TEXT_KEY_OPTIONS );
      box = new VBox( { children: [ arrowIcon, keyIcon ], spacing: KEY_ARROW_SPACING } );
    }
    else if ( direction === 'left' ) {
      keyIcon = new TextKeyNode( 'A', TEXT_KEY_OPTIONS );
      box = new HBox( { children: [ arrowIcon, keyIcon ], spacing: KEY_ARROW_SPACING } );
    }
    else if ( direction === 'right' ) {
      keyIcon = new TextKeyNode( 'D', TEXT_KEY_OPTIONS );
      box = new HBox( { children: [ keyIcon, arrowIcon ], spacing: KEY_ARROW_SPACING } );
    }
    else if ( direction === 'down' ) {
      keyIcon = new TextKeyNode( 'S', TEXT_KEY_OPTIONS );
      box = new VBox( { children: [ keyIcon, arrowIcon ], spacing: KEY_ARROW_SPACING } );
    }

    assert && assert( box, 'No box created for direction ' + direction );
    return box;
  }
} );

export default MagnetInteractionCueNode;