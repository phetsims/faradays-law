/* eslint-disable */
/* @formatter:off */

import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAABpA9ZvQzAAEuE/J3HtACAQAAAoAhOBgYG/Hd3c9C/u7u9MAYDTHAgCAPh8oCAJwQBBwIAgGIOHC/KAhKO/wQ/Py4Pvkflt2ASblkaYgEAwAAawjmBnZE5DUAMpqZU/KrSd1C47SD5k5TrVWUS4mSRQOm4dTQ6bDgJciF8umxiaP3+tWnWa7fmh3/iGLf/UlCAUNXgDSb//syxAOACHSzb/z1ADENFis1p6k+kgATyHQyUhsgWixRl25vXqhexXvwSp+lBWD8L0laI4hjjhWAHCnQKEG4m//+hw+JnTqQjUv/OEEVb/+800FHNuk1U0AIZgqAUniSGKAFMYk8cjcXJKuvbGsffvFxH/+VKs79xyuVbPTCMqerKGImt/cx+u6eb8ZE2rdhKGz9HypoKW3bTOtoAf/7MsQEAAhEr1etDUzxDA/ptbEtnhmHoZXMImYeQQhgZ7I44LhOBO+kkOKQiz6Kc2kCUcG0mFQG4uXESJIUv+6brvP1nV2RM5n5Q911/bSkCnJbZJEiALMndRNcCCpzwChA/buSiG4gyLem0FsfMZJOu4IIjT16iBYUiXhsnpdcVdsY5Mwf75wt2E8+lak8QgMKVXA5dv9ttYwBqq7/+zLEBQAIjJdbrCxrcRQK6nWAmZaCCNRQS6wyNxiki84Ake+qptpU9O4/5fUQZOJ5kKlJNXDoZYclrCcOns8vhgrWhF4rZxgfWYQd2mRRaYd1o21kbSAyqwUqiVYMBWGiMATjfOrFr/5+NrBXctxyMpmI4XCTnlBWYYLNqIGhHtFIzze0nvoFU2i4ZDgHFWoQ1gvAynQ9tv/rbIkA//swxAQAB6ArWaC8wTD3k2q0HAwmzNIIaJ0HsxpkvDYlKD36+gaclwsDghBwRsAx6MAqTCXhJJMVCS1kmzcQKFtsUFnNfuV6/41UTa7bW2xogVA6/HiJjJxwI0+G4hKwp6LMjOBIEapcYzaFbCQIeapbG2al+flpUizjqDFvFoEoWiSJ+3a701BbbbvbY2gB9N5uKcN4JGcjO/EO//syxAoAB4BvU6eIyPDkCyr0F4wXFJzW3ydkgmGNlHG/n87/M1qTb3pqxSX3gMsw0lxpLJak+zk6AAfNDlRbdtttbIgBbWWSZfH7I7kLV8V9B3+l5mOCBj13owNsYW6kV3gZEou+n90eY417Umrbir2sx//zfAhG3LpdImQBvWMqIGj0G9tLazVCaqQUd7t641rFChQp/vuTV28oHf/7MsQTgAdQgz2sBGcg8Azn9CwMTKiMbPth65gXk2labgVRdX1qUR7QxKJb/ta2RBGIOzEmrB1sRPb3TbvE1Vf5lXkBjeauqzwSGkYjB4YoefY2GFjxRzFxoX5ghuGv+ep3xVT1CDTks31ljQEFwPEB5MsznwyPKiUpEvEI2EEzBvF7YzBjAw0KB5yKyIqSDQLKB5TFlxG0NPRziuf/+zLEHAAHlFk7oeBiQO+LZvTQmPDdu0W/SAEmhJbZG0gKVYMAbplIkC/NABcImjttty3lm3OJADmtZGAMal/CJUQNLihkXC9whmiMyaW8r01sNUxSxQQ1I3Z/rI1BGsFw/iqffrHT590Ee54MIKosjMOUQGtV+1RwzNk3EbFtNCVoWUxoqhS7W2BChYyr026arghG77rta0RBvvKg//swxCOAB4BrO6EwYgDoEKe0sIz06fpmMopdNQMkHmcXGZHdfVlUz0QjwZfwTjkhCYIiL4TVPH6nGRExblkH+3GU3CQABW4kiQEIaV5xRW85f9Cl+IqQ3dgEwg4GVe5zcziQuRLYEEEKv25lJxxt09iq59Aydl0G1OX75ueAFMEVgeNtpCQLYHgHVyJmM3/pIGIPeW6pDU93Rl7t//syxCwAByh5L0O8YgDtleg8cIysFzggXvekvk5NlrLIVJTBsMcIEqbWimp+f2dtSEIEpOWXa6yNAIVoWRa3mm3TV1zauHcV2ghecU8NI4JpU+7P8Uza0PrUWz4p4lRWxTj6kpfRHQeMy352u8KCSXb3SxoAR5oWCtyfRlvBcewDFtBC0yITQwZWyBmpZ5ZzKiS0LPQ0rQ7aKnRYmv/7MsQ1gAdonTmijE+A7hMntFAMhIpRlh4coZJMISfpogCAFHbI9I0BU+jcolB6abjGCoWYT6z9zhkcLvtwtiDhbRkXh5Tz+qCcYEUQWGDg+9UYbQ0aMuSitiOWmi0rIHZ/0EGYJEUSK9q6owGomfxE+JeJVdXqT2XlTtP/zp306GVrKjjCQIKGBgg4QPu4qKs/8qKioqRf/+oWFhb/+zLEPgAHgJ83oYBkgJAAZ3AQiAYk7i4qKioj/xYGQqKiMMVMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//swxFIDxVQifAGISAAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
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