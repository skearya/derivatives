import { Latex, Layout, Line, Rect, Txt, makeScene2D } from '@motion-canvas/2d';
import {
	Vector2,
	all,
	createRef,
	createRefArray,
	waitFor,
	waitUntil
} from '@motion-canvas/core';
import { addToLayout, colors, gradients } from '../utils';
import { Graph } from '../components/graph';

export default makeScene2D(function* (view) {
	view.fontFamily('JetBrains Mono');
	view.fontSize(64);
	view.opacity(0);

	const graphView = createRef<Layout>();
	const graph = createRef<Graph>();
	const sideNote = createRef<Rect>();
	const sideView = createRef<Layout>();
	const divider = createRef<Line>();
	const highlighters = createRefArray<Rect>();

	const f = (x: number) => x * 2;

	view.add(
		<>
			<Layout
				ref={graphView}
				offset={[1, 0]}
				width={'100%'}
				height={'100%'}
				x={view.width() / 2}
				clip
			>
				<Graph
					ref={graph}
					f={f}
					range={[-5, 5]}
					width={view.width()}
					height={view.height()}
					p1={0}
					p2={1}
				/>
			</Layout>

			<Rect
				ref={sideNote}
				width={800}
				height={150}
				position={[0, 750]}
				radius={25}
				fill={colors.black}
				lineWidth={5}
				stroke={gradients.one}
			>
				<Latex
					tex={`{\\color{${colors.white}} \\Delta \\text{(pronounced delta) = change in}}`}
					width={700}
				/>
			</Rect>

			<Layout
				ref={sideView}
				width={'33.334%'}
				height={'100%'}
				offset={[-1, 0]}
				x={view.width() / 2}
				opacity={0}
			>
				<Layout
					layout
					direction={'column'}
					alignItems={'center'}
					justifyContent={'center'}
					gap={100}
					opacity={0}
				>
					<Txt
						lineHeight={90}
						fill={colors.white}
						fontStyle={'italic'}
						width={850}
						textWrap
						text={
							'how much one quantity changes in relation to another quantity'
						}
					/>
				</Layout>
				<Layout
					layout
					direction={'column'}
					alignItems={'center'}
					justifyContent={'center'}
					gap={100}
					opacity={0}
				>
					<Latex
						tex={() =>
							`{\\color{${colors.green}} \\Delta y = ${(
								f(graph().p2()) - f(graph().p1())
							).toFixed(2)}}`
						}
						width={400}
					/>
					<Latex
						tex={() =>
							`{\\color{${colors.blue}} \\Delta x = ${(
								graph().p2() - graph().p1()
							).toFixed(2)}}`
						}
						width={400}
					/>
					<Latex
						tex={() =>
							`{\\color{white} \\frac{\\color{${
								colors.green
							}} \\Delta y}{\\color{${colors.blue}} \\Delta x} = \\color{${
								colors.orange
							}} ${graph().slopeVal().toFixed(2)}}`
						}
						width={400}
					/>
				</Layout>
			</Layout>

			<Line
				ref={divider}
				zIndex={1}
				stroke={colors.white}
				lineWidth={4}
				x={view.width() / 2}
				points={[
					[0, -view.height() / 2],
					[0, view.height() / 2]
				]}
				opacity={0}
			/>

			<Rect
				ref={highlighters}
				zIndex={1}
				fill={gradients.one}
				compositeOperation={'xor'}
				offset={[-1, 0]}
				height={70}
			/>
			<Rect
				ref={highlighters}
				zIndex={1}
				fill={gradients.one}
				compositeOperation={'xor'}
				offset={[-1, 0]}
				height={80}
			/>
			<Rect
				ref={highlighters}
				zIndex={1}
				fill={gradients.two}
				compositeOperation={'xor'}
				offset={[-1, 0]}
				height={70}
			/>
			<Rect
				ref={highlighters}
				zIndex={1}
				fill={gradients.two}
				compositeOperation={'xor'}
				offset={[-1, 0]}
				height={80}
			/>
		</>
	);

	function* showSideView(graphViewWidth: number, changeWidth = true) {
		yield* all(
			graphView().width(view.width() * graphViewWidth, 1),
			sideView().width(
				changeWidth ? view.width() * (1 - graphViewWidth) : sideView().width(),
				1
			),
			graphView().x(view.width() * graphViewWidth - view.width() / 2, 1),
			sideView().x(view.width() * graphViewWidth - view.width() / 2, 1),
			divider().x(view.width() * graphViewWidth - view.width() / 2, 1),
			divider().opacity(1, 1)
		);
	}

	function* hideSideView() {
		yield* all(showSideView(1, false), divider().opacity(0, 1));
	}

	function* showSideNote(duration = 1) {
		yield* sideNote().y(400, duration);
	}

	function* hideSideNote(duration = 1) {
		yield* sideNote().y(750, duration);
	}

	function moveHighlighterTo(highlighter: Rect, to: Latex) {
		highlighter.absolutePosition(
			to.absolutePosition().sub([to.width() / 2, 0])
		);
	}

	view.opacity(1);

	yield* waitUntil('show grid');
	yield* graph().showGrid();
	yield* graph().drawGraph(2);

	yield* waitUntil('show points');
	yield* graph().showPoints();

	yield* all(graph().moveAndCenter({}), graph().camera().zoom(2, 1));

	yield* waitUntil('draw X');
	graph().deltas.x().opacity(1);
	yield* graph().deltas.x().end(1, 1);

	yield* waitUntil('draw Y');
	graph().deltas.y().opacity(1);
	yield* graph().deltas.y().end(1, 1);

	yield* waitUntil('show note');
	yield* all(graph().camera().shift(new Vector2(0, 40), 1), showSideNote());

	yield* waitUntil('draw delta labels');
	yield* graph().drawDeltaLabels();

	yield* waitUntil('hide note');
	yield* all(graph().camera().shift(new Vector2(0, -40), 1), hideSideNote());

	yield* waitUntil('show side view');
	yield* all(
		showSideView(1 / 2),
		sideView().opacity(1, 1),
		divider().opacity(1, 1)
	);
	yield* sideView().childAs<Layout>(0).opacity(1, 1);

	yield* waitUntil('pink highlighter');
	highlighters[0].position([400, -95]);
	yield* highlighters[0].width(475, 1);

	moveHighlighterTo(highlighters[1], graph().deltaLabels.y());
	yield* highlighters[1].width(105, 1);

	yield* waitUntil('yellow highlighter');
	highlighters[2].position([55, 85]);
	yield* highlighters[2].width(630, 1);

	moveHighlighterTo(highlighters[3], graph().deltaLabels.x());
	yield* highlighters[3].width(105, 1);

	yield* waitUntil('roc formula');
	const rocFormula = new Latex({
		tex: `{\\color{${colors.white}} \\frac{\\color{${colors.green}} \\Delta y}{\\color{${colors.blue}} \\Delta x}}`,
		width: 200,
		opacity: 0
	});
	yield* all(
		addToLayout(sideView().childAs<Layout>(0), rocFormula, 1),
		...[highlighters[0], highlighters[2]].map((highlighter) =>
			highlighter.y(highlighter.y() - 160, 1)
		)
	);
	yield* rocFormula.opacity(1, 0.5);

	yield* waitUntil('hide highlighters');
	yield* all(...highlighters.map((highlighter) => highlighter.opacity(0, 1)));

	yield* waitUntil('show slope');
	yield* graph().drawSlope(1, true);

	yield* waitUntil('hide definition view');
	yield* sideView().childAs<Layout>(0).opacity(0, 1);
	yield* showSideView(2 / 3);
	yield* sideView().childAs<Layout>(1).opacity(1, 1);

	yield* waitUntil('move p2');
	yield* graph().camera().zoom(1.3, 1);
	yield* graph().moveAndCenter({ p2: 2 }, 2);

	yield* waitUntil('move p1');
	yield* all(
		graph().camera().centerOn(new Vector2(0, 0), 1),
		graph().camera().zoom(1, 1)
	);
	yield* graph().movePoints({ p1: -2 });

	yield* waitUntil('move p2 2');
	yield* graph().movePoints({ p2: 0 });

	yield* waitUntil('move points');
	yield* graph().movePoints({ p1: -0.5, p2: 0.5 });
	yield* graph().camera().zoom(1.5, 1);

	yield* waitUntil('end');
	yield* sideView().childAs<Layout>(1).opacity(0, 1);
	yield* all(hideSideView(), graph().opacity(0, 1));
});
