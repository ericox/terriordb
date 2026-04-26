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
          Genetic reference for specialty coffee
        </p>
        <h1 className="text-4xl font-semibold leading-tight mb-5">
          Explore the Terroir
        </h1>
        <p className="text-lg text-[var(--muted)] max-w-2xl leading-relaxed mb-4">
          Terroir shapes what&apos;s in your cup — but terroir only makes sense when you know
          what you&apos;re growing. Most tools tell you <em>where</em> a coffee came from.
          TerriorDB tells you <em>what</em> it actually is.
        </p>
        <p className="text-base text-[var(--muted)] max-w-2xl leading-relaxed">
          The most sought-after varieties in specialty coffee are precisely the ones
          whose genetics are least understood. &ldquo;Geisha Inca&rdquo; contains no Gesha genetics.
          &ldquo;Typica Mejorado&rdquo; is a Bourbon cross. A Yellow Gesha selling at $70/kg
          hasn&apos;t been confirmed by a lab. TerriorDB documents what&apos;s known,
          what&apos;s pending, and what remains genuinely unresolved.
        </p>
        <div className="flex gap-4 mt-8">
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
          <Link
            href="/matcher"
            className="px-5 py-2.5 border border-[var(--border)] text-sm rounded hover:border-[var(--muted)] transition-colors"
          >
            SNP Matcher
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-14 p-6 bg-white rounded-lg border border-[var(--border)]">
        <div className="text-center">
          <div className="text-3xl font-semibold text-[var(--accent)]">{varieties.length}</div>
          <div className="text-xs text-[var(--muted)] mt-1 uppercase tracking-wide">Varieties documented</div>
        </div>
        <div className="text-center border-x border-[var(--border)]">
          <div className="text-3xl font-semibold text-emerald-700">{verified}</div>
          <div className="text-xs text-[var(--muted)] mt-1 uppercase tracking-wide">DNA-verified by WCR</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-semibold text-amber-600">{pending + insufficient}</div>
          <div className="text-xs text-[var(--muted)] mt-1 uppercase tracking-wide">Unresolved identity</div>
        </div>
      </div>

      {/* Why genetics matter */}
      <div className="mb-14">
        <h2 className="text-xl font-semibold mb-2">Why genetics matter in the cup</h2>
        <p className="text-base text-[var(--muted)] max-w-2xl leading-relaxed mb-8">
          Three things determine what&apos;s in your cup: genetics, environment, and processing.
          Of the three, only genetics is fixed. Terroir shifts with rainfall and altitude.
          Processing varies by producer. But the genetic blueprint of the plant — its
          predisposition for florals, acids, and aromatic compounds — travels with every seed.
        </p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
          <div className="p-5 bg-white rounded-lg border border-[var(--border)]">
            <div className="text-sm font-semibold mb-2">Genetics sets the baseline</div>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              UC Davis researchers sequenced the first public <em>Coffea arabica</em> genome
              using Geisha trees, and are now mapping which specific genes produce the jasmine
              and stone-fruit compounds that make Geisha distinctly Geisha. The science confirms
              what roasters already suspected: the variety is doing most of the work.
            </p>
          </div>
          <div className="p-5 bg-white rounded-lg border border-[var(--border)]">
            <div className="text-sm font-semibold mb-2">Authentication is broken</div>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              WCR genetic testing found that only 39% of samples sold as &ldquo;Geisha&rdquo; were
              actually Geisha — the most celebrated variety in specialty coffee has a 61%
              misidentification rate. For home brewers and roasters paying a premium, the
              name on the bag is not a guarantee.
            </p>
          </div>
          <div className="p-5 bg-white rounded-lg border border-[var(--border)]">
            <div className="text-sm font-semibold mb-2">Lineage rewrites the story</div>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              Cafe Imports had Pink Bourbon tested twice — in 2017 and again in 2023 — and
              both times the genetics came back Ethiopian landrace, not Bourbon. These are not
              edge cases. The varieties commanding the highest prices are precisely the ones
              whose identities are least verified.
            </p>
          </div>
        </div>

        <p className="text-xs text-[var(--muted)] leading-relaxed max-w-2xl">
          Sources:{" "}
          <a
            href="https://www.ucdavis.edu/food/news/arabica-coffee-genome-sequenced"
            className="underline hover:text-[var(--foreground)]"
            target="_blank"
            rel="noreferrer"
          >
            UC Davis Arabica Genome (2017)
          </a>
          {" · "}
          <a
            href="https://academic.oup.com/g3journal/article/15/1/jkae262/7900928"
            className="underline hover:text-[var(--foreground)]"
            target="_blank"
            rel="noreferrer"
          >
            Geisha genome assembly, G3 Genetics (2024)
          </a>
          {" · "}
          <a
            href="https://academic.oup.com/jaoac/article/103/2/325/5809455"
            className="underline hover:text-[var(--foreground)]"
            target="_blank"
            rel="noreferrer"
          >
            Authentication via DNA fingerprinting, AOAC International
          </a>
          {" · "}
          <a
            href="https://www.cafeimports.com/north-america/blog/2023/09/26/pink-bourbon-cryptozoology-and-genetics-in-specialty-coffee/"
            className="underline hover:text-[var(--foreground)]"
            target="_blank"
            rel="noreferrer"
          >
            Pink Bourbon genetics, Cafe Imports (2023)
          </a>
          {" · "}
          <a
            href="https://worldcoffeeresearch.org/resources/arabica-ldp-snp-marker-panel"
            className="underline hover:text-[var(--foreground)]"
            target="_blank"
            rel="noreferrer"
          >
            WCR KASP SNP panel
          </a>
        </p>
      </div>

      {/* The gap */}
      <div className="mb-14">
        <h2 className="text-xl font-semibold mb-2">The gap this fills</h2>
        <p className="text-sm text-[var(--muted)] max-w-2xl leading-relaxed mb-6">
          The only industry tool for genetic authentication — the WCR KASP SNP panel — covers
          23 commercial Latin American breeding varieties. It was built for yield programs,
          not specialty lots. The varieties that define the top end of the market:
          Gesha, Pink Bourbon, Chiroso, SL28, SL34, Ethiopian landraces — none are in the panel.
          TerriorDB maps where that certainty ends and documents the genetic stories researchers
          and roasters are still working out.
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

      {/* Name lookup */}
      <div className="p-6 bg-amber-50 border border-amber-200 rounded-lg">
        <h2 className="text-base font-semibold mb-1">Trade name or true name?</h2>
        <p className="text-sm text-[var(--muted)] mb-3">
          Search by any name a variety goes by — regional names, trade names, or synonyms —
          and see what the genetics actually say.
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
