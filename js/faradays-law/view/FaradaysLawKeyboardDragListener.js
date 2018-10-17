// Copyright 2014-2018, University of Colorado Boulder

/**
 * Type to handle all standard keyboard input. The only exception is the
 * @extends KeyboardDragListener
 */

define( require => {
  'use strict';

  // modules
  const faradaysLaw = require( 'FARADAYS_LAW/faradaysLaw' );
  const KeyboardDragListener = require( 'SCENERY_PHET/accessibility/listeners/KeyboardDragListener' );
  class FaradaysLawKeyboardDragListener extends KeyboardDragListener {
    // need to implement;
      // drag
      // end
      // jump behavior
    // this type needs to handle all the keyboard interaction - for now, I suppose it's possible to simply add 2
    // a11yInputListeners...let's try!

    constructor( model, regionManager, alertManager ) {

      const drag = vectorDelta => {
        model.magnetArrowsVisibleProperty.set( false );
        let newPosition = model.magnet.positionProperty.get().plus( vectorDelta );
        newPosition = model.bounds.closestPointTo( newPosition );
        model.moveMagnetToPosition( newPosition );
      };

      const end = event => {
        alertManager.movementEndAlert();
      };

      super( { drag, end, dragBounds: model.bounds } );

      this.regionManager = regionManager;
      this.alertManager = alertManager;
    }

    initializeAccessibleInputListener() {
      return {
        keyup: onKeyup.bind( this ),
        focus: onFocus.bind( this )
      };
    }
  }

  function onKeyup( event ) {
    const { magnetIsAnimating, magnetStoppedByKeyboard } = this.regionManager;

    if ( !magnetIsAnimating && magnetStoppedByKeyboard ) {
      this.alertManager.movementEndAlert();
      this.regionManager.resetKeyboardStop();
    }
  }

  function onFocus( event ) {
    // set flag to override the next keyup alert
    this.alertManager.magnetFocusAlert();
    this.regionManager.resetKeyboardStop();
  }

  return faradaysLaw.register( 'FaradaysLawKeyboardDragListener', FaradaysLawKeyboardDragListener );
} );