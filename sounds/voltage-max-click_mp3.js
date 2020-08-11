/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAABnwBe1QRADExDW2jMJAAAAFtNtxoAH3lAQBMHz5c+6CDgTB8P6gQOS4Pg+D4fBAEAQOZcH3xAcy4Ph/KO/P6wcOf0AYKYAAACQGJCBxE9GoWKhc4T5rHXw/1aMSielNamOmVMhBknJ74q/t9z6JxMAb/ejRtkjBCCJKItA4VJkjHWkCGAl+BhUXFGLER78wqM8J6AJWU//syxAMACEx1ZBmUgAEJoSsDJKAAEkMhFQl0vMv+w1KRrzVpQ48MLOgl4lJiQViH+v4PJGPF0/k9UxK/f/2s/bR935QMA//Lh8EP/g+//8EC4GHhclJ8MWhdKvC54MVeEkCr5AKoXP4Coggbha/6BdCqIn/xEkRxCRD7/8RRCPWNIRV//yIfE2REI9Hv//5xynEQ+kxBTUUzLjk5Lv/7MsQEg8AAAaQcAAAgAAA0gAAABDWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqo=';
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