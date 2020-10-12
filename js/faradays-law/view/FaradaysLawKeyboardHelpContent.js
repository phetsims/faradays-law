// Copyright 2020, University of Colorado Boulder

/**
 * content for the "Keyboard Help" dialog that can be brought up from the sim's navigation bar
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import GeneralKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/GeneralKeyboardHelpSection.js';
import KeyboardHelpIconFactory from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpIconFactory.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import LetterKeyNode from '../../../../scenery-phet/js/keyboard/LetterKeyNode.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import faradaysLaw from '../../faradaysLaw.js';

// TODO: String need to move into string file once finalized, see https://github.com/phetsims/faradays-law/issues/176.

// constants
const moveMagnetString = 'Move grabbed magnet';
const moveMagnetSlowerString = 'Move magnet slower';
// const pressAndHoldString = 'Press and hold Arrow key or letter key for continuous movement.';

const moveMagnetWithString = 'Move grabbed magnet up, left, down, or right with Arrow keys, or with letter keys W, A, S, or D.';
const moveMagnetSlowerWithString = 'Move slower with Shift plus Arrow keys, or Shift plus letter keys W, A, S, or D.';

class FaradaysLawKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  constructor() {

    // make all the KeyboardHelpSection consistent in layout
    const maxWidth = 175;
    const grabReleaseHelpSection = KeyboardHelpSection.getGrabReleaseHelpSection( 'Bar Magnet', 'bar magnet', {
      labelMaxWidth: maxWidth
    } );
    const generalNavigationHelpSection = new GeneralKeyboardHelpSection();
    const moveMagnetHelpSection = new MoveMagnetHelpSection( {
      labelMaxWidth: maxWidth
    } );
    const autoSlideMagnetHelpSection = new AutoSlideMagnetHelpSection( {
      labelMaxWidth: maxWidth
    } );

    KeyboardHelpSection.alignHelpSectionIcons( [ grabReleaseHelpSection, moveMagnetHelpSection, autoSlideMagnetHelpSection ] );

    const leftContent = [ grabReleaseHelpSection, moveMagnetHelpSection, autoSlideMagnetHelpSection ];
    const rightContent = [ generalNavigationHelpSection ];
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
    const moveMagnetRow = KeyboardHelpSection.labelWithIcon( moveMagnetString, moveMagnetIcon, moveMagnetWithString );

    // move magnet slower row
    const shiftPlusArrowKeys = KeyboardHelpIconFactory.shiftPlusIcon( KeyboardHelpIconFactory.arrowKeysRowIcon() );
    const shiftPlusWASDKeys = KeyboardHelpIconFactory.shiftPlusIcon( KeyboardHelpIconFactory.wasdRowIcon() );
    const moveMagnetSlowerRow = KeyboardHelpSection.labelWithIconList(
      moveMagnetSlowerString,
      [ shiftPlusArrowKeys, shiftPlusWASDKeys ],
      moveMagnetSlowerWithString
    );

    // press and hold message row
    // TODO: The initial design was a line of text by itself, which isn't currently supported, see https://github.com/phetsims/faradays-law/issues/176.
    // const pressAndHoldMessageRow = new RichText( pressAndHoldString, { font: new PhetFont( 16 ) } );

    super( 'Move Bar Magnet', [ moveMagnetRow, moveMagnetSlowerRow ], options );
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
    const tempString = 'Auto-Slide grabbed bar magnet<br>left or right at 3 different speeds<br>Number keys start auto-slide<br>or toggle sliding direction.';
    const moveGrabbedMagnetRow = KeyboardHelpSection.labelWithIcon( tempString, numberKeysIcon, tempString );

    super( 'Auto-Slide Bar Magnet', [ moveGrabbedMagnetRow ], options );
  }
}

faradaysLaw.register( 'FaradaysLawKeyboardHelpContent', FaradaysLawKeyboardHelpContent );

export default FaradaysLawKeyboardHelpContent;