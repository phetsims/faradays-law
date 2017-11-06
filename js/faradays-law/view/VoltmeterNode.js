// Copyright 2014-2017, University of Colorado Boulder

/**
 * Voltmeter for 'Faradays Law' simulation model
 *
 * @author Vasily Shakhov (MLearner)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var Color = require( 'SCENERY/util/Color' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MinusNode = require( 'SCENERY_PHET/MinusNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PlusNode = require( 'SCENERY_PHET/PlusNode' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ShadedRectangle = require( 'SCENERY_PHET/ShadedRectangle' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Vector2 = require( 'DOT/Vector2' );
  var VoltmeterScale = require( 'FARADAYS_LAW/faradays-law/view/VoltmeterScale' );

  // strings
  var faradaysLawVoltageString = require( 'string!FARADAYS_LAW/faradays-law.voltage' );

  // constants
  var TERMINAL_COLOR = '#C0C0C0';
  var TERMINAL_STROKE = '#000000';
  var TERMINAL_BORDER_RADIUS = 3;
  var OUTER_BORDER_RADIUS = 10;
  var DEFAULT_FONT = new PhetFont( 18 );

  /**
   * @param needleAngleProperty - angle of needle in voltmeter
   * @param {Tandem} tandem
   * @param {Object} [options]
   * @constructor
   */
  function VoltmeterNode( needleAngleProperty, tandem, options ) {
    Node.call( this, {
      tandem: tandem
    } );

    options = _.extend( {
      baseColor: new Color( '#232674' ),
      rectangleWidth: 170,
      rectangleHeight: 107,
      marginTop: 7,
      marginLeft: 5,
      marginRight: 5,
      marginBottom: 3,
      readoutHeight: 72,
      readoutWidth: 132,
      readoutBorderRadius: 5,
      textColor: 'yellow', //color of 'voltage' text
      terminalSize: 18, //size of terminals at the bottom of the voltmeter
      terminalSignSize: new Dimension2( 12, 2 ) //size of plus and minus signs
    }, options );

    var background = new ShadedRectangle( new Bounds2( 0, 0, options.rectangleWidth, options.rectangleHeight ), {
      cornerRadius: OUTER_BORDER_RADIUS,
      baseColor: options.baseColor,
      center: Vector2.ZERO
    } );
    this.addChild( background );

    // background rectangle with a deflecting needle meter inside
    var readoutBackground = new Rectangle( 0, 0, options.readoutWidth, options.readoutHeight, {
      cornerRadius: options.readoutBorderRadius,
      fill: '#FFF',
      centerX: 0,
      centerY: -5 // empirically determined to allow space for the label under the readout
    } );

    // scale + needle
    readoutBackground.addChild( new VoltmeterScale( needleAngleProperty, {
      centerX: readoutBackground.width / 2,
      centerY: readoutBackground.height / 2
    } ) );
    this.addChild( readoutBackground );

    // create the label and scale it if it's too long
    var label = new Text( faradaysLawVoltageString, {
      font: DEFAULT_FONT,
      fill: options.textColor,
      tandem: tandem.createTandem( 'label' ),
      maxWidth: options.readoutWidth // Support PhET-iO
    } );
    label.scale( Math.min( readoutBackground.width / label.width, 1 ) );

    // position and add the label
    label.centerX = 0;
    label.centerY = (readoutBackground.bottom + background.bottom) * 0.48; // position a little above exactly between edges

    // When the text changes (via PhET-iO), re-center it
    label.on( 'text', function() {
      label.centerX = 0;
    } );
    this.addChild( label );

    // add the plus and minus terminals at the bottom
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

  faradaysLaw.register( 'VoltmeterNode', VoltmeterNode );

  return inherit( Node, VoltmeterNode );
} );