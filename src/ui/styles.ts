import { keyframes, styled } from "styled-components";

/** Styles live without the theme: cards inside drei <Html> render in a separate React root. */

const INK = "#1f2430";
const MUTED = "#5b6272";
const YELLOW = "#ffd84a";
const YELLOW_LIGHT = "#ffe473";
const YELLOW_DARK = "#f4c92c";

const keyPulse = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
`;

const rise = keyframes`
  from { opacity: 0; transform: translateY(10px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

export const Card = styled.div`
  width: min(320px, 78vw);
  padding: 16px 18px 14px;
  color: ${INK};
  text-align: center;
  background: rgba(255, 255, 255, 0.94);
  border: 2px solid ${YELLOW};
  border-radius: 18px;
  box-shadow: 0 14px 40px rgba(60, 45, 20, 0.22), 0 0 0 6px rgba(255, 216, 74, 0.18);
  animation: ${rise} 0.28s ease-out both;
  user-select: none;
`;

export const CardTitle = styled.h2`
  font-size: 22px;
  font-weight: 800;
  letter-spacing: 0.01em;
`;

export const CardSubtitle = styled.p`
  margin-top: 6px;
  font-size: 14px;
  line-height: 1.4;
  color: ${MUTED};
`;

export const CardButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 12px;
  padding: 10px 20px;
  font-family: inherit;
  font-size: 15px;
  font-weight: 800;
  color: ${INK};
  text-decoration: none;
  background: ${YELLOW};
  border: none;
  border-radius: 999px;
  cursor: pointer;
  box-shadow: 0 4px 0 #e0b21f;
  transition:
    transform 0.14s ease-out,
    box-shadow 0.14s ease-out,
    background-color 0.14s ease-out;

  /* Hover — by mouse, or by the crosshair while the cursor is captured ([data-hover]). */
  &:hover,
  &[data-hover] {
    background: ${YELLOW_LIGHT};
    transform: translateY(-2px);
    box-shadow:
      0 6px 0 #e0b21f,
      0 0 0 4px rgba(255, 216, 74, 0.35),
      0 0 22px rgba(255, 216, 74, 0.75);
  }

  /* Pushed in: the button sinks onto its "base" and the edge shadow almost disappears. */
  &:active,
  &[data-pressed] {
    background: ${YELLOW_DARK};
    transform: translateY(3px);
    box-shadow:
      0 1px 0 #e0b21f,
      inset 0 2px 5px rgba(130, 90, 0, 0.3),
      0 0 12px rgba(255, 216, 74, 0.45);
    transition-duration: 0.05s;
  }
`;

export const CardHint = styled.div`
  margin-top: 8px;
  font-size: 12px;
  color: ${MUTED};

  kbd {
    display: inline-block;
    padding: 1px 6px;
    font-family: inherit;
    font-weight: 700;
    border: 1px solid #d5d8de;
    border-bottom-width: 2px;
    border-radius: 5px;
    background: #f5f6f8;
  }
`;

export const CardLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;

/* ---------- Page overlays ---------- */

export const Page = styled.div`
  position: fixed;
  inset: 0;
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 40;
  display: grid;
  place-items: center;
  padding: 16px;
  background: radial-gradient(ellipse at center, rgba(255, 250, 238, 0.35), rgba(255, 244, 220, 0.75));
  backdrop-filter: blur(3px);
  transition: opacity 0.4s;
`;

export const Intro = styled.div`
  max-width: 520px;
  padding: 30px 30px 24px;
  color: ${INK};
  text-align: center;
  background: rgba(255, 255, 255, 0.96);
  border-radius: 26px;
  box-shadow: 0 30px 80px rgba(90, 70, 30, 0.25);
  animation: ${rise} 0.5s ease-out both;

  h1 {
    font-size: clamp(28px, 6vw, 40px);
    font-weight: 900;
  }

  p {
    margin-top: 12px;
    font-size: 16px;
    line-height: 1.55;
    color: ${MUTED};
  }
`;

export const Controls = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px 16px;
  margin-top: 18px;
  font-size: 13px;
  color: ${MUTED};
  list-style: none;

  kbd {
    padding: 1px 6px;
    font-family: inherit;
    font-weight: 700;
    border: 1px solid #d5d8de;
    border-bottom-width: 2px;
    border-radius: 5px;
    background: #f5f6f8;
  }
`;

export const StartButton = styled(CardButton)`
  margin-top: 22px;
  padding: 13px 30px;
  font-size: 17px;
`;

export const Brand = styled.div`
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 30;
  padding: 8px 14px;
  font-size: 14px;
  font-weight: 800;
  color: ${INK};
  background: rgba(255, 255, 255, 0.85);
  border-radius: 999px;
  box-shadow: 0 4px 14px rgba(60, 45, 20, 0.12);

  span {
    color: #d49b00;
  }
`;

export const HintBar = styled.div`
  position: fixed;
  left: 16px;
  bottom: 16px;
  z-index: 30;
  max-width: calc(100vw - 32px);
  padding: 8px 14px;
  font-size: 12px;
  color: ${MUTED};
  background: rgba(255, 255, 255, 0.85);
  border-radius: 12px;
  transition: opacity 0.3s;

  kbd {
    font-family: inherit;
    font-weight: 700;
    color: ${INK};
  }

  @media (max-width: 640px) {
    display: none;
  }
`;

/** Big "Press E" line under a painting — the only way into a project. */
export const UseKey = styled.div`
  margin-top: 12px;
  font-size: 15px;
  font-weight: 700;
  color: ${INK};

  kbd {
    display: inline-block;
    min-width: 30px;
    margin: 0 4px;
    padding: 3px 9px;
    font-family: inherit;
    font-weight: 900;
    background: ${YELLOW};
    border-radius: 8px;
    box-shadow: 0 3px 0 #e0b21f;
    animation: ${keyPulse} 1.4s ease-in-out infinite;
  }
`;

/** Small dot in the middle of the screen while the cursor is captured; grows yellow over a painting. */
export const Crosshair = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 25;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(31, 36, 48, 0.55);
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.7);
  transform: translate(-50%, -50%);
  transition: width 0.2s, height 0.2s, background 0.2s;
  pointer-events: none;

  &[data-active] {
    width: 12px;
    height: 12px;
    background: ${YELLOW};
  }
`;

/** Shown after Esc frees the cursor; clicking anywhere on the scene captures it again. */
export const ResumeHint = styled.button`
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 30;
  padding: 12px 22px;
  font-family: inherit;
  font-size: 15px;
  font-weight: 800;
  color: ${INK};
  background: rgba(255, 255, 255, 0.92);
  border: 2px solid ${YELLOW};
  border-radius: 999px;
  box-shadow: 0 8px 24px rgba(60, 45, 20, 0.18);
  transform: translate(-50%, -50%);
  cursor: pointer;
`;
