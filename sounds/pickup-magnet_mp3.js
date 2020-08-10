/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAABmBNA1SRgAE0lyw3MIACAACAAAACiCjGTIxW2oCYbJ9qGf/3r8d/3d4Biz/6gfflz8QQQOf9Z8Rh/h+IP/EhxYfpddhGQrFVi1MqFAgDAA74Q+AkS6DssbSTbln/HWd3b/h3YcV/YCgD6MdOrD88bd8LTxeJmIT4r+v8sXJY8uLZP//w/kgcKD3/wyco//QqOOjgTEKt//syxAMACCQ7WRzxAAEQC+7wwYpWHP9nU6PaDHFkR8ygU5OHkTAUOEAJIRg6GC4EBQuQB8daCp/kAKaFa/1LflJdN5BZl9T0hc0D5RVpCcRLY5HZK+QgIWT8Qx5DQQEqMwCBWdLhQiWUF0evsOU93AJnuLFkgARqLegooBBzXjFDSCq1pJx9yuzE8kXwF31vrvc6hVWHZWVUZ1ktbf/7MsQEAAh8h4nnpHBxCxet5MGuUAAZiwIslEpb0wujLC/UqYT9Umr7QRpMlkOEADxc99qu2UGRQBAQGiLiwl1OV5CMw7eeQM+5Rdg5vpl110gAIGoAKl5oH6VwtDE4bTEYSRKLpIPjt8xa59E9D3ljDZ/ez6dGYBh8tc2n/ygWc9OnZdRbitA/X8f/9XFmhW///1K/gksoYpsSAIj/+zLEBIAIhQdrp5lJgQ8jqqWDHSBDHw3mRPobElUOgw90TQEXZFkjUPi/6WRM067/VThAgWp+yowmzvIW+IEKUet/9OIJ3/6EyL/+v+MW9QIQIYQGAkSNzsdjUulVHDLtB1AxIkDJLLisIzAsC1R0gWdV/opp0367HCYJUPRM380Wjz//0g+DBf///9l9tBM/92QvDmaSQXkmDYAK//swxASACLS9VaYY60EBl2r8xBW42LCCgDqsGsdTPCQMTvDDVH7/nAwhscJs5QZyNfmohLTXuKgTOY3oSZ3qODU5jET/6gqLX16DZV0Xb9PTSCQzPLqg3f8DgBMdniCDYJkZJJumKlY8lNxos5vBRxIV/ZzYa4tVqL+OvVVVvhwe2v16GlVBZdWT/4R//6JE7WkZqsJIkUMETYgQ//syxAUABzi9O0WJtlC3mqa0gJyq2JJo/bdtO+e+qv/FADpo6kR0ui721rIEcK1pq6kQTla//0v/22KgvoQ5P1f/Lf54hNhuAORQUccWoQ1NeKaxXsKgHEX1b/2zv/lAfEv/5v//jwPi5vc5Hx0iv//8qkvqBoDKGByx0JrLLAYUMFDAwQcILFAIYGCBhHSWWWf///8SJAoMJAhYgP/7MsQVA8VwxIzBgNiIAAA0gAAABHAKTEFNRTMuOTkuNaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqo=';
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