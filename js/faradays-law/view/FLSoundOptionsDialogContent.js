// Copyright 2020, University of Colorado Boulder

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import AquaRadioButtonGroup from '../../../../sun/js/AquaRadioButtonGroup.js';
import faradaysLaw from '../../faradaysLaw.js';

// constants
const HEADER_TEXT_OPTIONS = { font: new PhetFont( 24 ), weight: 'bold' };
const SELECTION_TEXT_OPTIONS = { font: new PhetFont( 18 ) };

// globals that are controlled by this dialog
phet.faradaysLaw.magnetSoundSetIndexProperty = new NumberProperty( 0 );

/**
 * SoundOptionsDialogContent is intended as an example of a node that can serve as the content for an options dialog,
 * and that enables the user to select between different candidate sounds that are under consideration for use in a
 * sound design.
 */
class SoundOptionsDialogContent extends VBox {

  constructor() {

    const magnetPickupAndDropItems = [
      {
        value: 0,
        node: new Text( 'Metal 1', SELECTION_TEXT_OPTIONS )
      },
      {
        value: 1,
        node: new Text( 'Metal 2', SELECTION_TEXT_OPTIONS )
      },
      {
        value: 2,
        node: new Text( 'Default Grab/Release', SELECTION_TEXT_OPTIONS )
      }
    ];

    const magnetPickupAndDropSoundSelector = new AquaRadioButtonGroup( phet.faradaysLaw.magnetSoundSetIndexProperty, magnetPickupAndDropItems, {
      orientation: 'vertical',
      align: 'left'
    } );

    super( {
      children: [
        new Text( 'Magnet Pick Up and Release Sounds:', HEADER_TEXT_OPTIONS ),
        magnetPickupAndDropSoundSelector
      ],
      spacing: 15,
      align: 'left'
    } );
  }
}

faradaysLaw.register( 'SoundOptionsDialogContent', SoundOptionsDialogContent );
export default SoundOptionsDialogContent;