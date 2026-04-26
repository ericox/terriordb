"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { VarietyFingerprint } from "@/lib/types";
import { matchProfile, parsePastedRow, MatchResult } from "@/lib/snp-match";

// Map WCR CSV variety names → our variety page IDs where they exist
const WCR_TO_VARIETY_ID: Record<string, string> = {
  Bourbon: "bourbon",
  Caturra: "caturra",
  CaturraAmarillo: "caturra",
  CaturraRojo: "caturra",
  Catuai: "catuai",
  CatuaiAmarillo: "catuai",
  Typica: "typica",
  TypicaXanthocarpa: "typica",
  Pacamara: "pacamara",
  Maragogpe: "maragogype",
};

const ALLELE_OPTIONS = ["", "A:A", "T:T", "G:G", "C:C", "A:T", "A:G", "C:T", "C:G", "G:T"];

interface Props {
  markerNames: string[];
  fingerprints: VarietyFingerprint[];
  demoProfile: Record<string, string>;
}

export function SnpMatcherClient({ markerNames, fingerprints, demoProfile }: Props) {
  const [profile, setProfile] = useState<Record<string, string>>({});
  const [pasteText, setPasteText] = useState("");
  const [parseError, setParseError] = useState("");
  const [results, setResults] = useState<MatchResult[] | null>(null);
  const [showAllMarkers, setShowAllMarkers] = useState(false);

  const filledCount = markerNames.filter((m) => profile[m]).length;

  const handleParse = useCallback(() => {
    setParseError("");
    const parsed = parsePastedRow(pasteText, markerNames);
    if (!parsed) {
      setParseError(
        "Could not parse allele calls from the pasted text. Ensure it contains values like A:A, T:T, G:G, C:C."
      );
      return;
    }
    setProfile(parsed);
  }, [pasteText, markerNames]);

  const handleDemo = useCallback(() => {
    setProfile(demoProfile);
    setPasteText("");
    setParseError("");
    setResults(null);
  }, [demoProfile]);

  const handleClear = useCallback(() => {
    setProfile({});
    setPasteText("");
    setParseError("");
    setResults(null);
  }, []);

  const handleMatch = useCallback(() => {
    if (filledCount === 0) return;
    setResults(matchProfile(profile, fingerprints));
  }, [profile, fingerprints, filledCount]);

  const setMarker = (name: string, value: string) =>
    setProfile((p) => ({ ...p, [name]: value }));

  const topResult = results?.[0];
  const isStrongMatch = topResult && topResult.matchPct >= 90;
  const isWeakMatch = topResult && topResult.matchPct >= 60 && topResult.matchPct < 90;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* ── Left: Input ── */}
      <div className="space-y-6">
        {/* Paste area */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] block mb-2">
            Paste lab result row
          </label>
          <textarea
            value={pasteText}
            onChange={(e) => { setPasteText(e.target.value); setParseError(""); }}
            placeholder={`Paste a CSV row from your Intertek Agritech result…\ne.g.  S001,,,,,,C:C,T:T,G:G,A:A,…`}
            rows={4}
            className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--accent-light)] font-mono resize-none"
          />
          {parseError && (
            <p className="text-xs text-rose-600 mt-1">{parseError}</p>
          )}
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleParse}
              disabled={!pasteText.trim()}
              className="px-3 py-1.5 text-sm bg-[var(--accent)] text-white rounded hover:opacity-90 disabled:opacity-40 transition-opacity"
            >
              Parse
            </button>
            <button
              onClick={handleDemo}
              className="px-3 py-1.5 text-sm border border-[var(--border)] rounded hover:border-[var(--muted)] transition-colors"
            >
              Load demo (Bourbon)
            </button>
            <button
              onClick={handleClear}
              className="px-3 py-1.5 text-sm border border-[var(--border)] rounded hover:border-[var(--muted)] transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Marker grid */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
              Markers ({filledCount}/{markerNames.length} filled)
            </label>
            <button
              onClick={() => setShowAllMarkers((v) => !v)}
              className="text-xs text-[var(--muted)] underline"
            >
              {showAllMarkers ? "Collapse" : "Edit individually"}
            </button>
          </div>

          {showAllMarkers ? (
            <div className="grid grid-cols-3 gap-1.5 max-h-80 overflow-y-auto pr-1">
              {markerNames.map((name) => (
                <div key={name} className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-[var(--muted)] font-mono">{name}</span>
                  <select
                    value={profile[name] ?? ""}
                    onChange={(e) => setMarker(name, e.target.value)}
                    className="text-xs border border-[var(--border)] rounded px-1 py-0.5 bg-white font-mono focus:outline-none focus:border-[var(--accent-light)]"
                  >
                    {ALLELE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt || "—"}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-1">
              {markerNames.map((name) => (
                <span
                  key={name}
                  title={`${name}: ${profile[name] || "empty"}`}
                  className={`w-3 h-3 rounded-sm border ${
                    profile[name]
                      ? "bg-[var(--accent)] border-[var(--accent)]"
                      : "bg-[var(--border)] border-[var(--border)]"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Match button */}
        <button
          onClick={handleMatch}
          disabled={filledCount < 10}
          className="w-full py-2.5 bg-[var(--accent)] text-white text-sm rounded hover:opacity-90 disabled:opacity-40 transition-opacity"
        >
          {filledCount < 10
            ? `Fill at least 10 markers to match (${filledCount} filled)`
            : `Match against ${fingerprints.length} reference varieties`}
        </button>
      </div>

      {/* ── Right: Results ── */}
      <div>
        {!results && (
          <div className="flex items-center justify-center h-full min-h-48 border border-dashed border-[var(--border)] rounded-lg text-sm text-[var(--muted)]">
            Results will appear here after matching
          </div>
        )}

        {results && (
          <div className="space-y-4">
            {/* Confidence banner */}
            {topResult && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  isStrongMatch
                    ? "bg-emerald-50 border border-emerald-200"
                    : isWeakMatch
                    ? "bg-amber-50 border border-amber-200"
                    : "bg-rose-50 border border-rose-200"
                }`}
              >
                {isStrongMatch && (
                  <span className="font-medium">Strong match — </span>
                )}
                {isWeakMatch && (
                  <span className="font-medium">Weak match — </span>
                )}
                {!isStrongMatch && !isWeakMatch && (
                  <span className="font-medium">No confident match — </span>
                )}
                {isStrongMatch &&
                  `${topResult.matchedMarkers}/${topResult.totalMarkers} markers agree with ${topResult.varietyId}.`}
                {isWeakMatch &&
                  `Best candidate is ${topResult.varietyId} but confidence is low.`}
                {!isStrongMatch && !isWeakMatch &&
                  `Top result is only ${topResult.matchPct.toFixed(1)}%. This variety may not be in the WCR panel.`}
              </div>
            )}

            {/* Ranked list */}
            <div className="space-y-2">
              {results.slice(0, 5).map((r, i) => {
                const varietyId = WCR_TO_VARIETY_ID[r.varietyId];
                return (
                  <div
                    key={r.varietyId}
                    className={`p-3 rounded-lg border ${
                      i === 0
                        ? "border-[var(--accent-light)] bg-white"
                        : "border-[var(--border)] bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[var(--muted)] w-4">{i + 1}.</span>
                        <span className="font-medium text-sm">{r.varietyId}</span>
                        {varietyId && (
                          <Link
                            href={`/varieties/${varietyId}`}
                            className="text-xs text-[var(--accent)] underline"
                          >
                            view variety →
                          </Link>
                        )}
                      </div>
                      <span className="text-sm font-semibold tabular-nums">
                        {r.matchPct.toFixed(1)}%
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden mb-1.5">
                      <div
                        className={`h-full rounded-full transition-all ${
                          r.matchPct >= 90
                            ? "bg-emerald-500"
                            : r.matchPct >= 60
                            ? "bg-amber-400"
                            : "bg-rose-400"
                        }`}
                        style={{ width: `${r.matchPct}%` }}
                      />
                    </div>

                    <div className="text-xs text-[var(--muted)]">
                      {r.matchedMarkers}/{r.totalMarkers} markers matched
                    </div>

                    {/* Fingerprint comparison grid for top result */}
                    {i === 0 && (
                      <div className="mt-2 pt-2 border-t border-[var(--border)]">
                        <div className="text-xs text-[var(--muted)] mb-1.5">Marker comparison</div>
                        <div className="flex flex-wrap gap-0.5">
                          {Object.entries(r.markerDetail).map(([marker, status]) => (
                            <span
                              key={marker}
                              title={`${marker}: ${status}`}
                              className={`w-2.5 h-2.5 rounded-sm ${
                                status === "match"
                                  ? "bg-emerald-400"
                                  : status === "mismatch"
                                  ? "bg-rose-400"
                                  : "bg-[var(--border)]"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex gap-3 mt-1.5 text-[10px] text-[var(--muted)]">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-sm bg-emerald-400 inline-block" /> Match
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-sm bg-rose-400 inline-block" /> Mismatch
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-sm bg-[var(--border)] inline-block" /> Missing
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Coverage note */}
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              The WCR KASP panel covers {fingerprints.length} Latin American commercial varieties.
              High-value specialty varieties like Gesha, Pink Bourbon, and Chiroso are not yet in the
              reference panel — a match below 60% likely means your lot is outside current database coverage.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
