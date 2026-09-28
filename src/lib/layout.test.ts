import { describe, expect, it } from "vitest";
import { PAINTINGS } from "@/content/projects";
import { BENCHES, ROOM_HALF_WIDTH } from "./constants";
import { collide, pickFocus, placePainting, viewingSpot } from "./layout";

const byId = (id: string) => PAINTINGS.find((p) => p.id === id)!;

describe("gallery layout", () => {
  it("faces every painting into the room", () => {
    for (const painting of PAINTINGS) {
      const p = placePainting(painting);
      const spot = viewingSpot(painting);

      // Front of the painting (+z local rotated by rotationY) equals the room normal.
      expect(Math.sin(p.rotationY)).toBeCloseTo(p.nx);
      expect(Math.cos(p.rotationY)).toBeCloseTo(p.nz);
      expect(Math.abs(spot.x)).toBeLessThan(ROOM_HALF_WIDTH);
    }
  });

  it("focuses a painting when standing at its viewing spot", () => {
    for (const painting of PAINTINGS) {
      const spot = viewingSpot(painting);

      expect(pickFocus(PAINTINGS, spot.x, spot.z, spot.yaw)).toBe(painting.id);
    }
  });

  it("ignores a painting behind the visitor", () => {
    const spot = viewingSpot(byId("sandbox"));

    expect(pickFocus(PAINTINGS, spot.x, spot.z, spot.yaw + Math.PI)).not.toBe("sandbox");
  });

  it("keeps the walker out of walls and benches", () => {
    expect(collide(99, 0).x).toBeLessThan(ROOM_HALF_WIDTH);
    const bench = BENCHES[0];
    const pushed = collide(bench.x, bench.z + 0.1);

    expect(Math.abs(pushed.z - bench.z)).toBeGreaterThanOrEqual(bench.hz);
  });
});
