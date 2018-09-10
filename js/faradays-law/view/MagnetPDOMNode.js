// Copyright 2018, University of Colorado Boulder

define( require => {
  'use strict';

  // modules
  const faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  const FaradaysLawA11yStrings = require( 'FARADAYS_LAW/FaradaysLawA11yStrings' );
  const Node = require( 'SCENERY/nodes/Node' );


  // @a11y strings
  const barMagnetIsString = FaradaysLawA11yStrings.barMagnetIs.value; // The bar magnet is
  const magnetPolarityString = FaradaysLawA11yStrings.magnetPolarity.value;
  const fieldStrengthIsString = FaradaysLawA11yStrings.fieldStrengthIs.value;
  const fieldLinesString = FaradaysLawA11yStrings.fieldLines.value;

  class MagnetPDOMNode extends Node {

    constructor( describer ) {

      super();

      const fourCoilOnlyNode = new Node( {
        tagName: 'p'
      } );

      const locationItem = new Node( { tagName: 'li' } );
      const twoCoilProximityItem = new Node( { tagName: 'li' } );
      const fourCoilProximityItem = new Node( { tagName: 'li' } );

      const twoAndFourCoilNode = new Node( {
        tagName: 'ul',
        labelTagName: 'p',
        labelContent: barMagnetIsString,
        children: [ locationItem, fourCoilProximityItem, twoCoilProximityItem ]
      } );

      this.addChild( fourCoilOnlyNode );
      this.addChild( twoAndFourCoilNode );

      const northNode = new Node( { tagName: 'li', innerContent: describer.northPoleSideString } );
      const southNode = new Node( { tagName: 'li', innerContent: describer.southPoleSideString } );

      const polarityNode = new Node(
        {
          tagName: 'ul',
          labelTagName: 'p',
          labelContent: magnetPolarityString,
          children: [ northNode, southNode ]
        }
      );

      this.addChild( polarityNode );

      const fourLoopOnlyStrengthNode = new Node( { tagName: 'p' } );

      const fourLoopFieldStrengthItem = new Node( { tagName: 'li' } );
      const twoLoopFieldStrengthItem = new Node( { tagName: 'li' } );
      const twoLoopStrengthListNode = new Node( {
        tagName: 'ul',
        labelTagName: 'p',
        labelContent: fieldStrengthIsString,
        children: [ fourLoopFieldStrengthItem, twoLoopFieldStrengthItem ]
      } );

      const fieldLinesDescriptionNode = new Node( {
        labelTagName: 'h3',
        labelContent: fieldLinesString,
        tagName: 'div',
        descriptionTagName: 'p',
        children: [ fourLoopOnlyStrengthNode, twoLoopStrengthListNode ]
      } );

      this.addChild( fieldLinesDescriptionNode );

      // @public - methods are registered in the constructor to allow access to the above nodes without making
      // the nodes themselves public

      /**
       * Updates the inner content of all children. The describer dynamically sets the strings by watching the model
       * and RegionManager.
       */
      this.updatePositionDescription = () => {

        // magnet location and coil proximity description content updates
        fourCoilOnlyNode.innerContent = describer.fourLoopOnlyMagnetPosition;
        locationItem.innerContent = describer.positionOfPlayAreaString;
        twoCoilProximityItem.innerContent = describer.twoCoilProximityString;
        fourCoilProximityItem.innerContent = describer.fourCoilProximityString;

        // field strength description content updates
        fourLoopOnlyStrengthNode.innerContent = describer.fourLoopOnlyFieldStrength;
        fourLoopFieldStrengthItem.innerContent = describer.fourLoopFieldStrength;
        twoLoopFieldStrengthItem.innerContent = describer.twoLoopFieldStrength;
      };

      /**
       * Shows/hides the appropriate description/help text node.
       *
       * @param  {boolean} showTopCoil
       */
      this.updateNodeVisibility = showTopCoil => {
        fourCoilOnlyNode.visible = !showTopCoil;
        twoAndFourCoilNode.visible = showTopCoil;

        // ensure that the parent node is also visible
        fourLoopOnlyStrengthNode.visible = fieldLinesDescriptionNode.visible && !showTopCoil;
        twoLoopStrengthListNode.visible = fieldLinesDescriptionNode && showTopCoil;
      };

      /**
       * Changes the inner content of the polarity description node.
       *
       * @param  {String} orientation one of OrientationEnum
       */
      this.updateOrientationDescription = orientation => {

        // N/S orientation change alert
        northNode.innerContent = describer.northPoleSideString;
        southNode.innerContent = describer.southPoleSideString;
        fieldLinesDescriptionNode.descriptionContent = describer.fieldLinesDescription;
      };

      /**
       * Sets the visibility of the field lines description node.
       *
       * @param  {boolean} showFieldLines
       */
      this.updateFieldLinesDescriptionVisibility = showFieldLines => {
        fieldLinesDescriptionNode.visible = showFieldLines;
      };
    }
  }

  return faradaysLaw.register( 'MagnetPDOMNode', MagnetPDOMNode );
} );