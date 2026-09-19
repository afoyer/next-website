// Geometry + physics helpers for the mobile pager's vertical item dial.
// Pure functions — no DOM, no React — so the behavior stays easy to reason about.

/** Degrees of cylinder rotation between adjacent items. */
export const ANGLE = 24;

/** Height (px) of one item slot. Drives drag sensitivity and the cylinder radius. */
export const ITEM_HEIGHT = 60;

/** Cylinder radius (px): half the slot height divided by tan(half the per-item angle). */
export const RADIUS: number = Math.round(ITEM_HEIGHT / 2 / Math.tan((ANGLE / 2) * (Math.PI / 180)));

/** Spring used to settle the dial onto an item. */
export const SETTLE_SPRING = { type: "spring" as const, stiffness: 300, damping: 32 };

/** Contribution of release velocity (items/sec) to the projected landing index. */
export const MOMENTUM_FACTOR = 0.18;

/** Wheel delta (px) multiplier when feeding the dial position. */
export const WHEEL_SENSITIVITY = 0.008;

/** Milliseconds of wheel silence before the dial snaps to the nearest item. */
export const WHEEL_SETTLE_MS = 120;

/** First-move travel (px) before a gesture commits to an axis. */
export const AXIS_LOCK_THRESHOLD = 6;

/** Horizontal travel (px) that commits a section swipe. */
export const SWIPE_OFFSET = 60;

/** Horizontal velocity (px/s) that commits a fast section flick. */
export const SWIPE_VELOCITY = 400;

export function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

/** Snap target after a flick: project momentum forward, round, clamp to range. */
export function projectTarget(pos: number, velocity: number, count: number): number {
	return clamp(Math.round(pos + velocity * MOMENTUM_FACTOR), 0, Math.max(0, count - 1));
}

/**
 * Opacity for an item `offset` slots from center (offset may be fractional).
 * Items past 90° sit on the back of the cylinder and are fully hidden.
 */
export function itemOpacity(offset: number): number {
	const deg = Math.abs(offset) * ANGLE;
	if (deg >= 90) return 0;
	return Math.max(0, Math.cos(deg * (Math.PI / 180)));
}

/**
 * First-move axis decision. Returns null until travel passes the lock threshold,
 * then "vertical" or "horizontal" based on the dominant component.
 */
export function axisFromDelta(dx: number, dy: number): "vertical" | "horizontal" | null {
	if (Math.abs(dx) < AXIS_LOCK_THRESHOLD && Math.abs(dy) < AXIS_LOCK_THRESHOLD) return null;
	return Math.abs(dy) > Math.abs(dx) ? "vertical" : "horizontal";
}
