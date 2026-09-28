import {
  BENCHES,
  BODY_RADIUS,
  FOCUS_DISTANCE,
  FOCUS_FACING,
  PAINTING_Y,
  ROOM_FAR_Z,
  ROOM_HALF_WIDTH,
  ROOM_NEAR_Z,
  VIEWING_DISTANCE,
} from "./constants";
import { PaintingSpec } from "@/content/projects";

export interface Placement {
  x: number;
  y: number;
  z: number;
  /** Rotation around Y so the painting's front (+z in local space) faces into the room. */
  rotationY: number;
  /** Unit normal pointing from the wall into the room (xz plane). */
  nx: number;
  nz: number;
}

/** Gap between the wall surface and the painting canvas. */
const WALL_GAP = 0.08;

export const placePainting = (painting: PaintingSpec): Placement => {
  if (painting.wall === "left") {
    return { x: -ROOM_HALF_WIDTH + WALL_GAP, y: PAINTING_Y, z: painting.z, rotationY: Math.PI / 2, nx: 1, nz: 0 };
  }

  if (painting.wall === "right") {
    return { x: ROOM_HALF_WIDTH - WALL_GAP, y: PAINTING_Y, z: painting.z, rotationY: -Math.PI / 2, nx: -1, nz: 0 };
  }

  return { x: 0, y: PAINTING_Y + 0.15, z: ROOM_FAR_Z + WALL_GAP, rotationY: 0, nx: 0, nz: 1 };
};

/** Standing spot and yaw from which a painting is admired. Yaw uses the camera convention forward = (-sin, -cos). */
export const viewingSpot = (painting: PaintingSpec) => {
  const p = placePainting(painting);
  const distance = painting.wall === "far" ? VIEWING_DISTANCE + 0.8 : VIEWING_DISTANCE;
  const x = p.x + p.nx * distance;
  const z = p.z + p.nz * distance;

  return { x, z, yaw: Math.atan2(p.nx, p.nz) };
};

/**
 * Painting the visitor is looking at: close enough to its viewing area and facing it.
 * Returns the best candidate id or null.
 */
export const pickFocus = (paintings: PaintingSpec[], x: number, z: number, yaw: number): string | null => {
  const fx = -Math.sin(yaw);
  const fz = -Math.cos(yaw);
  let best: string | null = null;
  let bestScore = -Infinity;

  for (const painting of paintings) {
    const p = placePainting(painting);
    const dx = p.x - x;
    const dz = p.z - z;
    const distance = Math.hypot(dx, dz);
    const reach = painting.wall === "far" ? FOCUS_DISTANCE + 2 : FOCUS_DISTANCE;

    if (distance > reach || distance < 1e-3) continue;

    const facing = (dx * fx + dz * fz) / distance;

    if (facing < FOCUS_FACING) continue;

    const score = facing * 2 - distance / reach;

    if (score > bestScore) {
      bestScore = score;
      best = painting.id;
    }
  }

  return best;
};

/** Keep the walker inside the hall and out of the benches. */
export const collide = (x: number, z: number) => {
  let cx = Math.max(-ROOM_HALF_WIDTH + BODY_RADIUS, Math.min(ROOM_HALF_WIDTH - BODY_RADIUS, x));
  let cz = Math.max(ROOM_FAR_Z + BODY_RADIUS, Math.min(ROOM_NEAR_Z - BODY_RADIUS, z));

  for (const bench of BENCHES) {
    const hx = bench.hx + BODY_RADIUS;
    const hz = bench.hz + BODY_RADIUS;
    const dx = cx - bench.x;
    const dz = cz - bench.z;

    if (Math.abs(dx) >= hx || Math.abs(dz) >= hz) continue;

    const pushX = hx - Math.abs(dx);
    const pushZ = hz - Math.abs(dz);

    if (pushX < pushZ) cx = bench.x + Math.sign(dx || 1) * hx;
    else cz = bench.z + Math.sign(dz || 1) * hz;
  }

  return { x: cx, z: cz };
};
