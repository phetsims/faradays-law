// Copyright 2014-2020, University of Colorado Boulder

/**
 * Voltmeter gauge (panel with needle) for 'Faradays Law'
 *
 * @author Vasily Shakhov (MLearner)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import Utils from '../../../../dot/js/Utils.js';
import Shape from '../../../../kite/js/Shape.js';
import inherit from '../../../../phet-core/js/inherit.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import MinusNode from '../../../../scenery-phet/js/MinusNode.js';
import PlusNode from '../../../../scenery-phet/js/PlusNode.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import faradaysLaw from '../../faradaysLaw.js';

/**
 * @param {NumberProperty} needleAngleProperty - angle of needle in voltmeter
 * @param {Object} [options]
 * @constructor
 */
function VoltmeterGauge( needleAngleProperty, options ) {
  Node.call( this );
  const arcRadius = 55; // radius of voltmeter scale
  const needleColor = '#3954a5'; // blue

  // background panel within which the needle moves
  const background = new Path( new Shape()
    .moveTo( 0, 0 )
    .lineTo( 0, -arcRadius )
    .moveTo( -arcRadius, 0 )
    .arc( 0, 0, arcRadius, -Math.PI, 0, false )
    .lineTo( -arcRadius, 0 )
    .close(), {
    stroke: 'black',
    lineWidth: 1
  } );
  this.addChild( background );

  // plus and minus signs
  this.addChild( new PlusNode( {
    centerX: arcRadius / 2.3,
    centerY: -arcRadius / 2.5,
    size: new Dimension2( 12, 2 )
  } ) );
  this.addChild( new MinusNode( {
    centerX: -arcRadius / 2.3,
    centerY: -arcRadius / 2.5,
    size: new Dimension2( 12, 2 )
  } ) );

  // needle base
  this.addChild( new Circle( 4, {
    fill: needleColor
  } ) );

  // needle
  const needleArrowNode = new ArrowNode( 0, 0, 0, -53, {
    headHeight: 12,
    headWidth: 8,
    tailWidth: 2,
    fill: needleColor,
    lineWidth: 0
  } );
  this.addChild( needleArrowNode );

  // observers
  needleAngleProperty.link( function( needleAngle ) {
    needleArrowNode.rotation = Utils.clamp( needleAngle, -Math.PI / 2, Math.PI / 2 );
  } );

  this.mutate( options );
}

faradaysLaw.register( 'VoltmeterGauge', VoltmeterGauge );

inherit( Node, VoltmeterGauge );
export default VoltmeterGauge;