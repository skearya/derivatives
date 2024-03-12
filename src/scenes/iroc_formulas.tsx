import { Latex, Layout, Txt, makeScene2D } from '@motion-canvas/2d';
import { createRef, waitUntil } from '@motion-canvas/core';
import { addToLayout, colors } from '../utils';

export default makeScene2D(function* (view) {
	view.fontFamily('JetBrains Mono');
	view.fontSize(64);
	view.opacity(0);

	const rootLayout = createRef<Layout>();
	const layout = createRef<Layout>();

	view.add(
		<Layout
			layout
			ref={rootLayout}
			direction={'column'}
			gap={150}
			alignItems={'center'}
		>
			<Layout layout ref={layout} gap={35}>
				<Latex
					tex={`{\\color{${colors.white}} \\lim_{\\color{${colors.blue}} \\Delta x \\color{${colors.white}} \\to 0} \\frac{\\color{${colors.green}} \\Delta y}{\\color{${colors.blue}} \\Delta x}}`}
					height={250}
				/>
			</Layout>
		</Layout>
	);

	function* changeFormulaTex(width: number, tex: string) {
		yield* altFormula.opacity(0, 0.5);
		yield* altFormula.width(width, 0.5);
		altFormula.tex(tex);
		yield* altFormula.opacity(1, 0.5);
	}

	yield* waitUntil('show formula');
	yield* view.opacity(1, 1);

	const altFormula = new Latex({
		tex: `{\\color{${colors.white}} = \\lim_{\\color{${colors.blue}} \\Delta x \\color{${colors.white}} \\to 0} \\frac{\\color{${colors.green}} Y_b - Y_a}{\\color{${colors.blue}} X_b - X_a}}`,
		height: 250,
		opacity: 0
	});

	yield* waitUntil('show formula 2');
	yield* addToLayout(layout(), altFormula, 1);
	yield* altFormula.opacity(1, 1);

	yield* waitUntil('transform 1');
	yield* changeFormulaTex(
		1101.34375,
		`{\\color{${colors.white}} = \\lim_{\\color{${colors.blue}} \\Delta x \\color{${colors.white}} \\to 0} \\frac{\\color{${colors.green}} f(X_b) - f(X_a)}{\\color{${colors.blue}} X_b - X_a}}`
	);

	yield* waitUntil('transform 2');
	yield* changeFormulaTex(
		1118.40625,
		`{\\color{${colors.white}} = \\lim_{\\color{${colors.blue}} X_b \\color{${colors.white}} \\to \\color{${colors.blue}} X_a} \\frac{\\color{${colors.green}} f(X_b) - f(X_a)}{\\color{${colors.blue}} X_b - X_a}}`
	);

	const text = new Txt({
		text: 'instantaneous rate of change',
		fill: colors.white,
		opacity: 0
	});

	yield* waitUntil('text');
	// @ts-expect-error
	yield* addToLayout(rootLayout(), text, 1);
	yield* text.opacity(1, 1);

	yield* waitUntil('change text');
	yield* text.text('derivative', 1);

	yield* waitUntil('end');
	yield* view.opacity(0, 1);
});
