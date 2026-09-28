import { useMemo } from "react";
import * as THREE from "three";
import { paintFloor } from "@/lib/art";
import { BENCHES, PLANTS, ROOM_FAR_Z, ROOM_HALF_WIDTH, ROOM_HEIGHT, ROOM_NEAR_Z } from "@/lib/constants";

const LENGTH = ROOM_NEAR_Z - ROOM_FAR_Z;
const MID_Z = (ROOM_NEAR_Z + ROOM_FAR_Z) / 2;
const WIDTH = ROOM_HALF_WIDTH * 2;

const WALL_COLOR = "#fbf7ef";
const TRIM_COLOR = "#e9dcc6";
const CEILING_COLOR = "#ffffff";

/** Skylight panels along the ceiling. */
const SKYLIGHTS = Array.from({ length: Math.floor(LENGTH / 6.4) }, (_, i) => ROOM_NEAR_Z - 4 - i * 6.4);
const useFloorTexture = () =>
  useMemo(() => {
    const canvas = document.createElement("canvas");

    canvas.width = 512;
    canvas.height = 1024;
    paintFloor(canvas);

    const texture = new THREE.CanvasTexture(canvas);

    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(WIDTH / 2.2, LENGTH / 5);
    texture.anisotropy = 8;

    return texture;
  }, []);

const Bench = ({ x, z, hx, hz }: { x: number; z: number; hx: number; hz: number }) => (
  <group position={[x, 0, z]}>
    <mesh position={[0, 0.45, 0]}>
      <boxGeometry args={[hx * 2, 0.08, hz * 2]} />
      <meshStandardMaterial color="#c89664" roughness={0.6} />
    </mesh>
    {[-1, 1].map((side) => (
      <mesh key={side} position={[side * (hx - 0.15), 0.21, 0]}>
        <boxGeometry args={[0.08, 0.42, hz * 1.7]} />
        <meshStandardMaterial color="#3f3a36" roughness={0.5} metalness={0.3} />
      </mesh>
    ))}
  </group>
);

const Plant = ({ x, z, seed }: { x: number; z: number; seed: number }) => (
  <group position={[x, 0, z]}>
    <mesh position={[0, 0.3, 0]}>
      <cylinderGeometry args={[0.28, 0.22, 0.6, 20]} />
      <meshStandardMaterial color={seed % 2 ? "#f4a261" : "#e9c46a"} roughness={0.8} />
    </mesh>
    {[0, 1, 2, 3, 4].map((i) => {
      const a = i * 1.3 + seed;

      return (
        <mesh key={i} position={[Math.cos(a) * 0.18, 0.85 + (i % 3) * 0.22, Math.sin(a) * 0.18]}>
          <icosahedronGeometry args={[0.28 - (i % 3) * 0.04, 0]} />
          <meshStandardMaterial color={["#52b788", "#40916c", "#74c69d"][i % 3]} roughness={0.7} flatShading />
        </mesh>
      );
    })}
  </group>
);

export const Room = () => {
  const floor = useFloorTexture();

  return (
    <group>
      {/* Floor */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, MID_Z]}>
        <planeGeometry args={[WIDTH, LENGTH]} />
        <meshStandardMaterial map={floor} roughness={0.55} emissive="#ffffff" emissiveMap={floor} emissiveIntensity={0.18} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation-x={Math.PI / 2} position={[0, ROOM_HEIGHT, MID_Z]}>
        <planeGeometry args={[WIDTH, LENGTH]} />
        <meshStandardMaterial color={CEILING_COLOR} emissive={CEILING_COLOR} emissiveIntensity={0.45} />
      </mesh>
      {SKYLIGHTS.map((z) => (
        <mesh key={z} rotation-x={Math.PI / 2} position={[0, ROOM_HEIGHT - 0.01, z]}>
          <planeGeometry args={[WIDTH * 0.55, 3.2]} />
          <meshBasicMaterial color="#fffdf5" toneMapped={false} />
        </mesh>
      ))}

      {/* Side walls */}
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * ROOM_HALF_WIDTH, ROOM_HEIGHT / 2, MID_Z]} rotation-y={-side * Math.PI / 2}>
            <planeGeometry args={[LENGTH, ROOM_HEIGHT]} />
            <meshStandardMaterial color={WALL_COLOR} emissive={WALL_COLOR} emissiveIntensity={0.32} />
          </mesh>
          {/* Baseboard and picture rail */}
          <mesh position={[side * (ROOM_HALF_WIDTH - 0.02), 0.08, MID_Z]}>
            <boxGeometry args={[0.04, 0.16, LENGTH]} />
            <meshStandardMaterial color={TRIM_COLOR} />
          </mesh>
          <mesh position={[side * (ROOM_HALF_WIDTH - 0.02), ROOM_HEIGHT - 0.9, MID_Z]}>
            <boxGeometry args={[0.04, 0.05, LENGTH]} />
            <meshStandardMaterial color={TRIM_COLOR} />
          </mesh>
        </group>
      ))}

      {/* End walls */}
      <mesh position={[0, ROOM_HEIGHT / 2, ROOM_FAR_Z]}>
        <planeGeometry args={[WIDTH, ROOM_HEIGHT]} />
        <meshStandardMaterial color={WALL_COLOR} emissive={WALL_COLOR} emissiveIntensity={0.32} />
      </mesh>
      <mesh position={[0, ROOM_HEIGHT / 2, ROOM_NEAR_Z]} rotation-y={Math.PI}>
        <planeGeometry args={[WIDTH, ROOM_HEIGHT]} />
        <meshStandardMaterial color={WALL_COLOR} emissive={WALL_COLOR} emissiveIntensity={0.32} />
      </mesh>

      {BENCHES.map((bench) => (
        <Bench key={bench.z} {...bench} />
      ))}
      {PLANTS.map(([x, z], i) => (
        <Plant key={`${x}:${z}`} x={x} z={z} seed={i} />
      ))}
    </group>
  );
};
