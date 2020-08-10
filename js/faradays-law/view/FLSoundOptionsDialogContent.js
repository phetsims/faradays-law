// Copyright 2020, University of Colorado Boulder

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import AquaRadioButtonGroup from '../../../../sun/js/AquaRadioButtonGroup.js';
import faradaysLaw from '../../faradaysLaw.js';

// constants
const TEXT_OPTIONS = { font: new PhetFont( 24 ) };

// globals that are controlled by this dialog
phet.faradaysLaw.magnetSoundSetIndexProperty = new NumberProperty( 0 );

/**
 * SoundOptionsDialogContent is intended as an example of a node that can serve as the content for an options dialog,
 * and that enables the user to select between different candidate sounds that are under consideration for use in a
 * sound design.
 */
class SoundOptionsDialogContent extends Node {

  constructor() {

    const items = [
      {
        value: 0,
        node: new Text( '1st option', TEXT_OPTIONS )
      },
      {
        value: 1,
        node: new Text( '2nd option', TEXT_OPTIONS )
      },
      {
        value: 2,
        node: new Text( '3rd option', TEXT_OPTIONS )
      }
    ];

    const radioButtonGroup = new AquaRadioButtonGroup( phet.faradaysLaw.magnetSoundSetIndexProperty, items, {
      orientation: 'vertical',
      align: 'left'
    } );

    super( { children: [ radioButtonGroup ] } );
  }
}

faradaysLaw.register( 'SoundOptionsDialogContent', SoundOptionsDialogContent );
export default SoundOptionsDialogContent;