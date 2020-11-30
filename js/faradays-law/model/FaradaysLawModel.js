// Copyright 2014-2020, University of Colorado Boulder

/**
 * Model container for the 'Faradays Law' simulation.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Sam Reid (PhET Interactive Simulations)
 */

// modules
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Line from '../../../../kite/js/segments/Line.js';
import faradaysLaw from '../../faradaysLaw.js';
import FaradaysLawConstants from '../FaradaysLawConstants.js';
import CoilTypeEnum from '../view/CoilTypeEnum.js';
import Coil from './Coil.js';
import Magnet from './Magnet.js';
import Voltmeter from './Voltmeter.js';

// constants

// Values used for the restricted zones where the magnet can't be dragged due to the presence of the coils.  These
// numbers were empirically determined based upon how the artwork for the coils appear in the view.
const COIL_RESTRICTED_AREA_HEIGHT = 11;
const TOP_COIL_RESTRICTED_AREA_WIDTH = 25;
const BOTTOM_COIL_RESTRICTED_AREA_WIDTH = 55;

// Minimum distance between the magnet and the restricted areas (i.e. the coils) or the motion bounds.  This is used to
// make sure that the magnet never goes through anything.
const MIN_MAGNET_TO_OBJECT_DISTANCE = 0.01;

class FaradaysLawModel {

  /**
   * @param {Bounds2} bounds of Screen
   * @param {Tandem} tandem
   */
  constructor( bounds, tandem ) {

    // @public (read-only) (Bounds2}
    this.bounds = bounds;

    // @public - Whether the top coil should be shown
    this.topCoilVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'topCoilVisibleProperty' ),
      phetioDocumentation: 'True if and only if the top coil is visible'
    } );

    // @public - true if the magnet arrows should be shown
    this.magnetArrowsVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'magnetArrowsVisibleProperty' ),
      phetioDocumentation: 'True if the magnet arrows are shown'
    } );

    // @public
    this.voltmeterVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'voltmeterVisibleProperty' ),
      phetioDocumentation: 'True if the voltmeter is shown'
    } );

    // @public {NumberProperty} Voltage indicated by the voltmeter. This drives the needle position and the light bulb brightness.
    this.voltageProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'voltageProperty' ),
      phetioDocumentation: 'Voltage indicated by the voltmeter. This drives the needle position and the light bulb brightness.',
      phetioReadOnly: true,
      phetioHighFrequency: true,
      units: 'volts'
    } );

    // @public - the magnet which can be dragged
    this.magnet = new Magnet( tandem.createTandem( 'magnet' ) );

    // @public - bottom coil
    this.bottomCoil = new Coil( FaradaysLawConstants.BOTTOM_COIL_POSITION, 4, this.magnet );

    // @public - top coil
    this.topCoil = new Coil( FaradaysLawConstants.TOP_COIL_POSITION, 2, this.magnet );

    // @public (read-only) {Bounds2[]} - Regions where the magnet cannot be dragged.  There are two for each coil, one for
    // the upper portion of the coil and one for the lower portion.  The hard coded numbers are empirically determined
    // based upon how the artwork for the coils ended up projecting into the view.
    this.topCoilRestrictedBounds = [

      // upper portion of the coil
      Bounds2.rect(
        this.topCoil.position.x - 7,
        this.topCoil.position.y - 76,
        TOP_COIL_RESTRICTED_AREA_WIDTH,
        COIL_RESTRICTED_AREA_HEIGHT
      ),

      // lower portion of the coil
      Bounds2.rect(
        this.topCoil.position.x,
        this.topCoil.position.y + 67,
        TOP_COIL_RESTRICTED_AREA_WIDTH,
        COIL_RESTRICTED_AREA_HEIGHT
      )
    ];
    this.bottomCoilRestrictedBounds = [

      // upper portion of the coil
      Bounds2.rect(
        this.bottomCoil.position.x - 30,
        this.bottomCoil.position.y - 76,
        BOTTOM_COIL_RESTRICTED_AREA_WIDTH,
        COIL_RESTRICTED_AREA_HEIGHT
      ),

      // lower portion of the coil
      Bounds2.rect(
        this.bottomCoil.position.x - 23,
        this.bottomCoil.position.y + 67,
        BOTTOM_COIL_RESTRICTED_AREA_WIDTH,
        COIL_RESTRICTED_AREA_HEIGHT
      )
    ];

    // @public - the Voltmeter
    this.voltmeter = new Voltmeter( this );

    // @public (read-only)
    this.resetInProgressProperty = new BooleanProperty( false );

    // @public (listen-only) - emitter that fires when the magnet bumps into a coil
    this.coilBumpEmitter = new Emitter( { parameters: [ { valueType: CoilTypeEnum } ] } );

    // @public (listen-only) - emitter that fires when the magnet bumps into the outer drag bounds
    this.edgeBumpEmitter = new Emitter();

    // @private - see this.moveMagnetToPosition method, used to calculate allowed magnet positions
    this.intersectedBounds = null;

    // @private {Bounds2|null} - bounds where magnet was set to on the last movement attempt, used to detect transitions
    // between being totally in bounds and reaching the boundary edge
    this.previousMagnetBounds = null;

    // @private {Bounds2|null} - bounds that restricted the magnet's motion the last time its position was set, if any
    this.previousBoundsThatLimitedMotion = null;

    // If the magnet intersects the top coil area when the top coil is shown, then reset the magnet.
    this.topCoilVisibleProperty.link( showTopCoil => {
      if ( showTopCoil && this.magnetIntersectsTopCoilArea() ) {
        this.magnet.positionProperty.reset();
      }
      this.intersectedBounds = null;
      this.topCoil.reset();
    } );
  }

  /**
   * Restore to initial conditions
   * @public
   */
  reset() {
    this.resetInProgressProperty.set( true );
    this.magnet.reset();
    this.topCoilVisibleProperty.reset();
    this.magnetArrowsVisibleProperty.reset();
    this.bottomCoil.reset();
    this.topCoil.reset();
    this.voltmeterVisibleProperty.reset();
    this.resetInProgressProperty.set( false );
  }

  /**
   * Move the model forward in time
   * @param {number} dt - in seconds
   * @public
   */
  step( dt ) {
    this.bottomCoil.step( dt );
    this.topCoilVisibleProperty.get() && this.topCoil.step( dt );
    this.voltmeter.step( dt );
  }

  /**
   * Returns true if magnet intersects coil bounds
   * @returns {boolean}
   * @private
   */
  magnetIntersectsTopCoilArea() {
    const magnetBounds = Bounds2.point( this.magnet.positionProperty.get() ).dilatedXY( this.magnet.width / 2, this.magnet.height / 2 );
    return magnetBounds.intersectsBounds(
      this.topCoilRestrictedBounds[ 1 ] ) || magnetBounds.intersectsBounds( this.topCoilRestrictedBounds[ 0 ]
    );
  }

  /**
   * Return one of the model's restricted bounds if it intersects with the given bounds. Can return null.
   * @param  {Bounds2} bounds
   * @returns {Bounds2|null}
   * @public
   */
  getIntersectedRestrictedBounds( bounds ) {

    let intersectedRestrictedBounds = null;

    // Handle whether one or both coils are visible.
    let restrictedBoundsList = [ ...this.bottomCoilRestrictedBounds ];
    if ( this.topCoilVisibleProperty.get() ) {
      restrictedBoundsList = restrictedBoundsList.concat( this.topCoilRestrictedBounds );
    }

    // test against all restricted bounds
    for ( let i = 0; i < restrictedBoundsList.length; i++ ) {
      if ( bounds.intersectsBounds( restrictedBoundsList[ i ] ) ) {
        intersectedRestrictedBounds = restrictedBoundsList[ i ];
        break;
      }
    }

    return intersectedRestrictedBounds;
  }

  /**
   * Given the leading edges for a rectangular moving object, a proposed translation, and the edges from another object
   * or boundary with which the first one could collide, return a value representing the amount of the translation that
   * could occur without collision.
   * @param {{verticalEdge: Line, horizontalEdge: Line }} leadingEdgeLines
   * @param {Vector2} proposedTranslation
   * @param {{verticalEdge: Line, horizontalEdge: Line }} obstacleEdgeLines
   * @returns {Vector2} - either a copy of the proposed translation or, if the obstacle edges would interfere with the
   * proposed motion, and limited version thereof
   * @private
   */
  checkObjectMotion( leadingEdgeLines, proposedTranslation, obstacleEdgeLines ) {

    // If there is no actual motion proposed, there is nothing to do here.  This is done as an optimization.
    if ( proposedTranslation.x === 0 && proposedTranslation.y === 0 ) {
      return proposedTranslation;
    }

    // Start by assuming that the entire amount of the translation will work.
    let allowedHorizontalMotion = proposedTranslation.x;
    let allowedVerticalMotion = proposedTranslation.y;

    // Check the horizontal motion and limit it if necessary.
    const horizontalDelta = obstacleEdgeLines.verticalEdge.start.x - leadingEdgeLines.verticalEdge.start.x;

    // Test if the restricted bounds are within a distance and on a side where interference could occur.
    if ( Math.sign( proposedTranslation.x ) === Math.sign( horizontalDelta ) &&
         Math.abs( proposedTranslation.x ) >= Math.abs( horizontalDelta ) ) {

      // Test whether the leading edge line would overlap with the bounds edge if projected to the same location.  In
      // other words, would these two lines collide with each other when moved by the proposed translation?
      const translationScaleFactor = horizontalDelta / proposedTranslation.x;
      assert && assert( translationScaleFactor <= 1, 'if we hit this, something is wrong in the code above' );
      const scaledDownTranslation = proposedTranslation.timesScalar( translationScaleFactor );
      const projectedLineStartPoint = leadingEdgeLines.verticalEdge.start.plus( scaledDownTranslation );
      const projectedLineEndPoint = leadingEdgeLines.verticalEdge.end.plus( scaledDownTranslation );

      // Does the translated leading edge line overlap with the restricted bounds?
      const edgeLinesOverlap = ( projectedLineEndPoint.y > obstacleEdgeLines.verticalEdge.start.y &&
                                 projectedLineStartPoint.y < obstacleEdgeLines.verticalEdge.end.y ) ||
                               ( projectedLineStartPoint.y < obstacleEdgeLines.verticalEdge.end.y &&
                                 projectedLineEndPoint.y > obstacleEdgeLines.verticalEdge.start.y );

      if ( edgeLinesOverlap ) {

        // The proposed translation would cause the edge lines to collide, so limit the horizontal motion to an amount
        // where overlap will not occur.
        allowedHorizontalMotion = Math.sign( horizontalDelta ) === 1 ?
                                  horizontalDelta - MIN_MAGNET_TO_OBJECT_DISTANCE :
                                  horizontalDelta + MIN_MAGNET_TO_OBJECT_DISTANCE;
      }
    }

    // Check the vertical motion and limit it if necessary.
    const verticalDelta = obstacleEdgeLines.horizontalEdge.start.y - leadingEdgeLines.horizontalEdge.start.y;

    // Test if the restricted bounds are within a distance and on a side where interference could occur.
    if ( Math.sign( proposedTranslation.y ) === Math.sign( verticalDelta ) &&
         Math.abs( proposedTranslation.y ) >= Math.abs( verticalDelta ) ) {

      // Test whether the leading edge line would overlap with the bounds edge if projected to the same location.  In
      // other words, would these two lines collide with each other when moved by the proposed translation?
      const translationScaleFactor = verticalDelta / proposedTranslation.y;
      assert && assert( translationScaleFactor < 1, 'if we hit this, something is wrong in the code above' );
      const scaledDownTranslation = proposedTranslation.timesScalar( translationScaleFactor );
      const projectedLineStartPoint = leadingEdgeLines.horizontalEdge.start.plus( scaledDownTranslation );
      const projectedLineEndPoint = leadingEdgeLines.horizontalEdge.end.plus( scaledDownTranslation );

      // Does the translated leading edge line overlap with the restricted bounds?
      const edgeLinesOverlap = ( projectedLineEndPoint.x > obstacleEdgeLines.horizontalEdge.start.x &&
                                 projectedLineStartPoint.x < obstacleEdgeLines.horizontalEdge.end.x ) ||
                               ( projectedLineStartPoint.x < obstacleEdgeLines.horizontalEdge.end.x &&
                                 projectedLineEndPoint.x > obstacleEdgeLines.horizontalEdge.start.x );

      if ( edgeLinesOverlap ) {

        // The proposed translation would cause the edge lines to collide, so limit the vertical motion to an amount
        // where overlap will not occur.
        allowedVerticalMotion = Math.sign( verticalDelta ) === 1 ?
                                verticalDelta - MIN_MAGNET_TO_OBJECT_DISTANCE :
                                verticalDelta + MIN_MAGNET_TO_OBJECT_DISTANCE;
      }
    }

    return new Vector2( allowedHorizontalMotion, allowedVerticalMotion );
  }

  /**
   * Given a proposed translation, get the horizontal and vertical leading edge lines for the magnet.  For instance,
   * if the proposed translation is to the right, the right side of the magnet would be the leading edge.  This is used
   * for collision detection.
   * @param {Vector2} proposedTranslation
   * @returns {{horizontalEdge: Line, verticalEdge: Line}} - an object with the horizontal and vertical leading edges
   * @private
   */
  getMagnetLeadingEdgeLines( proposedTranslation ) {

    const currentMagnetBounds = this.magnet.getBounds();
    let leadingHorizontalEdge;
    let leadingVerticalEdge;

    if ( proposedTranslation.x > 0 ) {

      // The leading vertical edge is the right side of the magnet.
      leadingVerticalEdge = new Line(
        new Vector2( currentMagnetBounds.maxX, currentMagnetBounds.minY ),
        new Vector2( currentMagnetBounds.maxX, currentMagnetBounds.maxY )
      );
    }
    else {

      // The leading vertical edge is the left side of the magnet.
      leadingVerticalEdge = new Line(
        new Vector2( currentMagnetBounds.minX, currentMagnetBounds.minY ),
        new Vector2( currentMagnetBounds.minX, currentMagnetBounds.maxY )
      );
    }

    if ( proposedTranslation.y > 0 ) {

      // The leading horizontal edge is the bottom of the magnet (increasing Y is in the downward direction).
      leadingHorizontalEdge = new Line(
        new Vector2( currentMagnetBounds.minX, currentMagnetBounds.maxY ),
        new Vector2( currentMagnetBounds.maxX, currentMagnetBounds.maxY )
      );
    }
    else {

      // The leading horizontal edge is the top of the magnet (decreasing Y is in the upward direction).
      leadingHorizontalEdge = new Line(
        new Vector2( currentMagnetBounds.minX, currentMagnetBounds.minY ),
        new Vector2( currentMagnetBounds.maxX, currentMagnetBounds.minY )
      );
    }

    return {
      horizontalEdge: leadingHorizontalEdge,
      verticalEdge: leadingVerticalEdge
    };
  }

  /**
   * Get the edges of a rectangular obstacle or container that could potentially block the motion of an object moving
   * with the proposed translation.
   * @param {Vector2} proposedTranslation
   * @param {Bounds2} obstacleOrContainerBounds
   * @param {boolean} obstacle - If true, return the potentially blocking edges assuming that the obstacle is
   * potentially in the way of the proposed motion, otherwise assume that the bounds are a container that is limiting
   * the proposed motion.
   * @returns {{horizontalEdge: Line, verticalEdge: Line}} - an object with the horizontal and vertical edges with
   * which an object moving in the proposed direction could potentially collide
   * @private
   */
  getPotentiallyBlockingObstacleEdges( proposedTranslation, obstacleOrContainerBounds, obstacle = true ) {

    let horizontalEdge;
    let verticalEdge;

    if ( proposedTranslation.x > 0 && obstacle || proposedTranslation.x < 0 && !obstacle ) {

      // The edge that could get in the way is the left side of the object or container.
      verticalEdge = new Line(
        new Vector2( obstacleOrContainerBounds.minX, obstacleOrContainerBounds.minY ),
        new Vector2( obstacleOrContainerBounds.minX, obstacleOrContainerBounds.maxY )
      );
    }
    else {

      // The edge that could get in the way is the right side of the object or container.
      verticalEdge = new Line(
        new Vector2( obstacleOrContainerBounds.maxX, obstacleOrContainerBounds.minY ),
        new Vector2( obstacleOrContainerBounds.maxX, obstacleOrContainerBounds.maxY )
      );
    }

    if ( proposedTranslation.y > 0 && obstacle || proposedTranslation.y < 0 && !obstacle ) {

      // The edge that could get in the way is the top of the object or container (increasing Y is in the downward
      // direction).
      horizontalEdge = new Line(
        new Vector2( obstacleOrContainerBounds.minX, obstacleOrContainerBounds.minY ),
        new Vector2( obstacleOrContainerBounds.maxX, obstacleOrContainerBounds.minY )
      );
    }
    else {

      // The edge that could get in the way is the bottom of the object (decreasing Y is in the upward direction).
      horizontalEdge = new Line(
        new Vector2( obstacleOrContainerBounds.minX, obstacleOrContainerBounds.maxY ),
        new Vector2( obstacleOrContainerBounds.maxX, obstacleOrContainerBounds.maxY )
      );
    }

    return {
      horizontalEdge: horizontalEdge,
      verticalEdge: verticalEdge
    };
  }

  /**
   * Move the magnet to the proposed position unless doing so would cause it to move through obstacles or out of the
   * sim bounds.  In those cases, limit the motion to what can be allowed.
   * @param {Vector2} proposedPosition - a proposed position for the magnet
   * @public
   */
  moveMagnetToPosition( proposedPosition ) {

    const proposedTranslation = proposedPosition.minus( this.magnet.positionProperty.value );

    // Make a list of the restricted bounds that could block the magnet's motion.  This varies based on which coils are
    // currently visible.
    let restrictedBoundsList = [ ...this.bottomCoilRestrictedBounds ];
    if ( this.topCoilVisibleProperty.value ) {
      restrictedBoundsList = this.bottomCoilRestrictedBounds.concat( this.topCoilRestrictedBounds );
    }

    // Get a set of lines that represent the leading edges of the magnet if it is moved using the proposed translation.
    const leadingMagnetEdges = this.getMagnetLeadingEdgeLines( proposedTranslation );

    // Test the proposed motion against the potential obstacles, which, in this sim, are the coils.
    let smallestAllowedTranslation = proposedTranslation.copy();
    let boundsThatLimitedMotion = null;
    restrictedBoundsList.forEach( restrictedBounds => {
      const obstacleEdgeLines = this.getPotentiallyBlockingObstacleEdges( proposedTranslation, restrictedBounds );
      const allowedTranslation = this.checkObjectMotion(
        leadingMagnetEdges,
        proposedTranslation,
        obstacleEdgeLines
      );
      if ( !allowedTranslation.equals( proposedTranslation ) ) {

        // An obstacle was encountered, so limit the allowed motion.
        if ( smallestAllowedTranslation.magnitude > allowedTranslation.magnitude ) {
          smallestAllowedTranslation = allowedTranslation;
          boundsThatLimitedMotion = restrictedBounds;
        }
      }
    } );

    // If the motion was limited due to running into an obstacle, determine if an event should be emitted that indicates
    // that a coil was bumped.
    if ( boundsThatLimitedMotion && boundsThatLimitedMotion !== this.previousBoundsThatLimitedMotion ) {
      if ( this.bottomCoilRestrictedBounds.includes( boundsThatLimitedMotion ) ) {
        this.coilBumpEmitter.emit( CoilTypeEnum.FOUR_COIL );
      }
      else {
        this.coilBumpEmitter.emit( CoilTypeEnum.TWO_COIL );
      }
    }

    // If there were no obstacles encountered, test against the edges of the sim area.  Strictly speaking, this is not
    // entirely general, but this sim is set up such that it is impossible to encounter edges and obstacles at the same
    // time, so it isn't necessary to test for both.
    if ( smallestAllowedTranslation.equals( proposedTranslation ) ) {

      const boundaryEdgeLines = this.getPotentiallyBlockingObstacleEdges( proposedTranslation, this.bounds, false );
      smallestAllowedTranslation = this.checkObjectMotion(
        leadingMagnetEdges,
        proposedTranslation,
        boundaryEdgeLines
      );
    }

    // Set the resultant position.
    const newPosition = this.magnet.positionProperty.value.plus( smallestAllowedTranslation );
    this.magnet.positionProperty.set( newPosition );

    // Figure out what the bounds ended up being.
    const finalMagnetBounds = this.magnet.getBounds();

    // Check whether the position has changed such that the magnet has hit a boundary.
    if ( this.previousMagnetBounds ) {
      const boundsWithMargin = this.bounds.dilated( -MIN_MAGNET_TO_OBJECT_DISTANCE );

      // The following rounding was necessary to work around a floating point issue.
      const digitsToTest = 10;
      const previousMagnetBoundsMinX = Utils.toFixedNumber( this.previousMagnetBounds.minX, digitsToTest );
      const finalMagnetBoundsMinX = Utils.toFixedNumber( finalMagnetBounds.minX, digitsToTest );

      // If the magnet is now up against the bounds, and it wasn't before, fire the edgeBumpEmitter.
      if ( ( this.previousMagnetBounds.maxX < boundsWithMargin.maxX && finalMagnetBounds.maxX >= boundsWithMargin.maxX ) ||
           ( previousMagnetBoundsMinX > boundsWithMargin.minX && finalMagnetBoundsMinX <= boundsWithMargin.minX ) ||
           ( this.previousMagnetBounds.maxY < boundsWithMargin.maxY && finalMagnetBounds.maxY >= boundsWithMargin.maxY ) ||
           ( this.previousMagnetBounds.minY > boundsWithMargin.minY && finalMagnetBounds.minY <= boundsWithMargin.minY )
      ) {
        this.edgeBumpEmitter.emit();
      }
    }

    // Keep a record of the magnet bounds so that edge bumps can be detected.
    this.previousMagnetBounds = finalMagnetBounds;

    // Keep a record of any bounds that limited the motion so we can use them to detect new obstacle bumps.
    this.previousBoundsThatLimitedMotion = boundsThatLimitedMotion;
  }
}

faradaysLaw.register( 'FaradaysLawModel', FaradaysLawModel );
export default FaradaysLawModel;