import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useUnit } from "effector-react";
import * as THREE from "three";
import { PaintingSpec } from "@/content/projects";
import { paintArt, paintGlow } from "@/lib/art";
import { HIGHLIGHT_COLOR } from "@/lib/constants";
import { placePainting } from "@/lib/layout";
import { $activePainting } from "@/store/gallery";
import { Card, CardHint, CardSubtitle, CardTitle, UseKey } from "@/ui/styles";
import { ContactLinks } from "./ContactLinks";

const FRAME = 0.14;
const FRAME_DEPTH = 0.09;
const OUTLINE_GAP = 0.07;
const OUTLINE_WIDTH = 0.06;
const TEXTURE_WIDTH = 1280;

const useArtTexture = (painting: PaintingSpec) => {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");

    canvas.width = TEXTURE_WIDTH;
    canvas.height = Math.round((TEXTURE_WIDTH * painting.height) / painting.width);
    paintArt(canvas, painting.art);

    const map = new THREE.CanvasTexture(canvas);

    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 8;

    return map;
  }, [painting]);

  // Repaint once the web font is ready so lettering uses Exo 2.
  useEffect(() => {
    let alive = true;

    document.fonts?.ready.then(() => {
      if (!alive) return;
      paintArt(texture.image as HTMLCanvasElement, painting.art);
      texture.needsUpdate = true;
    });

    return () => {
      alive = false;
      texture.dispose();
    };
  }, [texture, painting]);

  return texture;
};

const glowTexture = (() => {
  let cached: THREE.CanvasTexture | null = null;

  return () => {
    if (cached) return cached;

    const canvas = document.createElement("canvas");

    canvas.width = canvas.height = 256;
    paintGlow(canvas, "rgba(255,216,74,0.55)");
    cached = new THREE.CanvasTexture(canvas);

    return cached;
  };
})();

export const Painting = ({ painting }: { painting: PaintingSpec }) => {
  const active = useUnit($activePainting) === painting.id;
  const place = useMemo(() => placePainting(painting), [painting]);
  const art = useArtTexture(painting);
  const glow = glowTexture();
  const highlight = useRef(0);
  const outlineMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({ color: HIGHLIGHT_COLOR, transparent: true, opacity: 0, toneMapped: false, depthWrite: false }),
    [],
  );
  const halo = useRef<THREE.MeshBasicMaterial>(null);
  const spot = useRef<THREE.SpotLight>(null);
  const target = useMemo(() => new THREE.Object3D(), []);

  const outerW = painting.width + FRAME * 2;
  const outerH = painting.height + FRAME * 2;

  useEffect(() => {
    if (spot.current) spot.current.target = target;
  }, [target]);

  useEffect(() => () => outlineMaterial.dispose(), [outlineMaterial]);

  useFrame((state, delta) => {
    highlight.current += ((active ? 1 : 0) - highlight.current) * Math.min(1, delta * 7);

    const pulse = 0.85 + Math.sin(state.clock.elapsedTime * 3) * 0.15;

    outlineMaterial.opacity = highlight.current * pulse;
    if (halo.current) halo.current.opacity = highlight.current * 0.9;
    if (spot.current) spot.current.intensity = 22 + highlight.current * 14;
  });

  const outlineStrips = useMemo(() => {
    const w = outerW + OUTLINE_GAP * 2;
    const h = outerH + OUTLINE_GAP * 2;

    return [
      { pos: [0, h / 2, 0], size: [w + OUTLINE_WIDTH, OUTLINE_WIDTH] },
      { pos: [0, -h / 2, 0], size: [w + OUTLINE_WIDTH, OUTLINE_WIDTH] },
      { pos: [-w / 2, 0, 0], size: [OUTLINE_WIDTH, h + OUTLINE_WIDTH] },
      { pos: [w / 2, 0, 0], size: [OUTLINE_WIDTH, h + OUTLINE_WIDTH] },
    ] as const;
  }, [outerW, outerH]);

  return (
    <group position={[place.x, place.y, place.z]} rotation-y={place.rotationY}>
      {/* Coloured feature panel on the wall */}
      <mesh position={[0, 0, -0.07]}>
        <planeGeometry args={[outerW + 1.5, outerH + 1.3]} />
        <meshStandardMaterial color={painting.accent} />
      </mesh>

      {/* Soft yellow halo */}
      <mesh position={[0, 0, -0.06]}>
        <planeGeometry args={[outerW + 1.4, outerH + 1.4]} />
        <meshBasicMaterial ref={halo} map={glow} transparent opacity={0} depthWrite={false} toneMapped={false} />
      </mesh>

      {/* Frame */}
      <mesh position={[0, 0, FRAME_DEPTH / 2 - 0.05]}>
        <boxGeometry args={[outerW, outerH, FRAME_DEPTH]} />
        <meshStandardMaterial color="#2b2522" roughness={0.85} />
      </mesh>

      {/* Canvas */}
      <mesh position={[0, 0, FRAME_DEPTH - 0.045]}>
        <planeGeometry args={[painting.width, painting.height]} />
        <meshBasicMaterial map={art} toneMapped={false} />
      </mesh>

      {/* Yellow outline */}
      {outlineStrips.map((strip, i) => (
        <mesh key={i} position={[strip.pos[0], strip.pos[1], 0.06]} material={outlineMaterial}>
          <planeGeometry args={[strip.size[0], strip.size[1]]} />
        </mesh>
      ))}

      {/* Picture light */}
      <primitive object={target} position={[0, 0, 0]} />
      <spotLight
        ref={spot}
        position={[0, outerH / 2 + 1.2, 2.8]}
        angle={0.62}
        penumbra={0.8}
        distance={9}
        decay={1.6}
        color="#fff4dc"
      />

      {active && (
        <Html position={[0, -outerH / 2 - 0.12, 0.35]} center={false} zIndexRange={[20, 0]} style={{ transform: "translate(-50%, 0)" }}>
          <Card>
            <CardTitle>{painting.title}</CardTitle>
            <CardSubtitle>{painting.subtitle}</CardSubtitle>
            {painting.url && (
              <UseKey>
                Press <kbd>E</kbd> to enter
              </UseKey>
            )}
            {!painting.url && painting.art === "farewell" && <ContactLinks />}
            {!painting.url && painting.art !== "farewell" && <CardHint>Stay tuned ✨</CardHint>}
          </Card>
        </Html>
      )}
    </group>
  );
};
