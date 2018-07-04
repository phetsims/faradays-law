// Copyright 2014-2018, University of Colorado Boulder

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
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  // var Range = require( 'DOT/Range' );
  // var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  // var Util = require( 'DOT/Util' );

  // strings
  var lightBulbCircuitLabelString = FaradaysLawA11yStrings.lightBulbCircuitLabelString.value;
  var circuitFourCoilOnlyString = FaradaysLawA11yStrings.circuitFourCoilOnlyString.value;

  function CircuitDescriptionNode ( model, options ) {

    var self = this;

    options = _.extend( {
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: lightBulbCircuitLabelString
    }, options );

    Node.call( this, options );

    var fourCoilOnlyNode = new Node( {
      tagName: 'p',
      innerContent: circuitFourCoilOnlyString
    } );

    var otherComponentsNode = new Node( {
      tagName: 'ul',
      labelTagName: 'p',
      labelContent: 'In circuit are a:',
      descriptionTagName: 'p',
      descriptionContent: 'The coils are open on the left and right - the bar magnet to pass through.',
      appendDescription: true
    } );

    var fourLoopItem = new Node( { tagName: 'li', innerContent: '4 loop coil' } );
    var twoLoopItem = new Node( { tagName: 'li', innerContent: '2 loop coil' } );
    var voltmeterItem = new Node( { tagName: 'li', innerContent: 'Voltmeter' } );

    Property.multilink(
      [ model.showTopCoilProperty, model.showVoltmeterProperty ],
      function( showTopCoil, showVoltmeter ) {
        if ( !( showTopCoil || showVoltmeter ) ) {
          self.children = [ fourCoilOnlyNode ];
        } else {
          var children = [];
          children.push( fourLoopItem );
          showTopCoil && children.push( twoLoopItem );
          showVoltmeter && children.push( voltmeterItem );
          otherComponentsNode.children = children;
          self.children = [ otherComponentsNode ];
        }
      }
    );
  }

  faradaysLaw.register( 'CircuitDescriptionNode', CircuitDescriptionNode );

  return inherit( Node, CircuitDescriptionNode );
} );