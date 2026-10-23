/** Illustrative QR-style label. Production prints real QR codes encoding the asset URL. */
function cells(seed: string, n: number): boolean[] {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const out: boolean[] = [];
  for (let i = 0; i < n * n; i++) {
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    out.push(((h >>> 7) & 1) === 1);
  }
  return out;
}

export function QrLabel({ tag, name, size = 148 }: { tag: string; name: string; size?: number }) {
  const n = 21;
  const grid = cells(tag, n);
  const finder = (x: number, y: number) => (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
  return (
    <figure className="inline-flex flex-col items-center gap-1.5 rounded-lg border border-hair bg-white p-3 text-[#1f1f1f]">
      <svg viewBox={`0 0 ${n} ${n}`} width={size} height={size} role="img" aria-label={`QR label for ${tag}`} shapeRendering="crispEdges">
        {grid.map((on, i) => {
          const x = i % n;
          const y = Math.floor(i / n);
          if (finder(x, y)) return null;
          return on ? <rect key={i} x={x} y={y} width={1} height={1} fill="#1f1f1f" /> : null;
        })}
        {[
          [0, 0],
          [n - 7, 0],
          [0, n - 7],
        ].map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <rect x={x} y={y} width={7} height={7} fill="#1f1f1f" />
            <rect x={x + 1} y={y + 1} width={5} height={5} fill="#fff" />
            <rect x={x + 2} y={y + 2} width={3} height={3} fill="#1f1f1f" />
          </g>
        ))}
      </svg>
      <figcaption className="text-center">
        <div className="font-mono text-[11px] font-bold">{tag}</div>
        <div className="max-w-[160px] truncate text-[10px]">{name}</div>
        <div className="text-[9px] uppercase tracking-wider">BCJS · scan to check out</div>
      </figcaption>
    </figure>
  );
}
