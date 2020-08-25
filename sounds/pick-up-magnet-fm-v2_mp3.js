/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAABBABJaCIYBCXjSf2giAGBbrAYcbSadD3KDBRfOecic1T7P7k/5+6pzy///yROpyE223BY5GkTBczGNkMcgJf5W9O/a61zuZgQRxx3Q717dv/9H9aPSq6WiySzR3GUyKVDQaACld8MNFGWnKZ34udpK+qS5QSydUDfJ1jSC9IkRE5KxogIKCbzVIlE3xAIL+B0gzaR1FD//syxCAADgUXi7mYgBFEHu73nnACQQjIizhXxgFNMyP9/IAMoixm5i6KL7/IYQYuk+eTq//5kXDRMwZNOtLqf/+ibhD0TUNMBAEEpzhzNQsYDaPShB/laLihzE46uftatpo1AkLwyKQegtYx6DxFQdFkQdNNa67AUOQvxsmf1EJEsl6nav5pisnvZ9aD343/NzflOi30VXgwdcGaMv/7MsQDAAhkt2vMPOmBCZrtNYeo6hhAyi0qodQaWEqhdywf0yw+TuukRvHWfRckyvP1Zt9v5b5shgzc/zjnqCgHoUF2pvHvEX3yheRL/T8dp/S8xHVswgirQPsvo1uYZmOFmR+IYq2Vw2vb52grEdW1WWvmtUhUiAiej87xKBU5R/apL4gn/R5E//4+3/m9Cxcw2nklamBTtXtWRbP/+zLEBAAIdNdb57VQgRIWqjwcNCiANOTIY6VJOAeglyWJw92U9pT+jbTo1Z69n+s4JMXg/haEZrf0CsCq/3lSW9gGSy/IniJbr/KktH//HzpKAyUjXAq2+AAVDLAoisoYkPiXrElgYdZNLafFwPJs2bVdR0xk0LFCXkek+oEsHEslfvMT2kNQcTo/MWMil7fyaalvySoIBFiCAFNO//swxAOACDSZN62yCkDbEKi0F6hegbyp4AgMvoZfnGXhCe7L2CxIj9D2AsO10f+fHKTIYHSqmT9XPBYUUkhxH/0dclBpVP6VRtv7kfkv/0JMNtypotNKCmlUJqLEUg6znJgP43zy85bfqBVFUJw4Oqj/1BZHP+niUNr+z8js9pLUtzPqS/01AGaxtttqjSgYgpSa1yfzS3rVb0/E//syxAqABXRhNUU8pJCEgGf0AIgGlAox3/M8PAYXDW22+tH0+r+3FFf9HNmS2yaxxsolA2SLCAzS3OORddDCUOy23/1dn2I/Z9D/tlUACealWyhDmEPYNRSyxjEGUjb7mPD6NVqdznOODqOWvylDV5xeoe4vbmiYr00pJEkwBJEQpDjXTjjVGk8KtF3hB0sGbqvT/+7/X/V9ClJRbf/7MsQoAAVUByEhhGAAhwBlaACIAqLZIgRAbQqifapHYDTVNq397bv+3//q//6ylE2GGmw0hAKxe1q6PpZwGAzrIKhT+1dZ/9f/v//6agGW5HE3GmnxGWtCljBa8p1LFbGZ9EPiXo0M/3rSv9HsRK/9QTgbbj4lAFqKtVUxEgO0N+//eWox1NOm6WoCxtgODVttACCrgaQSSV6ur9D/+zLERYADkANDoARAMHsAZnQAiAK/6PaS/jXf/byvXUxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//swxGuABGwHK6EAYABkgGZwAIgGVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//syxJCDw5QDF6CEAAAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==';
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