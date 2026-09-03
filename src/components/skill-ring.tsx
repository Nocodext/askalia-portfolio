import { useMemo } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

export type SkillRingItem = {
  id: string;
  color: string;
  title: string;
  node: React.ReactNode;
};

type SkillRingProps = {
  items: SkillRingItem[];
  hubClassName: string;
  onSelect: (id: string) => void;
};

// Positions are equal-angle, independent of item count or any weighting —
// spatial proximity to the hub encodes "linked", nothing is sized by magnitude.
// The hub carries no label (the bucket name above the ring already names it) —
// just the section color, so there's no long-label-in-a-small-circle problem.
export function SkillRing({ items, hubClassName, onSelect }: SkillRingProps) {
  const reducedMotion = useReducedMotion();
  const radius = 78;
  const positions = useMemo(() => {
    const n = items.length;
    return items.map((item, i) => {
      const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
      return {
        ...item,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        angleDeg: (angle * 180) / Math.PI,
      };
    });
  }, [items]);

  return (
    <div className="relative mx-auto flex h-[210px] w-full items-center justify-center">
      <div
        className="absolute rounded-full border border-slate/30"
        style={{ width: radius * 2 + 34, height: radius * 2 + 34 }}
      />
      {positions.map((p) => (
        <div
          key={p.id}
          className={`absolute top-1/2 left-1/2 h-0.5 opacity-50 ${reducedMotion ? "" : "spoke-flow"}`}
          style={{
            width: radius,
            transformOrigin: "0 50%",
            transform: `rotate(${p.angleDeg}deg)`,
            backgroundImage: `repeating-linear-gradient(90deg, ${p.color} 0 6px, transparent 6px 12px)`,
          }}
        />
      ))}
      <div
        className={`relative z-[3] size-6 rounded-full shadow-[0_10px_24px_-10px_rgba(16,19,26,0.5)] ${hubClassName}`}
      />
      {positions.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onSelect(p.id)}
          className="group absolute z-[2] -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full transition-transform hover:scale-[1.14]"
          style={{ left: `calc(50% + ${p.x}px)`, top: `calc(50% + ${p.y}px)` }}
        >
          {p.node}
          <span className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 rounded-md bg-ink px-2.5 py-1 text-[11px] font-medium whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
            {p.title}
          </span>
        </button>
      ))}
    </div>
  );
}
