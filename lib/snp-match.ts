import { VarietyFingerprint } from "./types";

export interface MatchResult {
  varietyId: string;
  matchPct: number;
  matchedMarkers: number;
  totalMarkers: number;
  markerDetail: Record<string, "match" | "mismatch" | "missing">;
}

// Compare an unknown SNP profile against the reference fingerprints.
// Returns varieties ranked by % matching markers (descending).
export function matchProfile(
  unknown: Record<string, string>,
  fingerprints: VarietyFingerprint[]
): MatchResult[] {
  return fingerprints
    .map((fp) => {
      const markerDetail: Record<string, "match" | "mismatch" | "missing"> = {};
      let matched = 0;
      let total = 0;

      for (const marker of Object.keys(fp.markers)) {
        const ref = fp.markers[marker];
        const query = unknown[marker];
        if (!query || !ref) {
          markerDetail[marker] = "missing";
        } else {
          total++;
          if (ref === query) {
            matched++;
            markerDetail[marker] = "match";
          } else {
            markerDetail[marker] = "mismatch";
          }
        }
      }

      return {
        varietyId: fp.varietyId,
        matchPct: total > 0 ? (matched / total) * 100 : 0,
        matchedMarkers: matched,
        totalMarkers: total,
        markerDetail,
      };
    })
    .sort((a, b) => b.matchPct - a.matchPct);
}

// Parse a pasted lab result row into a marker map.
// Handles both "full CSV row" (with leading metadata columns) and bare 45-value strings.
export function parsePastedRow(
  raw: string,
  markerNames: string[]
): Record<string, string> | null {
  const cols = raw
    .trim()
    .split(/[,\t]/)
    .map((c) => c.trim())
    .filter((c) => c.length > 0);

  // Find where the allele calls start — they match pattern like A:A, T:T, G:G, C:C
  const allelePattern = /^[ATGC]:[ATGC]$/;
  const firstAllele = cols.findIndex((c) => allelePattern.test(c));
  if (firstAllele === -1) return null;

  const alleleCols = cols.slice(firstAllele);
  if (alleleCols.length < markerNames.length) return null;

  const result: Record<string, string> = {};
  markerNames.forEach((name, i) => {
    if (alleleCols[i]) result[name] = alleleCols[i];
  });
  return result;
}
