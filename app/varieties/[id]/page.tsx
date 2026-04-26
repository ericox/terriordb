import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllVarieties, getVarietyById, getParents, getChildren } from "@/lib/varieties";
import { CertaintyBadge } from "@/components/CertaintyBadge";
import { MigrationPath } from "@/components/MigrationPath";
import { AgronomicGrid } from "@/components/AgronomicGrid";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const varieties = getAllVarieties();
  return varieties.map((v) => ({ id: v.id }));
}

export default async function VarietyPage({ params }: Props) {
  const { id } = await params;
  const variety = getVarietyById(id);
  if (!variety) notFound();

  const all = getAllVarieties();
  const parents = getParents(variety, all);
  const children = getChildren(variety, all);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <div className="text-xs text-[var(--muted)] mb-6">
        <Link href="/varieties" className="hover:text-[var(--foreground)]">Varieties</Link>
        {" / "}
        <span>{variety.name}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start gap-4 flex-wrap">
          <h1 className="text-3xl font-semibold">{variety.name}</h1>
          <CertaintyBadge certainty={variety.certainty} />
        </div>
        {variety.aliases.length > 0 && (
          <p className="text-sm text-[var(--muted)] mt-1">
            Also known as: {variety.aliases.join(", ")}
          </p>
        )}
        <div className="flex gap-4 mt-3 text-sm text-[var(--muted)]">
          <span>{variety.geneticGroup}</span>
          <span>·</span>
          <span>{variety.origin.country}{variety.origin.region ? `, ${variety.origin.region}` : ""}</span>
          {variety.origin.yearDiscovered && (
            <>
              <span>·</span>
              <span>Discovered {variety.origin.yearDiscovered}</span>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <section>
            <p className="leading-relaxed text-[var(--foreground)]">{variety.description}</p>
          </section>

          {/* Migration path */}
          {variety.migrationPath.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--muted)] mb-4">
                Migration Path
              </h2>
              <MigrationPath stops={variety.migrationPath} />
            </section>
          )}

          {/* Flavor notes */}
          {variety.flavorNotes.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--muted)] mb-3">
                Flavor Associations
              </h2>
              <div className="flex flex-wrap gap-2">
                {variety.flavorNotes.map((note) => (
                  <span
                    key={note}
                    className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-sm"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Agronomic traits */}
          {variety.agronomic && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--muted)] mb-4">
                Agronomic Traits
              </h2>
              <AgronomicGrid traits={variety.agronomic} />
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Authentication status */}
          <div className="p-4 bg-white border border-[var(--border)] rounded-lg">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-3">
              Authentication
            </h3>
            <CertaintyBadge certainty={variety.certainty} />
            <p className="text-xs text-[var(--muted)] mt-2 leading-relaxed">
              {variety.certainty === "wcr-verified" &&
                "SNP fingerprint exists in the WCR KASP reference panel. Identity can be confirmed via commercial DNA testing."}
              {variety.certainty === "classified" &&
                "Genetic group confirmed through sequencing, but no SNP panel fingerprint exists for this variety yet."}
              {variety.certainty === "pending" &&
                "Genetic samples have been collected and are awaiting lab analysis."}
              {variety.certainty === "insufficient" &&
                "Too few samples have been sequenced to reach a definitive conclusion about this variety's identity."}
              {variety.certainty === "unknown" &&
                "The genetic identity of this variety has not yet been investigated."}
            </p>
            {variety.wcrSnpVerified && (
              <a
                href="https://worldcoffeeresearch.org/resources/arabica-ldp-snp-marker-panel"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[var(--accent)] underline mt-2 block"
              >
                View WCR panel →
              </a>
            )}
          </div>

          {/* Lineage */}
          {(parents.length > 0 || children.length > 0) && (
            <div className="p-4 bg-white border border-[var(--border)] rounded-lg">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-3">
                Lineage
              </h3>
              {parents.length > 0 && (
                <div className="mb-3">
                  <div className="text-xs text-[var(--muted)] mb-1">Parents</div>
                  <div className="flex flex-col gap-1">
                    {parents.map((p) => (
                      <Link
                        key={p.id}
                        href={`/varieties/${p.id}`}
                        className="text-sm text-[var(--accent)] hover:underline"
                      >
                        {p.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {children.length > 0 && (
                <div>
                  <div className="text-xs text-[var(--muted)] mb-1">Descendants</div>
                  <div className="flex flex-col gap-1">
                    {children.map((c) => (
                      <Link
                        key={c.id}
                        href={`/varieties/${c.id}`}
                        className="text-sm text-[var(--accent)] hover:underline"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notable producers */}
          {variety.notableProducers && variety.notableProducers.length > 0 && (
            <div className="p-4 bg-white border border-[var(--border)] rounded-lg">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-3">
                Notable Producers
              </h3>
              <ul className="space-y-1">
                {variety.notableProducers.map((p) => (
                  <li key={p} className="text-xs text-[var(--foreground)]">
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* WCR link */}
          {variety.wcrSlug && (
            <div className="p-4 bg-white border border-[var(--border)] rounded-lg">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-2">
                External Reference
              </h3>
              <a
                href={`https://varieties.worldcoffeeresearch.org/varieties/${variety.wcrSlug}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[var(--accent)] underline"
              >
                WCR Varieties Catalog →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
