// Copyright 2018, University of Colorado Boulder

/**
 * A node that provides an interaction cue for interacting with the magnet in Faraday's Law.
 * When focused for the first time, arrow and letter keys will appear to indicate that the user can use WASD or arrow
 * keys to move it around the play area. After the first interaction, this will be invisible.
 *
 * @author Michael Barlow
 */

define( function( require ) {
  'use strict';

  var faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Shape = require( 'KITE/Shape' );
  var TextKeyNode = require( 'SCENERY_PHET/keyboard/TextKeyNode' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  var ARROW_HEIGHT = 15; // dimensions for the arrow
  var KEY_HEIGHT = 24; // height of the arrow key, larger than default KeyNode height
  var ARROW_WIDTH = 1 / 2 * Math.sqrt( 3 ) * ARROW_HEIGHT; // for equilateral triangle
  var TEXT_KEY_OPTIONS = { font: new PhetFont( 14 ), forceSquareKey: true, keyHeight: KEY_HEIGHT };
  var KEY_ARROW_SPACING = 2;
  var NODE_PADDING = 8;

  // possible directions or the directional cues
  var DIRECTION_ANGLES = {
    up: 0,
    down: Math.PI,
    left: -Math.PI / 2,
    right: Math.PI / 2
  };

  function MagnetInteractionCueNode() {

    Node.call( this );

    var a11yEnabled = phet.chipper.queryParameters.accessibility;

    var wNode = a11yEnabled ? this.createA11yMovementKeyNode( 'up' ) : this.createMovementKeyNode( 'up' );
    var aNode = a11yEnabled ? this.createA11yMovementKeyNode( 'left' ) : this.createMovementKeyNode( 'left' );
    var sNode = a11yEnabled ? this.createA11yMovementKeyNode( 'down' ) : this.createMovementKeyNode( 'down' );
    var dNode = a11yEnabled ? this.createA11yMovementKeyNode( 'right' ) : this.createMovementKeyNode( 'right' );

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

  return inherit( Node, MagnetInteractionCueNode, {

    createMovementKeyNode: function( direction ) {

      // create the arrow icon
      var arrowShape = new Shape();
      arrowShape.moveTo( ARROW_HEIGHT / 2, 0 ).lineTo( ARROW_HEIGHT, ARROW_WIDTH ).lineTo( 0, ARROW_WIDTH ).close();
      var arrowIcon = new Path( arrowShape, {
        fill: 'white',
        stroke: 'black',
        lineJoin: 'bevel',
        lineCap: 'butt',
        lineWidth: 2,
        rotation: DIRECTION_ANGLES[ direction ]
      } );

      // determine direction dependent variables
      var box;
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
      var arrowShape = new Shape();
      arrowShape.moveTo( ARROW_HEIGHT / 2, 0 ).lineTo( ARROW_HEIGHT, ARROW_WIDTH ).lineTo( 0, ARROW_WIDTH ).close();
      var arrowIcon = new Path( arrowShape, {
        fill: 'white',
        stroke: 'black',
        lineJoin: 'bevel',
        lineCap: 'butt',
        lineWidth: 2,
        rotation: DIRECTION_ANGLES[ direction ]
      } );

      // determine direction dependent variables
      var keyIcon;
      var box;
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
} );