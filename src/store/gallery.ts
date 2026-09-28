import { createEvent, createStore } from "effector";

/** Id of the painting the visitor is currently looking at (null when none). */
export const activePaintingChanged = createEvent<string | null>();
export const $activePainting = createStore<string | null>(null).on(activePaintingChanged, (_, id) => id);

/** Welcome card on top of the gallery; closed once the visitor starts walking. */
export const introClosed = createEvent();
export const $introOpen = createStore(true).on(introClosed, () => false);

/** Whether the mouse cursor is captured by the gallery (pointer lock). */
export const lockChanged = createEvent<boolean>();
export const $locked = createStore(false).on(lockChanged, (_, locked) => locked);

/**
 * "Paused" = the visitor freed the cursor on purpose (Esc) and should see the resume button.
 * Losing the cursor because the tab or window lost focus is not a pause — no menu then.
 */
export const pausedChanged = createEvent<boolean>();
export const $paused = createStore(false)
  .on(pausedChanged, (_, paused) => paused)
  .on(lockChanged, (paused, locked) => (locked ? false : paused));
