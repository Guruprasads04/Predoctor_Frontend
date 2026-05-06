import { useMemo } from "react";

interface Particle {
  left: string;
  top: string;
  size: number;
  delay: string;
  duration: string;
  tx: string;
  ty: string;
  color: string;
}

export const Particles = ({ count = 32 }: { count?: number }) => {
  const particles = useMemo<Particle[]>(() => {
    const colors = ["hsl(var(--primary-glow))", "hsl(var(--accent-glow))", "hsl(var(--cyan))"];
    return Array.from({ length: count }).map((_, i) => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1,
      delay: `${Math.random() * 8}s`,
      duration: `${8 + Math.random() * 10}s`,
      tx: `${(Math.random() - 0.5) * 200}px`,
      ty: `${-100 - Math.random() * 200}px`,
      color: colors[i % colors.length],
    }));
  }, [count]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 4}px ${p.color}`,
            opacity: 0,
            animation: `particle-drift ${p.duration} linear ${p.delay} infinite`,
            // @ts-expect-error css vars
            "--tx": p.tx,
            "--ty": p.ty,
          }}
        />
      ))}
      <style>{`
        @keyframes particle-drift {
          0% { transform: translate(0,0); opacity: 0; }
          10%, 90% { opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
