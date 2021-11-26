// Copyright 2018-2021, University of Colorado Boulder

/**
 *
 * Handles the logic of mapping the position of a Node (via its bounds) to a specified region in the sim. This map is
 * divided into 9 evenly divided regions.
 *
 * @author Michael Barlow (PhET Interactive Simulations)
 */

// modules
import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import { Node } from '../../../../scenery/js/imports.js';
import faradaysLaw from '../../faradaysLaw.js';
import faradaysLawStrings from '../../faradaysLawStrings.js';
import MagnetDescriber from './MagnetDescriber.js';

// strings
const lightBulbCircuitLabelString = faradaysLawStrings.a11y.lightBulbCircuitLabel;
const lightBulbString = faradaysLawStrings.a11y.lightBulb;
const inTheCircuitString = faradaysLawStrings.a11y.inTheCircuit;
const fourLoopCoilString = faradaysLawStrings.a11y.fourLoopCoil;
const twoLoopCoilString = faradaysLawStrings.a11y.twoLoopCoil;
const voltmeterString = faradaysLawStrings.a11y.voltmeter;

class CircuitDescriptionNode extends Node {

  /**
   * @param {FaradaysLawModel} model
   * @param {Object} [options]
   */
  constructor( model, options ) {

    options = merge( {
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: lightBulbCircuitLabelString
    }, options );

    super( options );

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
      ( showTopCoil, showVoltmeter ) => {
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
}

function createListItemNode( innerContent ) {
  return new Node( { tagName: 'li', innerContent: innerContent } );
}

faradaysLaw.register( 'CircuitDescriptionNode', CircuitDescriptionNode );
export default CircuitDescriptionNode;