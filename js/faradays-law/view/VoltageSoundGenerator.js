// Copyright 2019-2020, University of Colorado Boulder

/**
 * sound generator for the voltage
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import faradaysLaw from '../../faradaysLaw.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import lightBulbTone1 from '../../../sounds/lightbulb-sound-chord-g3-loop_mp3.js';
import lightBulbTone2 from '../../../sounds/lightbulb-sound-chord-e4-loop_mp3.js';
import lightBulbTone3 from '../../../sounds/lightbulb-sound-chord-c5-loop_mp3.js';
import SoundGenerator from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import merge from '../../../../phet-core/js/merge.js';
import Utils from '../../../../dot/js/Utils.js';

// constants
const SOUND_GENERATION_THRESHOLD_VOLTAGE = 0.01; // in volts, empirically determined, must be greater than zero

// By design, the voltage in this sim hits its max at pi/2 so that it is easy to integrate with the voltmeter, so use
// that value for the maximum voltage in the calculations for this sound generator.
const MAX_VOLTAGE_FOR_CALCULATIONS = Math.PI / 2;

class VoltageSoundGenerator extends SoundGenerator {

  /**
   * @param {NumberProperty} voltageProperty
   * @param {Object} [options]
   * @constructor
   */
  constructor( voltageProperty, options ) {

    options = merge( {
      initialOutputLevel: 0.5
    }, options );

    super( options );

    // sound clips that are layered to produce the voltage sound
    const voltageSoundClips = [
      new SoundClip( lightBulbTone1, { loop: true } ),
      new SoundClip( lightBulbTone2, { loop: true } ),
      new SoundClip( lightBulbTone3, { loop: true } )
    ];
    voltageSoundClips.forEach( voltageSoundClip => {
      voltageSoundClip.connect( this.masterGainNode );
    } );

    const voltageListener = voltage => {

      const voltageMagnitude = Math.abs( voltage );

      if ( voltageMagnitude > SOUND_GENERATION_THRESHOLD_VOLTAGE ) {
        voltageSoundClips.forEach( ( clip, index ) => {
          if ( !clip.isPlaying ) {
            clip.play();
          }
          const playThreshold = index * ( MAX_VOLTAGE_FOR_CALCULATIONS / voltageSoundClips.length );
          const outputLevel = Utils.clamp( 0, voltageMagnitude - playThreshold, 1 );
          clip.setOutputLevel( outputLevel );
        } );
      }
      else {
        voltageSoundClips.forEach( clip => {
          if ( clip.isPlaying ) {
            clip.stop();
          }
        } );
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