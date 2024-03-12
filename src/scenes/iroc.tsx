import { Latex, Layout, Line, Rect, is, makeScene2D } from '@motion-canvas/2d';
import {
	Vector2,
	all,
	createRef,
	delay,
	easeOutSine,
	waitFor,
	waitUntil
} from '@motion-canvas/core';
import { colors } from '../utils';
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
	const possibleSlope = createRef<Line>();

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
					p2={2}
				/>

				<Line
					ref={possibleSlope}
					lineWidth={6}
					stroke={colors.white}
					points={[
						[-view.width() / 2, 0],
						[view.width() / 2, 0]
					]}
					end={0}
				/>
			</Layout>

			<Rect
				ref={sideNote}
				zIndex={2}
				width={500}
				height={225}
				position={[0, 750]}
				radius={25}
				fill={colors.black}
				lineWidth={5}
				stroke={colors.orange}
			>
				<Latex
					tex={`{\\color{${colors.white}} \\lim_{\\color{${colors.blue}} \\Delta x \\color{${colors.white}} \\to 0} \\frac{\\color{${colors.green}} \\Delta y}{\\color{${colors.blue}} \\Delta x}}`}
					height={175}
				/>
			</Rect>

			<Layout
				ref={sideView}
				width={'33.333%'}
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
			sideView().opacity(1, 1),
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
		yield* sideNote().y(-750, duration);
	}

	function* showPossibleSlope() {
		yield* possibleSlope().end(1, 1);
	}

	function* hidePossibleSlope() {
		yield* possibleSlope().start(1, 1);
		possibleSlope().start(0);
		possibleSlope().end(0);
	}

	function* pointLabelOpacity(opacity: number, duration: number) {
		yield* all(
			...graph().points.mapRefs((point) =>
				point.parent().findFirst(is(Latex)).opacity(opacity, duration)
			)
		);
	}

	function* approachPointA(difference = 0.05) {
		yield* all(
			graph().p2(graph().p1() + difference, 5),
			graph()
				.camera()
				.centerOn(
					new Vector2(graph().p1() * 100, -graph().f(graph().p1()) * 100),
					6,
					easeOutSine
				),
			graph().camera().zoom(8, 6),
			graph().hideGraphStuff(0.1, 6),
			delay(3, pointLabelOpacity(0, 1))
		);
	}

	function* blurEverythingButNote() {
		yield* all(
			...view
				.children()
				.filter((node) => node.opacity() !== 0)
				.filter((node) => !(node instanceof Rect))
				.flatMap((node) => [node.filters.blur(5, 1), node.opacity(0.5, 1)])
		);
	}

	function* unblurEverythingButNote() {
		yield* all(
			...view
				.children()
				.filter((node) => node.opacity() !== 0)
				.filter((node) => !(node instanceof Rect))
				.flatMap((node) => [node.filters.blur(0, 1), node.opacity(1, 1)])
		);
	}

	view.opacity(1);

	yield* waitUntil('show grid');
	yield* graph().showGrid();
	yield* graph().drawGraph(2);

	yield* waitUntil('show A');
	yield* graph().showA();

	yield* waitUntil('show possible slope');
	yield* graph().hideGraphStuff(0.1, 1);
	yield* showPossibleSlope();

	yield* waitUntil('hide possible slope');
	yield* hidePossibleSlope();
	yield* graph().showGraphStuff(1);

	yield* waitUntil('show B');
	yield* graph().showB();
	yield* all(graph().camera().zoom(1.5, 1), graph().centerBetweenPoints({}));

	yield* waitUntil('draw deltas');
	yield* all(graph().drawDeltas(), graph().drawDeltaLabels());

	yield* waitUntil('draw slope');
	yield* graph().drawSlope(2);

	yield* waitUntil('show side view');
	yield* showSideView(2 / 3);
	yield* sideView().childAs<Layout>(0).opacity(1, 1);

	yield* waitUntil('approach A');
	yield* approachPointA();

	yield* waitUntil('show possible slope 2');
	yield* all(graph().camera().zoom(2, 1), graph().showGraphStuff(1));
	yield* all(graph().hideGraphStuff(0.1, 1), showPossibleSlope());

	yield* waitUntil('hide possible slope 2');
	yield* all(graph().showGraphStuff(1), hidePossibleSlope());

	yield* all(graph().camera().zoom(8, 1), graph().hideGraphStuff(0.1, 1));

	yield* waitUntil('distance 0');
	yield* graph().p2(graph().p1(), 1);

	yield* waitUntil('show side note');
	yield* all(
		sideNote().position([0, 0], 1),
		sideNote().scale(1.5, 1),
		blurEverythingButNote()
	);

	yield* waitUntil('hide side note');
	yield* all(
		sideNote().position([-675, -400], 1),
		sideNote().scale(1, 1),
		unblurEverythingButNote()
	);

	yield* waitUntil('hide stuff');
	yield* all(
		graph().hideComponents(),
		sideView().childAs<Layout>(0).opacity(0, 1)
	);
	yield* hideSideView();

	//

	graph().p1(0);
	graph().p2(2);

	yield* all(graph().camera().zoom(1.25, 1), graph().showGraphStuff(1));

	yield* waitUntil('show stuff');
	yield* all(
		pointLabelOpacity(1, 1),
		graph().showComponents(),
		graph().moveAndCenter({})
	);

	yield* waitUntil('show side view 2');
	sideView().childAs<Layout>(0).childAs<Latex>(0).remove();
	sideView().childAs<Layout>(0).childAs<Latex>(0).remove();
	yield* showSideView(2 / 3);
	yield* sideView().childAs<Layout>(0).opacity(1, 1);

	yield* waitUntil('approach A 2');
	yield* approachPointA(Number.EPSILON);

	yield* waitUntil('show possible slope 3');
	yield* showPossibleSlope();

	yield* waitUntil('hide possible slope 3');
	yield* hidePossibleSlope();

	//

	yield* waitUntil('hide stuff 2');
	yield* all(
		graph().hideComponents(),
		sideView().childAs<Layout>(0).opacity(0, 1)
	);
	yield* hideSideView();

	graph().p1(0.5);
	graph().p2(2);

	yield* all(
		graph().camera().zoom(1.25, 1),
		graph().showGraphStuff(1),
		graph()
			.camera()
			.centerOn(new Vector2(graph().p1() * 100, -graph().f(graph().p1()) * 100))
	);

	yield* waitUntil('show A 2');
	yield* all(graph().showA(), pointLabelOpacity(1, 1));

	yield* waitUntil('show possible slope 4');
	possibleSlope().points([
		[-750, 750],
		[750, -750]
	]);
	yield* all(graph().hideGraphStuff(0.1, 1), showPossibleSlope());

	yield* waitUntil('hide possible slope 4');
	yield* all(graph().showGraphStuff(1), hidePossibleSlope());

	yield* waitUntil('show stuff 2');
	yield* all(graph().showComponents(), graph().moveAndCenter({}));

	yield* waitUntil('show side view 3');
	yield* showSideView(2 / 3);
	yield* sideView().childAs<Layout>(0).opacity(1, 1);

	yield* waitUntil('approach A 3');
	yield* approachPointA(Number.EPSILON);

	yield* waitUntil('show possible slope 5');
	yield* all(graph().camera().zoom(2, 1), graph().showGraphStuff(1));
	yield* all(graph().hideGraphStuff(0.1, 1), showPossibleSlope());

	yield* waitUntil('hide possible slope 5');
	yield* all(graph().showGraphStuff(1), hidePossibleSlope());

	yield* waitUntil('end');
	yield* all(hideSideNote(), sideView().childAs<Layout>(0).opacity(0, 1));
	yield* all(hideSideView(), graph().opacity(0, 1));
});
