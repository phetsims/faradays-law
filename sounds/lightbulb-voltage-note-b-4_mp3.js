/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,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VVVVVVVVVVVVVf/7MMToAAi4nUOscgVQ/xOoNcTBjlVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7MsTogAnUhUFVyQARvp3s9zUwA1VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+zLEzQPHhElIXYSAAAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
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