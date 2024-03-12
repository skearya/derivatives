import {
	Circle,
	Line,
	Rect,
	Txt,
	Latex,
	makeScene2D,
	Layout,
	Grid,
	is
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
	delay,
	Vector2,
	linear,
	waitFor
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

	const points = createRefMap<Latex>();
	const point1 = createSignal(1);
	const point2 = createSignal(2.5);
	const deltas = createRefMap<Line>();
	const slope = createRef<Line>();
	const slopeText = createRef<Txt>();

	const regression = (x: number) => -(100 / 3) * Math.pow(x, 2) + 300;

	const slopeVal = createSignal(
		() =>
			(regression(point2()) - regression(point1())) /
			(point2() - point1()) /
			100
	);

	console.log('slope val: ' + slopeVal());

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
					<Line
						ref={slope}
						zIndex={1}
						lineWidth={4}
						stroke={colors.orange}
						points={() => [
							new Vector2(-600, slopeVal() * 600 + 2),
							new Vector2(600, slopeVal() * -600 + 2)
						]}
						end={0}
						opacity={0}
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
					<Layout zIndex={2}>
						<Layout
							opacity={0}
							position={() => [point1() * 100, -regression(point1())]}
						>
							<Latex
								ref={points.a}
								tex="{\color{white} A}"
								position={[25, -25]}
								width={25}
							/>
							<Circle size={15} fill={'white'} />
						</Layout>
						<Layout
							opacity={0}
							position={() => [point2() * 100, -regression(point2())]}
						>
							<Latex
								ref={points.b}
								tex="{\color{white} B}"
								position={[25, -25]}
								width={25}
							/>
							<Circle size={15} fill={'white'} />
						</Layout>
					</Layout>
					<Layout zIndex={1}>
						<Line
							ref={deltas.x}
							lineWidth={3}
							stroke={colors.blue}
							points={() => [
								[point1() * 100, -regression(point2())],
								[point2() * 100, -regression(point2())]
							]}
							lineCap={'round'}
							end={0}
							opacity={0}
						/>
						<Line
							ref={deltas.y}
							lineWidth={3}
							stroke={colors.green}
							points={() => [
								[point1() * 100, -regression(point1())],
								[point1() * 100, -regression(point2())]
							]}
							lineCap={'round'}
							end={0}
							opacity={0}
						/>
					</Layout>
					<Txt
						zIndex={10}
						ref={slopeText}
						text={() => {
							const val = `${(slopeVal() * 30).toFixed(2)} ft/s`;

							if (val == '-0.00 ft/s') {
								return '0.00 ft/s';
							} else {
								return val;
							}
						}}
						fill={colors.orange}
						fontSize={35}
						shadowColor={'black'}
						shadowBlur={5}
						opacity={0}
					/>
				</Layout>
			</Layout>
		</>
	);

	slope().absolutePosition(() => points.a().absolutePosition().add([-50, 50]));
	slopeText().absolutePosition(() =>
		points
			.a()
			.absolutePosition()
			.add([-50, 50])
			.add(points.b().absolutePosition().add([-50, 50]))
			.div(2)
			.add([250, -50])
	);

	function* resetSetup() {
		yield* all(circle().opacity(0, 1), graph().opacity(0, 1));

		circle().position.y(-3000);
		circleBody.position[1] = 3000;
		graph().points([]);

		yield* all(circle().opacity(1, 1), graph().opacity(1, 1));
	}

	function* dropBall(linear?: true): Generator<any, void, unknown> {
		for (let i = 0; i < usePlayback().secondsToFrames(3); i++) {
			if (!linear) {
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

	function* showA() {
		yield* points.a().parent().opacity(1, 1);
	}

	function* showB() {
		yield* points.b().parent().opacity(1, 1);
	}

	function* drawDeltas() {
		yield* all(
			...deltas
				.mapRefs((delta) => [delta.end(1, 1), delta.opacity(1, 1)])
				.flat()
		);
	}

	function* drawSlope() {
		slope().opacity(1);
		yield* all(slope().end(1, 2), delay(1, slopeText().opacity(1, 1)));
	}

	function* approachPointA() {
		yield* all(point2(point1() + 0.0001, 4), delay(1, pointLabelOpacity(0, 2)));
	}

	function* pointLabelOpacity(opacity: number, duration = 1) {
		yield* all(
			...points.mapRefs((point) =>
				point.parent().findFirst(is(Latex)).opacity(opacity, duration)
			)
		);
	}

	function* hideComponents() {
		yield* all(
			points.a().parent().opacity(0, 1),
			points.b().parent().opacity(0, 1),
			...deltas.mapRefs((delta) => delta.opacity(0, 1)),
			slope().opacity(0, 1),
			slope().end(0, 2),
			slopeText().opacity(0, 1)
		);

		deltas.mapRefs((delta) => delta.end(0));
	}

	yield* waitUntil('show elements');
	yield* all(floor().size([800, 450], 1), floor().opacity(1, 1));
	yield* circle().opacity(1, 1);

	yield* waitUntil('drop ball');
	yield* dropBall();
	yield* resetSetup();

	yield* waitUntil('show graph');
	yield* showSideView(1 / 3, 1.5);
	yield* graphView().opacity(1, 1);

	yield* waitUntil('drop ball 2');
	yield* dropBall();

	yield* waitUntil('show side view');
	yield* showSideView(0);

	yield* waitUntil('show A');
	yield* showA();

	yield* waitUntil('show B');
	yield* showB();

	yield* waitUntil('slope + deltas');
	yield* all(drawDeltas(), drawSlope());

	yield* waitUntil('approach A');
	yield* approachPointA();

	yield* waitUntil('hide components');
	yield* hideComponents();

	yield* waitUntil('show everything');
	point1(1.6);
	point2(2.6);
	yield* all(showA(), showB(), pointLabelOpacity(1), drawDeltas(), drawSlope());

	yield* waitUntil('approach A 2');
	yield* approachPointA();

	yield* waitUntil('hide components 2');
	yield* hideComponents();

	yield* waitUntil('show everything 2');
	point1(2.6);
	point2(1);
	slopeText().absolutePosition(() =>
		points
			.a()
			.absolutePosition()
			.add([-50, 50])
			.add(points.b().absolutePosition().add([-50, 50]))
			.div(2)
			.add([-250, 60])
	);
	yield* all(showA(), showB(), pointLabelOpacity(1), drawDeltas(), drawSlope());

	yield* waitUntil('approach A 3');
	yield* approachPointA();

	yield* waitUntil('hide components 3');
	yield* hideComponents();

	yield* waitUntil('show ball');
	point1(0);
	point2(() => point1() + 0.0001);
	slopeText().absolutePosition(() => {
		let point = points
			.a()
			.absolutePosition()
			.add([-50, 50])
			.add(points.b().absolutePosition().add([-50, 50]));

		point.x = point.x / 2.3;
		point.y = point.y / 2;

		return point.add([0, -50]);
	});
	yield* showSideView(1 / 3);
	yield* resetSetup();

	yield* waitUntil('show stuff');
	yield* all(showA(), showB(), drawDeltas(), drawSlope());

	yield* waitUntil('drop ball 3');
	yield* all(dropBall(), point1(3, 2.5, linear));

	yield* waitUntil('end');
	yield* view.opacity(0, 1);

	yield* waitFor(1);
});
