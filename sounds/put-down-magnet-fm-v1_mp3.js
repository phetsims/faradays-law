/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,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';
const soundByteArray = base64SoundToByteArray( phetAudioContext, soundURI );
const unlock = simLauncher.createLock( soundURI );
const wrappedAudioBuffer = new WrappedAudioBuffer();
const onDecodeSuccess = decodedAudio => {
  wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
  unlock();
};
const onDecodeError = decodeError => {
  console.warn( 'decode of audio data failed, using stubbed sound, error: ' + decodeError );
  wrappedAudioBuffer.audioBufferProperty.set( phetAudioContext.createBuffer( 1, 0, phetAudioContext.sampleRate ) );
  unlock();
};
phetAudioContext.decodeAudioData( soundByteArray.buffer, onDecodeSuccess, onDecodeError );
export default wrappedAudioBuffer;