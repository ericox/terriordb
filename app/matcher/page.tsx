import { loadSnpPanel, buildFingerprints, getMarkerNames } from "@/lib/snp";
import { SnpMatcherClient } from "@/components/SnpMatcherClient";

export default function MatcherPage() {
  const markerNames = getMarkerNames();
  const samples = loadSnpPanel();
  const fingerprints = buildFingerprints(samples);

  // Build a demo profile from the first Bourbon sample so users can test the tool
  const bourbonSample = samples.find((s) => s.variety === "Bourbon");
  const demoProfile = bourbonSample ? bourbonSample.markers : {};

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2">SNP Variety Matcher</h1>
        <p className="text-sm text-[var(--muted)] max-w-2xl leading-relaxed">
          If you&apos;ve had a lot tested by{" "}
          <a
            href="https://worldcoffeeresearch.org/resources/arabica-ldp-snp-marker-panel"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            Intertek Agritech
          </a>{" "}
          using the WCR KASP panel, paste your 45-marker result below to identify which of the{" "}
          {fingerprints.length} authenticated varieties it most closely matches.
        </p>
      </div>

      <SnpMatcherClient
        markerNames={markerNames}
        fingerprints={fingerprints}
        demoProfile={demoProfile}
      />
    </div>
  );
}
