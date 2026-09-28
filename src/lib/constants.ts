/** Gallery room — a long bright hall running from the entrance (+z) to the far wall (-z). */
export const ROOM_HALF_WIDTH = 4.6;
export const ROOM_HEIGHT = 5.4;
export const ROOM_NEAR_Z = 5;
export const ROOM_FAR_Z = -63;

/** First-person walker. */
export const EYE_HEIGHT = 1.68;
export const WALK_SPEED = 2.6;
export const RUN_SPEED = 4.6;
export const BODY_RADIUS = 0.45;
export const LOOK_SENSITIVITY = 0.0022;
export const START_POSITION = { x: 0, z: 2.5 };

/** A painting lights up when the visitor is this close to it and roughly facing it. */
export const FOCUS_DISTANCE = 5.6;
export const FOCUS_FACING = 0.45;
/** Comfortable spot to admire a painting from, metres from the wall. */
export const VIEWING_DISTANCE = 3.5;

export const HIGHLIGHT_COLOR = "#ffd84a";

/** Centre height of every painting. */
export const PAINTING_Y = 2.25;

/** Benches in the middle of the hall: centre + half extents (x, z). */
export const BENCHES = [
  { x: 0, z: -14.5, hx: 1.1, hz: 0.32 },
  { x: 0, z: -36.5, hx: 1.1, hz: 0.32 },
  { x: 0, z: -47.5, hx: 1.1, hz: 0.32 },
];

/** Potted plants along the walls, kept clear of the paintings: [x, z]. */
export const PLANTS: [number, number][] = [
  [-ROOM_HALF_WIDTH + 0.7, -2],
  [ROOM_HALF_WIDTH - 0.7, -3],
  [ROOM_HALF_WIDTH - 0.7, -12],
  [-ROOM_HALF_WIDTH + 0.7, -17],
  [-ROOM_HALF_WIDTH + 0.7, -24],
  [ROOM_HALF_WIDTH - 0.7, -30],
  [-ROOM_HALF_WIDTH + 0.7, -39],
  [ROOM_HALF_WIDTH - 0.7, -49],
  [-ROOM_HALF_WIDTH + 0.7, -46],
  [ROOM_HALF_WIDTH - 0.7, -55],
  [ROOM_HALF_WIDTH - 0.7, -60],
  [-ROOM_HALF_WIDTH + 0.7, -60],
];
