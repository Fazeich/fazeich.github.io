import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PAINTINGS } from "@/content/projects";
import { EYE_HEIGHT, LOOK_SENSITIVITY, RUN_SPEED, WALK_SPEED } from "@/lib/constants";
import { collide, pickFocus } from "@/lib/layout";
import { capturePointer } from "@/lib/pointer";
import { WalkerRuntime } from "@/lib/runtime";
import { $activePainting, $introOpen, activePaintingChanged, introClosed, lockChanged, pausedChanged } from "@/store/gallery";

// Physical key codes, so WASD also works on the Russian layout (ЦФЫВ).
const MOVE_KEYS = ["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
const RUN_KEYS = ["ShiftLeft", "ShiftRight"];
const MAX_PITCH = 1.1;

/** First-person visitor: WASD walking, mouse look with a captured cursor and a gentle head bob. */
export const Walker = ({ runtime }: { runtime: WalkerRuntime }) => {
  const { camera, gl } = useThree();
  const keys = useRef(new Set<string>());
  const bob = useRef({ phase: 0, amount: 0, idle: 0, sway: 1 });

  useEffect(() => {
    const canvas = gl.domElement;
    let pauseTimer = 0;

    const down = (event: KeyboardEvent) => {
      if (!MOVE_KEYS.includes(event.code) && !RUN_KEYS.includes(event.code)) return;

      event.preventDefault();
      keys.current.add(event.code);

      if (MOVE_KEYS.includes(event.code) && $introOpen.getState()) introClosed();
    };
    const up = (event: KeyboardEvent) => keys.current.delete(event.code);
    const clear = () => keys.current.clear();

    const look = (event: MouseEvent) => {
      if (document.pointerLockElement !== canvas) return;

      runtime.yaw -= event.movementX * LOOK_SENSITIVITY;
      runtime.pitch = Math.max(-MAX_PITCH, Math.min(MAX_PITCH, runtime.pitch - event.movementY * LOOK_SENSITIVITY));
    };
    const click = () => {
      if ($introOpen.getState()) introClosed();
      capturePointer();
    };
    const lockChange = () => {
      const locked = document.pointerLockElement === canvas;

      lockChanged(locked);
      if (locked) return;

      // The browser drops pointer lock both on Esc and when the tab/window loses focus, and the focus
      // events may land slightly after this one — so decide a moment later whether it was a real pause.
      window.clearTimeout(pauseTimer);
      pauseTimer = window.setTimeout(() => {
        const away = document.hidden || !document.hasFocus();

        pausedChanged(!away && document.pointerLockElement !== canvas);
      }, 150);
    };
    const leave = () => {
      window.clearTimeout(pauseTimer);
      pausedChanged(false);
    };
    const visibility = () => {
      if (document.hidden) leave();
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", clear);
    window.addEventListener("blur", leave);
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("mousemove", look);
    canvas.addEventListener("click", click);
    document.addEventListener("pointerlockchange", lockChange);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", clear);
      window.removeEventListener("blur", leave);
      document.removeEventListener("visibilitychange", visibility);
      window.clearTimeout(pauseTimer);
      window.removeEventListener("mousemove", look);
      canvas.removeEventListener("click", click);
      document.removeEventListener("pointerlockchange", lockChange);
      if (document.pointerLockElement === canvas) document.exitPointerLock();
    };
  }, [gl, runtime]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const held = keys.current;
    const speed = RUN_KEYS.some((key) => held.has(key)) ? RUN_SPEED : WALK_SPEED;
    const forward = Number(held.has("KeyW") || held.has("ArrowUp")) - Number(held.has("KeyS") || held.has("ArrowDown"));
    const sideways = Number(held.has("KeyD") || held.has("ArrowRight")) - Number(held.has("KeyA") || held.has("ArrowLeft"));
    let moveX = 0;
    let moveZ = 0;

    if (forward || sideways) {
      const sin = Math.sin(runtime.yaw);
      const cos = Math.cos(runtime.yaw);
      const length = Math.hypot(forward, sideways);

      moveX = (-sin * forward + cos * sideways) / length;
      moveZ = (-cos * forward - sin * sideways) / length;
    }

    const next = collide(runtime.x + moveX * speed * dt, runtime.z + moveZ * speed * dt);
    const travelled = Math.hypot(next.x - runtime.x, next.z - runtime.z);

    runtime.x = next.x;
    runtime.z = next.z;

    // Head bob: steps follow the distance walked, fading in and out smoothly.
    const b = bob.current;

    b.phase += travelled * 3.4;
    b.amount += ((travelled > 0 ? 1 : 0) - b.amount) * Math.min(1, dt * 6);
    b.idle += dt;

    const introOpen = $introOpen.getState();

    // Slow look-around behind the welcome card, easing out once the walk starts.
    b.sway += ((introOpen ? 1 : 0) - b.sway) * Math.min(1, dt * 1.5);
    if (b.sway < 0.001) b.sway = 0;
    const idleSway = Math.sin(b.idle * 0.35) * 0.12 * b.sway;

    camera.rotation.order = "YXZ";
    camera.position.set(
      runtime.x + Math.cos(b.phase) * 0.025 * b.amount,
      EYE_HEIGHT + Math.abs(Math.sin(b.phase)) * 0.06 * b.amount,
      runtime.z,
    );
    camera.rotation.set(runtime.pitch, runtime.yaw + idleSway, Math.cos(b.phase) * 0.006 * b.amount);

    const focus = introOpen ? null : pickFocus(PAINTINGS, runtime.x, runtime.z, runtime.yaw);

    if (focus !== $activePainting.getState()) activePaintingChanged(focus);
  });

  return null;
};
