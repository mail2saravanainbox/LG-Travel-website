import type { Transition } from "framer-motion";

/** Signature luxury easing curve, typed as a cubic-bezier tuple. */
export const EASE_LUX: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const transitionLux: Transition = { duration: 0.7, ease: EASE_LUX };
