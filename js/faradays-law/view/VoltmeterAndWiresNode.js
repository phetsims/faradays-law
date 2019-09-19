// Copyright 2018, University of Colorado Boulder

/**
 * A Node that holds the Voltmeter and the Voltmeter wires. This is handy for phet-io because we want both of these
 * child nodes to be controlled in the same way (with visibility, opacity etc).
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  const FaradaysLawConstants = require( 'FARADAYS_LAW/faradays-law/FaradaysLawConstants' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const VoltmeterNode = require( 'FARADAYS_LAW/faradays-law/view/VoltmeterNode' );
  const VoltmeterWiresNode = require( 'FARADAYS_LAW/faradays-law/view/VoltmeterWiresNode' );

  /**
   * @param {NumberProperty} needleAngleProperty - angle of needle in voltmeter
   * @param {Tandem} tandem
   * @param {Object} [options]
   * @constructor
   */
  function VoltmeterAndWiresNode( needleAngleProperty, tandem, options ) {

    options = _.extend( {
      tandem: tandem,
      phetioDocumentation: 'The voltmeter and its connecting wires'
    }, options );

    Node.call( this, options );

    // pass an unmodified tandem in so that the VoltmeterNode's children look the this types children.
    const voltmeterNode = new VoltmeterNode( needleAngleProperty, tandem );
    const voltmeterWiresNode = new VoltmeterWiresNode( voltmeterNode );
    voltmeterNode.center = FaradaysLawConstants.VOLTMETER_POSITION;

    this.children = [ voltmeterNode, voltmeterWiresNode ];
  }

  faradaysLaw.register( 'VoltmeterAndWiresNode', VoltmeterAndWiresNode );

  return inherit( Node, VoltmeterAndWiresNode );
} );