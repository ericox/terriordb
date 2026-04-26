import Link from "next/link";
import { getAllVarieties, findByName } from "@/lib/varieties";
import { CertaintyBadge } from "@/components/CertaintyBadge";
import { GeneticGroup } from "@/lib/types";

const GROUP_ORDER: GeneticGroup[] = [
  "Ethiopian Wild",
  "Ethiopian Landrace",
  "Ethiopian Legacy",
  "Typica",
  "Bourbon",
  "Bourbon x Typica",
  "Catimor",
  "Sarchimor",
  "Timor Hybrid",
  "F1 Hybrid",
  "Unknown",
];

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function VarietiesPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const all = getAllVarieties();

  // If there's a search query, try alias lookup first then filter
  let results = all;
  let aliasMatch: (typeof all)[0] | undefined;
  if (q) {
    aliasMatch = findByName(q, all);
    results = all.filter(
      (v) =>
        v.name.toLowerCase().includes(q.toLowerCase()) ||
        v.aliases.some((a) => a.toLowerCase().includes(q.toLowerCase())) ||
        v.geneticGroup.toLowerCase().includes(q.toLowerCase()) ||
        v.origin.country.toLowerCase().includes(q.toLowerCase())
    );
  }

  // Group by genetic group
  const grouped = GROUP_ORDER.reduce<Record<string, typeof all>>((acc, group) => {
    const inGroup = results.filter((v) => v.geneticGroup === group);
    if (inGroup.length > 0) acc[group] = inGroup;
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Coffee Varieties</h1>
          <p className="text-sm text-[var(--muted)] mt-1">{all.length} varieties · grouped by genetic lineage</p>
        </div>
        <form method="get" className="flex gap-2">
          <input
            name="q"
            type="text"
            defaultValue={q}
            placeholder="Search name, alias, origin…"
            className="px-3 py-2 text-sm border border-[var(--border)] rounded bg-white w-64 focus:outline-none focus:border-[var(--accent-light)]"
          />
          <button
            type="submit"
            className="px-3 py-2 bg-[var(--accent)] text-white text-sm rounded hover:opacity-90 transition-opacity"
          >
            Search
          </button>
          {q && (
            <a href="/varieties" className="px-3 py-2 text-sm border border-[var(--border)] rounded hover:border-[var(--muted)] transition-colors">
              Clear
            </a>
          )}
        </form>
      </div>

      {/* Alias match callout */}
      {aliasMatch && q && aliasMatch.name.toLowerCase() !== q.toLowerCase() && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm">
          <span className="font-medium">&ldquo;{q}&rdquo;</span> is a local/trade name for{" "}
          <Link href={`/varieties/${aliasMatch.id}`} className="font-semibold text-[var(--accent)] underline">
            {aliasMatch.name}
          </Link>{" "}
          — <CertaintyBadge certainty={aliasMatch.certainty} size="xs" />
        </div>
      )}

      {results.length === 0 && (
        <p className="text-[var(--muted)] text-sm">No varieties found for &ldquo;{q}&rdquo;.</p>
      )}

      {Object.entries(grouped).map(([group, vars]) => (
        <section key={group} className="mb-10">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-3 pb-2 border-b border-[var(--border)]">
            {group}
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {vars.map((v) => (
              <Link
                key={v.id}
                href={`/varieties/${v.id}`}
                className="flex items-start gap-4 p-4 bg-white rounded-lg border border-[var(--border)] hover:border-[var(--accent-light)] transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium group-hover:text-[var(--accent)] transition-colors">
                      {v.name}
                    </span>
                    <CertaintyBadge certainty={v.certainty} size="xs" />
                  </div>
                  {v.aliases.length > 0 && (
                    <div className="text-xs text-[var(--muted)] mb-1 truncate">
                      aka {v.aliases.join(", ")}
                    </div>
                  )}
                  <div className="text-xs text-[var(--muted)]">
                    {v.origin.country}
                    {v.origin.region ? ` · ${v.origin.region}` : ""}
                  </div>
                </div>
                <div className="text-xs text-[var(--muted)] text-right shrink-0">
                  <div>{v.flavorNotes.slice(0, 2).join(", ")}</div>
                  {v.wcrSnpVerified && (
                    <div className="text-emerald-700 mt-1">DNA fingerprint</div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
