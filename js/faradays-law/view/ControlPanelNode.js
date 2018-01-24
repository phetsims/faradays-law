// Copyright 2014-2018, University of Colorado Boulder

/**
 * Control panel for 'Faradays Law' simulation.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Checkbox = require( 'SUN/Checkbox' );
  var CoilNode = require( 'FARADAYS_LAW/faradays-law/view/CoilNode' );
  var CoilTypeEnum = require( 'FARADAYS_LAW/faradays-law/view/CoilTypeEnum' );
  var faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  var FlipMagnetButton = require( 'FARADAYS_LAW/faradays-law/view/FlipMagnetButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var OrientationEnum = require( 'FARADAYS_LAW/faradays-law/model/OrientationEnum' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var faradaysLawShowFieldLinesString = require( 'string!FARADAYS_LAW/faradays-law.showFieldLines' );

  /**
   * @param {FaradaysLawModel} model
   * @param {Tandem} tandem
   * @constructor
   */
  function ControlPanelNode( model, tandem ) {
    Node.call( this );

    // reset button
    var resetAllButton = new ResetAllButton( {
      listener: model.reset.bind( model ),
      right: model.bounds.maxX - 10,
      bottom: 0,
      scale: 0.75,
      touchAreaDilation: 10,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );

    // flip magnet button
    var flipMagnetButton = new FlipMagnetButton( tandem.createTandem( 'flipMagnetButton' ), {
      listener: function() {
        model.magnet.orientationProperty.set( OrientationEnum.opposite( model.magnet.orientationProperty.get() ) );
      },
      bottom: 0,
      right: model.bounds.maxX - 110
    } );
    this.addChild( flipMagnetButton );

    // add radio button group for showing/hiding the second coil
    var coilButtonGroupOptions = {
      spacing: 10,
      align: 'left',
      scale: 0.21
    };

    var coilButtonGroupContents = [ {
      value: false,
      node: new VBox( _.extend( {
        children: [
          new CoilNode( CoilTypeEnum.TWO_COIL, { visible: false } ),
          new CoilNode( CoilTypeEnum.FOUR_COIL )
        ]
      }, coilButtonGroupOptions ) ),
      tandemName: 'singleCoilRadioButton'
    }, {
      value: true,
      node: new VBox( _.extend( {
        children: [
          new CoilNode( CoilTypeEnum.TWO_COIL ),
          new CoilNode( CoilTypeEnum.FOUR_COIL )
        ]
      }, coilButtonGroupOptions ) ),
      tandemName: 'doubleCoilRadioButton'
    } ];

    var coilRadioButtonGroup = new RadioButtonGroup( model.showTopCoilProperty, coilButtonGroupContents, {
      buttonContentXMargin: 20,
      buttonContentYMargin: 4,
      left: 377,
      bottom: 0,
      orientation: 'horizontal',
      baseColor: '#cdd5f6', // lavender-ish
      selectedLineWidth: 3,
      deselectedLineWidth: 1,
      tandem: tandem.createTandem( 'coilRadioButtonGroup' )
    } );

    this.addChild( coilRadioButtonGroup );

    // Create the label for the "Show Field Lines" checkbox, scaling it if it's too long.
    var showFieldLinesLabel = new Text( faradaysLawShowFieldLinesString, { font: new PhetFont( 16 ) } );
    showFieldLinesLabel.scale( Math.min( 150 / showFieldLinesLabel.width, 1 ) ); // max width empirically determined

    // show field lines
    var showFieldCheckbox = new Checkbox( showFieldLinesLabel, model.magnet.showFieldLinesProperty, {
      x: 174,
      centerY: coilRadioButtonGroup.centerY,
      tandem: tandem.createTandem( 'showFieldCheckbox' )
    } );
    showFieldCheckbox.touchArea = showFieldCheckbox.localBounds.dilated( 8 );
    this.addChild( showFieldCheckbox );

    this.bottom = model.bounds.maxY - 10;

    // a11y keyboard nav order
    this.accessibleOrder = [ showFieldCheckbox, coilRadioButtonGroup, flipMagnetButton, resetAllButton ];
  }

  faradaysLaw.register( 'ControlPanelNode', ControlPanelNode );

  return inherit( Node, ControlPanelNode );
} );