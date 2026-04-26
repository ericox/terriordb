# Coffee Genetics Explorer

An open-source reference tool for specialty coffee roasters to explore the genetic identity, lineage, and authentication status of coffee varieties.

Built because local names and genetic reality don't always match: *"Geisha Inca"* contains no Gesha genetics. *"Typica Mejorado"* is actually a Bourbon cross. This app makes the science accessible.

---

## Features

- **Variety Browser** — 26+ varieties grouped by genetic lineage, searchable by name or alias
- **Variety Detail Pages** — migration history, flavor associations, agronomic traits, authentication status, notable producers
- **Family Tree** — interactive D3 visualization of genetic relationships across all varieties; pan, zoom, click to navigate
- **SNP Matcher** — paste a lab result from the WCR KASP panel to identify which authenticated variety it most closely matches

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## SNP Matcher

### What is it?

The SNP Matcher lets you take a real DNA test result and identify which coffee variety it matches.

**SNP** stands for *Single Nucleotide Polymorphism* — a position in the genome where different varieties carry different DNA bases. The [World Coffee Research](https://worldcoffeeresearch.org) KASP panel defines **45 such positions** that together form a unique genetic fingerprint for each authenticated variety. By comparing an unknown sample's calls at these 45 positions against a reference panel of known varieties, you can determine which variety (if any) the sample is.

This is how high-end roasters and producers verify that what they're growing is actually what they think it is.

### The problem it solves

Local names in specialty coffee routinely diverge from genetic identity:

| Local name | What the genetics say |
|---|---|
| "Geisha Inca" (Peru) | SL9 — contains zero Gesha genetics |
| "Typica Mejorado" (Ecuador) | Bourbon × Ethiopian Landrace cross |
| "Yellow Gesha" (Neto, Peru) | Unconfirmed — testing pending |
| "Pink Bourbon" (Colombia) | Ethiopian Landrace, specific accession unknown |

The WCR KASP panel is the standard tool for resolving these mismatches for the 23 authenticated Latin American commercial varieties it covers.

### How the matching works

1. **Reference panel** — the file `data/wcr-snp-panel.csv` contains 1,419 real plant samples across 23 varieties, each with genotype calls at 45 marker positions (e.g. `Ca0468: C:C`, `Ca0516: T:T`).

2. **Consensus fingerprints** — on page load the server computes a consensus fingerprint for each variety by taking the majority allele call at each marker across all samples of that variety. This produces 23 reference fingerprints.

3. **Matching** — when you submit a profile, the matcher compares your 45 calls against each reference fingerprint, counting how many markers agree. Results are ranked by match percentage.

4. **Per-marker detail** — for the top match, each of the 45 markers is shown as green (match), red (mismatch), or gray (missing data).

### The database gap

The panel authenticates **23 Latin American commercial varieties** — the ones used in breeding programs and yield research. It was not built to cover the rare, high-value varieties that top roasters care most about:

| Variety | In WCR panel? |
|---|---|
| Bourbon, Typica, Caturra, Catuai | ✅ Yes |
| Pacamara, Marsellesa, Parainema | ✅ Yes |
| Gesha / Geisha | ❌ No |
| Pink Bourbon | ❌ No |
| Chiroso, Sidra, Aruzi | ❌ No |
| SL28, SL34, SL9 | ❌ No |
| Ethiopian Landraces | ❌ No |

A match below ~60% on this tool most likely means your lot falls outside current database coverage — not that it failed a test.

### How to use it

**Option 1 — Paste a lab result**

If you've had a sample tested by [Intertek Agritech](https://www.intertek.com/agritech/) using the WCR KASP panel, they return a CSV with your sample's allele calls. Paste that row directly into the text area:

```
S001,LatAm,Unknown,,,,C:C,T:T,G:G,A:A,G:G,T:T,C:C,A:A,...
```

The parser auto-detects where the allele calls start (values matching `A:A`, `T:T`, `G:G`, `C:C` etc.) and skips any leading metadata columns. Click **Parse** to populate the 45 marker fields, then **Match**.

**Option 2 — Load the demo**

Click **Load demo (Bourbon)** to pre-fill with a real Bourbon sample from the reference panel. Hit **Match** and you'll see:

- Bourbon: **~100%** — 44 or 45 markers agree
- All other varieties drop sharply (< 30%)

This demonstrates how distinctive the fingerprints are when there's a true match in the database.

**Option 3 — Fill markers individually**

Click **Edit individually** to expand a grid of dropdowns — one per marker. Useful if you have partial results or want to explore hypotheticals.

### Example: what a Bourbon result looks like

A real Bourbon sample from the WCR panel produces these allele calls across the 45 markers:

```
Marker    Call    Marker    Call    Marker    Call
Ca0468    —       Ca0516    C:C     Ca0711    C:C
Ca2024    A:A     Ca2044    G:G     Ca2285    T:T
Ca3052    —       Ca3165    A:A     Ca3177    —
Ca3457    A:A     Ca3594    T:T     Ca3700    G:G
Ca3728    T:T     Ca3794    C:C     Ca3970    A:A
Ca4110    T:T     Ca4219    T:T     Ca4223    G:G
Ca4233    A:A     Ca4248    G:G     Ca4257    C:C
Ca4704    A:G     Ca4729    —       Ca4929    T:T
Ca4998    T:T     Ca5014    G:G     Ca5205    C:C
Ca5295    —       Ca5511    —       Ca5578    A:A
Ca5643    A:A     Ca5659    G:G     Ca5810    G:G
Ca5818    C:C     Ca5821    T:T     Ca5877    C:G
Ca6081    C:C     Ca6117    C:C     Ca6219    —
Ca6320    T:T     Ca6385    C:C     Ca6387    C:C
Ca6801    T:T     Ca6811    T:T     Ca6840    T:T
```

Blank (`—`) means no call was recorded at that position in the sample.

### Interpreting results

| Match % | Interpretation |
|---|---|
| 90–100% | Strong match — variety identity confirmed |
| 60–89% | Weak match — candidate but not definitive |
| < 60% | No match — variety likely outside panel coverage |

---

## Data Sources

- **Variety data** — curated from [WCR Varieties Catalog](https://varieties.worldcoffeeresearch.org) and [SEY Coffee archived lots](https://www.seycoffee.com/collections/archived-coffees)
- **SNP reference panel** — [WCR Arabica LDP SNP Marker Panel](https://worldcoffeeresearch.org/resources/arabica-ldp-snp-marker-panel) (CC0, 2023)
- **Genetic testing services** — [Intertek Agritech](https://www.intertek.com/agritech/) offers ISO-certified KASP genotyping using this panel

---

## Project Structure

```
data/
  varieties/          # one JSON file per variety
  wcr-snp-panel.csv   # WCR reference panel (1,419 samples, 45 markers)
lib/
  types.ts            # TypeScript interfaces
  varieties.ts        # load, search, parent/child resolution
  snp.ts              # CSV parsing + fingerprint building (server-only)
  snp-match.ts        # pure matching logic (browser-safe)
  tree.ts             # hierarchy builder for D3 family tree
app/
  page.tsx            # homepage
  varieties/          # browser + detail pages
  tree/               # D3 family tree
  matcher/            # SNP matcher
components/
  FamilyTree.tsx      # D3 tree (client)
  SnpMatcherClient.tsx
  CertaintyBadge.tsx
  MigrationPath.tsx
  AgronomicGrid.tsx
```

---

## Adding a Variety

Create a new JSON file in `data/varieties/` following the `CoffeeVariety` interface in `lib/types.ts`. The variety will automatically appear in the browser, family tree, and search.

```json
{
  "id": "my-variety",
  "name": "My Variety",
  "aliases": ["Local Name", "Trade Name"],
  "geneticGroup": "Bourbon",
  "parentIds": ["bourbon"],
  "certainty": "classified",
  "origin": { "country": "Colombia", "region": "Huila" },
  "migrationPath": [],
  "flavorNotes": ["Citrus", "Florals"],
  "description": "...",
  "wcrSnpVerified": false
}
```

---

## License

Variety data and SNP panel: [CC0](https://creativecommons.org/publicdomain/zero/1.0/) via World Coffee Research.
