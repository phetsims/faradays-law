// Copyright 2018, University of Colorado Boulder

/**
 *
 * A node that creates a "Scene Summary" accessible section in the pDOM. This type prevents duplicated code because
 * all scene summaries have the same label, structure, and intro sentence.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

define( function( require ) {
  'use strict';

  // modules
  var AccessibleSectionNode = require( 'SCENERY_PHET/accessibility/AccessibleSectionNode' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  var FaradaysLawA11yStrings = require( 'FARADAYS_LAW/FaradaysLawA11yStrings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var SceneryPhetA11yStrings = require( 'SCENERY_PHET/SceneryPhetA11yStrings' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // a11y strings
  var sceneSummarySingleScreenIntroString = SceneryPhetA11yStrings.sceneSummarySingleScreenIntro.value;
  var sceneSummaryString = SceneryPhetA11yStrings.sceneSummary.value;
  var playAreaContentDescriptionString = FaradaysLawA11yStrings.playAreaContentDescriptionString.value;
  var summaryCircuitHelpTextPatternString = FaradaysLawA11yStrings.summaryCircuitHelpTextPatternString.value;
  var aLightbulbString = FaradaysLawA11yStrings.aLightbulbString.value;
  var aVoltMeterString = FaradaysLawA11yStrings.aVoltMeterString.value;
  var aFourLoopCoilString = FaradaysLawA11yStrings.aFourLoopCoilString.value;
  var aTwoLoopCoilString = FaradaysLawA11yStrings.aTwoLoopCoilString.value;
  var twoItemPatternString = FaradaysLawA11yStrings.twoItemPatternString.value;
  var threeItemPatternString = FaradaysLawA11yStrings.threeItemPatternString.value;
  var fourItemPatternString = FaradaysLawA11yStrings.fourItemPatternString.value;
  var moveMagnetToPlayString = FaradaysLawA11yStrings.moveMagnetToPlayString.value;

  /**
   * @constructor
   * @param {string} sceneSummary - the text for the sim specific part of the intro paragraph
   * @param {Object} options
   */
  function FaradaysLawSceneSummaryNode( model, options ) {

    var self = this;

    this.voltMeterProperty = new BooleanProperty( true );

    // options for accessibility, but others can be passed to Node call
    options = _.extend( {
      multiscreen: false // to use the default multiscreen intro or single screen intro
    }, options );

    AccessibleSectionNode.call( this, sceneSummaryString, options );

    // different default string depending on if there are multiple screens
    var openingSummaryNode = new Node( { tagName: 'p', innerContent: sceneSummarySingleScreenIntroString } );

    var playAreaContentDescription = new Node( { tagName: 'p', innerContent: playAreaContentDescriptionString } );

    this.circuitDescriptionNode = new Node( { tagName: 'p' } );
    this.magnetDescriptionNode = new Node( { tagName: 'p' } );
    this.moveMagnetToPlayNode = new Node( { tagName: 'p', labelContent: moveMagnetToPlayString } );

    this.children = [
      openingSummaryNode,
      playAreaContentDescription,
      this.circuitDescriptionNode,
      this.magnetDescriptionNode,
      this.moveMagnetToPlayNode
    ];

    // link descriptions with properties
    Property.multilink( [ this.voltMeterProperty, model.showTopCoilProperty ], function( showVoltMeter, showTopCoil ) {
      self.updateCircuitDescription( showVoltMeter, showTopCoil );
    } );
  }

  faradaysLaw.register( 'FaradaysLawSceneSummaryNode', FaradaysLawSceneSummaryNode );

  return inherit( AccessibleSectionNode, FaradaysLawSceneSummaryNode, {

    constructCircuitPartsDescription: function( voltMeterDisplayed, twoCoilDisplayed ) {

      // a lightbulb and a four-loop coil
      // a lightbulb, a volt meter, and a four-loop coil
      // a lightbulb, a four-loop coil, and a two-loop coil
      // a lightbulb, a volt meter, a four-loop coil, and a two-loop coil

      var circuitParts = [ aLightbulbString ];
      var keys = [ 'first', 'second', 'third', 'fourth' ];
      var patternString = twoItemPatternString;

      if ( voltMeterDisplayed ) {
        circuitParts.push( aVoltMeterString );
      }

      circuitParts.push( aFourLoopCoilString );

      if ( twoCoilDisplayed ) {
        circuitParts.push( aTwoLoopCoilString );
      }

      if ( circuitParts.length === 3 ) {
        patternString = threeItemPatternString;
      } else if ( circuitParts.length === 4 ) {
        patternString = fourItemPatternString;
      }

      var partsObject = {};

      for ( var i = 0; i < circuitParts.length; i++ ) {
        partsObject[ keys[ i ] ] = circuitParts[ i ];
      }

      return StringUtils.fillIn( patternString, partsObject );
    },

    updateCircuitDescription: function( showVM, showTC ) {
      var partsString = this.constructCircuitPartsDescription( showVM, showTC );
      var newInnerContent = StringUtils.fillIn( summaryCircuitHelpTextPatternString, { circuitParts: partsString } );
      this.circuitDescriptionNode.innerContent = newInnerContent;
    }
  } );
} );
