import { CameraView } from '@ksassnowski/motion-canvas-camera';
import {
	Circle,
	Grid,
	Latex,
	Layout,
	LayoutProps,
	Line,
	Txt,
	signal
} from '@motion-canvas/2d';
import {
	DEFAULT,
	SignalValue,
	SimpleSignal,
	Vector2,
	all,
	chain,
	createRef,
	createRefArray,
	createRefMap,
	createSignal,
	range,
	sequence,
	waitFor
} from '@motion-canvas/core';
import { colors, createPoints } from '../utils';

export interface GraphProps extends LayoutProps {
	f: (x: number) => number;
	range: [number, number];
	p1: SignalValue<number>;
	p2: SignalValue<number>;
}

export class Graph extends Layout {
	@signal()
	public declare readonly p1: SimpleSignal<number, this>;
	@signal()
	public declare readonly p2: SimpleSignal<number, this>;

	public readonly camera = createRef<CameraView>();
	public readonly grid = createRef<Grid>();
	public readonly graphAxes = createRefMap<Line>();
	public readonly xMarkers = createRefArray<Txt>();
	public readonly yMarkers = createRefArray<Txt>();
	public readonly funcPlot = createRef<Line>();
	public readonly points = createRefMap<Circle>();
	public readonly deltas = createRefMap<Line>();
	public readonly deltaLabels = createRefMap<Latex>();
	public readonly slope = createRef<Line>();

	public readonly f: (x: number) => number;

	public readonly slopeVal = createSignal(
		() => (this.f(this.p2()) - this.f(this.p1())) / (this.p2() - this.p1())
	);

	private readonly lineWidth = createSignal(() => 6 / this.camera().scale.x());

	private deltaXFlipped = false;

	public constructor(props?: GraphProps) {
		super({
			...props
		});

		this.f = props.f;

		this.add(
			<CameraView ref={this.camera} width={'100%'} height={'100%'} clip={false}>
				<Grid
					ref={this.grid}
					stroke={colors.gray}
					spacing={100}
					opacity={0}
					width={this.view().width() * 2}
					height={this.view().height() * 2}
				/>

				<Line
					zIndex={1}
					ref={this.funcPlot}
					stroke={colors.pink}
					lineWidth={this.lineWidth}
					points={createPoints(this.f, props.range, 100)}
					end={0}
				/>

				<Line
					ref={this.graphAxes.x}
					lineWidth={this.lineWidth}
					stroke={colors.lighterGray}
					points={[
						[-this.view().width(), 0],
						[this.view().width(), 0]
					]}
					end={0}
				/>
				<Line
					ref={this.graphAxes.y}
					lineWidth={this.lineWidth}
					stroke={colors.lighterGray}
					points={[
						[0, -this.view().height()],
						[0, this.view().height()]
					]}
					end={0}
				/>

				<Layout>
					{range(20).map((index) => (
						<Txt
							ref={this.xMarkers}
							x={index == 0 ? -25 : 100 * index}
							y={30}
							text={`${index}`}
							fill={colors.lighterGray}
							fontSize={35}
							opacity={0}
						/>
					))}
					{range(1, 15).map((index) => (
						<Txt
							ref={this.yMarkers}
							x={-12.5}
							y={-100 * index}
							offset={[1, 0]}
							text={`${index}`}
							fill={colors.lighterGray}
							fontSize={35}
							opacity={0}
						/>
					))}
				</Layout>

				<Layout zIndex={2}>
					<Layout
						opacity={0}
						position={() => [this.p1() * 100, -this.f(this.p1()) * 100]}
						scale={() => 1 / this.camera().scale.x()}
					>
						<Latex
							ref={this.points.a}
							tex="{\color{white} A}"
							position={[-50, -50]}
							width={50}
						/>
						<Circle size={30} fill={'white'} />
					</Layout>
					<Layout
						opacity={0}
						position={() => [this.p2() * 100, -this.f(this.p2()) * 100]}
						scale={() => 1 / this.camera().scale.x()}
					>
						<Latex
							ref={this.points.b}
							tex="{\color{white} B}"
							position={[-50, -50]}
							width={50}
						/>
						<Circle size={30} fill={'white'} />
					</Layout>
				</Layout>

				<Line
					ref={this.slope}
					zIndex={1}
					lineWidth={this.lineWidth}
					stroke={colors.orange}
					points={() => [
						new Vector2(-600, this.slopeVal() * 600),
						new Vector2(600, this.slopeVal() * -600)
					]}
					end={0}
					opacity={0}
				/>

				<Layout zIndex={1}>
					<Line
						ref={this.deltas.x}
						lineWidth={this.lineWidth}
						stroke={colors.blue}
						points={() => [
							[this.p1() * 100, -this.f(this.p1()) * 100],
							[this.p2() * 100, -this.f(this.p1()) * 100]
						]}
						lineCap={'round'}
						end={0}
						opacity={0}
					/>
					<Line
						ref={this.deltas.y}
						lineWidth={this.lineWidth}
						stroke={colors.green}
						points={() => [
							[this.p2() * 100, -this.f(this.p1()) * 100],
							[this.p2() * 100, -this.f(this.p2()) * 100]
						]}
						lineCap={'round'}
						end={0}
						opacity={0}
					/>
				</Layout>

				<Layout zIndex={1}>
					<Latex
						ref={this.deltaLabels.x}
						offset={[0, -1]}
						x={() => ((this.p1() + this.p2()) / 2) * 100}
						y={() =>
							-this.f(this.p1()) * 100 + (1 / this.camera().scale.x()) * 30
						}
						scale={() => 1 / this.camera().scale.x()}
						width={100}
						tex={`{\\color{${colors.blue}} \\Delta x}`}
						opacity={0}
					/>
					<Latex
						ref={this.deltaLabels.y}
						offset={[-1, 0]}
						x={() => this.p2() * 100 + (1 / this.camera().scale.x()) * 30}
						y={() => ((-this.f(this.p1()) - this.f(this.p2())) / 2) * 100}
						scale={() => 1 / this.camera().scale.x()}
						width={100}
						tex={`{\\color{${colors.green}} \\Delta y}`}
						opacity={0}
					/>
				</Layout>
			</CameraView>
		);

		this.slope().absolutePosition(() =>
			this.points.a().absolutePosition().add(50)
		);
	}

	public pointBetween(x1: number, x2: number) {
		return new Vector2(x1 * 100, -this.f(x1) * 100)
			.add(new Vector2(x2 * 100, -this.f(x2) * 100))
			.div(2);
	}

	public *movePoints(points: { p1?: number; p2?: number }, duration = 1) {
		const p1 = points.p1 ?? this.p1();
		const p2 = points.p2 ?? this.p2();

		yield* all(this.p1(p1, duration), this.p2(p2, duration));
	}

	public *centerBetweenPoints(
		points: { p1?: number; p2?: number },
		duration = 1
	) {
		const p1 = points.p1 ?? this.p1();
		const p2 = points.p2 ?? this.p2();

		yield* this.camera().centerOn(this.pointBetween(p1, p2), duration);
	}

	public *moveAndCenter(points: { p1?: number; p2?: number }, duration = 1) {
		yield* all(
			this.movePoints(points, duration),
			this.centerBetweenPoints(points, duration)
		);
	}

	public *showGrid(duration = 1) {
		yield* sequence(
			0.2,
			this.grid().opacity(() => 1 / this.camera().scale.x(), duration),
			...this.graphAxes.mapRefs((line) => line.end(1, duration))
		);

		yield all(
			sequence(0.1, ...this.xMarkers.map((marker) => marker.opacity(1, 0.5))),
			sequence(0.1, ...this.yMarkers.map((marker) => marker.opacity(1, 0.5)))
		);

		yield* waitFor(1);
	}

	public *drawGraph(duration = 1) {
		yield* this.funcPlot().end(1, duration);
	}

	public *drawSlope(duration = 1, betweenPoints = false) {
		if (betweenPoints) {
			this.slope().absolutePosition(() =>
				new Vector2(0).transformAsPoint(this.camera().localToWorld())
			);

			this.slope().points(() => [
				[this.p1() * 100, -this.f(this.p1()) * 100],
				[this.p2() * 100, -this.f(this.p2()) * 100]
			]);
		}

		this.slope().opacity(1);
		yield* this.slope().end(1, duration);
	}

	public *showA(duration = 1) {
		yield* this.points.a().parent().opacity(1, duration);
	}

	public *showB(duration = 1) {
		yield* this.points.b().parent().opacity(1, duration);
	}

	public *showPoints(duration = 1) {
		yield* chain(this.showA(duration), this.showB(duration));
	}

	public *drawDeltas(duration = 1) {
		this.deltas.x().opacity(1);
		yield* this.deltas.x().end(1, duration);

		this.deltas.y().opacity(1);
		yield* this.deltas.y().end(1, duration);
	}

	public *drawDeltaLabels(duration = 1) {
		yield* this.deltaLabels.x().opacity(1, duration);
		yield* this.deltaLabels.y().opacity(1, duration);
	}

	public *hideDeltaLabels(duration = 1) {
		yield* all(
			...this.deltaLabels.mapRefs((label) => label.opacity(0, duration))
		);
	}

	public flipDeltaXLabel() {
		if (this.deltaXFlipped) {
			this.deltaLabels.x().offset([0, -1]);
			this.deltaLabels
				.x()
				.y(() => -this.f(this.p1()) * 100 + (1 / this.camera().scale.x()) * 30);
		} else {
			this.deltaLabels.x().offset([0, 1]);
			this.deltaLabels
				.x()
				.y(() => -this.f(this.p1()) * 100 - (1 / this.camera().scale.x()) * 30);
		}
	}

	public *showComponents(duration = 1) {
		yield* all(
			...this.points.mapRefs((point) => point.parent().opacity(1, duration)),
			...this.deltaLabels.mapRefs((label) => label.opacity(1, duration)),
			...this.deltas
				.mapRefs((delta) => [
					delta.end(1, duration),
					delta.opacity(1, duration)
				])
				.flat(),
			this.slope().end(1, 2),
			this.slope().opacity(1, duration)
		);
	}

	public *hideComponents(duration = 1, opacity = 0) {
		yield* all(
			...this.points.mapRefs((point) =>
				point.parent().opacity(opacity, duration)
			),
			...this.deltaLabels.mapRefs((label) => label.opacity(opacity, duration)),
			...this.deltas
				.mapRefs((delta) => [
					delta.end(0, duration),
					delta.opacity(opacity, duration)
				])
				.flat(),
			this.slope().end(0, duration),
			this.slope().opacity(opacity, duration)
		);
	}

	public *showGraphStuff(duration: number = 1) {
		yield* all(
			this.grid().opacity(() => 1 / this.camera().scale.x(), duration),
			...this.graphAxes.mapRefs((axis) => axis.opacity(1, duration)),
			...this.xMarkers.map((marker) => marker.opacity(1, duration)),
			...this.yMarkers.map((marker) => marker.opacity(1, duration))
		);
	}

	public *hideGraphStuff(opacity: number, duration: number = 1) {
		yield* all(
			this.grid().opacity(opacity, duration),
			...this.graphAxes.mapRefs((axis) => axis.opacity(opacity, duration)),
			...this.xMarkers.map((marker) => marker.opacity(opacity, duration)),
			...this.yMarkers.map((marker) => marker.opacity(opacity, duration))
		);
	}
}
