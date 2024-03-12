import { Latex, Layout, makeScene2D } from '@motion-canvas/2d';
import { createRef, waitFor, waitUntil } from '@motion-canvas/core';
import { addToLayout, colors } from '../utils';

export default makeScene2D(function* (view) {
	view.fontFamily('JetBrains Mono');
	view.fontSize(64);
	view.opacity(0);

	const layout = createRef<Layout>();

	view.add(
		<Layout layout ref={layout} gap={35}>
			<Latex
				tex={`{\\color{white} \\frac{\\color{${colors.green}} \\Delta y}{\\color{${colors.blue}} \\Delta x}}`}
				height={250}
			/>
		</Layout>
	);

	yield* waitUntil('show formula');
	yield* view.opacity(1, 1);

	const altFormula = new Latex({
		tex: `{\\color{white} = \\frac{\\color{${colors.green}} Y_b - Y_a}{\\color{${colors.blue}} X_b - X_a}}`,
		height: 250,
		opacity: 0
	});

	yield* waitUntil('show formula 2');
	yield* addToLayout(layout(), altFormula, 1);
	yield* altFormula.opacity(1, 1);

	const altFormula2 = new Latex({
		tex: `{\\color{white} = \\frac{\\color{${colors.green}} f(X_b) - f(X_a)}{\\color{${colors.blue}} X_b - X_a}}`,
		height: 250,
		opacity: 0
	});

	yield* waitUntil('show formula 3');
	yield* addToLayout(layout(), altFormula2, 1);
	yield* altFormula2.opacity(1, 1);

	yield* waitUntil('end');
	yield* view.opacity(0, 1);
});
