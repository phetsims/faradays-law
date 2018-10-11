// Copyright 2018, University of Colorado Boulder

/**
 *
 * Handles the logic of mapping the position of a Node (via its bounds) to a specified region in the sim. This map is
 * divided into 9 evenly divided regions.
 *
 * @author Michael Barlow (PhET Interactive Simulations)
 */

define( function( require ) {
  'use strict';

  // modules
  var faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  var FaradaysLawA11yStrings = require( 'FARADAYS_LAW/FaradaysLawA11yStrings' );
  // var FaradaysLawConstants = require( 'FARADAYS_LAW/faradays-law/FaradaysLawConstants' );
  // var Vector2 = require( 'DOT/Vector2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MagnetDescriber = require( 'FARADAYS_LAW/faradays-law/view/MagnetDescriber' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );

  // strings
  var lightBulbCircuitLabelString = FaradaysLawA11yStrings.lightBulbCircuitLabel.value;
  var lightBulbString = FaradaysLawA11yStrings.lightBulb.value;
  var inTheCircuitString = FaradaysLawA11yStrings.inTheCircuit.value;
  var fourLoopCoilString = FaradaysLawA11yStrings.fourLoopCoil.value;
  var twoLoopCoilString = FaradaysLawA11yStrings.twoLoopCoil.value;
  var voltmeterString = FaradaysLawA11yStrings.voltmeter.value;

  function CircuitDescriptionNode ( model, options ) {

    options = _.extend( {
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: lightBulbCircuitLabelString
    }, options );

    Node.call( this, options );

    var dynamicChildrenNode = new Node();
    this.addChild( dynamicChildrenNode );

    var fourCoilOnlyNode = new Node( {
      tagName: 'p',
      innerContent: ''
    } );


    var otherComponentsNode = new Node( {
      tagName: 'ul',
      labelTagName: 'p',
      labelContent: inTheCircuitString,
      descriptionTagName: 'p',
      appendDescription: true
    } );

    model.topCoilVisibleProperty.link( showTopCoil => {
      otherComponentsNode.descriptionContent = MagnetDescriber.getCoilDescription( showTopCoil );
    } );

    model.voltmeterVisibleProperty.link( showVoltmeter => {
      fourCoilOnlyNode.innerContent = MagnetDescriber.getFourCoilOnlyDescription( showVoltmeter );
    } );

    var lightBulbItem = createListItemNode( lightBulbString );
    var fourLoopItem = createListItemNode( fourLoopCoilString );
    var twoLoopItem = createListItemNode( twoLoopCoilString );
    var voltmeterItem = createListItemNode( voltmeterString );

    Property.multilink(
      [ model.topCoilVisibleProperty, model.voltmeterVisibleProperty ],
      function( showTopCoil, showVoltmeter ) {
        if ( !showTopCoil ) {
          dynamicChildrenNode.children = [ fourCoilOnlyNode ];
        } else {
          var children = [ lightBulbItem  ];
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

  return inherit( Node, CircuitDescriptionNode );
} );