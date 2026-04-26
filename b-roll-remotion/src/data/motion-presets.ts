// ─── Motion Presets ─────────────────────────────────────────────────
// Centralized animation constants. Patterns lifted from LEARNINGS.md
// "Core Design Principles" so a single fix propagates to all scenes.
// ──────────────────────────────────────────────────────────────────────

export const MOTION = {
  /** Spring physics configs for entrance animations. */
  spring: {
    /** Badge pops, node entrances — quick and punchy. */
    snappy: { damping: 14, stiffness: 200 },
    /** Headers, dividers — clean settle. */
    smooth: { damping: 18, stiffness: 100 },
    /** Bars, lines drawing in — slower, deliberate. */
    settle: { damping: 22, stiffness: 70 },
  },

  /**
   * Continuous motion patterns. Required after entrance for any scene
   * that sits 8+ seconds — static reads as boring (LEARNINGS.md).
   */
  continuous: {
    /** Subtle scale "breathing" on cards/nodes. Multiply transform: scale(...). */
    breathe: (frame: number, offset = 0): number =>
      Math.sin(frame * 0.07 + offset) * 0.01 + 1,

    /** Box-shadow / text-shadow intensity multiplier. Range ~[0.4, 1.0]. */
    glowPulse: (frame: number, rate = 0.1, offset = 0): number =>
      Math.sin(frame * rate + offset) * 0.3 + 0.7,

    /** Vertical drift in pixels for list items. Index spaces them. */
    floatY: (frame: number, i = 0): number =>
      Math.sin(frame * 0.05 + i * 0.7) * 1.5,

    /** Position 0-100 for travelling dot on a connector. */
    travelDot: (frame: number, period = 24): number =>
      ((frame % period) / period) * 100,

    /** Hue-rotation shimmer for accent text. */
    hueShift: (frame: number, range = 20): number =>
      ((Math.sin(frame * 0.09) + 1) / 2) * range,
  },

  /**
   * Pacing standards for short-form cutaways. Codified from
   * LEARNINGS.md "Pacing — cutaways are CUT-aways, not takeovers".
   */
  pacing: {
    /** 6s — anything less feels rushed. */
    cutawayMinFrames: 180,
    /** 12s — anything more is dead air on screen. */
    cutawayMaxFrames: 360,
    /** 6s minimum speaker-on-camera open before any cutaway. */
    speakerOpenFrames: 180,
    /** 10-15s+ speaker close for natural handoffs. */
    speakerCloseFrames: 300,
    /** Adjacent cutaways must overlap by 16+ frames (zero peek-through). */
    cutawayOverlapFrames: 16,
  },

  /**
   * Easing functions for non-spring animations (count-ups, bar fills).
   * Cubic ease-out is the project's default — `1 - (1 - t) ** 3`.
   */
  easing: {
    /** Cubic ease-out — fast start, soft landing. Used for count-up animations. */
    easeOutCubic: (t: number): number => 1 - Math.pow(1 - t, 3),
    /** Cubic ease-in-out — symmetric. */
    easeInOutCubic: (t: number): number =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  },
} as const;

/**
 * Default tickRange for KPI cards based on value magnitude.
 * Prevents percentages near 100 from ticking above 100.
 */
export function defaultTickRange(value: number): [number, number] {
  if (value >= 95) return [-3, 0];   // pinned high → only tick down
  if (value >= 80) return [-2, 1];   // mostly down
  return [-1, 1];                    // standard ±1
}
