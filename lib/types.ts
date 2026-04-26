export type CertaintyLevel =
  | "wcr-verified"     // has SNP fingerprint in WCR reference panel
  | "classified"       // genetic group confirmed, no panel fingerprint
  | "pending"          // genetic testing in progress
  | "insufficient"     // too few samples sequenced to conclude
  | "unknown";

export type GeneticGroup =
  | "Typica"
  | "Bourbon"
  | "Bourbon x Typica"
  | "Ethiopian Wild"       // specific named accession from Ethiopian forests (e.g. Gesha)
  | "Ethiopian Landrace"   // Ethiopian origin confirmed, but specific variety unresolved
  | "Ethiopian Legacy"     // Kenyan SL selections of Ethiopian-origin germplasm (e.g. SL9)
  | "Timor Hybrid"
  | "Catimor"              // Timor Hybrid x Caturra
  | "Sarchimor"            // Timor Hybrid x Villa Sarchi
  | "F1 Hybrid"
  | "Unknown";

export interface MigrationStop {
  location: string;
  year?: string;
  notes?: string;
}

export interface AgronomicTraits {
  yieldPotential: "Low" | "Medium" | "High" | "Very High";
  optimalAltitudeM: { min: number; max: number };
  firstProductionYear: number;
  diseaseResistance: {
    leafRust: "Susceptible" | "Moderate" | "Resistant";
    coffeeBerryDisease: "Susceptible" | "Moderate" | "Resistant";
    nematode: "Susceptible" | "Moderate" | "Resistant";
  };
  stature: "Dwarf" | "Compact" | "Medium" | "Tall";
  leafTipColor?: "Bronze" | "Green";
  beanSize: "Small" | "Average" | "Large";
}

export interface CoffeeVariety {
  id: string;
  name: string;
  // All names this variety goes by (trade names, regional names, synonyms)
  aliases: string[];
  geneticGroup: GeneticGroup;
  // IDs of direct parent varieties
  parentIds: string[];
  certainty: CertaintyLevel;
  origin: {
    country: string;
    region?: string;
    yearDiscovered?: string;
  };
  migrationPath: MigrationStop[];
  flavorNotes: string[];
  agronomic?: AgronomicTraits;
  // Notable producers working with this variety (from Sey archive etc.)
  notableProducers?: string[];
  description: string;
  // WCR catalog slug if it exists
  wcrSlug?: string;
  // Whether this variety has SNP fingerprint data in the WCR panel
  wcrSnpVerified: boolean;
}

// One row in the WCR SNP reference panel CSV
export interface SnpSample {
  num: string;
  targetCountries: string;
  variety: string;
  pedigree: string;
  pop: string;
  subpop: string;
  markers: Record<string, string>; // e.g. { Ca0468: "C:C", Ca0516: "T:T", ... }
}

// Consensus fingerprint for a variety (majority allele per marker across all samples)
export interface VarietyFingerprint {
  varietyId: string;
  sampleCount: number;
  markers: Record<string, string>;
}
