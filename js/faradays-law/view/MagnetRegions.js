// Copyright 2018, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var CoilTypeEnum = require( 'FARADAYS_LAW/faradays-law/view/CoilTypeEnum' );
  var Emitter = require( 'AXON/Emitter' );
  var faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  var FaradaysLawConstants = require( 'FARADAYS_LAW/faradays-law/FaradaysLawConstants' );
  // var Magnet = require( 'FARADAYS_LAW/faradays-law/model/Magnet' );
  var MagnetDirectionEnum = require( 'FARADAYS_LAW/faradays-law/model/MagnetDirectionEnum' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  // var OrientationEnum = require( 'FARADAYS_LAW/faradays-law/model/OrientationEnum' );
  // var Range = require( 'DOT/Range' );
  // var Shape = require( 'KITE/Shape' );
  var Util = require( 'DOT/Util' );
  // var Vector2 = require( 'DOT/Vector2' );

  // constants
  var NUMBER_OF_ROWS = 3;
  var EDGE_TOLERANCE = 5;
  var VERTICAL_EDGE_TOLERANCE = Util.roundSymmetric( FaradaysLawConstants.MAGNET_HEIGHT / 2 ) + EDGE_TOLERANCE;
  var HORIZONTAL_EDGE_TOLERANCE = Util.roundSymmetric( FaradaysLawConstants.MAGNET_WIDTH / 2 ) + EDGE_TOLERANCE;
  const { LEFT, RIGHT, UP, DOWN, UP_LEFT, UP_RIGHT, DOWN_LEFT, DOWN_RIGHT } = MagnetDirectionEnum;
  const DIRECTION_LIST = [ LEFT, UP_LEFT, UP, UP_RIGHT, RIGHT, DOWN_RIGHT, DOWN, DOWN_LEFT ];

  var angleToDirection = LinearFunction( -Math.PI, Math.PI, 0, 8 );

  var coilProximityToRegion = new LinearFunction( 95, 260, 1, 3, true ); // determined empirically from sim testing

  var rowHeight = Util.roundSymmetric( FaradaysLawConstants.LAYOUT_BOUNDS.getHeight() / NUMBER_OF_ROWS );
  var columnWidth = Util.roundSymmetric( FaradaysLawConstants.LAYOUT_BOUNDS.getWidth() / NUMBER_OF_ROWS );


  function MagnetRegions( model ) {

    this.model = model;
    this.magnet = model.magnet;
    this.topCoil = model.topCoil;
    this.bottomCoil = model.bottomCoil;
    this.bounds = model.bounds;

    // generate bounds to indicate if magnet is inside the coil
    this._topCoilInnerBounds = new Bounds2(
      Math.min( model.listOfRestrictedBounds[ 0 ].minX, model.listOfRestrictedBounds[ 1 ].minX ),
      Math.min( model.listOfRestrictedBounds[ 0 ].minY, model.listOfRestrictedBounds[ 1 ].minY ),
      Math.max( model.listOfRestrictedBounds[ 0 ].maxX, model.listOfRestrictedBounds[ 1 ].maxX ),
      Math.max( model.listOfRestrictedBounds[ 0 ].maxY, model.listOfRestrictedBounds[ 1 ].maxY )
    );

    this._bottomCoilInnerBounds = new Bounds2(
      Math.min( model.listOfRestrictedBounds[ 2 ].minX, model.listOfRestrictedBounds[ 3 ].minX ),
      Math.min( model.listOfRestrictedBounds[ 2 ].minY, model.listOfRestrictedBounds[ 3 ].minY ),
      Math.max( model.listOfRestrictedBounds[ 2 ].maxX, model.listOfRestrictedBounds[ 3 ].maxX ),
      Math.max( model.listOfRestrictedBounds[ 2 ].maxY, model.listOfRestrictedBounds[ 3 ].maxY )
    );

    this.oldDirection = null;
    this.currentDirection = null;

    this.oldStepSize = 0;
    this.currentStepSize = 0;

    this.coilEntranceDirectionEmitter = new Emitter();
    this.coilExitEmitter = new Emitter();
    this.regionChangedEmitter = new Emitter();
    // this.proximityChangedEmitter = new Emitter();
    // this.fieldStrengthChangedEmitter = new Emitter();
    this.proximityOrFieldStrengthChangedEmiter = new Emitter();
    this.directionChangedEmitter = new Emitter();

    this.silenceFieldStrengthAndProximity = false;

    this.magnet.positionProperty.lazyLink( ( newPosition, oldPosition ) => {
      let newRegion = this.getRegion( newPosition );
      let oldRegion = this.getRegion( oldPosition );
      if ( newRegion !== oldRegion )
      {
        this.regionChangedEmitter.emit2( newRegion, oldRegion );
      }

      let newCoilEntranceRegion = this.getCoilEntranceRegion( newPosition );
      let oldCoilEntranceRegion = this.getCoilEntranceRegion( oldPosition );

      if ( newCoilEntranceRegion !== oldCoilEntranceRegion ) {
        if ( model.showTopCoilProperty.get() ||
           ( oldCoilEntranceRegion !== CoilTypeEnum.TWO_COIL && newCoilEntranceRegion !== CoilTypeEnum.TWO_COIL ) )
        {
          this.coilEntranceDirectionEmitter.emit1( newCoilEntranceRegion );
          this.silenceFieldStrengthAndProximity = true;
        }
      }

      let exitingCoil = this.isExitingCoil( newPosition, oldPosition );

      if ( exitingCoil && ( exitingCoil !== CoilTypeEnum.TWO_COIL || model.showTopCoilProperty.get() ) ) {
        this.coilExitEmitter.emit1( exitingCoil );
        this.silenceFieldStrengthAndProximity = true;
      }

      if ( !this.silenceFieldStrengthAndProximity ) {
        let newTopCoilProximity = this.getTopCoilProximityRegion( newPosition );
        let newBottomCoilProximity = this.getBottomCoilProximityRegion( newPosition );
        let oldTopCoilProximity = this.getTopCoilProximityRegion( oldPosition );
        let oldBottomCoilProximity = this.getBottomCoilProximityRegion( oldPosition );

        let newTopCoilFieldStrength = this.getTopCoilFieldStrengthRegion( newPosition );
        let newBottomCoilFieldStrength = this.getBottomCoilFieldStrengthRegion( newPosition );
        let oldTopCoilFieldStrength = this.getTopCoilFieldStrengthRegion( oldPosition );
        let oldBottomCoilFieldStrength = this.getBottomCoilFieldStrengthRegion( oldPosition );

        if ( ( newTopCoilProximity !== oldTopCoilProximity ) ||
             ( newBottomCoilProximity !== oldBottomCoilProximity ) ||
             ( newTopCoilFieldStrength !== oldTopCoilFieldStrength ) ||
             ( newBottomCoilFieldStrength !== oldBottomCoilFieldStrength ) )
        {
          let topCoilData = { proximity: newTopCoilProximity, fieldStrength: newTopCoilFieldStrength };
          let bottomCoilData = { proximity: newBottomCoilProximity, fieldStrength: newBottomCoilFieldStrength };
          this.proximityOrFieldStrengthChangedEmiter.emit2( bottomCoilData, topCoilData );
        }
      }

      this.silenceFieldStrengthAndProximity = false;

      this.currentDirection = MagnetRegions.getDirection( newPosition, oldPosition );

      if ( this.currentDirection !== this.oldDirection ) {
        // or if this is the first move after focus
        // or if the step size is different
        this.directionChangedEmitter.emit1( this.currentDirection );
        this.oldDirection = this.currentDirection;
      }
    } );

    model.showTopCoilProperty.link( showTopCoil => {
      let entranceRegion = this.getCoilEntranceRegion( this.magnet.positionProperty.get() );
      if ( entranceRegion === CoilTypeEnum.TWO_COIL ) {
        entranceRegion = showTopCoil ? entranceRegion : CoilTypeEnum.NO_COIL;
        this.coilEntranceDirectionEmitter.emit1( entranceRegion );
      }
    } );
  }

  faradaysLaw.register( 'MagnetRegions', MagnetRegions );

  return inherit( Object, MagnetRegions, {

    isExitingCoil: function( newPosition, oldPosition ) {
      var newMagnetBounds = createMagnetBounds( newPosition );
      var oldMagnetBounds = createMagnetBounds( oldPosition );
      if ( this._bottomCoilInnerBounds.intersectsBounds( oldMagnetBounds ) &&
           !this._bottomCoilInnerBounds.intersectsBounds( newMagnetBounds ) )
      {
        return CoilTypeEnum.FOUR_COIL;
      }

      if ( this._topCoilInnerBounds.intersectsBounds( oldMagnetBounds ) &&
           !this._topCoilInnerBounds.intersectsBounds( newMagnetBounds ) )
      {
        return CoilTypeEnum.TWO_COIL;
      }

      return false;
    },

    isExitingTopCoil: function( newPosition, oldPosition ) {
      var oldIn = this._topCoilInnerBounds.containsPoint( oldPosition );
      var newOut = !this._topCoilInnerBounds.containsPoint( newPosition );
      return oldIn && newOut;
    },

    isExitingBottomCoil: function( newPosition, oldPosition ) {
      var oldIn = this._bottomCoilInnerBounds.containsPoint( oldPosition );
      var newOut = !this._bottomCoilInnerBounds.containsPoint( newPosition );
      return oldIn && newOut;
    },

    getCoilEntranceRegion: function( vector ) {
      var y = vector.y;

      if ( y <= this._topCoilInnerBounds.maxY && y >= this._topCoilInnerBounds.minY ) {
        return CoilTypeEnum.TWO_COIL;
      }

      if ( y <= this._bottomCoilInnerBounds.maxY && y >= this._bottomCoilInnerBounds.minY ) {
        return CoilTypeEnum.FOUR_COIL;
      }

      return CoilTypeEnum.NO_COIL;
    },

    get coilDirection() {
      var coilsCenterX = this.topCoil.position.x + ( this.bottomCoil.position.x - this.topCoil.position.x ) / 2;
      return ( this.magnet.positionProperty.get().x - coilsCenterX ) < 0 ? RIGHT : LEFT;
    },

    getBottomCoilDirection: function( vector ) {
      return ( vector.x - this.bottomCoil.position ) < 0 ? RIGHT : LEFT;
    },

    get currentRegion() {
      return this.getRegion( this.magnet.positionProperty.get() );
    },

    getRegion: function( vector ) {
      return ( NUMBER_OF_ROWS * this.getRow( vector.y ) ) + this.getColumn( vector.x );
    },

    getRow: function( y ) {
      return this.mapSegment( y, rowHeight );
    },

    getColumn: function( x ) {
      return this.mapSegment( x, columnWidth );
    },

    mapSegment: function( num, interval ) {
      for ( let i = 0; i < NUMBER_OF_ROWS; i++ ) {
        if ( num <= ( i + 1 ) * interval ) {
          return i;
        }
      }
      return NUMBER_OF_ROWS - 1;
    },

    isVectorAtEdge: function( { x, y } ) {
      const { minX, minY, maxX, maxY } = this.bounds;
      const verticalMinDistance = Math.min( Math.abs( y - minY ), Math.abs( y - maxY ) );
      const horizontalMinDistance = Math.min( Math.abs( x - minX ), Math.abs( x - maxX ) );

      return verticalMinDistance <= VERTICAL_EDGE_TOLERANCE || horizontalMinDistance <= HORIZONTAL_EDGE_TOLERANCE;
    },

    get magnetAtEdge() {
      return this.isVectorAtEdge( this.magnet.positionProperty.get() );
    },

    get magnetToTopCoilProximity() {
      return this.getTopCoilProximityRegion( this.magnet.positionProperty.get() );
    },

    get magnetToBottomCoilProximity() {
      return this.getBottomCoilProximityRegion( this.magnet.positionProperty.get() );
    },

    getTopCoilProximityRegion( vector ) {
      return this.getCoilProximityRegion( vector, CoilTypeEnum.TWO_COIL );
    },

    getBottomCoilProximityRegion( vector ) {
      return this.getCoilProximityRegion( vector, CoilTypeEnum.FOUR_COIL );
    },

    getCoilProximityRegion: function( vector, coilType ) {
      var magnetBounds = createMagnetBounds( vector );
      var coilBounds = coilType === CoilTypeEnum.TWO_COIL ? this._topCoilInnerBounds : this._bottomCoilInnerBounds;

      if ( coilBounds.intersectsBounds( magnetBounds ) ) {
        return 0;
      }

      var distance = this.getDistanceToCoil( vector, coilType );

      return Util.roundSymmetric( coilProximityToRegion( distance ) );
    },

    getDistanceToCoil: function( position, coilType ) {
      var coilPosition = coilType === CoilTypeEnum.TWO_COIL ? this.topCoil.position : this.bottomCoil.position;
      return position.distance( coilPosition );
    },

    getTopCoilFieldStrengthRegion: function() {
      return this.getFieldStrengthAtCoilRegion( this.topCoil );
    },

    getBottomCoilFieldStrengthRegion: function() {
      return this.getFieldStrengthAtCoilRegion( this.bottomCoil );
    },

    getFieldStrengthAtCoilRegion: function( coil ) {
      if ( coil.position.distance( this.magnet.positionProperty.get() ) < 70 ) {
        return 4;
      }

      var fieldStrength = coil.magneticFieldProperty.get();

      return MagnetRegions.mapFieldStrengthToInteger( Math.abs( fieldStrength ) );
    }
  }, {
    getDirection: function( newPosition, oldPosition ) {
      var angle = newPosition.minus( oldPosition ).angle();
      var i = Util.roundSymmetric( angleToDirection( angle ) );
      i = i === 8 ? 0 : i;
      return DIRECTION_LIST[ i ];
    },

    mapFieldStrengthToInteger: function( fieldStrength ) {
      if ( fieldStrength < 0.025 ) {
        return 0;
      } else if ( fieldStrength >= 0.025 && fieldStrength < 0.04 ) {
        return 1;
      } else if ( fieldStrength >= 0.04 && fieldStrength < 0.075 ) {
        return 2;
      } else if ( fieldStrength >= 0.075 && fieldStrength < 0.18 ) {
        return 3;
      } else {
        return 4;
      }
    }
  } );

  /**
   * TODO: add doc
   * @param  {Vector2} vector the position on which to center the bounds
   * @return {Bounds2}        the bounds of the magnet at the passed position
   */
  function createMagnetBounds( vector ) {
    var halfWidth = FaradaysLawConstants.MAGNET_WIDTH / 2;
    var halfHeight = FaradaysLawConstants.MAGNET_HEIGHT / 2;
    return new Bounds2 (
      vector.x - halfWidth,
      vector.y - halfHeight,
      vector.x + halfWidth,
      vector.y + halfHeight
    );
  }
} );