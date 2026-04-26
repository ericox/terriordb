import { AgronomicTraits } from "@/lib/types";

const RESISTANCE_COLOR = {
  Susceptible: "text-rose-600",
  Moderate: "text-amber-600",
  Resistant: "text-emerald-700",
};

export function AgronomicGrid({ traits }: { traits: AgronomicTraits }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      <Cell label="Yield" value={traits.yieldPotential} />
      <Cell label="Altitude" value={`${traits.optimalAltitudeM.min}–${traits.optimalAltitudeM.max}m`} />
      <Cell label="Stature" value={traits.stature} />
      <Cell label="Bean Size" value={traits.beanSize} />
      <Cell label="First Harvest" value={`Year ${traits.firstProductionYear}`} />
      {traits.leafTipColor && <Cell label="Leaf Tip" value={traits.leafTipColor} />}

      <div className="col-span-2 sm:col-span-3">
        <div className="text-xs text-[var(--muted)] mb-2">Disease Resistance</div>
        <div className="flex gap-4">
          <ResistanceCell label="Leaf Rust" level={traits.diseaseResistance.leafRust} />
          <ResistanceCell label="Coffee Berry Disease" level={traits.diseaseResistance.coffeeBerryDisease} />
          <ResistanceCell label="Nematode" level={traits.diseaseResistance.nematode} />
        </div>
      </div>
    </div>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 bg-white border border-[var(--border)] rounded">
      <div className="text-xs text-[var(--muted)] mb-0.5">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}

function ResistanceCell({ label, level }: { label: string; level: keyof typeof RESISTANCE_COLOR }) {
  return (
    <div>
      <div className="text-xs text-[var(--muted)]">{label}</div>
      <div className={`text-sm font-medium ${RESISTANCE_COLOR[level]}`}>{level}</div>
    </div>
  );
}
