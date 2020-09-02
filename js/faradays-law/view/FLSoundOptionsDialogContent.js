// Copyright 2020, University of Colorado Boulder

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import faradaysLaw from '../../faradaysLaw.js';
import FaradaysLawQueryParameters from '../FaradaysLawQueryParameters.js';

// constants
const HEADER_TEXT_OPTIONS = { font: new PhetFont( 24 ), weight: 'bold' };
const SELECTION_TEXT_OPTIONS = { font: new PhetFont( 18 ) };

// globals that are controlled by this dialog
phet.faradaysLaw.onlyPlayHighNoteWhenVoltmeterVisibleProperty = new BooleanProperty(
  FaradaysLawQueryParameters.voltmeterVisibilityAffectsSounds
);

/**
 * SoundOptionsDialogContent is intended as an example of a node that can serve as the content for an options dialog,
 * and that enables the user to select between different candidate sounds that are under consideration for use in a
 * sound design.
 */
class FLSoundOptionsDialogContent extends VBox {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const highNoteOnlyWhenVoltmeterVisibleCheckbox = new Checkbox(
      new Text( 'Voltage sound is affected by voltmeter visibility', SELECTION_TEXT_OPTIONS ),
      phet.faradaysLaw.onlyPlayHighNoteWhenVoltmeterVisibleProperty,
      { tandem: Tandem.OPT_OUT }
    );

    super( {
      children: [
        new Text( 'Voltage sound behavior options:', HEADER_TEXT_OPTIONS ),
        highNoteOnlyWhenVoltmeterVisibleCheckbox
      ],
      spacing: 15,
      align: 'left',
      tandem: tandem
    } );
  }
}

faradaysLaw.register( 'FLSoundOptionsDialogContent', FLSoundOptionsDialogContent );
export default FLSoundOptionsDialogContent;