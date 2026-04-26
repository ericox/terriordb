import { CertaintyLevel } from "@/lib/types";

const CONFIG: Record<CertaintyLevel, { label: string; className: string; title: string }> = {
  "wcr-verified": {
    label: "WCR Verified",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
    title: "SNP fingerprint confirmed in the WCR KASP reference panel",
  },
  "classified": {
    label: "Classified",
    className: "bg-sky-100 text-sky-800 border-sky-200",
    title: "Genetic group confirmed but no SNP panel fingerprint exists",
  },
  "pending": {
    label: "Testing Pending",
    className: "bg-amber-100 text-amber-800 border-amber-200",
    title: "Genetic testing has been conducted but results are not yet confirmed",
  },
  "insufficient": {
    label: "Insufficient Data",
    className: "bg-rose-100 text-rose-800 border-rose-200",
    title: "Too few samples have been sequenced to draw conclusions",
  },
  "unknown": {
    label: "Unknown",
    className: "bg-zinc-100 text-zinc-600 border-zinc-200",
    title: "Genetic identity not yet investigated",
  },
};

interface Props {
  certainty: CertaintyLevel;
  size?: "xs" | "sm";
}

export function CertaintyBadge({ certainty, size = "sm" }: Props) {
  const { label, className, title } = CONFIG[certainty];
  const textSize = size === "xs" ? "text-[10px]" : "text-xs";
  return (
    <span
      title={title}
      className={`inline-block border rounded px-1.5 py-0.5 font-medium whitespace-nowrap ${textSize} ${className}`}
    >
      {label}
    </span>
  );
}
