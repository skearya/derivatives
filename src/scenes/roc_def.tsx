import { Layout, Txt, makeScene2D } from '@motion-canvas/2d';
import { all, createRef, waitFor, waitUntil } from '@motion-canvas/core';
import { colors } from '../utils';

export default makeScene2D(function* (view) {
	view.fontFamily('JetBrains Mono');
	view.fontSize(64);
	view.opacity(0);

	const equals = createRef<Txt>();
	const definition = createRef<Txt>();

	view.add(
		<Layout
			layout
			direction={'column'}
			alignItems={'center'}
			justifyContent={'center'}
			gap={50}
		>
			<Txt text={'rate of change'} fill={colors.white} fontWeight={550} />
			<Txt ref={equals} text={'='} fill={colors.white} opacity={0} />
			<Txt
				ref={definition}
				lineHeight={90}
				fill={colors.white}
				fontStyle={'italic'}
				text={'how much one quantity changes\nin relation to another quantity'}
				opacity={0}
			/>
		</Layout>
	);

	yield* waitUntil('title');
	yield* view.opacity(1, 1);

	yield* waitUntil('definition');
	yield* all(equals().opacity(1, 1), definition().opacity(1, 1));

	yield* waitUntil('end');
	yield* view.opacity(0, 1);
});
