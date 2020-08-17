/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAABuxNW7QTABEijW7vHvAA0kJSAAAATXEEAAAOBTG5A93d73sgQIQ5MBpsAwsLBiIwfiBwgd8TqB9RyUh9TvKO5yD7y/nP8nqKBQAAAABhghEyb5pooul2aOHQKJAj0Kgl4tq8ymQe5zLUvH+qkAw1p7+NAfwLY///rPq+8S6XlFgZX0E0SyyPuuf6/L/Sz5NQvlq+oQsE//syxAOAB9BrfTzDADEcju31h5hu6QWBsrSGwkDYPSYWAIIFDo8cyTgh9z3pek//ftj1oOzoXE51syx6rxKda1Wr+HSNC3K1Hf/BWQchKDBRKbjYBOh5uOElmB8SFOTGEOM6WXBYlKy1zSKBLewKYFJPLb+x1kUf+295mZzosSSf3h0NrBXKufg0enqHZ2vrce+VSg4QTVLdXEQAV//7MsQEgAhw3VGsJO9wz44pNZG0finn91JV0xKTwzXvRGWRbGKxBczIiNkpR/+ymtN1xmskQES7LNrCrPkpSkk8Eg7/9jZUskj1X/6//+KA3JJLba40BATm2pb3m156oTD2RGoI+yjpogSiDEsazr0f61RNwpTSL6ULcmh/RZ/LO//9FTbbbdds9GXATp7GbVllM5fOkTYluaY+XdT/+zLEDIAGYN9TrAzjsMQOaTWRqD5qQKidiq1Rf+IQDUTtf+r6f/+v//lf7Fd/kC3LJLLK60DAPw2hJ52FJxTPEFQFN5VFNR7ti6kjRf+wVQjRiWhsxSJ7kP+r/Df/R+kOS2SW7/Wq8A9c1SRdp0Tz0P6jjkGYCZ5PAjxNZvuHa2ILaypUrulHen/b/V62f/PhOSyOCWRICAF6kau0//swxB6ABgxxS6gF59Cvjih1EKy+2Tm07HPcK/Lne01cw2k/xEz/zIqEFr3b6NPs/p//+lUAQEJJGNtJQAty6wC17F3pTO9vf65iUae7/dXA4vl9t6kaKF2e3Xb+/9b2jAFaSQaTa4DSW2s5IUpOpRcyrIvb3/16NQwZ1Q33ssay25rzWnplaOv3K1oILzg20kqAharWqQ1NR/Pu//syxDOABYBzKa0M4ICqjeTpkIh4W2GdX9f8pv/f//vkwj+7OoKuGRMWJSy9p7+r7fh1VH5Kv//8t081cEkEgAEADABrxUW4v//6xT///qZrFOpMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7MsRMAEOIBTNEBCAQaoAlZDCEAlVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+zLEdIPC4AL9oIRAMAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
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