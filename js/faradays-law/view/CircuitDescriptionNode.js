// Copyright 2018-2020, University of Colorado Boulder

/**
 *
 * Handles the logic of mapping the position of a Node (via its bounds) to a specified region in the sim. This map is
 * divided into 9 evenly divided regions.
 *
 * @author Michael Barlow (PhET Interactive Simulations)
 */


// modules
// const FaradaysLawConstants = require( '/faradays-law/js/faradays-law/FaradaysLawConstants' );
// const Vector2 = require( '/dot/js/Vector2' );
import Property from '../../../../axon/js/Property.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import faradaysLaw from '../../faradaysLaw.js';
import FaradaysLawA11yStrings from '../../FaradaysLawA11yStrings.js';
import MagnetDescriber from './MagnetDescriber.js';

// strings
const lightBulbCircuitLabelString = FaradaysLawA11yStrings.lightBulbCircuitLabel.value;
const lightBulbString = FaradaysLawA11yStrings.lightBulb.value;
const inTheCircuitString = FaradaysLawA11yStrings.inTheCircuit.value;
const fourLoopCoilString = FaradaysLawA11yStrings.fourLoopCoil.value;
const twoLoopCoilString = FaradaysLawA11yStrings.twoLoopCoil.value;
const voltmeterString = FaradaysLawA11yStrings.voltmeter.value;

function CircuitDescriptionNode( model, options ) {

  options = merge( {
    tagName: 'div',
    labelTagName: 'h3',
    labelContent: lightBulbCircuitLabelString
  }, options );

  Node.call( this, options );

  const dynamicChildrenNode = new Node();
  this.addChild( dynamicChildrenNode );

  const fourCoilOnlyNode = new Node( {
    tagName: 'p',
    innerContent: ''
  } );


  const otherComponentsNode = new Node( {
    tagName: 'ul',
    labelContent: inTheCircuitString,
    appendDescription: true
  } );

  model.topCoilVisibleProperty.link( showTopCoil => {
    otherComponentsNode.descriptionContent = MagnetDescriber.getCoilDescription( showTopCoil );
  } );

  model.voltmeterVisibleProperty.link( showVoltmeter => {
    fourCoilOnlyNode.innerContent = MagnetDescriber.getFourCoilOnlyDescription( showVoltmeter );
  } );

  const lightBulbItem = createListItemNode( lightBulbString );
  const fourLoopItem = createListItemNode( fourLoopCoilString );
  const twoLoopItem = createListItemNode( twoLoopCoilString );
  const voltmeterItem = createListItemNode( voltmeterString );

  Property.multilink(
    [ model.topCoilVisibleProperty, model.voltmeterVisibleProperty ],
    function( showTopCoil, showVoltmeter ) {
      if ( !showTopCoil ) {
        dynamicChildrenNode.children = [ fourCoilOnlyNode ];
      }
      else {
        const children = [ lightBulbItem ];
        children.push( fourLoopItem );
        showTopCoil && children.push( twoLoopItem );
        showVoltmeter && children.push( voltmeterItem );
        otherComponentsNode.children = children;
        dynamicChildrenNode.children = [ otherComponentsNode ];
      }
    }
  );
}

function createListItemNode( innerContent ) {
  return new Node( { tagName: 'li', innerContent: innerContent } );
}

faradaysLaw.register( 'CircuitDescriptionNode', CircuitDescriptionNode );

inherit( Node, CircuitDescriptionNode );
export default CircuitDescriptionNode;