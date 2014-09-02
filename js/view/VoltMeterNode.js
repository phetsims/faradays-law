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
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Color = require( 'SCENERY/util/Color' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var VoltMeterScale = require( 'FARADAYS_LAW/view/VoltMeterScale' );
  var Vector2 = require( 'DOT/Vector2' );
  var PlusNode = require( 'SCENERY_PHET/PlusNode' );
  var MinusNode = require( 'SCENERY_PHET/MinusNode' );
  var Dimension2 = require( 'DOT/Dimension2' );

  // strings
  var voltageString = require( 'string!FARADAYS_LAW/faradays-law.voltage' );

  /**
   * @param needleAngleProperty - angle of needle in voltmeter
   * @param options
   * @constructor
   */
  function VoltMeterNode( needleAngleProperty, options ) {
    Node.call( this );

    options = _.extend( {
      baseColor : new Color( "#232674" ),
      rectangleWidth: 170,
      rectangleHeight: 107,
      marginTop: 7,
      marginLeft: 5,
      marginRight: 5,
      marginBottom: 3,
      whiteRectangleHeight: 72,
      whiteRectangleWidth: 132,
      textColor: 'yellow', //color of 'voltage' text
      terminalSize: 18, //size of terminals at the bottom of the voltmeter
      terminalSignSize: new Dimension2( 12, 2 ) //size of plus and minus signs
    }, options );

    var transparentColor = new Color( options.baseColor.getRed(), options.baseColor.getGreen(), options.baseColor.getBlue(), 0 );

    // adding outer rectangle, background + vertical gradient
    this.addChild( new Rectangle( 0, 0, options.rectangleWidth, options.rectangleHeight, 10, 10, {
      fill: new LinearGradient( 0, 0, 0, options.rectangleHeight )
        .addColorStop( 0, options.baseColor.colorUtilsDarker( 0.35 ) )
        .addColorStop( 0.25, options.baseColor.colorUtilsBrighter( 0.3 ) )
        .addColorStop( 0.75, options.baseColor.colorUtilsBrighter( 0.3 ) )
        .addColorStop( 1, options.baseColor.colorUtilsDarker( 0.35 ) ),
      centerX: 0,
      centerY: 0
    } ) );

    // now rectangle for horizontal gradient
    this.addChild( new Rectangle( 0, 0, options.rectangleWidth, options.rectangleHeight, 10, 10, {
      fill: new LinearGradient( 0, 0, options.rectangleWidth, 0 )
        .addColorStop( 0, options.baseColor.colorUtilsDarker( 0.35 ) )
        .addColorStop( 0.1, transparentColor )
        .addColorStop( 0.9, transparentColor )
        .addColorStop( 1, options.baseColor.colorUtilsDarker( 0.35 ) ),
      centerX: 0,
      centerY: 0
    } ) );

    // inner rectangle
    this.addChild( new Rectangle( 0, 0, options.rectangleWidth - (options.marginLeft + options.marginRight), options.rectangleHeight - (options.marginTop + options.marginBottom), 5, 5, {
      fill: options.baseColor,
      stroke: new LinearGradient( 0, 0, 0, options.rectangleHeight )
        .addColorStop( 0, options.baseColor.colorUtilsBrighter( 0.2 ) )
        .addColorStop( 0.15, options.baseColor.colorUtilsBrighter( 0.05 ) ),
      centerX: 0,
      centerY: (options.marginTop - options.marginBottom) / 2
    } ) );

    // white rectangle + controls inside
    var whiteRectangle = new Node();
    whiteRectangle.addChild( new Rectangle( -options.whiteRectangleWidth, -options.whiteRectangleHeight, options.whiteRectangleWidth, options.whiteRectangleHeight, 5, 5, {
      fill: '#FFF',
      centerX: 0
    } ) );

    //scale + needle
    whiteRectangle.addChild( new VoltMeterScale( needleAngleProperty, {
      bottom: -10
    } ) );

    // rectangle + text
    this.addChild( new VBox( {
      children: [
        whiteRectangle,
        new Text( voltageString, {
          font: new PhetFont( 18 ),
          fill: options.textColor,
          centerX: 0
        } )
      ],
      spacing: -1,
      centerX: 0,
      centerY: (options.marginTop + 4) / 2
    } ) );

    //plus and minus terminals at the bottom
    var plusNode = new Node();
    plusNode.addChild( new Rectangle( -options.terminalSize / 2, -options.terminalSize / 2, options.terminalSize, options.terminalSize, 3, 3, {
      fill: '#999999'
    } ) );
    plusNode.addChild( new PlusNode( {
      centerX: 0,
      centerY: 0,
      size: options.terminalSignSize
    } ) );
    this.addChild( plusNode );
    plusNode.center = new Vector2( options.terminalSize, options.rectangleHeight / 2 + options.terminalSize / 2 );

    var minusNode = new Node();
    minusNode.addChild( new Rectangle( -options.terminalSize / 2, -options.terminalSize / 2, options.terminalSize, options.terminalSize, 3, 3, {
      fill: '#999999'
    } ) );
    minusNode.addChild( new MinusNode( {
      centerX: 0,
      centerY: 0,
      size: options.terminalSignSize
    } ) );
    this.addChild( minusNode );
    minusNode.center = new Vector2( -options.terminalSize + 3, options.rectangleHeight / 2 + options.terminalSize / 2 );
  }

  return inherit( Node, VoltMeterNode );
} )
;
