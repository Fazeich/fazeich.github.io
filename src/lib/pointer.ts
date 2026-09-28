/** Requests mouse capture on the gallery canvas. Browsers only allow this from a user gesture (click / key). */
export const capturePointer = () => {
  const canvas = document.querySelector("canvas");

  if (!canvas || document.pointerLockElement === canvas) return;

  try {
    // Chrome returns a promise that rejects if called too soon after Esc — just ignore it, the next click retries.
    const request = canvas.requestPointerLock() as unknown as Promise<void> | undefined;

    request?.catch?.(() => undefined);
  } catch {
    /* pointer lock unavailable */
  }
};
