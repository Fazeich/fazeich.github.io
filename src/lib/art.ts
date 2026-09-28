import { CONTACTS, GREETING, PaintingArt } from "@/content/projects";

/**
 * Procedural "paintings" drawn with Canvas2D — one small scene per project, in the spirit of the game it links to.
 * Deterministic: a seeded PRNG keeps every redraw identical.
 */

const ART_WIDTH = 1280;
const FONT = "'Exo 2', 'Segoe UI', sans-serif";

const rng = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;

  return seed / 4294967296;
};

type Ctx = CanvasRenderingContext2D;

const vertical = (ctx: Ctx, h: number, stops: [number, string][]) => {
  const g = ctx.createLinearGradient(0, 0, 0, h);

  for (const [at, color] of stops) g.addColorStop(at, color);

  return g;
};

const hills = (ctx: Ctx, w: number, h: number, base: number, amp: number, freq: number, phase: number, color: string) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, h);

  for (let x = 0; x <= w; x += 8) {
    const y = base + Math.sin(x * freq + phase) * amp + Math.sin(x * freq * 2.7 + phase * 1.7) * amp * 0.35;

    ctx.lineTo(x, y);
  }

  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fill();
};

const drawSandbox = (ctx: Ctx, w: number, h: number) => {
  const r = rng(7);

  ctx.fillStyle = vertical(ctx, h, [[0, "#ff9e6d"], [0.45, "#ffd49a"], [0.75, "#ffe9c4"]]);
  ctx.fillRect(0, 0, w, h);

  const sun = ctx.createRadialGradient(w * 0.68, h * 0.42, 10, w * 0.68, h * 0.42, 220);

  sun.addColorStop(0, "rgba(255,250,220,1)");
  sun.addColorStop(0.25, "rgba(255,236,170,0.9)");
  sun.addColorStop(1, "rgba(255,200,140,0)");
  ctx.fillStyle = sun;
  ctx.fillRect(0, 0, w, h);

  hills(ctx, w, h, h * 0.55, 30, 0.006, 1, "#c98f8a");
  hills(ctx, w, h, h * 0.63, 26, 0.009, 3, "#8fa37a");
  hills(ctx, w, h, h * 0.72, 22, 0.012, 5, "#5d8a5a");

  // Birches.
  for (let i = 0; i < 16; i++) {
    const x = r() * w;
    const base = h * (0.76 + r() * 0.2);
    const height = 110 + r() * 170;

    ctx.fillStyle = "#f4efe6";
    ctx.fillRect(x - 4, base - height, 8, height);
    ctx.fillStyle = "#3b3a36";

    for (let m = 0; m < 5; m++) ctx.fillRect(x - 4, base - height + r() * height, 4 + r() * 4, 3);

    ctx.fillStyle = ["#7fb069", "#a6c36f", "#e4b363"][i % 3];

    for (let b = 0; b < 6; b++) {
      ctx.beginPath();
      ctx.arc(x + (r() - 0.5) * 60, base - height + (r() - 0.3) * 50, 22 + r() * 18, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.fillStyle = vertical(ctx, h, [[0, "rgba(40,70,40,0)"], [1, "rgba(40,70,40,0.55)"]]);
  ctx.fillRect(0, h * 0.8, w, h * 0.2);
};

const drawValley = (ctx: Ctx, w: number, h: number) => {
  const r = rng(21);

  ctx.fillStyle = vertical(ctx, h, [[0, "#1c2b5a"], [0.6, "#4b5ea8"], [1, "#9aa8e0"]]);
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 90; i++) {
    ctx.fillStyle = `rgba(255,255,255,${0.3 + r() * 0.7})`;
    ctx.fillRect(r() * w, r() * h * 0.5, 2, 2);
  }

  // Isometric voxel valley.
  const size = 34;
  const cols = 34;
  const rows = 16;
  const originX = w / 2;
  const originY = h * 0.34;
  const colors = ["#5fb3e6", "#6fbf73", "#8bd17c", "#d9c58c"];
  const sides = [["#3f8fc4", "#2f78ab"], ["#3d6b45", "#2f5638"], ["#4f8a52", "#3d7040"], ["#a8925c", "#8f7a48"]];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const gx = col - cols / 2;
      const gy = row - 2;
      const lift = Math.max(0, Math.round(Math.sin(col * 0.5) * 1.5 + Math.cos(row * 0.7) * 1.2 + 1));
      const x = originX + (gx - gy) * size * 0.9;
      const y = originY + (gx + gy) * size * 0.45 - lift * size * 0.6;

      if (x < -size || x > w + size || y > h + size) continue;

      const level = Math.min(3, lift);
      const top = colors[level];

      ctx.fillStyle = top;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + size * 0.9, y + size * 0.45);
      ctx.lineTo(x, y + size * 0.9);
      ctx.lineTo(x - size * 0.9, y + size * 0.45);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = sides[level][0];
      ctx.fillRect(x - size * 0.9, y + size * 0.45, size * 0.9, size * 0.7);
      ctx.fillStyle = sides[level][1];
      ctx.fillRect(x, y + size * 0.45, size * 0.9, size * 0.7);
    }
  }

  // Beacons.
  for (const [bx, by, color] of [[0.2, 0.46, "#7dd3fc"], [0.42, 0.34, "#fbbf24"], [0.63, 0.5, "#f472b6"], [0.83, 0.38, "#86efac"], [0.52, 0.62, "#c4b5fd"]] as const) {
    const x = bx * w;
    const y = by * h;
    const glow = ctx.createRadialGradient(x, y - 60, 4, x, y - 60, 90);

    glow.addColorStop(0, color);
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(x - 100, y - 160, 200, 200);
    ctx.fillStyle = "#e5e7eb";
    ctx.fillRect(x - 6, y - 60, 12, 60);
    ctx.fillStyle = color;
    ctx.fillRect(x - 10, y - 74, 20, 16);
  }

  // Tiny red car.
  const cx = w * 0.3;
  const cy = h * 0.8;

  ctx.fillStyle = "#ef4444";
  ctx.fillRect(cx - 34, cy - 20, 68, 24);
  ctx.fillStyle = "#fca5a5";
  ctx.fillRect(cx - 18, cy - 36, 36, 18);
  ctx.fillStyle = "#1f2937";
  ctx.fillRect(cx - 28, cy + 2, 14, 12);
  ctx.fillRect(cx + 14, cy + 2, 14, 12);
};

const drawResume = (ctx: Ctx, w: number, h: number) => {
  // A friendly CV sheet pinned on a mint board.
  ctx.fillStyle = vertical(ctx, h, [[0, "#cdeede"], [1, "#a8dcc4"]]);
  ctx.fillRect(0, 0, w, h);

  const px = w * 0.13;
  const py = h * 0.07;
  const pw = w * 0.74;
  const ph = h * 0.86;

  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.rotate(-0.025);
  ctx.translate(-w / 2, -h / 2);
  ctx.fillStyle = "rgba(20,60,45,0.18)";
  ctx.fillRect(px + 14, py + 18, pw, ph);
  ctx.fillStyle = "#fffdf8";
  ctx.fillRect(px, py, pw, ph);

  // Header band with an avatar.
  ctx.fillStyle = "#2f3a4a";
  ctx.fillRect(px, py, pw, ph * 0.2);
  ctx.fillStyle = "#ffd84a";
  ctx.beginPath();
  ctx.arc(px + pw * 0.2, py + ph * 0.1, ph * 0.065, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#2f3a4a";
  ctx.beginPath();
  ctx.arc(px + pw * 0.2, py + ph * 0.085, ph * 0.022, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(px + pw * 0.2, py + ph * 0.142, ph * 0.04, ph * 0.025, 0, Math.PI, 0);
  ctx.fill();

  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillStyle = "#ffffff";
  ctx.font = `800 ${Math.round(ph * 0.06)}px ${FONT}`;
  ctx.fillText("RESUME", px + pw * 0.36, py + ph * 0.075);
  ctx.fillStyle = "#ffd84a";
  ctx.font = `600 ${Math.round(ph * 0.03)}px ${FONT}`;
  ctx.fillText("Frontend Engineer", px + pw * 0.36, py + ph * 0.135);

  // Section headings and text lines.
  const r = rng(29);
  let y = py + ph * 0.27;

  for (const [title, color] of [["Experience", "#f472b6"], ["Stack", "#60a5fa"], ["Education", "#34d399"]] as const) {
    ctx.fillStyle = color;
    ctx.fillRect(px + pw * 0.08, y - ph * 0.012, pw * 0.02, ph * 0.024);
    ctx.fillStyle = "#2f3a4a";
    ctx.font = `800 ${Math.round(ph * 0.032)}px ${FONT}`;
    ctx.fillText(title, px + pw * 0.13, y);
    y += ph * 0.05;

    const lines = title === "Stack" ? 0 : 3;

    for (let i = 0; i < lines; i++) {
      ctx.fillStyle = "#d9dde3";
      ctx.fillRect(px + pw * 0.13, y - 5, pw * (0.5 + r() * 0.3), 10);
      y += ph * 0.035;
    }

    if (title === "Stack") {
      let x = px + pw * 0.13;

      for (const tag of ["React", "TypeScript", "three.js"]) {
        ctx.font = `700 ${Math.round(ph * 0.026)}px ${FONT}`;
        const tw = ctx.measureText(tag).width + 28;

        ctx.fillStyle = "#e8f1ff";
        ctx.fillRect(x, y - ph * 0.022, tw, ph * 0.044);
        ctx.fillStyle = "#2563eb";
        ctx.fillText(tag, x + 14, y);
        x += tw + 12;
      }

      y += ph * 0.05;
    }

    y += ph * 0.03;
  }

  ctx.restore();

  // Pin.
  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.arc(w / 2, py + 4, 16, 0, Math.PI * 2);
  ctx.fill();
};

const drawMarkdown = (ctx: Ctx, w: number, h: number) => {
  // An editor window: raw Markdown on the left, the rendered README on the right.
  ctx.fillStyle = vertical(ctx, h, [[0, "#ffe1ee"], [1, "#ffc4dc"]]);
  ctx.fillRect(0, 0, w, h);

  const wx = w * 0.07;
  const wy = h * 0.09;
  const ww = w * 0.86;
  const wh = h * 0.82;
  const bar = wh * 0.1;
  const mid = wx + ww / 2;

  ctx.fillStyle = "rgba(120,40,80,0.18)";
  ctx.fillRect(wx + 16, wy + 20, ww, wh);

  // Title bar with window dots and a README.md tab.
  ctx.fillStyle = "#2b2d3a";
  ctx.fillRect(wx, wy, ww, bar);

  for (const [i, color] of ["#ff6b6b", "#ffd84a", "#4ade80"].entries()) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(wx + 34 + i * 34, wy + bar / 2, 10, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "#3b3e50";
  ctx.fillRect(wx + 150, wy + bar * 0.22, 190, bar * 0.78);
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillStyle = "#f5f5f7";
  ctx.font = `700 26px ${FONT}`;
  ctx.fillText("README.md", wx + 172, wy + bar * 0.62);

  // Sun / moon theme toggle.
  ctx.fillStyle = "#ffd84a";
  ctx.beginPath();
  ctx.arc(wx + ww - 44, wy + bar / 2, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#2b2d3a";
  ctx.beginPath();
  ctx.arc(wx + ww - 37, wy + bar / 2 - 6, 12, 0, Math.PI * 2);
  ctx.fill();

  // Editor pane (dark) and preview pane (light).
  ctx.fillStyle = "#1f2130";
  ctx.fillRect(wx, wy + bar, ww / 2, wh - bar);
  ctx.fillStyle = "#fffdf9";
  ctx.fillRect(mid, wy + bar, ww / 2, wh - bar);

  const source: [string, string][] = [
    ["# My Project", "#f472b6"],
    ["", ""],
    ["Short **description**", "#e5e7eb"],
    ["", ""],
    ["## Features", "#f472b6"],
    ["- live preview", "#93c5fd"],
    ["- dark theme", "#93c5fd"],
    ["- export .md", "#93c5fd"],
    ["", ""],
    ["`npm run start`", "#86efac"],
  ];
  const line = (wh - bar) / 12;
  let y = wy + bar + line;

  ctx.font = `600 30px 'Consolas', 'Courier New', monospace`;

  for (const [i, [text, color]] of source.entries()) {
    ctx.fillStyle = "#5b6076";
    ctx.fillText(String(i + 1).padStart(2, " "), wx + 18, y);
    ctx.fillStyle = color;
    ctx.fillText(text, wx + 70, y);
    y += line;
  }

  // Blinking caret.
  ctx.fillStyle = "#ffd84a";
  ctx.fillRect(wx + 70 + ctx.measureText("`npm run start`").width + 6, y - line - 18, 4, 36);

  // Rendered preview.
  const px = mid + 32;

  y = wy + bar + line * 1.2;
  ctx.fillStyle = "#1f2937";
  ctx.font = `800 52px ${FONT}`;
  ctx.fillText("My Project", px, y);
  ctx.fillStyle = "#e5e7eb";
  ctx.fillRect(px, y + 34, ww / 2 - 64, 3);
  y += line * 1.5;
  ctx.font = `500 30px ${FONT}`;
  ctx.fillStyle = "#4b5563";
  ctx.fillText("Short ", px, y);
  const indent = ctx.measureText("Short ").width;

  ctx.font = `800 30px ${FONT}`;
  ctx.fillText("description", px + indent, y);
  y += line * 1.3;
  ctx.fillStyle = "#1f2937";
  ctx.font = `800 38px ${FONT}`;
  ctx.fillText("Features", px, y);
  y += line;
  ctx.font = `500 30px ${FONT}`;

  for (const item of ["live preview", "dark theme", "export .md"]) {
    ctx.fillStyle = "#f472b6";
    ctx.beginPath();
    ctx.arc(px + 10, y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#4b5563";
    ctx.fillText(item, px + 30, y);
    y += line * 0.9;
  }

  y += line * 0.2;
  ctx.font = `600 26px 'Consolas', 'Courier New', monospace`;
  const code = "npm run start";
  const cw = ctx.measureText(code).width + 28;

  ctx.fillStyle = "#f1f2f6";
  ctx.fillRect(px, y - 22, cw, 44);
  ctx.fillStyle = "#be185d";
  ctx.fillText(code, px + 14, y);

  // Divider between the panes.
  ctx.fillStyle = "#f472b6";
  ctx.fillRect(mid - 2, wy + bar, 4, wh - bar);
};

const drawSoon = (ctx: Ctx, w: number, h: number) => {
  const r = rng(17);

  // Primed canvas with a faint pencil grid and loose construction sketches.
  ctx.fillStyle = vertical(ctx, h, [[0, "#fbf8f1"], [1, "#efe8da"]]);
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "rgba(120,110,95,0.12)";
  ctx.lineWidth = 1.5;

  for (let x = 0; x < w; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }

  for (let y = 0; y < h; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  const sketch = (draw: () => void) => {
    for (let pass = 0; pass < 3; pass++) {
      ctx.save();
      ctx.translate((r() - 0.5) * 5, (r() - 0.5) * 5);
      ctx.strokeStyle = `rgba(70,64,58,${0.25 + r() * 0.2})`;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      draw();
      ctx.stroke();
      ctx.restore();
    }
  };

  sketch(() => ctx.arc(w * 0.28, h * 0.42, 150, 0, Math.PI * 2));
  sketch(() => {
    ctx.moveTo(w * 0.5, h * 0.72);
    ctx.lineTo(w * 0.66, h * 0.22);
    ctx.lineTo(w * 0.86, h * 0.72);
    ctx.closePath();
  });
  sketch(() => ctx.rect(w * 0.12, h * 0.7, w * 0.76, 40));

  // A few dabs of colour on a palette corner.
  for (const [x, y, c] of [[0.86, 0.14, "#f472b6"], [0.9, 0.2, "#60a5fa"], [0.83, 0.22, "#fbbf24"], [0.88, 0.28, "#34d399"]] as const) {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(x * w, y * h, 22, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#4b4640";
  ctx.font = `italic 700 92px ${FONT}`;
  ctx.fillText("coming soon…", w / 2, h * 0.88);
};

const drawFarewell = (ctx: Ctx, w: number, h: number) => {
  ctx.fillStyle = vertical(ctx, h, [[0, "#fff7d6"], [1, "#ffe7a3"]]);
  ctx.fillRect(0, 0, w, h);

  const r = rng(5);
  const palette = ["#f472b6", "#60a5fa", "#fbbf24", "#34d399", "#a78bfa"];

  for (let i = 0; i < 70; i++) {
    ctx.save();
    ctx.translate(r() * w, r() * h);
    ctx.rotate(r() * Math.PI);
    ctx.fillStyle = palette[i % palette.length];
    ctx.globalAlpha = 0.55;
    ctx.fillRect(-7, -3, 14, 6);
    ctx.restore();
  }

  ctx.globalAlpha = 1;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#1f2937";
  ctx.font = `800 96px ${FONT}`;
  ctx.fillText("Thanks for visiting!", w / 2, h * 0.36);
  ctx.font = `500 44px ${FONT}`;
  ctx.fillStyle = "#4b5563";
  ctx.fillText(`More projects are on the way — ${GREETING.name}`, w / 2, h * 0.53);
  ctx.font = `700 40px ${FONT}`;
  ctx.fillStyle = "#b45309";
  ctx.fillText(CONTACTS.map((c) => c.url.replace("https://", "")).join("   ·   "), w / 2, h * 0.7);
};

const ARTISTS: Record<PaintingArt, (ctx: Ctx, w: number, h: number) => void> = {
  sandbox: drawSandbox,
  valley: drawValley,
  resume: drawResume,
  markdown: drawMarkdown,
  soon: drawSoon,
  farewell: drawFarewell,
};

export const paintArt = (canvas: HTMLCanvasElement, art: PaintingArt) => {
  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  // Artists draw in a 1280px-wide reference space, so any texture size looks the same.
  const scale = canvas.width / ART_WIDTH;

  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.clearRect(0, 0, ART_WIDTH, canvas.height / scale);
  ARTISTS[art](ctx, ART_WIDTH, canvas.height / scale);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
};

/** Light oak planks for the floor. */
export const paintFloor = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  const r = rng(99);
  const { width: w, height: h } = canvas;
  const plank = w / 6;

  for (let i = 0; i < 6; i++) {
    let y = -r() * h;

    while (y < h) {
      const length = h * (0.35 + r() * 0.4);
      const light = 76 + r() * 8;

      ctx.fillStyle = `hsl(${32 + r() * 6}, ${45 + r() * 10}%, ${light}%)`;
      ctx.fillRect(i * plank, y, plank, length);

      for (let g = 0; g < 7; g++) {
        ctx.fillStyle = `rgba(150,100,60,${0.05 + r() * 0.07})`;
        ctx.fillRect(i * plank + r() * plank, y, 1.5, length);
      }

      ctx.fillStyle = "rgba(120,80,50,0.35)";
      ctx.fillRect(i * plank, y, plank, 2);
      y += length;
    }

    ctx.fillStyle = "rgba(120,80,50,0.3)";
    ctx.fillRect(i * plank, 0, 2, h);
  }
};

/** Soft round glow used behind a highlighted painting. */
export const paintGlow = (canvas: HTMLCanvasElement, color: string) => {
  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  const { width: w, height: h } = canvas;
  const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);

  g.addColorStop(0, color);
  g.addColorStop(0.55, color);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
};
