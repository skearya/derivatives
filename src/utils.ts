import { PossibleVector2, SignalValue, range } from '@motion-canvas/core';
import { Gradient, Layout, Rect } from '@motion-canvas/2d';

export const colors = {
	white: '#FFFFF0',
	black: '#141414',
	gray: '#444',
	lighterGray: '#555',
	pink: '#F7208B',
	blue: '#497EE9',
	purple: '#7154F2',
	green: '#3FC661',
	orange: '#ED9454'
};

export const gradients = {
	one: new Gradient({
		type: 'linear',
		from: -400,
		to: 400,
		stops: [
			{
				offset: 0,
				color: '#DF99F7'
			},
			{
				offset: 1,
				color: '#FFDBB0'
			}
		]
	}),
	two: new Gradient({
		type: 'linear',
		from: -100,
		to: 100,
		stops: [
			{
				offset: 0,
				color: '#FFD9A0'
			},
			{
				offset: 1,
				color: '#FFF5F1'
			}
		]
	}),
	three: new Gradient({
		type: 'linear',
		from: -100,
		to: 100,
		stops: [
			{
				offset: 0,
				color: '#cfd9df'
			},
			{
				offset: 1,
				color: '#e2ebf0'
			}
		]
	})
};

export function createPoints(
	f: (x: number) => number,
	funcRange: [number, number],
	gridSize: number
): PossibleVector2[] {
	const [min, max] = funcRange;
	const samples = 300;
	const stepSize = (max - min) / samples;

	return range(min, max + stepSize, stepSize).map((i) => [
		i * gridSize,
		-f(i) * gridSize
	]);
}

export function* addToLayout(parent: Layout, node: Rect, duration: number) {
	yield node;

	const p = parent.padding();
	const dir = parent.direction();

	const bottom =
		dir === 'column' ? p.bottom + parent.gap().y + node.height() : p.bottom;
	const right =
		dir === 'row' ? p.right + parent.gap().x + node.width() : p.right;

	yield* parent.padding([p.top, right, bottom, p.left], duration);

	parent.add(node);
	parent.padding(p);
}
