/**
 * Shared geometry for the Signal Field — used by the WebGL engine, the static
 * poster and the HTML channel labels, so all three agree.
 * Coordinates are fractions of the hero: x from left, y from top.
 *
 * Story: five things that drag a business down (left) converge into one line that runs into the portrait
 * frame on the right — many inputs, one person running the system.
 */
export type Vec2 = readonly [number, number];

export type FieldLayout = {
  clusters: readonly Vec2[]; // manual work, scattered data, lost leads, slow replies, guesswork
  merge: Vec2; // where chaos becomes one line
  spread: number; // cluster radius (fraction of hero height)
  /** Approximate x of the portrait frame (poster only; the live canvas measures it). */
  end: number;
};

export const DESKTOP: FieldLayout = {
  clusters: [
    [0.07, 0.17],
    [0.19, 0.11],
    [0.12, 0.27],
    [0.31, 0.15],
    [0.24, 0.255],
  ],
  merge: [0.5, 0.2],
  spread: 0.046,
  end: 0.725,
};

export const MOBILE: FieldLayout = {
  clusters: [
    [0.11, 0.14],
    [0.3, 0.095],
    [0.13, 0.27],
    [0.35, 0.19],
    [0.27, 0.31],
  ],
  merge: [0.5, 0.2],
  spread: 0.04,
  end: 0.62,
};

export const pickLayout = (width: number) => (width >= 768 ? DESKTOP : MOBILE);
