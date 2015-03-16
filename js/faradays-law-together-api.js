//  Copyright 2002-2014, University of Colorado Boulder

/**
 * This is the public API for the concentration sim.  It can be used in concert with together.js and arch.js for API
 * simulation features.
 *
 * Conventions:
 * 1. Property names should start with the screen name. This will enable usage in sims where screens are mixed and matced
 * 2. Most components will be top level within the screen.  Sometime nested structure is valuable for composite items
 * 3. UI components have the component type as the suffix, such as showTimerButton.  Model components do not have a suffix
 *      such as concentrationScreen.solute
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  var togetherTypes = require( 'JOIST/togetherTypes' );

  // Convenience imports to make the API read more clearly below.
  var Button = togetherTypes.Button;
  var property = togetherTypes.property;
  var Vector2 = togetherTypes.Vector2;
  var Slider = togetherTypes.Slider;
  var Faucet = togetherTypes.Faucet;
  var ResetAllButton = togetherTypes.ResetAllButton;
  var RadioButton = togetherTypes.RadioButton;
  var ComboBox = togetherTypes.ComboBox;
  var ComboBoxListItem = togetherTypes.ComboBoxListItem;
  var Color = togetherTypes.Color;
  var Node = togetherTypes.Node;

  // Use explicit names for id keys so they will match what researchers see in data files
  // Use id and type instead of componentID and typeID to simplify things for researchers
  // Use a map so that JS will help us check that there are no duplicate names.
  return togetherTypes.createSingleScreen( {
    'faradaysLawScreen.magnet.position': { type: property( Vector2 ) }
  } );
} );