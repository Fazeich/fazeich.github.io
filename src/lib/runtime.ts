import { START_POSITION } from "./constants";

/** Fast-changing walker state, shared between the canvas loop and DOM overlays without React re-renders. */
export interface WalkerRuntime {
  x: number;
  z: number;
  yaw: number;
  pitch: number;
}

export const createWalkerRuntime = (): WalkerRuntime => ({
  x: START_POSITION.x,
  z: START_POSITION.z,
  yaw: 0,
  pitch: -0.02,
});
