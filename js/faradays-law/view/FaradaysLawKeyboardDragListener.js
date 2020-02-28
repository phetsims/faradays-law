// Copyright 2018-2020, University of Colorado Boulder

/**
 * Type to handle all standard keyboard input. The only exception is the
 * @extends KeyboardDragListener
 */

import KeyboardDragListener from '../../../../scenery/js/listeners/KeyboardDragListener.js';
import faradaysLaw from '../../faradaysLaw.js';

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

    super( { drag: drag, end: end, dragBounds: model.bounds } );

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

faradaysLaw.register( 'FaradaysLawKeyboardDragListener', FaradaysLawKeyboardDragListener );
export default FaradaysLawKeyboardDragListener;