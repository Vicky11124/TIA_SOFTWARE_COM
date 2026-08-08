import { useEffect, useRef, useState } from "react";

/**
 * Lightweight replacement for framer-motion's `whileInView`.
 * Returns a ref and a boolean indicating whether the element has entered the viewport.
 * Once triggered, stays true (equivalent to `viewport={{ once: true }}`).
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.1
): [React.RefObject<T>, boolean] {
  const ref = useRef<T>(null!);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, inView]);

  return [ref, inView];
}
