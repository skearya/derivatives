import { Latex, Layout, Line, Rect, Txt, makeScene2D } from '@motion-canvas/2d';
import { all, createRef, range, waitFor, waitUntil } from '@motion-canvas/core';
import { colors } from '../utils';
import { Graph } from '../components/graph';

export default makeScene2D(function* (view) {
	view.fontFamily('JetBrains Mono');
	view.fontSize(64);
	view.opacity(0);

	const graphView = createRef<Layout>();
	const graph = createRef<Graph>();
	const sideView = createRef<Layout>();
	const sideNote = createRef<Rect>();
	const divider = createRef<Line>();

	const f = (x: number) => x ** 2;

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
				zIndex={2}
				width={300}
				height={250}
				position={[1250, 0]}
				radius={25}
				fill={colors.black}
				lineWidth={5}
				stroke={colors.orange}
			>
				<Latex
					tex={`{\\color{white} \\frac{\\color{${colors.green}} \\Delta y}{\\color{${colors.blue}} \\Delta x}}`}
					height={175}
				/>
			</Rect>

			<Layout
				ref={sideView}
				width={'33.334%'}
				height={'100%'}
				offset={[-1, 0]}
				x={view.width() / 2}
			>
				<Txt
					lineHeight={90}
					fill={colors.white}
					fontStyle={'italic'}
					width={850}
					textWrap
					text={'how much one quantity changes in relation to another quantity'}
					opacity={0}
				/>
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
		</>
	);

	function* showSideNote(duration = 1) {
		yield* sideNote().x(550, duration);
	}

	function* hideSideNote(duration = 1) {
		yield* sideNote().x(1250, duration);
	}

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

	function increaseGraphSize() {
		graph()
			.grid()
			.height(graph().grid().width() * 2);

		graph()
			.graphAxes.y()
			.points([
				[0, -view.height() * 2],
				[0, view.height() * 2]
			]);

		graph()
			.yMarkers()
			.parent()
			.add(
				range(15, 20).map((index) => (
					<Txt
						ref={graph().yMarkers}
						x={-12.5}
						y={-100 * index}
						offset={[1, 0]}
						text={`${index}`}
						fill={colors.lighterGray}
						fontSize={35}
					/>
				))
			);
	}

	view.opacity(1);

	yield* waitUntil('show grid');
	yield* graph().showGrid();
	yield* graph().drawGraph(2);

	yield* waitUntil('show points');
	yield* graph().showPoints(0.75);

	yield* all(graph().moveAndCenter({}), graph().camera().zoom(2, 1));

	yield* waitUntil('draw deltas');
	yield* graph().drawDeltas();

	yield* waitUntil('draw delta labels');
	yield* graph().drawDeltaLabels();

	yield* waitUntil('draw slope');
	yield* graph().drawSlope(2);

	yield* waitUntil('side note');
	yield* showSideNote();

	yield* waitUntil('hide side note');
	yield* hideSideNote();

	yield* waitUntil('show side view');
	yield* showSideView(2 / 3);
	yield* sideView().childAs<Layout>(1).opacity(1, 1);

	yield* waitUntil('move p2');
	yield* graph().moveAndCenter({ p2: 2 });

	yield* waitUntil('move p2 2');
	yield* all(
		graph().centerBetweenPoints({ p2: 3 }),
		graph().camera().scale(0.9, 1)
	);
	yield* graph().movePoints({ p2: 3 });

	increaseGraphSize();

	yield* waitUntil('move p2 3');
	yield* all(
		graph().centerBetweenPoints({ p2: 4 }),
		graph().camera().scale(0.55, 1)
	);
	yield* graph().movePoints({ p2: 4 });

	yield* waitUntil('hide components');
	yield* all(
		graph().hideComponents(),
		sideView().childAs<Layout>(1).opacity(0, 1)
	);

	yield* waitUntil('move camera');
	yield* graph().centerBetweenPoints({ p1: -1, p2: 0 }, 1);
	yield* graph().camera().zoom(2, 2);

	yield* waitUntil('fade in stuff');
	graph().p1(-1);
	graph().p2(0);
	graph().flipDeltaXLabel();
	yield* all(
		graph().showComponents(),
		sideView().childAs<Layout>(1).opacity(1, 1)
	);

	yield* waitUntil('move p1');
	yield* graph().moveAndCenter({ p1: -2 }, 2);

	yield* waitUntil('end');
	yield* sideView().childAs<Layout>(1).opacity(0, 1);
	yield* all(hideSideView(), graph().opacity(0, 1));
});
