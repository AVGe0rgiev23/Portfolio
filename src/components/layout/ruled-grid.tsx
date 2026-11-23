/** Twelve faint column hairlines that "rule" the page on first load. Decorative. */
export function RuledGrid() {
  return (
    <div className="ruled" aria-hidden>
      <div className="frame ruled__inner">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className={i >= 4 ? "ruled__col hidden md:block" : "ruled__col"} style={{ ["--i" as string]: i }} />
        ))}
      </div>
    </div>
  );
}
