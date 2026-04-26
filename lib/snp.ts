import { SnpSample, VarietyFingerprint } from "./types";
import fs from "fs";
import path from "path";

const CSV_PATH = path.join(process.cwd(), "data", "wcr-snp-panel.csv");

// Return the 45 marker names from the CSV header
export function getMarkerNames(): string[] {
  if (!fs.existsSync(CSV_PATH)) return [];
  const firstLine = fs.readFileSync(CSV_PATH, "utf-8").replace(/^﻿/, "").split("\n")[0];
  return firstLine.split(",").slice(6).map((n) => n.trim());
}

// Parse the WCR SNP reference panel CSV
export function loadSnpPanel(): SnpSample[] {
  if (!fs.existsSync(CSV_PATH)) return [];
  const raw = fs.readFileSync(CSV_PATH, "utf-8").replace(/^﻿/, ""); // strip BOM
  const lines = raw.split("\n").filter((l) => l.trim());
  const headers = lines[0].split(",");
  const markerNames = headers.slice(6); // columns after num,TargetCountries,Variety,Pedigree,Pop,Subpop

  return lines.slice(1).map((line) => {
    const cols = line.split(",");
    const markers: Record<string, string> = {};
    markerNames.forEach((name, i) => {
      markers[name.trim()] = (cols[6 + i] || "").trim();
    });
    return {
      num: cols[0]?.trim() ?? "",
      targetCountries: cols[1]?.trim() ?? "",
      variety: cols[2]?.trim() ?? "",
      pedigree: cols[3]?.trim() ?? "",
      pop: cols[4]?.trim() ?? "",
      subpop: cols[5]?.trim() ?? "",
      markers,
    };
  });
}

// Compute the consensus fingerprint for each variety (majority allele per marker)
export function buildFingerprints(samples: SnpSample[]): VarietyFingerprint[] {
  const byVariety = new Map<string, SnpSample[]>();
  for (const s of samples) {
    const key = s.variety;
    if (!byVariety.has(key)) byVariety.set(key, []);
    byVariety.get(key)!.push(s);
  }

  return Array.from(byVariety.entries()).map(([variety, varSamples]) => {
    const markerNames = Object.keys(varSamples[0].markers);
    const consensus: Record<string, string> = {};

    for (const marker of markerNames) {
      const counts = new Map<string, number>();
      for (const s of varSamples) {
        const allele = s.markers[marker] || "";
        if (allele) counts.set(allele, (counts.get(allele) ?? 0) + 1);
      }
      // pick the most common allele call
      let best = "";
      let bestCount = 0;
      for (const [allele, count] of counts) {
        if (count > bestCount) { best = allele; bestCount = count; }
      }
      consensus[marker] = best;
    }

    return { varietyId: variety, sampleCount: varSamples.length, markers: consensus };
  });
}

// Compare an unknown SNP profile against the reference fingerprints.
// Returns varieties ranked by % matching markers (descending).
export function matchProfile(
  unknown: Record<string, string>,
  fingerprints: VarietyFingerprint[]
): Array<{ varietyId: string; matchPct: number; matchedMarkers: number; totalMarkers: number }> {
  return fingerprints
    .map((fp) => {
      const shared = Object.keys(unknown).filter((m) => fp.markers[m]);
      const matched = shared.filter((m) => fp.markers[m] === unknown[m]);
      return {
        varietyId: fp.varietyId,
        matchPct: shared.length > 0 ? (matched.length / shared.length) * 100 : 0,
        matchedMarkers: matched.length,
        totalMarkers: shared.length,
      };
    })
    .sort((a, b) => b.matchPct - a.matchPct);
}
