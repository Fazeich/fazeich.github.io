import { ROOM_FAR_Z } from "@/lib/constants";

/**
 * Everything the gallery shows. To add a project: add an entry to PAINTINGS (and, if you like,
 * a matching artist in src/lib/art.ts). Paintings alternate between the left and right walls.
 */

export const GREETING = {
  name: "Vlad",
  title: "Hi, I'm Vlad 👋",
  text: "Welcome to my little gallery! I'm really glad you stopped by — every painting here is one of my projects. Take a stroll, walk up to anything that catches your eye and step right in.",
};

export const CONTACTS = [
  { label: "GitHub", url: "https://github.com/fazeich" },
  { label: "Telegram", url: "https://t.me/samsyaaa" },
];

export type PaintingArt = "sandbox" | "valley" | "resume" | "markdown" | "soon" | "farewell";
export type Wall = "left" | "right" | "far";

export interface PaintingSpec {
  id: string;
  title: string;
  subtitle: string;
  /** Where the E key leads; null for paintings without a project behind them. */
  url: string | null;
  art: PaintingArt;
  wall: Wall;
  /** Position along the hall (side walls only). */
  z: number;
  width: number;
  height: number;
  /** Colour of the feature panel behind the painting. */
  accent: string;
}

export const PAINTINGS: PaintingSpec[] = [
  {
    id: "sandbox",
    title: "Sandbox",
    subtitle: "A first-person survival sandbox in an endless procedural world. Two empty hands, solo or co-op.",
    url: "https://fazeich.github.io/sandbox/",
    art: "sandbox",
    wall: "left",
    z: -9,
    width: 3.4,
    height: 2.3,
    accent: "#ffd9b8",
  },
  {
    id: "valley-riding",
    title: "Valley Riding",
    subtitle: "Drive a little voxel car across an open valley and bring five beacons back to life.",
    url: "https://fazeich.github.io/valley-riding/",
    art: "valley",
    wall: "right",
    z: -20,
    width: 3.4,
    height: 2.3,
    accent: "#bfe3ff",
  },
  {
    id: "resume",
    title: "Resume",
    subtitle: "Who painted all this: a Frontend Engineer who loves React & TypeScript. Experience, stack and contacts.",
    url: "https://fazeich.github.io/resume/",
    art: "resume",
    wall: "left",
    z: -31,
    width: 2.05,
    height: 2.6,
    accent: "#d6f0e4",
  },
  {
    id: "markdown-editor",
    title: "Markdown Editor",
    subtitle: "A cosy editor for README files: live preview, light & dark themes, GitHub-flavoured Markdown and .md export.",
    url: "https://fazeich.github.io/markdown-editor/",
    art: "markdown",
    wall: "right",
    z: -42,
    width: 3.4,
    height: 2.3,
    accent: "#ffd6e7",
  },
  {
    id: "coming-soon",
    title: "Coming soon",
    subtitle: "Something new is taking shape on this canvas. Check back later!",
    url: null,
    art: "soon",
    wall: "left",
    z: -53,
    width: 3.4,
    height: 2.3,
    accent: "#e4dcff",
  },
  {
    id: "farewell",
    title: "Thanks for visiting!",
    subtitle: "More projects are on the way. Say hi anytime.",
    url: null,
    art: "farewell",
    wall: "far",
    z: ROOM_FAR_Z,
    width: 4.2,
    height: 2.6,
    accent: "#fff1a8",
  },
];
