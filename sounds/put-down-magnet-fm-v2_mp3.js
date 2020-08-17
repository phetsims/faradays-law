/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAABpRjVHSTABErEu6DHvAAAABkAxcLgmGzdIEDc6UYhc5xGfxGWQQcmnsQ5AhH8Rh4ACEOD4Pz4nB+H+Xf/KO78Pl3/1qkwDrEjSQbCwknBhMo0kA/dRA5IMiGLRCS3GS6T8Bpcx9qV6ZqvZ4ivYoTMxIarYqtcJts91drU/+/a294iWpnflxjWYl4RPxUlQpsuosggEp3//syxAOACHzHebzzgBELmO209Z16gH66Uw3g1aEktQk0X8BPNiHTq2LIUOFQ3FAe85WOicHw8tDq8kdOdXKdH7s7e2VbtN6f1/xsLA0/d5R8N2C6qAMJFuAAur1WD/FC7Jor1Idhywgj8Y9fBcLga+82RSEUIoX7rOXkVTucoXFp3cx+FSI19C+C00l0Xv82d/jU176wbV4jAJJQAP/7MsQEAAh8kWentPRxDZTs9PY2Rnahi7EUAhUDPNxCy/K8mZDd+m07/K+M5a/U78lrITsaQTJV98rPTrA+cBT1+DxxKfo+Apw0sbK5H4hd01jeXtYuSUACGwyFSFTUfS5XB7Rz1CZtlw3T9fiC7Pv3/eTBqPoeU21VYdSVRU6I5SRC4tZugS5mat+iJigef9Zs9QGqA5sMKKAACrr/+zLEBAAIcI9FTTzr0Q4PZvW4raiqsoz+5CJTV1uZZsJEZ+df/rllR5tb1fdWoe4nIjKdr/uCy62SlzgODewF6MKDGoYU3OEoqR/UQBMBeVABZcAofrFoHaWHk0TEK8aKXOnJ+vk3GK4bbyGlEB1E+qqmZcFJgUYn0fR/TbOB+Q9LcqdcKQ6j+Pd/onUXUyP//6/oAQJ9RsECCrah//swxASAB3BbLU2F6KCtiGdw8JTmKcQNjh47aZB9JgND76sw2FcJvE3rW9Phioenaf5hbtMo4EZSw7xq937fSvVp7P87d2liSklG3fqEfVi6iGrDnMbiejPcSFqeMAIGxi1mBcgVCIApKqm2f6v/3f+/0yw23G2VIENelC6GPYN6etv6uKsu3avT/23W/9moVlqCkiiqHHPJUpbU//syxBSAA5gDNYAEQDCBgKVoIIwCX7Nenc0jdf0Ldo/6dX/RFNDbp3QqA/e9NpNLgpvY9StFle+m69pF93/p45VTW/a320b25i4o4LhddgLAwIBld1D5BDSCf9o4aTN+7/o+r///6RJJZJZ/kARVdgrRWhEpfMXXuW0cq+z/67tv6QACRGEU2klwYVRUBaS0zRejSJIniQXHCVCHOf/7MsQ5gAQcASlABEAAcIBotACIBrFvUWtSrWTAalOXP9tpdm9dm5dSS220QRhAIGXjbgqFLV7+n9DTR77v89o////0gBSqANtlACAihKSLGv/du2HWzx3zvb7GdXoLFft/pK+lTEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+zLEXwADYAM9gARAMLeAZHQQiABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//swxH6AA4QDQaAAQDCCgGL0AQgEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
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