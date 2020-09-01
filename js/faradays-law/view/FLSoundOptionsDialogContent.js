// Copyright 2020, University of Colorado Boulder

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import AquaRadioButtonGroup from '../../../../sun/js/AquaRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import faradaysLaw from '../../faradaysLaw.js';

// constants
const HEADER_TEXT_OPTIONS = { font: new PhetFont( 24 ), weight: 'bold' };
const SELECTION_TEXT_OPTIONS = { font: new PhetFont( 18 ) };

// globals that are controlled by this dialog
phet.faradaysLaw.maxVoltageClicksIndexProperty = new NumberProperty( 0 );
phet.faradaysLaw.highNoteBehaviorProperty = new NumberProperty( 0 );

/**
 * SoundOptionsDialogContent is intended as an example of a node that can serve as the content for an options dialog,
 * and that enables the user to select between different candidate sounds that are under consideration for use in a
 * sound design.
 */
class SoundOptionsDialogContent extends VBox {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const maxVoltageClickItems = [
      {
        value: 0,
        node: new Text( 'High click', SELECTION_TEXT_OPTIONS ),
        tandemName: 'choice0RadioButton'
      },
      {
        value: 1,
        node: new Text( 'Low click', SELECTION_TEXT_OPTIONS ),
        tandemName: 'choice1RadioButton'
      },
      {
        value: 2,
        node: new Text( 'No click', SELECTION_TEXT_OPTIONS ),
        tandemName: 'choice2RadioButton'
      }
    ];

    const maxVoltageClicksSoundSelector = new AquaRadioButtonGroup(
      phet.faradaysLaw.maxVoltageClicksIndexProperty,
      maxVoltageClickItems,
      {
        orientation: 'vertical',
        align: 'left',
        tandem: Tandem.OPT_OUT
      }
    );

    const highNoteBehaviorItems = [
      {
        value: 0,
        node: new Text( 'Always play high notes', SELECTION_TEXT_OPTIONS ),
        tandemName: 'choice0RadioButton'
      },
      {
        value: 1,
        node: new Text( 'Play high notes when voltmeter visible', SELECTION_TEXT_OPTIONS ),
        tandemName: 'choice1RadioButton'
      },
      {
        value: 2,
        node: new Text( 'Never play high notes', SELECTION_TEXT_OPTIONS ),
        tandemName: 'choice2RadioButton'
      }
    ];

    const highNoteBehaviorSelector = new AquaRadioButtonGroup(
      phet.faradaysLaw.highNoteBehaviorProperty,
      highNoteBehaviorItems,
      {
        orientation: 'vertical',
        align: 'left',
        tandem: Tandem.OPT_OUT
      }
    );

    super( {
      children: [
        new Text( 'Max Voltage Click Sounds:', HEADER_TEXT_OPTIONS ),
        maxVoltageClicksSoundSelector,
        new Text( 'High note behavior options:', HEADER_TEXT_OPTIONS ),
        highNoteBehaviorSelector
      ],
      spacing: 15,
      align: 'left',
      tandem: tandem
    } );
  }
}

faradaysLaw.register( 'SoundOptionsDialogContent', SoundOptionsDialogContent );
export default SoundOptionsDialogContent;