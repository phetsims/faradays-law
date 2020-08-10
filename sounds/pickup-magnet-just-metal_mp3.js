/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAABpQ7UFSUgBEnmK3DHrAAAAIEGLo0bc5oxQKCRy4XBMNyC5PsIWjboVk4WDEuf4Y/LqB94IBj5eUDBQMfyjv5Q5B94Pxk1Kqcso4zONJkLiyjaPNRHm5yjUQZiZNYbOJfJvFn3b740q+h3urYCC/srES5zjGXRYf4bRUevvK6Z75fcfWHf+4Lv38vyHq+lcyigwBPzYRa//syxAQACKEHZZyVAAELoKtolZ3qJCPBoRwaSmKhNsSB6pzyEhbGuqHKQt/nOQBdCBFn2R2FYF4dOdlRTH1Y0VTCpv/zeGA3b/morf//8ZHdS5q2RsZQaA8lyA2KlRATNtEJLDkz7d9t9Qfe2j6MR3G1x//DjFwfhNdfpVoKgSt6fikMlH//4EjTf9SISmmf//8Tu9BuSV2paRoFAf/7MsQEAAhlHVumNPHxDyCnqMe2SjwnjESF4kmGHJ4Ham0s4hHtITnjUMu8+ZZ//rUZDm+l1GwSKZP7fRHiZP//rHuLX/qhe3/6/3CQn/tIi7fxIiwSBNyoGD+ASJz0ykQPYMnS85tty6wKgKWsZiNeJLXyZ1VW1mv/mIbrL9bbssqKaZ6v/6joA5DhV/6X///y99MtJuOBW1xI8fD/+zLEBIAG8L9Dp4WjEM2X5fQgnGpfhcWJkJHmjFrP8ihsJlk2JBNXf1UjjpP0quTBOkG/+o2W3/o84AlS4UPu/+3+gAIORkK1U18SsGetoRoR+lAfCEHpUjt/85536dBsVIp/6Orev86OioJghGD0rJB3/1D/0ExBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//swxBMDwAABpAAAACAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq';
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