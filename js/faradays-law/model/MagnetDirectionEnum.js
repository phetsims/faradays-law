// Copyright 2018-2019, University of Colorado Boulder

/**
 * Possible directions for the magnet in Faraday's Law, magnet can move up, down, left, right,
 * and along the diagonals of these orientations.
 *
 * @author Michael Barlow
 */

import faradaysLaw from '../../faradaysLaw.js';

const MagnetDirectionEnum = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  UP: 'UP',
  DOWN: 'DOWN',
  UP_LEFT: 'UP_LEFT',
  UP_RIGHT: 'UP_RIGHT',
  DOWN_LEFT: 'DOWN_LEFT',
  DOWN_RIGHT: 'DOWN_RIGHT',

  /**
   * Returns true if direction is one of the primary relative directions "up", "down", "left", "right".
   *
   * @param {string} direction - one of MagnetDirectionEnum
   * @returns {Boolean}
   */
  isRelativeDirection: direction => {
    return direction === MagnetDirectionEnum.LEFT ||
           direction === MagnetDirectionEnum.RIGHT ||
           direction === MagnetDirectionEnum.UP ||
           direction === MagnetDirectionEnum.DOWN;
  }
};

// verify that enum is immutable, without the runtime penalty in production code
if ( assert ) { Object.freeze( MagnetDirectionEnum ); }

faradaysLaw.register( 'MagnetDirectionEnum', MagnetDirectionEnum );
export default MagnetDirectionEnum;