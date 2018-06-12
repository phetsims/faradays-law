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
  var aString = FaradaysLawA11yStrings.aString.value;
  var andString = FaradaysLawA11yStrings.andString.value;
  var summaryCircuitHelpTextPatternString = FaradaysLawA11yStrings.summaryCircuitHelpTextPatternString.value;
  var voltMeterString = FaradaysLawA11yStrings.voltMeterString.value;
  var fourLoopCoilString = FaradaysLawA11yStrings.fourLoopCoilString.value;
  var twoLoopCoilString = FaradaysLawA11yStrings.twoLoopCoilString.value;
  // var spacePatternString = FaradaysLawA11yStrings.spacePatternString.value;
  // var spaceCommaPatternString = FaradaysLawA11yStrings.spaceCommaPatternString.value;
  var andAString = andString + ' ' + aString;

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

    this.children = [
      openingSummaryNode,
      playAreaContentDescription,
      this.circuitDescriptionNode,
      this.magnetDescriptionNode
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

      if ( ! ( voltMeterDisplayed || twoCoilDisplayed ) ) {
        return andAString + ' ' + fourLoopCoilString;
      }

      var partsString = ', ';

      if ( voltMeterDisplayed ) {
        partsString += aString + ' ' + voltMeterString + ', ';
      }

      if ( twoCoilDisplayed ) {
        partsString += aString + ' ' + fourLoopCoilString + ', ';
        partsString += andAString + ' ' + twoLoopCoilString + '.';
      } else {
        partsString += andAString + ' ' + fourLoopCoilString + '.';
      }

      return partsString;
    },

    updateCircuitDescription: function( showVM, showTC ) {
      var partsString = this.constructCircuitPartsDescription( showVM, showTC );
      var newInnerContent = StringUtils.fillIn( summaryCircuitHelpTextPatternString, { circuitParts: partsString } );
      this.circuitDescriptionNode.innerContent = newInnerContent;
    }
  } );
} );
