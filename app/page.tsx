import Link from "next/link";
import { getAllVarieties } from "@/lib/varieties";
import { CertaintyBadge } from "@/components/CertaintyBadge";

export default function Home() {
  const varieties = getAllVarieties();
  const verified = varieties.filter((v) => v.wcrSnpVerified).length;
  const pending = varieties.filter((v) => v.certainty === "pending").length;
  const insufficient = varieties.filter((v) => v.certainty === "insufficient").length;

  const featured = ["gesha", "pink-bourbon", "sl9", "mejorado"]
    .map((id) => varieties.find((v) => v.id === id))
    .filter((v): v is NonNullable<typeof v> => v !== undefined);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Hero */}
      <div className="mb-14">
        <p className="text-xs uppercase tracking-widest text-[var(--muted)] mb-3">
          Open-source reference for specialty coffee
        </p>
        <h1 className="text-4xl font-semibold leading-tight mb-4">
          What&apos;s really in your bag?
        </h1>
        <p className="text-lg text-[var(--muted)] max-w-2xl leading-relaxed">
          Local names and genetic reality don&apos;t always match. &ldquo;Geisha Inca&rdquo; contains no Gesha
          genetics. &ldquo;Typica Mejorado&rdquo; is actually a Bourbon cross. Explore the genetic identity,
          lineage, and authentication status of specialty coffee varieties.
        </p>
        <div className="flex gap-4 mt-6">
          <Link
            href="/varieties"
            className="px-5 py-2.5 bg-[var(--accent)] text-white text-sm rounded hover:opacity-90 transition-opacity"
          >
            Browse Varieties
          </Link>
          <Link
            href="/tree"
            className="px-5 py-2.5 border border-[var(--border)] text-sm rounded hover:border-[var(--muted)] transition-colors"
          >
            Family Tree
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-14 p-6 bg-white rounded-lg border border-[var(--border)]">
        <div className="text-center">
          <div className="text-3xl font-semibold text-[var(--accent)]">{varieties.length}</div>
          <div className="text-xs text-[var(--muted)] mt-1 uppercase tracking-wide">Varieties</div>
        </div>
        <div className="text-center border-x border-[var(--border)]">
          <div className="text-3xl font-semibold text-emerald-700">{verified}</div>
          <div className="text-xs text-[var(--muted)] mt-1 uppercase tracking-wide">WCR DNA-Verified</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-semibold text-amber-600">{pending + insufficient}</div>
          <div className="text-xs text-[var(--muted)] mt-1 uppercase tracking-wide">Pending / Unresolved</div>
        </div>
      </div>

      {/* Featured: The Database Gap */}
      <div className="mb-14">
        <h2 className="text-xl font-semibold mb-1">The Database Gap</h2>
        <p className="text-sm text-[var(--muted)] mb-6">
          The WCR SNP panel authenticates 23 commercial Latin American varieties. The rare, high-value
          varieties that top roasters pay most for are precisely the ones least covered.
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {featured.map((v) => (
            <Link
              key={v.id}
              href={`/varieties/${v.id}`}
              className="p-4 bg-white rounded-lg border border-[var(--border)] hover:border-[var(--accent-light)] transition-colors group"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-medium text-sm group-hover:text-[var(--accent)] transition-colors">
                  {v.name}
                </span>
                <CertaintyBadge certainty={v.certainty} size="xs" />
              </div>
              <div className="text-xs text-[var(--muted)]">{v.origin.country}</div>
              <div className="text-xs text-[var(--muted)] mt-1">{v.geneticGroup}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Name Lookup teaser */}
      <div className="p-6 bg-amber-50 border border-amber-200 rounded-lg">
        <h2 className="text-base font-semibold mb-1">Local name ≠ genetics</h2>
        <p className="text-sm text-[var(--muted)] mb-3">
          Try looking up a variety by any name it goes by — trade names, regional names, or synonyms.
        </p>
        <form action="/varieties" method="get" className="flex gap-2">
          <input
            name="q"
            type="text"
            placeholder="e.g. Geisha Inca, Typica Mejorado, Elephant Bean…"
            className="flex-1 px-3 py-2 text-sm border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--accent-light)]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[var(--accent)] text-white text-sm rounded hover:opacity-90 transition-opacity"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
}
