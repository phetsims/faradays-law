// Copyright 2002-2014, University of Colorado Boulder

/**
 * Simple toggle button with custom behavior, change border and opacity when off
 *
 * @author Vasily Shakhov (MLearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Vector2 = require( 'DOT/Vector2' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );

  /**
   * @param targetProperty - property to link value of button
   * @param onValue - value of targetProperty, when button is 'on'
   * @param contentNode
   * @param options
   * @constructor
   */
  var SimpleToggleButton = function( targetProperty, onValue, contentNode, options ) {
    var self = this;
    Node.call( this, { focusable: true } );

    options = _.extend( {
      width: 75,
      height: 75,
      stroke: '#000',
      lineWidth: 3,
      margin: 10,
      deselectedLineWidth: 1,
      borderRadius: 5,
      fill: '#cdd5f6'
    }, options );

    var background = new Rectangle( 0, 0, options.width, options.height, options.borderRadius, options.borderRadius, {
      fill: options.fill,
      centerX: 0,
      centerY: 0
    } );
    this.addChild( background );

    var outline = new Path( new Shape()
      .arc( -options.width / 2 + options.borderRadius, -options.height / 2 + options.borderRadius, options.borderRadius, -Math.PI, -Math.PI / 2, false )
      .arc( options.width / 2 - options.borderRadius, -options.height / 2 + options.borderRadius, options.borderRadius, -Math.PI / 2, 0, false )
      .arc( options.width / 2 - options.borderRadius, options.height / 2 - options.borderRadius, options.borderRadius, 0, Math.PI / 2, false )
      .arc( -options.width / 2 + options.borderRadius, options.height / 2 - options.borderRadius, options.borderRadius, Math.PI / 2, Math.PI, false )
      .lineTo( -options.width / 2, -options.height / 2 + options.borderRadius ), {
      stroke: options.stroke,
      lineWidth: options.deselectedLineWidth
    } );
    this.addChild( outline );
    this.addChild( contentNode );

    //scale contentNode
    var scaleFactor = Math.min( (options.width - options.margin) / contentNode.width, (options.height - options.margin) / contentNode.height );
    contentNode.scale( scaleFactor );
    contentNode.center = new Vector2( 0, 0 );

    this.touchArea = this.localBounds.dilated( 8 );

    targetProperty.link( function( value ) {
      if ( value !== onValue ) {
        self.opacity = 0.5;
        outline.lineWidth = options.deselectedLineWidth;
        self.cursor = 'pointer';
      }
      else {
        self.opacity = 1;
        outline.lineWidth = options.lineWidth;
        self.cursor = 'default';
      }
    } );

    this.addInputListener( new ButtonListener( {
      fire: function() {
        targetProperty.value = onValue;
      }
    } ) );
  };

  return inherit( Node, SimpleToggleButton );
} );