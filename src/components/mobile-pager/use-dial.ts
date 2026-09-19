import {
	type AnimationPlaybackControls,
	animate,
	type MotionValue,
	useMotionValue,
	useTransform,
} from "motion/react";
import type { KeyboardEvent, MutableRefObject, PointerEvent, RefObject } from "react";
import { useCallback, useEffect, useRef } from "react";
import {
	ANGLE,
	axisFromDelta,
	clamp,
	ITEM_HEIGHT,
	projectTarget,
	SETTLE_SPRING,
	SWIPE_OFFSET,
	SWIPE_VELOCITY,
	WHEEL_SENSITIVITY,
	WHEEL_SETTLE_MS,
} from "./dial-math";

export type UseDialArgs = {
	count: number;
	index: number;
	active: boolean;
	onSettle: (index: number) => void;
	onSwipeSection: (delta: number) => void;
};

export function useDial({ count, index, active, onSettle, onSwipeSection }: UseDialArgs): {
	pos: MotionValue<number>;
	stageDeg: MotionValue<number>;
	containerRef: RefObject<HTMLDivElement | null>;
	didDragRef: MutableRefObject<boolean>;
	rollTo: (index: number) => void;
	handlePointerDown: (e: PointerEvent) => void;
	handlePointerMove: (e: PointerEvent) => void;
	handlePointerUp: (e: PointerEvent) => void;
	handleKeyDown: (e: KeyboardEvent) => void;
} {
	const pos = useMotionValue(index);
	const stageDeg = useTransform(pos, (p) => p * ANGLE);
	const containerRef = useRef<HTMLDivElement | null>(null);

	// Callbacks via refs so listeners don't resubscribe when the parent re-renders.
	const onSettleRef = useRef(onSettle);
	onSettleRef.current = onSettle;
	const onSwipeRef = useRef(onSwipeSection);
	onSwipeRef.current = onSwipeSection;

	const controlsRef = useRef<AnimationPlaybackControls | null>(null);
	const didDragRef = useRef(false);
	const draggingRef = useRef(false);
	const axisRef = useRef<"vertical" | "horizontal" | null>(null);
	const pointerIdRef = useRef<number | null>(null);
	const startRef = useRef({ x: 0, y: 0, pos: 0, t: 0 });
	const lastRef = useRef({ y: 0, t: 0 });
	const velRef = useRef(0); // items/sec, positive = toward higher index

	const settleTo = useCallback(
		(target: number, velocity: number) => {
			controlsRef.current?.stop();
			controlsRef.current = animate(pos, target, {
				...SETTLE_SPRING,
				velocity,
				onComplete: () => onSettleRef.current(target),
			});
		},
		[pos],
	);

	const rollTo = useCallback(
		(target: number) => {
			settleTo(clamp(Math.round(target), 0, count - 1), 0);
		},
		[count, settleTo],
	);

	const handlePointerDown = useCallback(
		(e: PointerEvent) => {
			if (!active) return;
			controlsRef.current?.stop();
			draggingRef.current = true;
			didDragRef.current = false;
			axisRef.current = null;
			pointerIdRef.current = e.pointerId;
			startRef.current = { x: e.clientX, y: e.clientY, pos: pos.get(), t: e.timeStamp };
			lastRef.current = { y: e.clientY, t: e.timeStamp };
			velRef.current = 0;
			e.currentTarget.setPointerCapture(e.pointerId);
		},
		[active, pos],
	);

	const handlePointerMove = useCallback(
		(e: PointerEvent) => {
			if (!draggingRef.current) return;
			const dx = e.clientX - startRef.current.x;
			const dy = e.clientY - startRef.current.y;
			if (axisRef.current === null) {
				const decided = axisFromDelta(dx, dy);
				if (!decided) return;
				axisRef.current = decided;
				didDragRef.current = true; // a committed drag suppresses the trailing click
			}
			if (axisRef.current !== "vertical") return; // horizontal commits on release
			const next = clamp(startRef.current.pos - dy / ITEM_HEIGHT, 0, count - 1);
			pos.set(next);
			const dt = (e.timeStamp - lastRef.current.t) / 1000;
			if (dt > 0) velRef.current = -((e.clientY - lastRef.current.y) / ITEM_HEIGHT) / dt;
			lastRef.current = { y: e.clientY, t: e.timeStamp };
		},
		[count, pos],
	);

	const handlePointerUp = useCallback(
		(e: PointerEvent) => {
			if (!draggingRef.current) return;
			draggingRef.current = false;
			if (pointerIdRef.current !== null) {
				e.currentTarget.releasePointerCapture(pointerIdRef.current);
				pointerIdRef.current = null;
			}
			const axis = axisRef.current;
			if (axis === "vertical") {
				settleTo(projectTarget(pos.get(), velRef.current, count), velRef.current);
			} else if (axis === "horizontal") {
				const dx = e.clientX - startRef.current.x;
				const dt = (e.timeStamp - startRef.current.t) / 1000;
				const vx = dt > 0 ? dx / dt : 0;
				if (dx < -SWIPE_OFFSET || vx < -SWIPE_VELOCITY) onSwipeRef.current(1);
				else if (dx > SWIPE_OFFSET || vx > SWIPE_VELOCITY) onSwipeRef.current(-1);
			}
			// the trailing click fires synchronously after pointerup; clear afterwards
			setTimeout(() => {
				didDragRef.current = false;
			}, 0);
		},
		[count, pos, settleTo],
	);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (!active) return;
			if (e.key === "ArrowDown") {
				e.preventDefault();
				rollTo(Math.round(pos.get()) + 1);
			} else if (e.key === "ArrowUp") {
				e.preventDefault();
				rollTo(Math.round(pos.get()) - 1);
			}
		},
		[active, pos, rollTo],
	);

	// Wheel/scroll — native listener so preventDefault works (React onWheel is passive).
	useEffect(() => {
		const el = containerRef.current;
		if (!el || !active) return;
		let timer: ReturnType<typeof setTimeout> | undefined;
		const onWheel = (e: WheelEvent) => {
			e.preventDefault();
			controlsRef.current?.stop();
			pos.set(clamp(pos.get() + e.deltaY * WHEEL_SENSITIVITY, 0, count - 1));
			didDragRef.current = true;
			if (timer) clearTimeout(timer);
			timer = setTimeout(() => {
				const target = clamp(Math.round(pos.get()), 0, count - 1);
				settleTo(target, 0);
				didDragRef.current = false;
			}, WHEEL_SETTLE_MS);
		};
		el.addEventListener("wheel", onWheel, { passive: false });
		return () => {
			el.removeEventListener("wheel", onWheel);
			if (timer) clearTimeout(timer);
			didDragRef.current = false;
		};
	}, [active, count, pos, settleTo]);

	// Sync to external index changes (dot tap, section switch) when not dragging.
	useEffect(() => {
		if (draggingRef.current) return;
		if (Math.round(pos.get()) === index) return;
		controlsRef.current?.stop();
		// index is already authoritative here (parent-driven) — no onSettle, avoids a feedback loop
		controlsRef.current = animate(pos, index, SETTLE_SPRING);
	}, [index, pos]);

	return {
		pos,
		stageDeg,
		containerRef,
		didDragRef,
		rollTo,
		handlePointerDown,
		handlePointerMove,
		handlePointerUp,
		handleKeyDown,
	};
}
