import { PAINTINGS } from "@/content/projects";
import { ROOM_HEIGHT } from "@/lib/constants";
import { WalkerRuntime } from "@/lib/runtime";
import { Painting } from "./Painting";
import { Room } from "./Room";
import { Walker } from "./Walker";

const BACKGROUND = "#fbf6ec";

export const GalleryScene = ({ runtime }: { runtime: WalkerRuntime }) => (
  <>
    <color attach="background" args={[BACKGROUND]} />
    <fog attach="fog" args={[BACKGROUND, 28, 90]} />

    <hemisphereLight args={["#ffffff", "#f1d9b5", 1.6]} />
    <ambientLight intensity={0.55} />
    <directionalLight position={[3, ROOM_HEIGHT + 6, 4]} intensity={1.1} color="#fff6e5" />

    <Room />
    {PAINTINGS.map((painting) => (
      <Painting key={painting.id} painting={painting} />
    ))}
    <Walker runtime={runtime} />
  </>
);
