// Copyright 2002-2014, University of Colorado Boulder

/**
 * Voltmeter for 'Faradays Law' simulation model
 *
 * @author Vasily Shakhov (MLearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Color = require( 'SCENERY/util/Color' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var VoltMeterScale = require( 'FARADAYS_LAW/faradays-law/view/VoltMeterScale' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Vector2 = require( 'DOT/Vector2' );
  var PlusNode = require( 'SCENERY_PHET/PlusNode' );
  var MinusNode = require( 'SCENERY_PHET/MinusNode' );
  var ShadedRectangle = require( 'SCENERY_PHET/ShadedRectangle' );
  var Dimension2 = require( 'DOT/Dimension2' );

  // strings
  var voltageString = require( 'string!FARADAYS_LAW/faradays-law.voltage' );

  // constants
  var TERMINAL_COLOR = '#C0C0C0';
  var TERMINAL_STROKE = '#000000';
  var TERMINAL_BORDER_RADIUS = 3;
  var OUTER_BORDER_RADIUS = 10;
  var DEFAULT_FONT = new PhetFont( 18 );

  /**
   * @param needleAngleProperty - angle of needle in voltmeter
   * @param {Object} [options]
   * @constructor
   */
  function VoltMeterNode( needleAngleProperty, options ) {
    Node.call( this );

    options = _.extend( {
      baseColor: new Color( '#232674' ),
      rectangleWidth: 170,
      rectangleHeight: 107,
      marginTop: 7,
      marginLeft: 5,
      marginRight: 5,
      marginBottom: 3,
      whiteRectangleHeight: 72,
      whiteRectangleWidth: 132,
      whiteRectangleBorderRadius: 5,
      textColor: 'yellow', //color of 'voltage' text
      terminalSize: 18, //size of terminals at the bottom of the voltmeter
      terminalSignSize: new Dimension2( 12, 2 ) //size of plus and minus signs
    }, options );

    this.addChild( new ShadedRectangle( new Bounds2( 0, 0, options.rectangleWidth, options.rectangleHeight ), {
      cornerRadius: OUTER_BORDER_RADIUS,
      baseColor: options.baseColor,
      center: Vector2.ZERO
    } ) );

    // white rectangle + controls inside
    var whiteRectangle = new Node();
    whiteRectangle.addChild( new Rectangle( -options.whiteRectangleWidth, -options.whiteRectangleHeight, options.whiteRectangleWidth, options.whiteRectangleHeight, options.whiteRectangleBorderRadius, options.whiteRectangleBorderRadius, {
      fill: '#FFF',
      centerX: 0
    } ) );

    //scale + needle
    whiteRectangle.addChild( new VoltMeterScale( needleAngleProperty, {
      bottom: -6
    } ) );

    // rectangle + text
    this.addChild( new VBox( {
      children: [
        whiteRectangle,
        new Text( voltageString, {
          font: DEFAULT_FONT,
          fill: options.textColor,
          centerX: 0
        } )
      ],
      spacing: -1,
      centerX: 0,
      centerY: (options.marginTop + 4) / 2
    } ) );

    //plus and minus terminals at the bottom
    this.plusNode = new Node();
    this.plusNode.addChild( new Rectangle( -options.terminalSize / 2, -options.terminalSize / 2, options.terminalSize, options.terminalSize, TERMINAL_BORDER_RADIUS, TERMINAL_BORDER_RADIUS, {
      fill: TERMINAL_COLOR,
      stroke: TERMINAL_STROKE
    } ) );
    this.plusNode.addChild( new PlusNode( {
      centerX: 0,
      centerY: 0,
      size: options.terminalSignSize
    } ) );
    this.addChild( this.plusNode );
    this.plusNode.center = new Vector2( options.terminalSize, options.rectangleHeight / 2 + options.terminalSize / 2 );

    this.minusNode = new Node();
    this.minusNode.addChild( new Rectangle( -options.terminalSize / 2, -options.terminalSize / 2, options.terminalSize, options.terminalSize, TERMINAL_BORDER_RADIUS, TERMINAL_BORDER_RADIUS, {
      fill: TERMINAL_COLOR,
      stroke: TERMINAL_STROKE
    } ) );
    this.minusNode.addChild( new MinusNode( {
      centerX: 0,
      centerY: 0,
      size: options.terminalSignSize
    } ) );
    this.addChild( this.minusNode );
    this.minusNode.center = new Vector2( -options.terminalSize, options.rectangleHeight / 2 + options.terminalSize / 2 );
  }

  return inherit( Node, VoltMeterNode );
} )
;
