import { MigrationStop } from "@/lib/types";

export function MigrationPath({ stops }: { stops: MigrationStop[] }) {
  return (
    <ol className="relative border-l border-[var(--border)] ml-2 space-y-4">
      {stops.map((stop, i) => (
        <li key={i} className="pl-5 relative">
          <span className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-[var(--accent-light)] border-2 border-white" />
          <div className="flex items-baseline gap-2">
            <span className="font-medium text-sm">{stop.location}</span>
            {stop.year && (
              <span className="text-xs text-[var(--muted)]">{stop.year}</span>
            )}
          </div>
          {stop.notes && (
            <p className="text-xs text-[var(--muted)] mt-0.5 leading-relaxed">{stop.notes}</p>
          )}
        </li>
      ))}
    </ol>
  );
}
