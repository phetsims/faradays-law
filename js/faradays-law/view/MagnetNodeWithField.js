// Copyright 2014-2018, University of Colorado Boulder

/**
 * Magnet Node with field lines, draggable.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  // const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  const FaradaysLawA11yStrings = require( 'FARADAYS_LAW/FaradaysLawA11yStrings' );
  const FocusHighlightFromNode = require( 'SCENERY/accessibility/FocusHighlightFromNode' );
  const inherit = require( 'PHET_CORE/inherit' );
  const JumpMagnitudeArrowNode = require( 'FARADAYS_LAW/faradays-law/view/JumpMagnitudeArrowNode' );
  const KeyboardDragListener = require( 'SCENERY_PHET/accessibility/listeners/KeyboardDragListener' );
  const KeyboardUtil = require( 'SCENERY/accessibility/KeyboardUtil' );
  const MagnetDescriptions = require( 'FARADAYS_LAW/faradays-law/view/MagnetDescriptions' );
  const MagnetJumpKeyboardListener = require( 'FARADAYS_LAW/faradays-law/view/MagnetJumpKeyboardListener' );
  const MagnetFieldLines = require( 'FARADAYS_LAW/faradays-law/view/MagnetFieldLines' );
  const MagnetNode = require( 'FARADAYS_LAW/faradays-law/view/MagnetNode' );
  const MagnetInteractionCueNode = require( 'FARADAYS_LAW/faradays-law/view/MagnetInteractionCueNode' );
  const Node = require( 'SCENERY/nodes/Node' );
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  // const Utterance = require( 'SCENERY_PHET/accessibility/Utterance' );
  const utteranceQueue = require( 'SCENERY_PHET/accessibility/utteranceQueue' );
  const Vector2 = require( 'DOT/Vector2' );
  // const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  // const Property = require( 'AXON/Property' );

  // strings
  const barMagnetString = FaradaysLawA11yStrings.barMagnet.value;
  const barMagnetIsString = FaradaysLawA11yStrings.barMagnetIs.value; // The bar magnet is
  const magnetPolarityString = FaradaysLawA11yStrings.magnetPolarity.value;
  const fieldStrengthIsString = FaradaysLawA11yStrings.fieldStrengthIs.value;
  const fieldLinesString = FaradaysLawA11yStrings.fieldLines.value;
  // const positionOfPlayAreaPatternString = FaradaysLawA11yStrings.positionOfPlayAreaPattern.value;
  // const twoWordsPatternString = FaradaysLawA11yStrings.twoWordsPattern.value;

  // const fieldStrengthPassingCoilPatternString = FaradaysLawA11yStrings.fieldStrengthPassingCoilPattern.value;
  // const fieldStrengthPassingBothCoilsPatternString = FaradaysLawA11yStrings.fieldStrengthPassingBothCoilsPattern.value;

  /**
   * @param {FaradaysLawModel} model
   * @param {Tandem} tandem
   * @constructor
   */
  function MagnetNodeWithField( model, tandem ) {
    const self = this;

    Node.call( this, {
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: barMagnetString
    } );

    // magnet
    this.magnetNode = createMagnetNode( model.magnet );

    // field lines
    this.addChild( new MagnetFieldLines( model.magnet ) );

    // a11y
    // create the focus highlight to pass as an option
    let draggableNodeFocusHighlight = new FocusHighlightFromNode( this.magnetNode ); // overridden once the draggableNode is fully constructed

    // the draggable container for the magnet and arrows
    let draggableNode = new Node( {
      cursor: 'pointer',

      // The parent (MagnetNodeWithField) isn't instrumented, and this is the interactive node, so instrument this as
      // the "parent" magnet instances, see https://github.com/phetsims/faradays-law/issues/116.
      // NOTE: this assumes that tandem is not passed into a mutate or Node.call() in the MagnetNodeWithField type.
      tandem: tandem,
      phetioInstanceDocumentation: 'The draggable container for the magnet and arrows',

      // a11y
      tagName: 'div',
      ariaRole: 'application',
      focusable: true,
      focusHighlightLayerable: true,
      focusHighlight: draggableNodeFocusHighlight
    } );

    this.addChild( draggableNode );
    this.addChild( draggableNodeFocusHighlight );
    draggableNode.addChild( self.magnetNode );

    // magnet reflection - node to indicate the future location when sliding the magnet
    this.reflectedMagnetNode = createMagnetNode( model.magnet );
    this.addChild( self.reflectedMagnetNode );
    this.reflectedMagnetNode.opacity = 0.5;
    this.reflectedMagnetNode.visible = false;

    // help arrows around the magnet
    let magnetInteractionCueNode = new MagnetInteractionCueNode();

    this.addChild( magnetInteractionCueNode );

    // a11y - Update the focusHighlight according to arrow visibility. The dilationCoefficient changes based on the
    // size of the node being highlighted.
    model.showMagnetArrowsProperty.link( function( showArrows ) {
      magnetInteractionCueNode.visible = showArrows;
    } );

    magnetInteractionCueNode.setKeyPositions( self.magnetNode.bounds );

    // handler
    let magnetOffset = new Vector2();
    let dragHandler = new DragListener( {

      tandem: tandem,
      phetioInstanceDocumentation: 'Emits events when dragged by the user',

      // When dragging across it in a mobile device, pick it up
      allowTouchSnag: true,

      start( event ) {
        magnetOffset.x = self.globalToParentPoint( event.pointer.point ).x - self.centerX;
        magnetOffset.y = self.globalToParentPoint( event.pointer.point ).y - self.centerY;
      },

      // Translate on drag events
      drag( event ) {
        model.showMagnetArrowsProperty.set( false );
        let parentPoint = self.globalToParentPoint( event.pointer.point );
        let desiredPosition = parentPoint.minus( magnetOffset );
        model.moveMagnetToPosition( desiredPosition );
      }
    } );
    draggableNode.addInputListener( dragHandler );

    // a11y descriptions - generates text content and alerts for magnet interactions
    let describer = new MagnetDescriptions( model, tandem );

    // @private - The sticky drag handler for keyboard navigation
    this.keyboardDragListener = new KeyboardDragListener( {
      start( event ) {
        describer.regionMap.shiftKeyDown = event.shiftKey;
      },
      drag( vectorDelta ) {
        model.showMagnetArrowsProperty.set( false );
        let newPosition = model.magnet.positionProperty.get().plus( vectorDelta );
        newPosition = model.bounds.closestPointTo( newPosition );
        model.moveMagnetToPosition( newPosition );
      },
      dragBounds: model.bounds
    } );

    // arrows displayed before initiating the sliding/jumping movement
    let leftJumpArrows = new JumpMagnitudeArrowNode( 'left' );
    let rightJumpArrows = new JumpMagnitudeArrowNode( 'right' );
    leftJumpArrows.setKeyPositions( self.magnetNode.bounds );
    rightJumpArrows.setKeyPositions( self.magnetNode.bounds );
    this.addChild( leftJumpArrows );
    this.addChild( rightJumpArrows );

    draggableNode.addAccessibleInputListener( this.keyboardDragListener );

    // handle the jump/slide interaction
    let magnetJumpKeyboardListener = new MagnetJumpKeyboardListener( model, {
      onKeydown( event ) {
        if ( KeyboardUtil.isNumberKey( event.keyCode ) && Number( event.key ) <= 3 ) {
          self.reflectedMagnetNode.visible = true;
          model.showMagnetArrowsProperty.set( false );

          let magnitude = Number( event.key );

          if ( model.magnet.positionProperty.get().x <= ( model.bounds.maxX / 2 ) ) {
            // point to right
            rightJumpArrows.showCue( magnitude );
          }
          else {
            leftJumpArrows.showCue( magnitude );
          }
        }
      },
      onKeyup( event ) {
        if ( KeyboardUtil.isNumberKey( event.keyCode ) ) {
          self.reflectedMagnetNode.visible = false;
        }
        rightJumpArrows.hideCue();
        leftJumpArrows.hideCue();
      }
    } );

    draggableNode.addAccessibleInputListener( magnetJumpKeyboardListener );

    // listener to position the reflected node
    let setReflectedNodeCenter = ( position ) => {
      self.reflectedMagnetNode.center = self.parentToLocalPoint( position );
    };

    // observers
    model.magnet.orientationProperty.link( () => {
      self.magnetNode.detach();
      self.magnetNode = createMagnetNode( model.magnet );
      draggableNode.addChild( self.magnetNode );

      // ensure poles on the reflected magnet match that of the original
      self.reflectedMagnetNode.detach();
      self.reflectedMagnetNode = createMagnetNode( model.magnet );
      self.addChild( self.reflectedMagnetNode );
      self.reflectedMagnetNode.opacity = 0.5;
      self.reflectedMagnetNode.visible = false;
      setReflectedNodeCenter( magnetJumpKeyboardListener.reflectedPositionProperty.get() );
    } );

    model.magnet.positionProperty.linkAttribute( this, 'translation' );

    magnetJumpKeyboardListener.reflectedPositionProperty.link( setReflectedNodeCenter );

    // alert when the movement direction changes
    // describer.regionMap.directionChangedEmitter.addListener( direction => {
    //   // map the ENUM direction to the appropriate string
    //   let utterance = describer.getMovementDirectionText( direction, this.keyboardDragListener.shiftKeyDown() );
    //
    //   utteranceQueue.addToBack( new Utterance( utterance, { typeId: 'direction' } ) );
    // } );

    // magnet and circuit description content, TODO: refactor into separate node(s)?
    let fourCoilOnlyNode = new Node( {
      tagName: 'p'
    } );

    let locationItem = new Node( { tagName: 'li' } );
    let twoCoilProximityItem = new Node( { tagName: 'li' } );
    let fourCoilProximityItem = new Node( { tagName: 'li' } );

    let twoAndFourCoilNode = new Node( {
      tagName: 'ul',
      labelTagName: 'p',
      labelContent: barMagnetIsString,
      children: [ locationItem, fourCoilProximityItem, twoCoilProximityItem ]
    } );

    this.addChild( fourCoilOnlyNode );
    this.addChild( twoAndFourCoilNode );

    let northNode = new Node( { tagName: 'li', innerContent: describer.northPoleSideString } );
    let southNode = new Node( { tagName: 'li', innerContent: describer.southPoleSideString } );

    let polarityNode = new Node(
      {
        tagName: 'ul',
        labelTagName: 'p',
        labelContent: magnetPolarityString,
        children: [ northNode, southNode ]
      }
    );

    this.addChild( polarityNode );

    let fourLoopOnlyStrengthNode = new Node( { tagName: 'p' } );

    let fourLoopFieldStrengthItem = new Node( { tagName: 'li' } );
    let twoLoopFieldStrengthItem = new Node( { tagName: 'li' } );
    let twoLoopStrengthListNode = new Node( {
      tagName: 'ul',
      labelTagName: 'p',
      labelContent: fieldStrengthIsString,
      children: [ fourLoopFieldStrengthItem, twoLoopFieldStrengthItem ]
    } );

    // @public - for setting accessible order in the screen view
    this.fieldLinesDescriptionNode = new Node( {
      labelTagName: 'h3',
      labelContent: fieldLinesString,
      tagName: 'div',
      descriptionTagName: 'p',
      children: [ fourLoopOnlyStrengthNode, twoLoopStrengthListNode ]
    } );

    this.addChild( this.fieldLinesDescriptionNode );

    // position observers
    model.magnet.positionProperty.link( () => {

      // magnet location and coil proximity description content updates
      fourCoilOnlyNode.innerContent = describer.fourLoopOnlyMagnetPosition;
      locationItem.innerContent = describer.positionOfPlayAreaString;
      twoCoilProximityItem.innerContent = describer.theTwoCoilProximityString;
      fourCoilProximityItem.innerContent = describer.theFourCoilProximityString;

      // field strength description content updates
      fourLoopOnlyStrengthNode.innerContent = describer.fourLoopOnlyFieldStrength;
      fourLoopFieldStrengthItem.innerContent = describer.fourLoopFieldStrength;
      twoLoopFieldStrengthItem.innerContent = describer.twoLoopFieldStrength;
    } );

    model.showTopCoilProperty.link( ( showTopCoil ) => {
      fourCoilOnlyNode.visible = !showTopCoil;
      twoAndFourCoilNode.visible = showTopCoil;

      // ensure that the parent node is also visible
      fourLoopOnlyStrengthNode.visible = self.fieldLinesDescriptionNode.visible && !showTopCoil;
      twoLoopStrengthListNode.visible = self.fieldLinesDescriptionNode && showTopCoil;
    } );

    model.magnet.orientationProperty.lazyLink( ( orientation ) => {

      // N/S orientation change alert
      northNode.innerContent = describer.northPoleSideString;
      southNode.innerContent = describer.southPoleSideString;
      self.fieldLinesDescriptionNode.descriptionContent = describer.fieldLinesDescription;

      utteranceQueue.addToBack( describer.getFlipMagnetAlertText( orientation ) );
    } );

    model.magnet.showFieldLinesProperty.link( ( showLines ) => {
      self.fieldLinesDescriptionNode.visible = showLines;
    } );

    // focus/blur alerts
    draggableNode.addAccessibleInputListener( {
      focus() {
        utteranceQueue.addToBack( describer.magnetFocusAlertText );
        describer.regionMap.justFocused = true;
      }
    } );

    // @a11y
    magnetJumpKeyboardListener._isAnimatingProperty.lazyLink( ( isAnimating ) => {

      // magnet stopped alert
      if ( !isAnimating ) {
        utteranceQueue.addToBack( describer.slidingStoppedText );
      }
    } );
  }

  /**
   * Creates the magnet node
   * @param {Magnet} magnet
   * @returns {MagnetNode}
   */
  let createMagnetNode = ( magnet ) => {
    return new MagnetNode( magnet.orientationProperty.get(), {
      width: magnet.width,
      height: magnet.height,
      showArrows: true
    } );
  };

  faradaysLaw.register( 'MagnetNodeWithField', MagnetNodeWithField );

  return inherit( Node, MagnetNodeWithField, {

    /**
     * Step in time
     * @param {number} dt - elapsed time in seconds
     * @public
     */
    // step: function( dt ) {
    //   this.magnetAccessibleDragHandler.step( dt );
    // }
  } );
} );
