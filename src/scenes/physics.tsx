import {
	Circle,
	Line,
	Rect,
	Txt,
	makeScene2D,
	Layout,
	Grid
} from '@motion-canvas/2d';
import {
	createRef,
	usePlayback,
	RAD2DEG,
	all,
	range,
	waitUntil,
	createRefMap,
	createSignal,
	SimpleSignal
} from '@motion-canvas/core';
import * as p2 from 'p2-es';
import { colors, gradients } from '../utils';

export default makeScene2D(function* (view) {
	view.fontFamily('JetBrains Mono');
	view.fontSize(64);

	const startingPosition = 3000;
	const radius = 100;

	const world = new p2.World({
		gravity: [0, -9.82]
	});

	const circleBody = new p2.Body({
		mass: 5,
		position: [0, startingPosition],
		gravityScale: 100
	});
	const circleShape = new p2.Circle({ radius });
	circleBody.addShape(circleShape);

	const groundBody = new p2.Body({
		mass: 0,
		position: [0, 0]
	});
	const groundShape = new p2.Plane();
	groundBody.addShape(groundShape);

	world.addBody(circleBody);
	world.addBody(groundBody);

	const ballView = createRef<Layout>();
	const graphView = createRef<Layout>();

	const divider = createRef<Line>();
	const circle = createRef<Circle>();
	const circleStates = createRef<Layout>();
	const floor = createRef<Rect>();
	const graph = createRef<Line>();
	const graphCamera = createRef<Layout>();
	const graphAxes = createRefMap<Line>();
	const cursors = createRefMap<Rect>();
	const cursorLabels = createRefMap<Txt>();
	const lineExtensions = createRefMap<Line>();
	const overlayText = createRef<Txt>();

	const linear = (x: number) => -100 * x + 300;
	const quadratic = (x: number) => -(100 / 3) * Math.pow(x, 2) + 300;
	const regression = createSignal(() => linear);

	view.add(
		<>
			<Layout
				ref={ballView}
				width={'100%'}
				height={'100%'}
				x={view.width() / 2}
				clip={true}
				offset={[1, 0]}
			>
				<Layout position={[0, 425]} scale={0.3}>
					<Circle
						ref={circle}
						position={[circleBody.position[0], -circleBody.position[1]]}
						size={[radius * 2, radius * 2]}
						fill={'red'}
						opacity={0}
						closed={true}
					/>

					<Layout ref={circleStates} />

					<Rect
						ref={floor}
						offset={[0, -1]}
						position={[0, 0]}
						radius={75}
						fill={gradients.one}
						opacity={0}
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

			<Layout
				ref={graphView}
				width={'66.66%'}
				height={'100%'}
				offset={[-1, 0]}
				x={view.width() / 2}
				clip={true}
				opacity={0}
			>
				<Layout ref={graphCamera} position={[-280, 240]} scale={2}>
					<Grid
						zIndex={-1}
						stroke={colors.gray}
						spacing={100}
						width={'100%'}
						height={'100%'}
					/>
					<Line
						ref={graphAxes.x}
						zIndex={1}
						lineWidth={3}
						stroke={gradients.one}
						points={[
							[-1000, 0],
							[1000, 0]
						]}
					/>
					<Line
						ref={graphAxes.y}
						zIndex={1}
						lineWidth={3}
						stroke={gradients.one}
						points={[
							[0, -500],
							[0, 500]
						]}
					/>
					<Line
						ref={graph}
						stroke={gradients.three}
						lineWidth={3}
						lineCap={'round'}
						points={[]}
					/>
					<Layout>
						<Txt
							text={'time passed (seconds)'}
							offset={[-1, 0]}
							fontSize={16}
							x={100}
							y={100}
							fill={colors.white}
							shadowColor={'black'}
							shadowBlur={5}
						/>
						{range(10).map((index) => (
							<Txt
								x={index == 0 ? -25 : 100 * index}
								y={30}
								text={`${index}`}
								fill={gradients.one}
								fontSize={35}
							/>
						))}
						<Txt
							text={'distance from floor (feet)'}
							offset={[-1, 0]}
							rotation={-90}
							fontSize={16}
							x={-100}
							y={-100}
							fill={colors.white}
							shadowColor={'black'}
							shadowBlur={5}
						/>
						{range(1, 9).map((index) => (
							<Txt
								x={-32}
								y={-100 * index}
								text={`${index * 30}`}
								fill={gradients.one}
								fontSize={35}
							/>
						))}
					</Layout>
					<Layout>
						<Rect
							ref={cursors.x}
							fill={colors.blue}
							height={5}
							offset={[-1, 0]}
							radius={5}
						/>
						<Txt
							ref={cursorLabels.x}
							fill={colors.blue}
							text={() => `${(cursors.x().width() / 100).toPrecision(1)}`}
							position={() => [cursors.x().x() + 50, -20]}
							fontSize={25}
							opacity={0}
						/>
						<Rect
							ref={cursors.y}
							fill={colors.green}
							y={() => -regression()(cursors.x().x() / 100)}
							width={() =>
								regression()(cursors.x().x() / 100) -
								regression()(cursors.x().x() / 100 + cursors.x().width() / 100)
							}
							height={5}
							rotation={-90}
							offset={[1, 0]}
							radius={5}
							opacity={0}
						/>
						<Txt
							ref={cursorLabels.y}
							fill={colors.green}
							text={() =>
								`${((cursors.y().width() / 100) * 30).toPrecision(2)}`
							}
							position={() => [10, cursors.y().y() + cursors.y().width() / 2]}
							offset={[-1, 0]}
							fontSize={25}
							opacity={0}
						/>
					</Layout>
					<Layout zIndex={-1}>
						<Line
							ref={lineExtensions.one}
							lineDash={[8]}
							lineDashOffset={10}
							lineWidth={3}
							lineCap={'round'}
							stroke={'white'}
							opacity={0}
							points={() => [
								[0, -regression()(cursors.x().x() / 100)],
								[cursors.x().x(), -regression()(cursors.x().x() / 100)]
							]}
						/>
						<Line
							ref={lineExtensions.two}
							lineDash={[8]}
							lineDashOffset={10}
							lineWidth={3}
							lineCap={'round'}
							stroke={'white'}
							opacity={0}
							points={() => [
								[
									0,
									-regression()(
										cursors.x().x() / 100 + cursors.x().width() / 100
									)
								],
								[
									cursors.x().x() + cursors.x().width(),
									-regression()(
										cursors.x().x() / 100 + cursors.x().width() / 100
									)
								]
							]}
						/>
					</Layout>
				</Layout>
			</Layout>

			<Txt
				ref={overlayText}
				text={'rate of change'}
				position={[0, 750]}
				fill={colors.white}
				fontSize={128}
				opacity={0}
			/>
		</>
	);

	function* resetSetup(resetPoints = true) {
		if (resetPoints) yield graph().opacity(0, 1);
		yield* circle().opacity(0, 1);

		if (resetPoints) {
			circle().position.y(-3000);
			circleBody.position[1] = 3000;
			graph().points([]);
		}

		if (resetPoints) yield graph().opacity(1, 1);
		yield* circle().opacity(1, 1);
	}

	function* dropBall(linearDrop?: boolean): Generator<any, void, unknown> {
		for (let i = 0; i < usePlayback().secondsToFrames(3); i++) {
			if (!linearDrop) {
				world.step(usePlayback().framesToSeconds(1));
			} else {
				circleBody.position[1] -= 1135 * usePlayback().framesToSeconds(1);

				if (circleBody.position[1] <= 100) {
					break;
				}
			}

			circle().position.x(circleBody.position[0]);
			circle().position.y(-circleBody.position[1]);
			circle().rotation(-circleBody.angle * RAD2DEG);

			graph().points([
				...graph().points(),
				[
					(i * 120) / usePlayback().fps,
					(-circleBody.position[1] + radius) / 9.6
				]
			]);

			yield;
		}

		regression(() => (linearDrop ? linear : quadratic));
	}

	function* showSideView(
		sideViewWidth: number,
		duration = 1,
		changeWidth = true
	) {
		yield* all(
			ballView().width(view.width() * sideViewWidth, duration),
			graphView().width(
				changeWidth ? view.width() * (1 - sideViewWidth) : graphView().width(),
				duration
			),
			ballView().x(view.width() * sideViewWidth - view.width() / 2, duration),
			graphView().x(view.width() * sideViewWidth - view.width() / 2, duration),
			divider().x(view.width() * sideViewWidth - view.width() / 2, duration),
			divider().opacity(sideViewWidth == 0 ? 0 : 1, duration)
		);
	}

	function* showCursors(withCircle = false) {
		cursors.x().position([0, 0], 1);

		if (withCircle) yield* circle().opacity(0, 1);
		yield all(...graphAxes.mapRefs((axis) => axis.opacity(0.2, 1)));

		if (withCircle) {
			circle().position.y(
				() =>
					-regression()(cursors.x().x() / 100 + cursors.x().width() / 100) *
						9.6 -
					radius
			);

			const circleClone = circle().snapshotClone({
				opacity: 0,
				position: circle().position()
			});

			circleStates().add(circleClone);

			yield* all(circleClone.opacity(0.5, 1), circle().opacity(1, 1));
		}

		yield* all(
			cursors.x().width(100, 1),
			cursors.x().opacity(1, 1),
			cursorLabels.x().opacity(1, 1)
		);

		yield* all(
			cursors.y().opacity(1, 1),
			cursorLabels.y().opacity(1, 1),
			...lineExtensions.mapRefs((line) => line.opacity(0.5, 1))
		);
	}

	function* resetCursors() {
		circle().position.y(circle().position.y()); // get rid of reactivity

		yield* all(
			cursors.x().position([0, 0], 1),
			...cursors.mapRefs((cursor) => cursor.opacity(0, 1)),
			...cursorLabels.mapRefs((label) => label.opacity(0, 1)),
			...lineExtensions.mapRefs((line) => line.opacity(0.0, 1)),
			...circleStates()
				.children()
				.map((circle) => circle.opacity(0, 1))
		);

		cursors.x().width(0);
		circleStates().children([]);

		yield* all(...graphAxes.mapRefs((axis) => axis.opacity(1, 1)));
	}

	function* moveCursor(second: number, withCircle = false) {
		if (withCircle) {
			circleStates().add(
				circle().snapshotClone({ opacity: 0.5, position: circle().position() })
			);
		}

		yield* cursors.x().position.x(second * 100, 1);
	}

	yield* waitUntil('show elements');
	yield* all(floor().size([800, 450], 1), floor().opacity(1, 1));
	yield* circle().opacity(1, 1);

	yield* waitUntil('drop ball');
	yield* dropBall();
	yield* resetSetup();

	// yield* waitUntil('drop ball 2');
	// yield* dropBall();
	// yield* resetSetup();

	yield* waitUntil('show graph');
	yield* showSideView(1 / 3, 1.5);
	yield* graphView().opacity(1, 1);

	yield* waitUntil('drop ball 3');
	yield* dropBall();

	// yield* waitUntil('drop ball 4');
	// yield* dropBall();
	// yield* resetSetup();

	yield* waitUntil('drop ball linear');
	yield* resetSetup();
	yield* dropBall(true);

	yield* waitUntil('show cursors');
	yield* showSideView(0);
	yield* showCursors();

	yield* waitUntil('move 1');
	yield* moveCursor(1);

	yield* waitUntil('move 2');
	yield* moveCursor(2);

	yield* waitUntil('reset');
	yield* all(resetCursors(), resetSetup());

	yield* waitUntil('reshow ball view');
	yield* showSideView(1 / 3);

	yield* waitUntil('drop ball 5');
	yield* dropBall();

	yield* waitUntil('show cursors 2');
	yield* showSideView(0);
	yield* showCursors();

	yield* waitUntil('move 3');
	yield* moveCursor(1);

	yield* waitUntil('move 4');
	yield* moveCursor(2);

	yield* waitUntil('reset 2');
	yield* all(resetCursors(), resetSetup(false));

	yield* waitUntil('reshow ball view 2');
	yield* showSideView(1 / 3);

	// yield* dropBall();

	yield* waitUntil('show cursors 3');
	yield* showCursors(true);

	yield* waitUntil('move 5');
	yield* moveCursor(1, true);

	yield* waitUntil('move 6');
	yield* moveCursor(2, true);

	yield* waitUntil('reset 3');
	yield* all(resetCursors(), resetSetup());

	yield* waitUntil('drop ball 6');
	yield* dropBall(true);

	yield* waitUntil('show cursors 4');
	yield* showCursors(true);

	yield* waitUntil('move 7');
	yield* moveCursor(1, true);

	yield* waitUntil('move 8');
	yield* moveCursor(2, true);

	yield* waitUntil('rate of change');

	yield* all(
		...view
			.children()
			.filter((node) => !(node instanceof Txt))
			.flatMap((node) => [node.filters.blur(5, 1), node.opacity(0.5, 1)])
	);

	yield* all(overlayText().position(0, 1), overlayText().opacity(1, 1));

	yield* waitUntil('end');
	yield* view.opacity(0, 1);
});
