import { useEffect, useRef } from "react";
import { CONTACTS } from "@/content/projects";
import { CardButton, CardHint, CardLinks } from "@/ui/styles";

/** Minimum time a button stays pressed down, so even a quick click shows the "push". */
const MIN_PRESS_MS = 140;

const isLocked = () => document.pointerLockElement !== null;

/**
 * Contact buttons under the farewell painting.
 * With a free cursor they behave like ordinary links (CSS :hover / :active).
 * With a captured cursor the crosshair in the middle of the screen acts as the pointer:
 * aiming at a button lights it up, a left click pushes it in and opens the link.
 */
export const ContactLinks = () => {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = root.current;

    if (!container) return;

    let aimed: HTMLAnchorElement | null = null;
    let pressed: { link: HTMLAnchorElement; at: number } | null = null;
    let releaseTimer = 0;
    let frame = 0;

    const setAimed = (link: HTMLAnchorElement | null) => {
      if (link === aimed) return;
      aimed?.removeAttribute("data-hover");
      link?.setAttribute("data-hover", "");
      aimed = link;
    };

    const release = (link: HTMLAnchorElement) => link.removeAttribute("data-pressed");

    // Track what the crosshair (screen centre) is pointing at.
    const track = () => {
      frame = requestAnimationFrame(track);

      if (!isLocked()) {
        setAimed(null);
        return;
      }

      const hit = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
      const link = hit?.closest<HTMLAnchorElement>("a[data-aim]") ?? null;

      setAimed(link && container.contains(link) ? link : null);
    };

    const down = (event: MouseEvent) => {
      if (event.button !== 0 || !isLocked() || !aimed) return;

      window.clearTimeout(releaseTimer);
      pressed = { link: aimed, at: performance.now() };
      aimed.setAttribute("data-pressed", "");
    };

    const up = (event: MouseEvent) => {
      if (event.button !== 0 || !pressed) return;

      const { link, at } = pressed;

      pressed = null;
      releaseTimer = window.setTimeout(() => release(link), Math.max(0, MIN_PRESS_MS - (performance.now() - at)));

      // Only follow the link if the crosshair is still on the same button — like a real click.
      if (link === aimed) window.open(link.href, "_blank", "noopener,noreferrer");
    };

    frame = requestAnimationFrame(track);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(releaseTimer);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, []);

  return (
    <>
      <CardLinks ref={root}>
        {CONTACTS.map((contact) => (
          <CardButton as="a" key={contact.label} href={contact.url} target="_blank" rel="noreferrer" data-aim="">
            {contact.label} ↗
          </CardButton>
        ))}
      </CardLinks>
      <CardHint>
        Aim and click — or <kbd>Esc</kbd> to free the cursor
      </CardHint>
    </>
  );
};
