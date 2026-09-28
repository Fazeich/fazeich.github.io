import { Canvas } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { useUnit } from "effector-react";
import { GREETING, PAINTINGS } from "@/content/projects";
import { capturePointer } from "@/lib/pointer";
import { createWalkerRuntime } from "@/lib/runtime";
import { GalleryScene } from "@/scene/GalleryScene";
import { $activePainting, $introOpen, $locked, $paused, activePaintingChanged, introClosed } from "@/store/gallery";
import { Brand, Controls, Crosshair, HintBar, Intro, Overlay, Page, ResumeHint, StartButton } from "@/ui/styles";

/** The "use" key: E on the English layout, У on the Russian one (same physical key). */
const isUseKey = (event: KeyboardEvent) => event.code === "KeyE" || ["e", "E", "у", "У"].includes(event.key);

const start = () => {
  introClosed();
  capturePointer();
};

export const App = () => {
  const runtime = useMemo(() => createWalkerRuntime(), []);
  const [introOpen, active, locked, paused] = useUnit([$introOpen, $activePainting, $locked, $paused]);

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.repeat) return;

      if ($introOpen.getState()) {
        if (event.code === "Enter" || event.code === "Space") {
          event.preventDefault();
          start();
        }

        return;
      }

      if (isUseKey(event)) {
        const painting = PAINTINGS.find((p) => p.id === $activePainting.getState());

        if (painting?.url) window.location.assign(painting.url);
      }
    };

    window.addEventListener("keydown", down);

    return () => {
      window.removeEventListener("keydown", down);
      activePaintingChanged(null);
    };
  }, []);

  return (
    <Page>
      <Canvas
        dpr={[1, 2]}
        camera={{ fov: 70, near: 0.05, far: 120, position: [0, 1.7, 2.5] }}
        style={{ cursor: locked ? "none" : "pointer" }}
      >
        <GalleryScene runtime={runtime} />
      </Canvas>

      <Brand>
        {GREETING.name}&apos;s <span>gallery</span>
      </Brand>

      {!introOpen && locked && <Crosshair data-active={active ? "" : undefined} />}

      {!introOpen && !locked && paused && <ResumeHint onClick={capturePointer}>Click to look around</ResumeHint>}

      {!introOpen && (
        <HintBar style={{ opacity: active ? 0 : 1 }}>
          <kbd>W A S D</kbd> walk · <kbd>Shift</kbd> hurry · mouse to look · <kbd>E</kbd> enter · <kbd>Esc</kbd> free the cursor
        </HintBar>
      )}

      {introOpen && (
        <Overlay>
          <Intro>
            <h1>{GREETING.title}</h1>
            <p>{GREETING.text}</p>
            <StartButton type="button" onClick={start} autoFocus>
              Let&apos;s take a walk →
            </StartButton>
            <Controls>
              <li>
                <kbd>WASD</kbd> walk
              </li>
              <li>mouse to look</li>
              <li>
                <kbd>E</kbd> enter a project
              </li>
              <li>
                <kbd>Esc</kbd> free the cursor
              </li>
            </Controls>
          </Intro>
        </Overlay>
      )}
    </Page>
  );
};
