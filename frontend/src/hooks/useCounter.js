import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

// Counts from 0 to `target` when the returned ref enters the viewport.
// Jumps straight to `target` when prefers-reduced-motion is set.
export default function useCounter(target, { duration = 2, once = true } = {}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: 0.5 });
  const prefersReducedMotion = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    if (prefersReducedMotion) {
      setValue(target);
      return;
    }
    const controls = animate(0, target, {
      duration,
      ease: "easeOut",
      onUpdate: (latest) => setValue(Math.round(latest)),
    });
    return () => controls.stop();
  }, [isInView, target, duration, prefersReducedMotion]);

  return { ref, value };
}
