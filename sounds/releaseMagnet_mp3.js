/* eslint-disable */
/* @formatter:off */

import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,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';
const soundByteArray = base64SoundToByteArray( phetAudioContext, soundURI );
const unlock = asyncLoader.createLock( soundURI );
const wrappedAudioBuffer = new WrappedAudioBuffer();

// safe way to unlock
let unlocked = false;
const safeUnlock = () => {
  if ( !unlocked ) {
    unlock();
    unlocked = true;
  }
};

const onDecodeSuccess = decodedAudio => {
  if ( wrappedAudioBuffer.audioBufferProperty.value === null ) {
    wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
    safeUnlock();
  }
};
const onDecodeError = decodeError => {
  console.warn( 'decode of audio data failed, using stubbed sound, error: ' + decodeError );
  wrappedAudioBuffer.audioBufferProperty.set( phetAudioContext.createBuffer( 1, 1, phetAudioContext.sampleRate ) );
  safeUnlock();
};
const decodePromise = phetAudioContext.decodeAudioData( soundByteArray.buffer, onDecodeSuccess, onDecodeError );
if ( decodePromise ) {
  decodePromise
    .then( decodedAudio => {
      if ( wrappedAudioBuffer.audioBufferProperty.value === null ) {
        wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
        safeUnlock();
      }
    } )
    .catch( e => {
      console.warn( 'promise rejection caught for audio decode, error = ' + e );
      safeUnlock();
    } );
}
export default wrappedAudioBuffer;