import { makeProject } from '@motion-canvas/core';

import thumbnail from './scenes/thumbnail?scene';
import physics from './scenes/physics?scene';
import roc_def from './scenes/roc_def?scene';
import linear_aroc from './scenes/linear_aroc?scene';
import quadratic_aroc from './scenes/quadratic_aroc?scene';
import aroc_formulas from './scenes/aroc_formulas?scene';
import iroc from './scenes/iroc?scene';
import iroc_formulas from './scenes/iroc_formulas?scene';
import physics_iroc from './scenes/physics_iroc?scene';

import audio from './audio/derivatives.wav';

import './global.css';

export default makeProject({
	audio: audio,
	scenes: [
		physics,
		roc_def,
		linear_aroc,
		quadratic_aroc,
		aroc_formulas,
		iroc,
		iroc_formulas,
		physics_iroc
	]
});
