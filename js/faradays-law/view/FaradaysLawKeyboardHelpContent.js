// Copyright 2020-2022, University of Colorado Boulder

/**
 * content for the "Keyboard Help" dialog that can be brought up from the sim's navigation bar
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import KeyboardHelpIconFactory from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpIconFactory.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import LetterKeyNode from '../../../../scenery-phet/js/keyboard/LetterKeyNode.js';
import { HBox } from '../../../../scenery/js/imports.js';
import faradaysLaw from '../../faradaysLaw.js';
import faradaysLawStrings from '../../faradaysLawStrings.js';

class FaradaysLawKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  constructor() {

    // make all the KeyboardHelpSection consistent in layout
    const maxWidth = 175; // empirically determined
    const grabReleaseHelpSection = KeyboardHelpSection.getGrabReleaseHelpSection(
      faradaysLawStrings.keyboardHelpDialog.barMagnet,
      faradaysLawStrings.keyboardHelpDialog.magnet,
      { textMaxWidth: maxWidth }
    );
    const basicActionsHelpSection = new BasicActionsKeyboardHelpSection( {
      withCheckboxContent: true
    } );
    const moveMagnetHelpSection = new MoveMagnetHelpSection( {
      textMaxWidth: maxWidth
    } );
    const autoSlideMagnetHelpSection = new AutoSlideMagnetHelpSection( {
      textMaxWidth: maxWidth
    } );

    KeyboardHelpSection.alignHelpSectionIcons( [ grabReleaseHelpSection, moveMagnetHelpSection, autoSlideMagnetHelpSection ] );

    const leftContent = [ grabReleaseHelpSection, moveMagnetHelpSection, autoSlideMagnetHelpSection ];
    const rightContent = [ basicActionsHelpSection ];
    super( leftContent, rightContent, {
      sectionSpacing: 10
    } );
  }
}

/**
 * @param {Object} [options]
 * @constructor
 */
class MoveMagnetHelpSection extends KeyboardHelpSection {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    // move grabbed magnet row
    const moveMagnetIcon = KeyboardHelpIconFactory.arrowOrWasdKeysRowIcon();
    const moveMagnetRow = KeyboardHelpSection.labelWithIcon(
      faradaysLawStrings.keyboardHelpDialog.moveGrabbedMagnet,
      moveMagnetIcon, {
        labelInnerContent: faradaysLawStrings.keyboardHelpDialog.moveGrabbedMagnetWith
      } );

    // move magnet slower row
    const shiftPlusArrowKeys = KeyboardHelpIconFactory.shiftPlusIcon( KeyboardHelpIconFactory.arrowKeysRowIcon() );
    const shiftPlusWASDKeys = KeyboardHelpIconFactory.shiftPlusIcon( KeyboardHelpIconFactory.wasdRowIcon() );
    const moveMagnetSlowerRow = KeyboardHelpSection.labelWithIconList(
      faradaysLawStrings.keyboardHelpDialog.moveGrabbedMagnetSlower,
      [ shiftPlusArrowKeys, shiftPlusWASDKeys ], {
        labelInnerContent: faradaysLawStrings.keyboardHelpDialog.moveGrabbedMagnetSlowerWith
      } );

    super( faradaysLawStrings.keyboardHelpDialog.moveGrabbedBarMagnet, [ moveMagnetRow, moveMagnetSlowerRow ], options );
  }
}

/**
 * @param {Object} [options]
 * @constructor
 */
class AutoSlideMagnetHelpSection extends KeyboardHelpSection {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    // row with text label and number icons
    const numberKeysIcon = new HBox( {
      children: [
        new LetterKeyNode( '1' ),
        new LetterKeyNode( '2' ),
        new LetterKeyNode( '3' )
      ],
      spacing: 1
    } );
    const moveGrabbedMagnetRow = KeyboardHelpSection.labelWithIcon(
      faradaysLawStrings.keyboardHelpDialog.autoSlideGrabbedBarMagnetText,
      numberKeysIcon, {
        labelInnerContent: faradaysLawStrings.keyboardHelpDialog.autoSlideGrabbedBarMagnetWith
      } );

    super( faradaysLawStrings.keyboardHelpDialog.autoSlideGrabbedBarMagnet, [ moveGrabbedMagnetRow ], options );
  }
}

faradaysLaw.register( 'FaradaysLawKeyboardHelpContent', FaradaysLawKeyboardHelpContent );

export default FaradaysLawKeyboardHelpContent;