import {
	Circle,
	Grid,
	Latex,
	Layout,
	Line,
	makeScene2D
} from '@motion-canvas/2d';
import { Vector2, waitFor } from '@motion-canvas/core';
import { colors, createPoints, gradients } from '../utils';

export default makeScene2D(function* (view) {
	view.fontFamily('JetBrains Mono');
	view.fontSize(64);

	const func = (x: number) => x ** 2;
	const [p1, p2] = [-0.75, 0.5];

	const slopeVal = (func(p2) - func(p1)) / (p2 - p1);

	view.add(
		<>
			<Grid
				stroke={colors.gray}
				spacing={200}
				width={view.width() * 2}
				height={view.height() * 2}
			/>
			<Line
				zIndex={1}
				stroke={colors.pink}
				lineWidth={10}
				points={createPoints(func, [-10, 10], 200)}
				y={400}
			/>

			<Layout zIndex={2} y={400}>
				<Layout position={() => [p1 * 200, -func(p1) * 200]}>
					<Latex tex="{\color{white} A}" position={[-55, -55]} width={60} />
					<Circle size={40} fill={'white'} />
				</Layout>
				<Layout position={() => [p2 * 200, -func(p2) * 200]}>
					<Latex tex="{\color{white} B}" position={[-55, -55]} width={60} />
					<Circle size={40} fill={'white'} />
				</Layout>
			</Layout>

			<Line
				y={325}
				zIndex={1}
				lineWidth={10}
				stroke={colors.orange}
				points={() => [
					new Vector2(-1000, slopeVal * 1000),
					new Vector2(1000, slopeVal * -1000)
				]}
			/>

			<Line
				x={-225}
				y={175}
				zIndex={1}
				lineWidth={10}
				stroke={colors.blue}
				points={() => [
					new Vector2(-1000, p1 * 2 * 1000),
					new Vector2(1000, p1 * 2 * -1000)
				]}
			/>

			<Latex
				y={-200}
				tex={`{\\color{${colors.white}} \\frac{\\color{${colors.green}} \\Delta y}{\\color{${colors.blue}} \\Delta x}}`}
				width={250}
			/>
		</>
	);

	yield* waitFor(5);
});
