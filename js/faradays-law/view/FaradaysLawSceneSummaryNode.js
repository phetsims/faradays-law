// Copyright 2018, University of Colorado Boulder

/**
 *
 * A node that creates a "Scene Summary" accessible section in the pDOM. This type prevents duplicated code because
 * all scene summaries have the same label, structure, and intro sentence.
 *
 * @author Michael Barlow (PhET Interactive Simulations)
 */

define( function( require ) {
  'use strict';

  // modules
  var AccessibleSectionNode = require( 'SCENERY_PHET/accessibility/AccessibleSectionNode' );
  // var BooleanProperty = require( 'AXON/BooleanProperty' );
  var faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  var FaradaysLawA11yStrings = require( 'FARADAYS_LAW/FaradaysLawA11yStrings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MagnetPositionRegionMap = require( 'FARADAYS_LAW/faradays-law/view/MagnetPositionRegionMap' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var SceneryPhetA11yStrings = require( 'SCENERY_PHET/SceneryPhetA11yStrings' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // a11y strings
  var sceneSummarySingleScreenIntroString = SceneryPhetA11yStrings.sceneSummarySingleScreenIntro.value;
  var sceneSummaryString = SceneryPhetA11yStrings.sceneSummary.value;
  var playAreaContainsString = FaradaysLawA11yStrings.playAreaContainsString.value;
  var circuitAndCoilPatternString = FaradaysLawA11yStrings.circuitAndCoilPatternString.value;
  var magnetPositionPatternString = FaradaysLawA11yStrings.magnetPositionPatternString.value;
  // var coilProximityPatternString = FaradaysLawA11yStrings.coilProximityPatternString.value;
  // var aLightbulbString = FaradaysLawA11yStrings.aLightbulbString.value;
  var aFourLoopCoilString = FaradaysLawA11yStrings.aFourLoopCoilString.value;
  // var theFourLoopCoilString = FaradaysLawA11yStrings.theFourLoopCoilString.value;
  var aTwoLoopCoilString = FaradaysLawA11yStrings.aTwoLoopCoilString.value;
  // var theTwoLoopCoilString = FaradaysLawA11yStrings.theTwoLoopCoilString.value;
  var twoItemPatternString = FaradaysLawA11yStrings.twoItemPatternString.value;
  // var threeItemPatternString = FaradaysLawA11yStrings.threeItemPatternString.value;
  // var fourItemPatternString = FaradaysLawA11yStrings.fourItemPatternString.value;
  var moveMagnetToPlayString = FaradaysLawA11yStrings.moveMagnetToPlayString.value;

  // constants
  // var COILS_Y_MIDPOINT = 230;
  /**
   * @constructor
   * @param {string} sceneSummary - the text for the sim specific part of the intro paragraph
   * @param {Object} options
   */
  function FaradaysLawSceneSummaryNode( model, options ) {

    var self = this;

    this._magnetRegionMap = new MagnetPositionRegionMap( model.bounds );
    this._model = model;

    // options for accessibility, but others can be passed to Node call
    options = _.extend( {
      multiscreen: false // to use the default multiscreen intro or single screen intro
    }, options );

    AccessibleSectionNode.call( this, sceneSummaryString, options );

    // different default string depending on if there are multiple screens
    var openingSummaryNode = new Node( { tagName: 'p', innerContent: sceneSummarySingleScreenIntroString } );

    var playAreaContentDescription = new Node( { labelTagName: 'p', labelContent: playAreaContainsString } );

    var summaryListNode = new Node( { tagName: 'ul' } );
    playAreaContentDescription.addChild( summaryListNode );

    this.circuitDescriptionNode = new Node( { tagName: 'li' } );
    this.magnetDescriptionNode = new Node( { tagName: 'li' } );
    summaryListNode.addChild( this.circuitDescriptionNode );
    summaryListNode.addChild( this.magnetDescriptionNode );

    var moveMagnetToPlayNode = new Node( { tagName: 'p', labelContent: moveMagnetToPlayString } );

    this.children = [
      openingSummaryNode,
      playAreaContentDescription,
      moveMagnetToPlayNode
    ];

    // link descriptions with properties
    model.showTopCoilProperty.link( function( showTopCoil ) {
      self.updateCircuitDescription( showTopCoil );
    } );

    Property.multilink( [ model.showTopCoilProperty, model.magnet.positionProperty ], function( showTopCoil, magnetPosition ) {
      self.updateMagnetDescription( showTopCoil, magnetPosition );
    } );
  }

  faradaysLaw.register( 'FaradaysLawSceneSummaryNode', FaradaysLawSceneSummaryNode );

  return inherit( AccessibleSectionNode, FaradaysLawSceneSummaryNode, {

    constructCoilString: function( showTopCoil ) {

      if ( showTopCoil ) {
        return StringUtils.fillIn( twoItemPatternString, { first: aTwoLoopCoilString, second: aFourLoopCoilString } );
      }

      return aFourLoopCoilString;
    },

    updateCircuitDescription: function( showTopCoil ) {
      var partsString = this.constructCoilString( showTopCoil );
      var newInnerContent = StringUtils.fillIn( circuitAndCoilPatternString, { coilString: partsString } );
      this.circuitDescriptionNode.innerContent = newInnerContent;
    },

    updateMagnetDescription: function( magnetPosition ) {
      // body...
    },

    getMagnetLocationDescription: function( position ) {
      var location = this._magnetRegionMap.getRegionTextFromPoint( position );
      return StringUtils.fillIn( magnetPositionPatternString, { location: location } );
    },

    getMagnetProximityToCoilDescription: function( magnetPosition, coilPosition ) {
      // var pattern = coilProximityPatternString;
      // var coil = coilPosition > COILS_Y_MIDPOINT ? theFourLoopCoilString : theTwoLoopCoilString;
      //
      // var distance = coilPosition.distance( magnetPosition );
    }
  } );
} );
