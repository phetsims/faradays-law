/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAAApQCwbQRgCDsku0DJKAAkFAAuwGAAADnC5/0LB8oGP+4TvEGbGgoQG52gMmE+Fw5gVBGgsnFsfsCrvIB4oFLyRCAkGpUd/EWIsnmEICg+i78wzMiuH1nydRR//9//63Sm2C2W4sFMLcaKdJTIP1pEaXl86WI0ksr28p2OFMxHw2f5dBU9SJKiCgUh8yPxDF01OCTAM8l//syxBuAC2j5bVz2gBFmIiv4x7ZVj0nFHqRWJqF2LqPUSRiM7faZdSQlXzij//9vrNFLW3Ot65vkoMDEiIiGp5QGwlhkVAyWgkCwGkw3ZquEYfoQaOrg+bMcn//pqCVR90jQW5EiYxZr0a02mQgQ5WdTc4WxNQc5LmvkwToiHvpTH0RKfrm3v//0anP80vX91mSZZZbxdrcNaAC4VP/7MsQFAAiwr1emIbCBEB8pNPgeKFKB4SzEkhI+PrI+FcU0wO3CCYYH236hMEYIr5NqJgJEkamsqbREBHM9X3ohvmbeVky31/qGVlSX/vuhQAAUgdMkBYAZwP1MHMjmnDjCbbxewxbjK1BQOjrP6kh6VremI9QvT8hxdbV1soagaEY/kU//qBX6SPtp6N9SmY/FIe6FNEVFYGCfcP7/+zLEBAAIeP1P5jVQwQQfKLRmNCPAIUIKTAtQLUaA4dNfAdfIcrUgrt/UmPHrSmAK8cfR6hQjJ9fw8DZfUgFs9/nV9AIk9yhP///tzePBn6CW20G5FA4CAJgkqT4BtjFyrqTXg6jItBCj6vfQGGdFSNSwOrJaXSDsM7LW/1B+FJb+5LK//nQUlHzGPL////y8JS3HIZazAkQxpSIJ//swxAWACAT9R6Y1TfDEleh0kMCaNOcOhVvo2t62Bkl8doJk1RqeupMx7ahYH/3jWTHa/4QQilv6iav/9Aav1M///0/UJojJ0/SE21DLK6m4QLLCdnWQE6vw2Y1IENNJqktdqtnsPRa9uYJq2+gDUEOY/9f//LvR/7uGVQS02nJXSzRwoeBsrWvZ2VuxEwRVFDtzFLvq6/Ogko8f//syxBAABtjrNaVhrFE4n6Ho+Im60Z9qlN9gbwX5kvpf/9L//V7ftP+P/6QFUGYYagoP0og5meLnVvWvtiMiHFAbgqJJF1JHtRRZlGyKRlMiLO3WyqNaP2c1D9gtGJwnlwaOVuUv+oC30N/QylhTTGcMBOhW6gIn/zQAACSwARwBAf/6KxwjBCIBuWdv////NNTnGjwpFImFY0AuGP/7MsQRg8Vg/uejgF54AAA0gAAABBks6//0UHDVTEFNRTMuOTkuNaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqo=';
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