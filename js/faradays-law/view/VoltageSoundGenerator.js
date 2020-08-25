// Copyright 2020, University of Colorado Boulder

/**
 * A sound generator that produces sounds based on the voltage level.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import SoundGenerator from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import lightBulbToneTop2 from '../../../sounds/lightbulb-voltage-note-b-flat-4_mp3.js';
import lightBulbTone1 from '../../../sounds/lightbulb-voltage-note-c-4_mp3.js';
import lightBulbToneTop1 from '../../../sounds/lightbulb-voltage-note-c-5_mp3.js';
import lightBulbTone2 from '../../../sounds/lightbulb-voltage-note-e-4_mp3.js';
import lightBulbTone3 from '../../../sounds/lightbulb-voltage-note-g-4_mp3.js';
import maxVoltageSound from '../../../sounds/voltage-max-click_mp3.js';
import maxVoltageHigherSound from '../../../sounds/voltage-max-octave-higher_mp3.js';
import faradaysLaw from '../../faradaysLaw.js';

// constants
const SOUND_GENERATION_THRESHOLD_VOLTAGE = 0.01; // in volts, empirically determined, must be greater than zero

// By design, the voltage in this sim hits its max at pi/2 so that it is easy to integrate with the voltmeter, so use
// that value for the maximum voltage in the calculations for this sound generator.
const MAX_VOLTAGE_FOR_CALCULATIONS = Math.PI / 2;
const VOLTMETER_PEGGED_THRESHOLD = 0.99 * MAX_VOLTAGE_FOR_CALCULATIONS; // multiplier empirically determined

class VoltageSoundGenerator extends SoundGenerator {

  /**
   * @param {NumberProperty} voltageProperty
   * @param {BooleanProperty} voltmeterVisibleProperty
   * @param {Object} [options]
   * @constructor
   */
  constructor( voltageProperty, voltmeterVisibleProperty, options ) {

    options = merge( {
      initialOutputLevel: 0.5
    }, options );

    super( options );

    /*
     TODO: There is a lot of the code below that's not really up to PhET standards and will need substantial cleanup
     once the sound design is finalized.  See https://github.com/phetsims/faradays-law/issues/161.
     */

    // sound clips that are layered to produce the voltage sound
    const voltageSoundClips = [
      new SoundClip( lightBulbTone1, { loop: true } ),
      new SoundClip( lightBulbTone2, { loop: true } ),
      new SoundClip( lightBulbTone3, { loop: true } )
    ];
    voltageSoundClips.forEach( voltageSoundClip => {
      voltageSoundClip.connect( this.masterGainNode );
    } );

    // high notes that are played when the voltmeter is visible
    const highNoteOutputLevelMultiplier = 0.5;
    const positiveVoltmeterHighTone = new SoundClip( lightBulbToneTop1 );
    soundManager.addSoundGenerator( positiveVoltmeterHighTone );
    const positiveVoltmeterLowTone = new SoundClip( lightBulbToneTop2 );
    soundManager.addSoundGenerator( positiveVoltmeterLowTone );

    // sound players for when the voltage reaches the max positive or negative values, i.e. "pegs"
    const maxPositiveVoltageLowerSoundClip = new SoundClip( maxVoltageSound );
    soundManager.addSoundGenerator( maxPositiveVoltageLowerSoundClip );
    const maxNegativeVoltageLowerSoundClip = new SoundClip( maxVoltageSound, {
      initialPlaybackRate: 0.89089871814
    } );
    soundManager.addSoundGenerator( maxNegativeVoltageLowerSoundClip );
    const maxPositiveVoltageHigherSoundClip = new SoundClip( maxVoltageHigherSound );
    soundManager.addSoundGenerator( maxPositiveVoltageHigherSoundClip );
    const maxNegativeVoltageHigherSoundClip = new SoundClip( maxVoltageHigherSound, {
      initialPlaybackRate: 0.74915353843
    } );
    soundManager.addSoundGenerator( maxNegativeVoltageHigherSoundClip );
    const maxPositiveVoltageSoundPlayer = {
      play: () => {
        switch( phet.faradaysLaw.maxVoltageClicksIndexProperty.value ) {
          case 0:
            maxPositiveVoltageHigherSoundClip.play();
            break;
          case 1:
            maxPositiveVoltageLowerSoundClip.play();
            break;
          case 2:
            // no sound
            break;
          default:
            throw new Error( 'invalid value for maxVoltageClicksIndexProperty' );
        }
      }
    };
    const maxNegativeVoltageSoundPlayer = {
      play: () => {
        switch( phet.faradaysLaw.maxVoltageClicksIndexProperty.value ) {
          case 0:
            maxNegativeVoltageHigherSoundClip.play();
            break;
          case 1:
            maxNegativeVoltageLowerSoundClip.play();
            break;
          case 2:
            // no sound
            break;
          default:
            throw new Error( 'invalid value for maxVoltageClicksIndexProperty' );
        }
      }
    };

    // flags used to decide when the voltmeter is transitioning in and out of being "pegged" at the min or max
    let voltmeterPeggedPositive = false;
    let voltmeterPeggedNegative = false;

    const voltageListener = voltage => {

      const voltageMagnitude = Math.abs( voltage );

      // voltage tone generation
      if ( voltageMagnitude > SOUND_GENERATION_THRESHOLD_VOLTAGE ) {
        voltageSoundClips.forEach( ( clip, index ) => {
          if ( !clip.isPlaying ) {
            clip.play();
          }
          const playThreshold = index * ( MAX_VOLTAGE_FOR_CALCULATIONS / voltageSoundClips.length );
          const outputLevel = Utils.clamp( 0, voltageMagnitude - playThreshold, 1 );
          clip.setOutputLevel( outputLevel );

          // top tone, played based on the value of one of the sound configuration settings
          const highNoteBehaviorValue = phet.faradaysLaw.highNoteBehaviorProperty.value;
          if ( index === 0 &&
               ( voltmeterVisibleProperty.value && highNoteBehaviorValue === 1 || highNoteBehaviorValue === 0 ) ) {

            const topNoteOutputLevel = outputLevel * highNoteOutputLevelMultiplier;
            if ( voltage > 0 ) {
              if ( !positiveVoltmeterHighTone.isPlaying ) {
                positiveVoltmeterHighTone.play();
              }
              positiveVoltmeterHighTone.setOutputLevel( topNoteOutputLevel );
              positiveVoltmeterLowTone.stop();
            }
            else if ( voltage < 0 ) {
              if ( !positiveVoltmeterLowTone.isPlaying ) {
                positiveVoltmeterLowTone.play();
              }
              positiveVoltmeterLowTone.setOutputLevel( topNoteOutputLevel );
              positiveVoltmeterHighTone.stop();
            }
          }
        } );
      }
      else {
        voltageSoundClips.forEach( clip => {
          if ( clip.isPlaying ) {
            clip.stop();
          }
        } );
        positiveVoltmeterHighTone.stop();
        positiveVoltmeterLowTone.stop();
      }

      // max voltage sound generation
      if ( voltmeterVisibleProperty.value ) {
        if ( voltage > VOLTMETER_PEGGED_THRESHOLD ) {
          if ( !voltmeterPeggedPositive ) {
            voltmeterPeggedPositive = true;
            maxPositiveVoltageSoundPlayer.play();
          }
          voltmeterPeggedNegative = false;
        }
        else if ( voltage < -VOLTMETER_PEGGED_THRESHOLD ) {
          if ( !voltmeterPeggedNegative ) {
            voltmeterPeggedNegative = true;
            maxNegativeVoltageSoundPlayer.play();
          }
          voltmeterPeggedPositive = false;
        }
        else {
          voltmeterPeggedPositive = false;
          voltmeterPeggedNegative = false;
        }
      }
    };

    voltageProperty.link( voltageListener );

    // @private {function}
    this.disposeVoltageSoundGenerator = () => { voltageProperty.unlink( voltageListener ); };
  }

  /**
   * @public
   */
  dispose() {
    this.disposeVoltageSoundGenerator();
    super.dispose();
  }
}

faradaysLaw.register( 'VoltageSoundGenerator', VoltageSoundGenerator );

export default VoltageSoundGenerator;